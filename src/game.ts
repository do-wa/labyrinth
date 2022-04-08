// three.js
// physics
import { AmmoPhysics, ExtendedMesh } from "@enable3d/ammo-physics";
import * as THREE from "three";
import { Scene } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

function setupCamera() {
  const fov = 60;
  const aspect = 1920 / 1080;
  const near = 1.0;
  const far = 1000.0;

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(40, 350, 0);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  return camera;
}

function setupLight(scene: Scene) {
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
  return [hemisphereLight, directionalLight];
}

function setupRenderer() {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
  return renderer;
}

function createLabyrinthMap(physics: AmmoPhysics) {
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
  const geometry = new THREE.ExtrudeBufferGeometry(rectShape, extrudeSettings);
  geometry.center();
  geometry.rotateX(Math.PI * -0.5);
  const material = new THREE.MeshPhongMaterial({
    color: 0x222222,
  });
  const ground = new ExtendedMesh(geometry, material);
  ground.receiveShadow = true;

  physics.add.existing(ground as any, { mass: 0 });
  ground.body.setCollisionFlags(2);
  return ground;
}

function createSphere(physics: AmmoPhysics) {
  const sphere = new ExtendedMesh(
    new THREE.SphereBufferGeometry(4),
    new THREE.MeshPhongMaterial({ color: 0xff0505 })
  );
  sphere.position.set(0, 100, 0);
  sphere.castShadow = true;
  sphere.receiveShadow = true;

  physics.add.existing(sphere as any);
  sphere.body.setRestitution(0);
  sphere.body.setFriction(0.1);

  return sphere;
}

function onWindowResize(
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function LabyrinthGame() {
  // scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);
  // camera
  const camera = setupCamera();
  const renderer = setupRenderer();
  window.addEventListener("resize", () => onWindowResize(camera, renderer));
  // light
  setupLight(scene);

  // orbit controls
  new OrbitControls(camera, renderer.domElement);

  // physics
  const physics = new AmmoPhysics(scene as any);
  physics.debug?.enable();
  const { factory } = physics;

  // add floor
  const labyrinthMap = createLabyrinthMap(physics);
  scene.add(labyrinthMap);
  // add sphere
  const sphere = createSphere(physics);
  scene.add(sphere);

  const geometry = new THREE.BoxBufferGeometry(20, 20, 20);
  const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
  const cube = new ExtendedMesh(geometry, material);
  cube.position.set(25, 25, 20);
  physics.add.existing(cube as any);
  cube.body.setCollisionFlags(2);
  scene.add(cube);

  // clock
  const clock = new THREE.Clock();

  // loop
  const animate = () => {
    cube.rotation.z += 0.01;
    cube.body.needUpdate = true;
    labyrinthMap.body.needUpdate = true; // this is how you update kinematic bodies

    physics.update(clock.getDelta() * 1000);
    physics.updateDebugger();

    // you have to clear and call render twice because there are 2 scenes
    // one 3d scene and one 2d scene
    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();

    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
}

// '/ammo' is the folder where all ammo file are
Ammo().then(LabyrinthGame);
