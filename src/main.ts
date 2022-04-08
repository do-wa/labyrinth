///<reference path="./lib/ammo.wasm.d.ts"/>

import { AmmoPhysics, ExtendedMesh } from "@enable3d/ammo-physics";
import * as THREE from "three";
import { Camera, Quaternion, Renderer, Scene, Vector3 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
//import { DeviceOrientationControls } from "./lib/deviceOrientation";
import "./style.css";

function debug<T>(text: T) {
  const debug = document.querySelector("#debug");

  debug!.innerHTML = JSON.stringify(text ?? "NOTHING");
  console.info(text);
}

class RigidBody {
  #transform: Ammo.btTransform;
  #shape: Ammo.btSphereShape;
  #inertia: Ammo.btVector3;
  #info: Ammo.btRigidBodyConstructionInfo;
  #motionState: Ammo.btMotionState;
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
    this.#motionState = new Ammo.btDefaultMotionState(this.#transform);

    const btSize = new Ammo.btVector3(size.x * 0.5, size.y * 0.5, size.z * 0.5);
    this.#shape = new Ammo.btBoxShape(btSize);
    this.#shape.setMargin(0.05);

    this.#inertia = new Ammo.btVector3(0, 0, 0);
    if (mass > 0) {
      this.#shape.calculateLocalInertia(mass, this.#inertia);
    }

    this.#info = new Ammo.btRigidBodyConstructionInfo(
      mass,
      this.#motionState,
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
    this.#motionState = new Ammo.btDefaultMotionState(this.#transform);

    this.#shape = new Ammo.btSphereShape(size);
    this.#shape.setMargin(0.05);

    this.#inertia = new Ammo.btVector3(0, 0, 0);

    if (mass > 0) {
      this.#shape.calculateLocalInertia(mass, this.#inertia);
    }

    this.#info = new Ammo.btRigidBodyConstructionInfo(
      mass,
      this.#motionState,
      this.#shape,
      this.#inertia
    );
    this.body = new Ammo.btRigidBody(this.#info);
  }
}

class Physics {
  #collisionConfig: Ammo.btDefaultCollisionConfiguration;
  #collisionDispatcher: Ammo.btCollisionDispatcher;
  #broadphase: Ammo.btDbvtBroadphase;
  #solver: Ammo.btSequentialImpulseConstraintSolver;
  physicsWorld: Ammo.btDiscreteDynamicsWorld;
  reusablePhysicsTransform: Ammo.btTransform = new Ammo.btTransform();
  rigidBodies: [THREE.Mesh, RigidBody][] = [];

  constructor() {
    this.#collisionConfig = new Ammo.btDefaultCollisionConfiguration();
    this.#collisionDispatcher = new Ammo.btCollisionDispatcher(
      this.#collisionConfig
    );
    this.#broadphase = new Ammo.btDbvtBroadphase();
    this.#solver = new Ammo.btSequentialImpulseConstraintSolver();
    this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(
      this.#collisionDispatcher,
      this.#broadphase,
      this.#solver,
      this.#collisionConfig
    );

    this.physicsWorld.setGravity(new Ammo.btVector3(0, -10, 0));
  }
}

class UserControls {
  gamma: number = 0;
  beta: number = 0;

  constructor() {
    const registerMouseEvent = () => {
      window.addEventListener("mousedown", () => {
        const move = (evt: MouseEvent) => {
          this.beta -= evt.movementX * 0.001;
          this.gamma -= evt.movementY * 0.001;
        };

        const mouseup = () => {
          window.removeEventListener("mousemove", move);
          window.removeEventListener("mouseup", mouseup);
        };
        window.addEventListener("mousemove", move);
        window.addEventListener("mouseup", mouseup);
      });
    };

    const registerKeyboardEvent = () => {
      window.addEventListener("keydown", (evt) => {
        switch (evt.key) {
          case "ArrowLeft":
          case "A": {
            this.beta += 0.025;
            break;
          }
          case "ArrowRight":
          case "D": {
            this.beta -= 0.025;
            break;
          }
          case "ArrowUp":
          case "W": {
            this.gamma -= 0.025;
            break;
          }
          case "ArrowDown":
          case "S": {
            this.gamma += 0.025;
            break;
          }
        }
      });
    };
    const registerMotionEvent = () => {
      window.addEventListener(
        "deviceorientation",
        ({ beta, gamma }: DeviceOrientationEvent) => {
          if (beta && gamma) {
            this.beta = Math.trunc(beta ?? 0);
            this.gamma = Math.trunc(gamma ?? 0);
          }
        },
        false
      );
    };

    registerMouseEvent();
    registerKeyboardEvent();
    if (
      window.DeviceOrientationEvent !== undefined &&
      typeof (window.DeviceOrientationEvent as any).requestPermission ===
        "function"
    ) {
      (window.DeviceOrientationEvent as any)
        .requestPermission()
        .then((response: any) => {
          if (response == "granted") {
            registerMotionEvent();
          }
        })
        .catch((error: any) => {
          console.error(
            "THREE.DeviceOrientationControls: Unable to use DeviceOrientation API:",
            error
          );
        });
    } else {
      registerMotionEvent();
    }
  }
}

class LabyrinthGame {
  #renderer: THREE.WebGLRenderer;
  #camera: THREE.PerspectiveCamera;
  #scene: THREE.Scene;

  #clock: THREE.Clock;
  #ground: [THREE.Object3D, RigidBody];

  #physics: Physics;
  #physics2: AmmoPhysics;
  #userControls: UserControls;
  constructor(userControls: UserControls) {
    //this.#physics = physics;
    this.#userControls = userControls;
    this.#clock = new THREE.Clock();
    this.#setupScene();
    this.#setupRenderer();
    this.#physics2 = new AmmoPhysics(this.#scene);
    this.#physics2.debug?.enable();
    window.addEventListener("resize", this.#onWindowResize);
    this.#setupCamera();

    this.#setupLight(this.#scene);
    this.#setupLabyrinthMap(this.#physics, this.#scene);
    this.#setupBall(this.#physics, this.#scene);

    // this.#debugOrbitControls(this.#camera, this.#renderer);

    this.#tick();
  }

  #debugOrbitControls(camera: Camera, renderer: Renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 20, 0);
    controls.update();
  }

  #setupScene() {
    this.#scene = new THREE.Scene();
    this.#scene.background = new THREE.Color("#fff");
  }

  #setupBall(physics: Physics, scene: Scene) {
    const STATE = { DISABLE_DEACTIVATION: 4 };
    const FLAGS = { CF_KINEMATIC_OBJECT: 2 };
    const sphere = new ExtendedMesh(
      new THREE.SphereBufferGeometry(4),
      new THREE.MeshPhongMaterial({ color: 0xff0505 })
    );
    sphere.position.set(0, 100, 0);
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    // const spherePhysics = new RigidBody();
    // spherePhysics.createSphere(1, sphere.position, 4);
    // spherePhysics.setRestitution(0);
    // spherePhysics.setFriction(0.1);
    // spherePhysics.setRollingFriction(0.1);
    // spherePhysics.body.setActivationState(STATE.DISABLE_DEACTIVATION);
    // //spherePhysics.body.setCollisionFlags(FLAGS.CF_KINEMATIC_OBJECT);
    // physics.physicsWorld.addRigidBody(spherePhysics.body);
    // physics.rigidBodies.push([sphere, spherePhysics]);

    this.#physics2.add.existing(sphere as any, { shape: "hacd" });
    scene.add(sphere);
  }

  #setupLabyrinthMap(physics: Physics, scene: Scene) {
    // Rectangle
    const rectLength = 200;
    const rectWidth = 120;
    const rectShape = new THREE.Shape()
      .moveTo(0, 0)
      .lineTo(rectLength, 0)
      .lineTo(rectLength, rectWidth)
      .lineTo(0, rectWidth)
      .lineTo(0, 0);
    // Holes
    const hole = new THREE.Path()
      .moveTo(144, 60)
      .absarc(134, 60, 10, 0, Math.PI * 2, true);
    rectShape.holes.push(hole);
    const hole2 = new THREE.Path()
      .moveTo(77, 60)
      .absarc(67, 60, 10, 0, Math.PI * 2, true);
    rectShape.holes.push(hole2);
    const extrudeSettings = {
      depth: 20,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 2,
      bevelSize: 1,
      bevelThickness: 1,
    };
    const geometry = new THREE.ExtrudeBufferGeometry(
      rectShape,
      extrudeSettings
    );
    geometry.center();
    geometry.rotateX(Math.PI * -0.5);
    const material = new THREE.MeshPhongMaterial({
      color: 0x222222,
    });
    const ground = new ExtendedMesh(geometry, material);
    ground.receiveShadow = true;
    scene.add(ground);
    //this.#physics2.add.existing(ground as any, { shape: "hacd" });
    // ground.body.setCollisionFlags(2);

    // const groundPhysics = new RigidBody();
    // groundPhysics.createBox(
    //   0,
    //   ground.position,
    //   ground.quaternion,
    //   new THREE.Vector3(300, 10, 300)
    // );
    // groundPhysics.setRestitution(0.99);
    // //this.#physics.rigidBodies.push([ground, groundPhysics]);
    // this.#ground = [ground, groundPhysics];

    // physics.physicsWorld.addRigidBody(groundPhysics.body);
    // // groundPhysics.body.setActivationState(STATE.DISABLE_DEACTIVATION);

    // groundPhysics.body.setCollisionFlags(2);
  }

  #setupRenderer() {
    this.#renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    this.#renderer.shadowMap.enabled = true;
    this.#renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.#renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.#renderer.outputEncoding = THREE.sRGBEncoding;
    this.#renderer.setPixelRatio(window.devicePixelRatio);
    this.#renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.#renderer.domElement);
  }

  #setupCamera() {
    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 1000.0;

    this.#camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.#camera.position.set(40, 250, 0);
    this.#camera.lookAt(new THREE.Vector3(0, 0, 0));
  }

  #setupLight(scene: Scene) {
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.1);
    hemisphereLight.color.setHSL(0.6, 0.6, 0.6);
    hemisphereLight.groundColor.setHSL(0.1, 1, 0.4);
    hemisphereLight.position.set(0, 50, 0);

    const directionalLight = new THREE.DirectionalLight(0xffffff);
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

    scene.add(hemisphereLight);
    scene.add(directionalLight);
  }

  #onWindowResize() {
    this.#camera.aspect = window.innerWidth / window.innerHeight;
    this.#camera.updateProjectionMatrix();
    this.#renderer.setSize(window.innerWidth, window.innerHeight);
  }

  #tick() {
    requestAnimationFrame(() => {
      let deltaTime = this.#clock.getDelta();

      this.#onWindowResize();
      // const [ground] = this.#ground;
      // ground.rotation.z = this.#userControls.gamma;
      // ground.rotation.x = this.#userControls.beta;
      //this.#simulate(deltaTime);
      this.#renderer.render(this.#scene, this.#camera);
      this.#tick();
    });
  }

  #simulate(deltaTime: number) {
    const [ground, groundPhysics] = this.#ground;

    ground.rotation.z = this.#userControls.gamma;

    const quat = new THREE.Quaternion();
    ground.getWorldQuaternion(quat);
    const tr = new Ammo.btTransform();
    const quat3 = new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w);
    tr.setRotation(quat3);
    groundPhysics.body.setWorldTransform(tr);
    this.#physics.physicsWorld.stepSimulation(deltaTime * 4, 10);
    for (let i = 0; i < this.#physics.rigidBodies.length; i++) {
      let [objThree, objAmmo] = this.#physics.rigidBodies[i];

      let ms = objAmmo.body.getMotionState();
      if (ms) {
        ms.getWorldTransform(this.#physics.reusablePhysicsTransform);
        let p = this.#physics.reusablePhysicsTransform.getOrigin();
        let q = this.#physics.reusablePhysicsTransform.getRotation();
        objThree.position.set(p.x(), p.y(), p.z());
        objThree.quaternion.set(q.x(), q.y(), q.z(), q.w());
      }
    }
  }
}

let game = null;

Ammo(Ammo).then(() => {
  game = new LabyrinthGame(new UserControls());
});
