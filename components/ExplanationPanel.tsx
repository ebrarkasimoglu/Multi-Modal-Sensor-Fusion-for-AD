import React from 'react';
import { BookOpen } from 'lucide-react';

export const ExplanationPanel: React.FC = () => {
  return (
    <div className="bg-[#0d1117] border-l border-slate-800 p-6 overflow-y-auto h-full text-slate-300 font-sans">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
        <BookOpen className="w-5 h-5 text-cyan-400" />
        <h2 className="text-lg font-bold text-white tracking-wide">README.md</h2>
      </div>

      <div className="prose prose-invert prose-sm">
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-white mb-4">
          Multi-Modal-Sensor-Fusion-for-AD
        </h1>

        {/* Introduction */}
        <div className="mb-6">
          <h3 className="text-cyan-200 font-semibold uppercase text-xs tracking-wider mb-2">Introduction</h3>
          <p className="leading-relaxed text-slate-400">
            I built this project to visualize the math I learned in my Linear Algebra course. 
            I wanted to see exactly how self-driving cars align different sensors—specifically, how you take a 3D point cloud from a LIDAR and stick it onto a 2D camera image.
            
            It turns out it's just matrix multiplication!
          </p>
        </div>

        {/* How It Works */}
        <div className="mb-6 bg-slate-900 p-4 rounded-md border border-slate-800">
          <h3 className="text-cyan-200 font-semibold uppercase text-xs tracking-wider mb-2">How it Works</h3>
          <p className="mb-3">
            The core logic is the projection formula:
          </p>
          <code className="block bg-black p-3 rounded text-green-400 font-mono text-xs mb-3">
            P_img = K · [R | T] · P_world
          </code>
          <ul className="list-disc pl-4 space-y-2 text-slate-400">
            <li>
              <strong className="text-white">World P:</strong> The 3D point (x, y, z).
            </li>
            <li>
              <strong className="text-white">[R | T]:</strong> The Extrinsic Matrix. It rotates and moves the world so it's relative to the camera.
            </li>
            <li>
              <strong className="text-white">K:</strong> The Intrinsic Matrix. It handles the focal length and perspective divide (making far things small).
            </li>
          </ul>
        </div>

        {/* Tech Stack */}
        <div>
          <h3 className="text-cyan-200 font-semibold uppercase text-xs tracking-wider mb-2">Tech Stack</h3>
          <div className="flex gap-2 text-xs font-mono">
            <span className="bg-slate-800 px-2 py-1 rounded">Python (Logic)</span>
            <span className="bg-slate-800 px-2 py-1 rounded">NumPy</span>
            <span className="bg-slate-800 px-2 py-1 rounded">Matplotlib</span>
          </div>
          <p className="text-xs text-slate-600 mt-2 italic">
            *Ported to TypeScript/React for this web demo so you can play with the sliders.*
          </p>
        </div>

      </div>
    </div>
  );
};