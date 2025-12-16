import React, { useState, useEffect } from 'react';
import { CameraView } from './components/CameraView';
import { ExplanationPanel } from './components/ExplanationPanel';
import { generateCubePoints } from './utils/math';
import { CameraConfig, Point3D } from './types';
import { Rotate3D, Move3D, Sliders, Menu, X, Github } from 'lucide-react';

const App: React.FC = () => {
  const [points, setPoints] = useState<Point3D[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Default camera slightly up and back
  const [config, setConfig] = useState<CameraConfig>({
    x: 0,
    y: 1.5,
    z: -8, 
    yaw: 0,
    pitch: 10, // Tilt down a bit
    roll: 0,
    focalLength: 800,
  });

  useEffect(() => {
    // Creating the "Cube" of data
    setPoints(generateCubePoints(4, { x: 0, y: 0, z: 0 }));
  }, []);

  const updateConfig = (key: keyof CameraConfig, value: number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  // Reusable slider component
  const SliderControl = ({ label, prop, min, max, step = 0.1 }: { label: string, prop: keyof CameraConfig, min: number, max: number, step?: number }) => (
    <div className="mb-5">
      <div className="flex justify-between mb-2 text-[10px] uppercase tracking-widest text-slate-500 font-bold">
        <label>{label}</label>
        <span className="font-mono text-cyan-400">{config[prop].toFixed(1)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={config[prop]}
        onChange={(e) => updateConfig(prop, parseFloat(e.target.value))}
        className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
      />
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-[#0d1117] text-slate-200 overflow-hidden font-sans selection:bg-cyan-900 selection:text-cyan-100">
      
      {/* Navbar */}
      <header className="flex-none h-14 border-b border-slate-800 bg-[#0d1117]/80 backdrop-blur flex items-center justify-between px-4 lg:px-6 z-20">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-cyan-600 rounded flex items-center justify-center text-white font-mono text-xs font-bold shadow-lg shadow-cyan-900/20">
            py
          </div>
          <h1 className="font-mono text-sm lg:text-base font-semibold text-slate-200 tracking-tight">
            Multi-Modal-Sensor-Fusion-for-AD
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <a href="#" className="hidden lg:flex items-center gap-2 text-xs text-slate-500 hover:text-white transition-colors">
            <Github className="w-4 h-4" />
            <span>view source</span>
          </a>
          <button 
            onClick={() => setShowExplanation(!showExplanation)}
            className="p-2 text-slate-400 hover:text-white lg:hidden"
          >
            {showExplanation ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex overflow-hidden relative">
        
        {/* Controls Sidebar (Left) */}
        <aside className="w-80 flex-none bg-[#0d1117] border-r border-slate-800 p-6 overflow-y-auto hidden lg:block custom-scrollbar">
          
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 text-cyan-400">
              <Move3D className="w-4 h-4" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Extrinsics: T</h2>
            </div>
            <div className="bg-slate-900/50 p-4 rounded border border-slate-800/50">
              <SliderControl label="X (Side)" prop="x" min={-10} max={10} />
              <SliderControl label="Y (Up/Down)" prop="y" min={-10} max={10} />
              <SliderControl label="Z (Forward)" prop="z" min={-20} max={5} />
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4 text-purple-400">
              <Rotate3D className="w-4 h-4" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Extrinsics: R</h2>
            </div>
            <div className="bg-slate-900/50 p-4 rounded border border-slate-800/50">
              <SliderControl label="Yaw (Pan)" prop="yaw" min={-180} max={180} step={1} />
              <SliderControl label="Pitch (Tilt)" prop="pitch" min={-90} max={90} step={1} />
              <SliderControl label="Roll" prop="roll" min={-180} max={180} step={1} />
            </div>
          </div>

          <div className="mb-8">
             <div className="flex items-center gap-2 mb-4 text-emerald-400">
              <Sliders className="w-4 h-4" />
              <h2 className="text-sm font-bold uppercase tracking-wider">Intrinsics: K</h2>
            </div>
            <div className="bg-slate-900/50 p-4 rounded border border-slate-800/50">
              <SliderControl label="Focal Length (f)" prop="focalLength" min={100} max={2000} step={10} />
            </div>
          </div>
        </aside>

        {/* Visualization Area (Center) */}
        <section className="flex-1 flex flex-col relative p-4 bg-black overflow-hidden justify-center items-center">
          
          {/* Mobile Controls Overlay */}
          <div className="lg:hidden absolute top-4 left-4 right-4 z-10 pointer-events-none">
             <div className="bg-slate-900/90 backdrop-blur p-4 rounded border border-slate-800 pointer-events-auto">
               <p className="text-[10px] text-slate-500 mb-3 uppercase font-bold tracking-widest">Quick Adjust</p>
               <SliderControl label="Yaw" prop="yaw" min={-180} max={180} step={1} />
               <SliderControl label="Depth (Z)" prop="z" min={-20} max={5} />
             </div>
          </div>

          <CameraView points={points} config={config} />
          
          <div className="mt-6 text-center">
            <p className="font-mono text-xs text-slate-500">
              Use the sliders to adjust the Extrinsic [R|T] and Intrinsic [K] matrices.
            </p>
          </div>
        </section>

        {/* Documentation Sidebar (Right) */}
        <aside className={`${showExplanation ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 transition-transform duration-300 absolute lg:relative right-0 top-0 bottom-0 w-full lg:w-[400px] z-30 bg-[#0d1117] border-l border-slate-800 shadow-2xl lg:shadow-none`}>
          <div className="lg:hidden absolute top-4 right-4 z-50">
             <button onClick={() => setShowExplanation(false)} className="p-2 bg-slate-800 rounded-full text-white hover:bg-slate-700"><X size={20} /></button>
          </div>
          <ExplanationPanel />
        </aside>

      </main>
    </div>
  );
};

export default App;