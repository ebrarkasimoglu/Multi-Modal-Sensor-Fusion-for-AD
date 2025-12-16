import { CameraConfig, Point3D, Point2D } from '../types';

const toRad = (deg: number) => (deg * Math.PI) / 180;

/**
 * Standard Pinhole Camera Projection
 * Formula: P_img = K * [R|T] * P_world
 */
export const projectPoint = (
  p: Point3D, 
  cam: CameraConfig, 
  width: number, 
  height: number
): Point2D => {
  
  // --- 1. Extrinsics [R|T] (World -> Camera Frame) ---
  
  // Translation (T)
  let x = p.x - cam.x;
  let y = p.y - cam.y;
  let z = p.z - cam.z;

  // Rotation (R) - Euler Angles: Yaw(Y) -> Pitch(X) -> Roll(Z)
  const yaw = toRad(cam.yaw);
  const pitch = toRad(cam.pitch);
  const roll = toRad(cam.roll);

  // Ry (Yaw)
  let dx = x * Math.cos(yaw) - z * Math.sin(yaw);
  let dz = x * Math.sin(yaw) + z * Math.cos(yaw);
  x = dx; z = dz;

  // Rx (Pitch)
  let dy = y * Math.cos(pitch) - z * Math.sin(pitch);
  dz = y * Math.sin(pitch) + z * Math.cos(pitch);
  y = dy; z = dz;

  // Rz (Roll)
  dx = x * Math.cos(roll) - y * Math.sin(roll);
  dy = x * Math.sin(roll) + y * Math.cos(roll);
  x = dx; y = dy;

  // Near plane clipping
  if (z <= 0.1) {
    return { u: 0, v: 0, depth: z, visible: false, original: p };
  }

  // --- 2. Intrinsics [K] (Camera -> Image Plane) ---

  const f = cam.focalLength;
  const cx = width / 2;
  const cy = height / 2;

  // Perspective Divide & Screen Mapping
  const u = (f * x / z) + cx;
  const v = cy - (f * y / z); // Invert Y for raster coordinates

  const visible = u >= 0 && u <= width && v >= 0 && v <= height;

  return { u, v, depth: z, visible, original: p };
};

export const generateCubePoints = (size: number, center: {x:number, y:number, z:number}): Point3D[] => {
  const points: Point3D[] = [];
  const s = size / 2;
  
  // Cube Vertices
  const vertices = [
    {x: -s, y: -s, z: -s}, {x: s, y: -s, z: -s},
    {x: s, y: s, z: -s},   {x: -s, y: s, z: -s},
    {x: -s, y: -s, z: s},  {x: s, y: -s, z: s},
    {x: s, y: s, z: s},    {x: -s, y: s, z: s},
  ];

  vertices.forEach((v, i) => {
    points.push({
      x: center.x + v.x,
      y: center.y + v.y,
      z: center.z + v.z,
      id: `v-${i}`
    });
  });

  // Simulated Point Cloud Noise
  for(let i=0; i<60; i++) {
    points.push({
      x: center.x + (Math.random() - 0.5) * size * 1.2,
      y: center.y + (Math.random() - 0.5) * size * 1.2,
      z: center.z + (Math.random() - 0.5) * size * 1.2,
      id: `n-${i}`
    })
  }

  return points;
};