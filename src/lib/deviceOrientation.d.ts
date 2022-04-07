declare type DeviceOrientation = {
  beta: number | undefined;
  gamma: number | undefined;
};

declare class DeviceOrientationControls {
  constructor(object: THREE.Object3D);
  update(): void;
  connect(): void;
  deviceOrientation: DeviceOrientation;
}

export { DeviceOrientationControls };
