///<reference path="./lib/ammo.wasm.d.ts"/>

import * as THREE from "three";
import { Quaternion, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//import { DeviceOrientationControls } from "./lib/deviceOrientation";
import "./style.css";

class RigidBody {
  #transform: Ammo.btTransform;
  #shape: Ammo.btSphereShape;
  #inertia: Ammo.btVector3;
  #info: Ammo.btRigidBodyConstructionInfo;
  motionState: Ammo.btMotionState;
  body: Ammo.btRigidBody;

  setRestitution(rest: number) {
    this.body.setRestitution(rest);
  }

  setFriction(friction: number) {
    this.body.setFriction(friction);
  }

  setRollingFriction(friction: number) {
    this.body.setRollingFriction(friction);
  }

  createBox(mass: number, pos: Vector3, quat: Quaternion, size: Vector3) {
    this.#transform = new Ammo.btTransform();
    this.#transform.setIdentity();
    this.#transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    this.#transform.setRotation(
      new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)
    );
    this.motionState = new Ammo.btDefaultMotionState(this.#transform);

    const btSize = new Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
    this.#shape = new Ammo.btBoxShape(btSize);
    this.#shape.setMargin(0.5);

    this.#inertia = new Ammo.btVector3(0, 0, 0);
    if (mass > 0) {
      this.#shape.calculateLocalInertia(mass, this.#inertia);
    }

    this.#info = new Ammo.btRigidBodyConstructionInfo(
      mass,
      this.motionState,
      this.#shape,
      this.#inertia
    );
    this.body = new Ammo.btRigidBody(this.#info);

    Ammo.destroy(btSize);
  }

  createSphere(mass: number, pos: Vector3, size: number) {
    this.#transform = new Ammo.btTransform();
    this.#transform.setIdentity();
    this.#transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
    this.#transform.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));
    this.motionState = new Ammo.btDefaultMotionState(this.#transform);

    this.#shape = new Ammo.btSphereShape(size);
    this.#shape.setMargin(0.5);

    this.#inertia = new Ammo.btVector3(0, 0, 0);

    if (mass > 0) {
      this.#shape.calculateLocalInertia(mass, this.#inertia);
    }

    this.#info = new Ammo.btRigidBodyConstructionInfo(
      mass,
      this.motionState,
      this.#shape,
      this.#inertia
    );
    this.body = new Ammo.btRigidBody(this.#info);
  }
}

class LabyrinthGame {
  #renderer: THREE.WebGLRenderer;
  #camera: THREE.PerspectiveCamera;
  #scene: THREE.Scene;

  #collisionConfig: Ammo.btDefaultCollisionConfiguration;
  #collisionDispatcher: Ammo.btCollisionDispatcher;
  #broadphase: Ammo.btDbvtBroadphase;
  #solver: Ammo.btSequentialImpulseConstraintSolver;
  #physicsWorld: Ammo.btDiscreteDynamicsWorld;
  #tempPhysicsTransform: Ammo.btTransform;
  #rigidBodies: [THREE.Mesh, RigidBody][] = [];

  #beta: number = 0;
  #gamma: number = 0;
  #ground: [THREE.Mesh, RigidBody];

  #previousRaf: number | null;

  constructor() {}

  initialize() {
    this.#collisionConfig = new Ammo.btDefaultCollisionConfiguration();
    this.#collisionDispatcher = new Ammo.btCollisionDispatcher(
      this.#collisionConfig
    );
    this.#broadphase = new Ammo.btDbvtBroadphase();
    this.#solver = new Ammo.btSequentialImpulseConstraintSolver();
    this.#physicsWorld = new Ammo.btDiscreteDynamicsWorld(
      this.#collisionDispatcher,
      this.#broadphase,
      this.#solver,
      this.#collisionConfig
    );

    this.#physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));

    this.#renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    this.#renderer.shadowMap.enabled = true;
    this.#renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.#renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.#renderer.outputEncoding = THREE.sRGBEncoding;
    this.#renderer.setPixelRatio(window.devicePixelRatio);
    this.#renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.#renderer.domElement);

    window.addEventListener("resize", this.#onWindowResize);

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;

    this.#camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.#camera.position.set(0, 250, 0);

    const directionalLight = new THREE.DirectionalLight(0xfffffffff);
    directionalLight.position.set(0, 125, 0);
    directionalLight.target.position.set(0, 0, 0);
    directionalLight.castShadow = true;
    directionalLight.shadow.bias = -0.01;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 1.0;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.left = 200;
    directionalLight.shadow.camera.right = -200;
    directionalLight.shadow.camera.top = 200;
    directionalLight.shadow.camera.bottom = -200;

    const ambientLight = new THREE.AmbientLight(0x101010);

    const controls = new OrbitControls(this.#camera, this.#renderer.domElement);
    controls.target.set(0, 20, 0);
    controls.update();

    const ground = new THREE.Mesh(
      new THREE.BoxGeometry(200, 1, 200),
      new THREE.MeshStandardMaterial({ color: 0xfffffff })
    );

    ground.castShadow = false;
    ground.receiveShadow = true;

    // this.#ground.rotation.x = 0.05;
    // ground.rotation.z = 0.03;
    const groundPhysics = new RigidBody();
    groundPhysics.createBox(
      0,
      ground.position,
      ground.quaternion,
      new THREE.Vector3(200, 1, 200)
    );
    groundPhysics.setRestitution(0.99);
    //this.#rigidBodies.push([ground, groundPhysics]);
    this.#ground = [ground, groundPhysics];
    this.#physicsWorld.addRigidBody(groundPhysics.body);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(4),
      new THREE.MeshStandardMaterial({
        metalness: 1, // between 0 and 1
        roughness: 0.5,
        color: "white",
      })
    );
    sphere.position.set(0, 50, 0);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    const spherePhysics = new RigidBody();
    spherePhysics.createSphere(1, sphere.position, 4);
    spherePhysics.setRestitution(0);
    spherePhysics.setFriction(0.1);
    spherePhysics.setRollingFriction(0.1);
    this.#physicsWorld.addRigidBody(spherePhysics.body);
    this.#rigidBodies.push([sphere, spherePhysics]);

    this.#scene = new THREE.Scene();
    this.#scene.background = new THREE.Color("#fff");
    this.#scene.add(ground);
    this.#scene.add(sphere);
    this.#scene.add(directionalLight);
    this.#scene.add(ambientLight);
    this.#tempPhysicsTransform = new Ammo.btTransform();

    this.#deviceMotion();
    this.#raf();
  }

  #onWindowResize() {
    this.#camera.aspect = window.innerWidth / window.innerHeight;
    this.#camera.updateProjectionMatrix();
    this.#renderer.setSize(window.innerWidth, window.innerHeight);
  }

  #debug<T>(text: T) {
    const debug = document.querySelector("#debug");

    debug!.innerHTML = JSON.stringify(text ?? "NOTHING");
    console.info(text);
  }

  #raf() {
    requestAnimationFrame((t) => {
      if (this.#previousRaf == null) this.#previousRaf = t;
      this.#onWindowResize();

      this.#tiltGround();
      this.#simulate(this.#previousRaf);
      this.#renderer.render(this.#scene, this.#camera);
      this.#raf();
    });
  }

  #tiltGround() {
    const [ground, groundPhysics] = this.#ground;
  }

  #deviceMotion() {
    const registerEvent = () => {
      window.addEventListener(
        "deviceorientation",
        ({ beta, gamma }) => {
          this.#beta = Math.trunc(beta ?? 0);
          this.#gamma = Math.trunc(gamma ?? 0);
          this.#debug({ beta: this.#beta, gamma: this.#gamma });
        },
        false
      );
    };

    if (
      window.DeviceOrientationEvent !== undefined &&
      typeof (window.DeviceOrientationEvent as any).requestPermission ===
        "function"
    ) {
      (window.DeviceOrientationEvent as any)
        .requestPermission()
        .then((response: any) => {
          if (response == "granted") {
            registerEvent();
          }
        })
        .catch((error: any) => {
          console.error(
            "THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:",
            error
          );
        });
    } else {
      registerEvent();
    }
  }

  #simulate(timeElapsed: number) {
    const timeElapsedInSeconds = timeElapsed * 0.001;
    const [ground, groundPhysics] = this.#ground;

    ground.rotation.z = this.#gamma * 0.01;

    const quat = new THREE.Quaternion();
    ground.getWorldQuaternion(quat);
    const tr = new Ammo.btTransform();
    const quat3 = new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w);
    tr.setRotation(quat3);
    groundPhysics.body.setWorldTransform(tr);

    for (let i = 0; i < this.#rigidBodies.length; ++i) {
      this.#rigidBodies[i][1].motionState.getWorldTransform(
        this.#tempPhysicsTransform
      );
      const pos = this.#tempPhysicsTransform.getOrigin();
      const quat = this.#tempPhysicsTransform.getRotation();
      const pos3 = new THREE.Vector3(pos.x(), pos.y(), pos.z());
      const quat3 = new THREE.Quaternion(
        quat.x(),
        quat.y(),
        quat.z(),
        quat.w()
      );

      this.#rigidBodies[i][0].position.copy(pos3);
      this.#rigidBodies[i][0].quaternion.copy(quat3);
    }
    this.#physicsWorld.stepSimulation(timeElapsedInSeconds, 10);
  }
}

let game = null;

window.addEventListener("DOMContentLoaded", async () => {
  Ammo(Ammo).then(() => {
    game = new LabyrinthGame();
    game.initialize();
  });
});
