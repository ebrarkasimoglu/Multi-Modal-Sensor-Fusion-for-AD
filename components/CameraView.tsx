import React, { useMemo } from 'react';
import { CameraConfig, Point3D } from '../types';
import { projectPoint } from '../utils/math';

interface CameraViewProps {
  points: Point3D[];
  config: CameraConfig;
}

export const CameraView: React.FC<CameraViewProps> = ({ points, config }) => {
  const width = 800;
  const height = 600;

  // Project all points
  const projectedPoints = useMemo(() => {
    return points
      .map((p) => projectPoint(p, config, width, height))
      .sort((a, b) => b.depth - a.depth); // Painter's algorithm (draw far points first)
  }, [points, config]);

  return (
    <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border-2 border-slate-800 shadow-2xl">
      {/* Overlay UI: Camera Frame Info */}
      <div className="absolute top-4 left-4 z-10 font-mono text-xs text-cyan-500/80 pointer-events-none">
        <p>CAM_RES: {width}x{height}</p>
        <p>FOCAL_LEN: {config.focalLength}px</p>
        <p>PTS_VISIBLE: {projectedPoints.filter(p => p.visible).length}</p>
      </div>

      <svg 
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Grid lines to give a sense of the 'image sensor' plane */}
        <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Center Crosshair */}
        <line x1={width/2 - 10} y1={height/2} x2={width/2 + 10} y2={height/2} stroke="rgba(255,255,255,0.2)" />
        <line x1={width/2} y1={height/2 - 10} x2={width/2} y2={height/2 + 10} stroke="rgba(255,255,255,0.2)" />

        {projectedPoints.map((pt, idx) => {
          if (!pt.visible) return null;

          // Depth coloring: Close = Red/Orange, Far = Blue/Purple
          // Let's normalize depth approx 0 to 20m
          const normalizedDepth = Math.max(0, Math.min(1, pt.depth / 20));
          
          // Simple heatmap gradient interpolation
          // 0 (close) -> Red (255, 0, 0)
          // 0.5 (mid) -> Green (0, 255, 0)
          // 1 (far) -> Blue (0, 0, 255)
          let r = 0, g = 0, b = 0;
          if (normalizedDepth < 0.5) {
            // Red to Green
            r = 255 * (1 - normalizedDepth * 2);
            g = 255 * (normalizedDepth * 2);
          } else {
            // Green to Blue
            g = 255 * (1 - (normalizedDepth - 0.5) * 2);
            b = 255 * ((normalizedDepth - 0.5) * 2);
          }

          const color = `rgb(${r},${g},${b})`;
          const size = Math.max(2, 20 / pt.depth); // Perspective size scaling

          return (
            <g key={pt.original.id}>
              <circle 
                cx={pt.u} 
                cy={pt.v} 
                r={size} 
                fill={color}
                opacity={0.8}
              />
              {/* Draw connections for cube vertices only (indices 0-7) to show structure */}
              {/* This is a bit of a hacky wireframe for the demo */}
              {idx < 8 && pt.original.id.startsWith('v-') && (
                 <circle cx={pt.u} cy={pt.v} r={size+2} stroke="white" strokeWidth="1" fill="none" opacity={0.3} />
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur p-2 rounded border border-slate-700 text-xs text-white">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div> <span>Close</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div> <span>Far</span>
        </div>
      </div>
    </div>
  );
};
