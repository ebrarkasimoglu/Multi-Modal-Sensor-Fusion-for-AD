export interface Point3D {
  x: number;
  y: number;
  z: number;
  id: string;
}

export interface Point2D {
  u: number;
  v: number;
  depth: number;
  visible: boolean;
  original: Point3D;
}

export interface CameraConfig {
  // Extrinsics (Position)
  x: number;
  y: number;
  z: number;
  // Extrinsics (Rotation in degrees)
  yaw: number;
  pitch: number;
  roll: number;
  // Intrinsics
  focalLength: number;
}
