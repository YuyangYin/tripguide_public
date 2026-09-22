import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeConfig } from '../types';
import { Compass, AlertTriangle, ShieldCheck, HelpCircle, Wind, Navigation, Gauge, Activity, Cpu } from 'lucide-react';
import TornEdge from './TornEdge';
import { getCardStyle } from '../lib/themeStyles';

interface DroneCalculatorProps {
  theme: ThemeConfig;
}

type DroneClass = 'mini' | 'air' | 'pro';

export default function DroneCalculator({ theme }: DroneCalculatorProps) {
  const [droneClass, setDroneClass] = useState<DroneClass>('mini');
  const [windSpeed, setWindSpeed] = useState(6); // m/s
  const [powerLoad, setPowerLoad] = useState(30);
  const [attitudeAngle, setAttitudeAngle] = useState(0);

  // Dynamic calculations for attitude tilt and motor load to make the telemetry realistic
  useEffect(() => {
    let maxSafeWind = 8;
    if (droneClass === 'air') maxSafeWind = 10;
    if (droneClass === 'pro') maxSafeWind = 12;

    // Calculate attitude angle (drones tilt into the wind to maintain GPS hold)
    // Up to 30 degrees tilt
    const calculatedAngle = Math.min((windSpeed / maxSafeWind) * -22, -1);
    setAttitudeAngle(windSpeed === 0 ? 0 : calculatedAngle);

    // Calculate motor power load (higher wind = rotors work harder)
    const baseLoad = droneClass === 'mini' ? 35 : droneClass === 'air' ? 25 : 18;
    const addedLoad = (windSpeed / maxSafeWind) * 65;
    setPowerLoad(Math.min(Math.round(baseLoad + addedLoad), 100));
  }, [windSpeed, droneClass]);

  // Retrieve limits
  const getSafetyData = () => {
    let maxWind = 8; // m/s for mini
    let droneName = '轻量级 < 249g';
    if (droneClass === 'air') {
      maxWind = 10;
      droneName = '中量级 250-900g';
    } else if (droneClass === 'pro') {
      maxWind = 12;
      droneName = '专业级 > 900g';
    }

    const difference = maxWind - windSpeed;
    let status: 'safe' | 'caution' | 'danger' = 'safe';
    let text = '风速适宜，可安心起飞。';
    let alertColor = 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/5 border-emerald-500/15';

    if (difference < 0) {
      status = 'danger';
      text = '已超抗风上限，切勿起飞。';
      alertColor = 'text-rose-700 dark:text-rose-300 bg-rose-500/5 border-rose-500/15';
    } else if (difference <= 2) {
      status = 'caution';
      text = '接近抗风上限，谨慎低空短飞。';
      alertColor = 'text-amber-700 dark:text-amber-300 bg-amber-500/5 border-amber-500/15';
    }

    return { maxWind, droneName, status, text, alertColor };
  };

  const { maxWind, droneName, status, text, alertColor } = getSafetyData();

  // Drone motor spin animation speed
  const rotorDuration = status === 'danger' ? 0.04 : status === 'caution' ? 0.08 : 0.25;
  // Shaking multiplier for the drone preview
  const shakeX = status === 'danger' ? [0, -4, 4, -3, 3, 0] : status === 'caution' ? [0, -1, 1, 0] : [0, -0.3, 0.3, 0];
  const shakeY = status === 'danger' ? [0, 3, -3, 4, -4, 0] : status === 'caution' ? [0, 0.8, -0.8, 0] : [0.5, -0.5, 0.5];

  // Wind streamline colors
  const streamlineColor = status === 'danger' 
    ? 'rgba(239, 68, 68, 0.4)' 
    : status === 'caution' 
      ? 'rgba(245, 158, 11, 0.3)' 
      : 'rgba(56, 189, 248, 0.2)';

  return (
    <div className={`relative p-6 ${getCardStyle(theme.id, 'primary')}`}>
      {theme.id === 'newspaper' && <TornEdge position="top" bgColor="#F4ECE1" cardColor="#FCFBF7" />}
      {theme.id === 'newspaper' && <TornEdge position="bottom" bgColor="#F4ECE1" cardColor="#FCFBF7" />}
      {/* Title */}
      <div className="flex items-center mb-5">
        <h3 className={`text-sm font-black tracking-tight flex items-center gap-2 ${
          theme.id === 'cyber' ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#00F5FF] to-[#FF007F]' : theme.accentColor
        }`}>
          <Wind className="w-4 h-4 text-sky-500" />
          起飞风控
        </h3>
      </div>

      <div className="space-y-5">
        {/* Step 1: Weight select */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-indigo-500" />
            设备规格
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['mini', 'air', 'pro'] as DroneClass[]).map((cls) => {
              const isActive = droneClass === cls;
              const labelText = cls === 'mini' ? '轻量 (<249g)' : cls === 'air' ? '中量 (Air级)' : '专业 (Mavic级)';
              return (
                <button
                  key={cls}
                  onClick={() => setDroneClass(cls)}
                  className={`py-2 px-1 text-center text-[11px] font-bold transition-all cursor-pointer border ${
                    isActive 
                      ? theme.id === 'cyber'
                        ? 'bg-[#00F5FF]/20 text-white border-[#00F5FF] shadow-[0_0_8px_rgba(0,245,255,0.4)] rounded-lg'
                        : theme.id === 'glacial'
                          ? 'bg-stone-900 text-white border-stone-800 shadow-sm rounded-lg'
                          : theme.id === 'aurora'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 rounded-2xl'
                            : theme.id === 'frosted'
                              ? 'bg-purple-600/35 text-white border-purple-400/40 shadow-md rounded-xl shadow-[0_0_8px_rgba(139,92,246,0.4)]'
                              : theme.id === 'newspaper'
                                ? 'bg-[#1B1917] text-white border-[#1B1917] rounded-none shadow-[2px_2px_0px_#1B1917]'
                                : 'bg-stone-900 text-white border-stone-800 shadow-sm rounded-lg'
                      : theme.id === 'cyber'
                        ? 'bg-black/40 text-stone-500 border-[#00F5FF]/10 hover:bg-black/60 rounded-lg'
                        : theme.id === 'glacial'
                          ? 'bg-stone-50/70 text-stone-500 border-stone-200/50 hover:bg-stone-100 rounded-lg'
                          : theme.id === 'aurora'
                            ? 'bg-[#12192C]/50 text-stone-400 border border-[#1E2942] rounded-2xl'
                            : theme.id === 'frosted'
                              ? 'bg-white/5 text-purple-200/60 border border-white/10 hover:bg-white/10 rounded-xl'
                              : theme.id === 'newspaper'
                                ? 'bg-[#FCFBF7] text-[#1B1917] border-2 border-[#1B1917] hover:bg-stone-100 rounded-none shadow-[2px_2px_0px_#1B1917]'
                                : theme.id === 'midnight'
                                  ? 'bg-[#151A26] text-slate-400 border-slate-700/70 hover:bg-[#1A2232] hover:text-slate-200 rounded-lg'
                                  : 'bg-stone-50/70 text-stone-500 border border-stone-200/50 hover:bg-stone-100 rounded-lg'
                  }`}
                >
                  {labelText}
                </button>
              );
            })}
          </div>
          <div className={`flex justify-between items-center text-[10px] bg-stone-500/5 p-2 border ${
            theme.id === 'newspaper' ? 'rounded-none border-[#1B1917] bg-[#FCFBF7]' : 'rounded-lg border-stone-200/10'
          }`}>
            <span className="text-stone-500 dark:text-stone-400 font-medium">{droneName}</span>
            <span className="font-extrabold text-stone-700 dark:text-stone-300">
              抗风极限：<span className="text-red-500 font-black">{maxWind} m/s</span>
            </span>
          </div>
        </div>

        {/* Step 2: Slide */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-sky-400" />
              实时风速
            </label>
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-black text-sky-500 tabular-nums">
                {windSpeed}
              </span>
              <span className="text-[10px] text-stone-400 font-bold">m/s</span>
              <span className="text-[10px] text-stone-500 bg-stone-500/5 px-1.5 py-0.5 rounded ml-1.5 tabular-nums">
                约 {Math.round(windSpeed * 3.6)} km/h
              </span>
            </div>
          </div>
          <div className="relative pt-1">
            <input
              type="range"
              min="0"
              max="18"
              step="1"
              value={windSpeed}
              onChange={(e) => setWindSpeed(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer h-1.5 bg-stone-200 dark:bg-stone-800 rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-bold px-0.5 mt-1.5">
              <span>0</span>
              <span>6</span>
              <span>10</span>
              <span className="text-red-500/80">14</span>
              <span className="text-red-600 font-black">18</span>
            </div>
          </div>
        </div>

        {/* Flight preview HUD */}
        <div className="space-y-2">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 font-bold flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-red-500" />
            姿态预览
          </span>
          
          <div className={`relative h-44 overflow-hidden border flex ${
            theme.id === 'cyber' 
              ? 'border-[#00F5FF]/30 bg-[#050508] rounded-xl' 
              : theme.id === 'glacial' 
                ? 'bg-[#0B2545]/5 border-blue-200/50 rounded-xl' 
                : theme.id === 'aurora' 
                  ? 'bg-black/40 border-[#1E2942] rounded-2xl' 
                  : theme.id === 'frosted'
                    ? 'bg-black/40 border-purple-400/20 rounded-2xl'
                    : theme.id === 'newspaper'
                      ? 'bg-[#FCFBF7] border-2 border-[#1B1917] rounded-none shadow-[2px_2px_0px_#1B1917]'
                      : theme.id === 'midnight'
                        ? 'bg-[#0C0F17] border-slate-700/70 rounded-xl'
                        : 'bg-[#F2EDE2]/50 border-[#E3DCD0] rounded-xl'
          }`}>
            {/* Background aerodynamic wind streamlines grid */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {/* Telemetry Grid overlay */}
              <div 
                className="absolute inset-0 opacity-10" 
                style={{
                  backgroundImage: `radial-gradient(rgba(0, 245, 255, 0.4) 1px, transparent 1px)`,
                  backgroundSize: '16px 16px'
                }}
              />
              
              {/* Dynamic wind streamlines moving right-to-left */}
              {windSpeed > 0 && Array.from({ length: 6 }).map((_, idx) => {
                const randomDelay = idx * 0.4;
                const topPos = 20 + idx * 24;
                const speedScale = 1.8 / Math.max(windSpeed, 1);
                return (
                  <motion.div
                    key={idx}
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: "-10%" }}
                    transition={{
                      repeat: Infinity,
                      duration: Math.max(0.3, speedScale * 8),
                      ease: "linear",
                      delay: randomDelay,
                    }}
                    style={{
                      position: 'absolute',
                      top: `${topPos}px`,
                      width: '60px',
                      height: '1px',
                      background: `linear-gradient(90deg, transparent, ${streamlineColor}, transparent)`,
                    }}
                  />
                );
              })}
            </div>

            {/* Left telemetry column */}
            <div className="w-1/3 border-r border-stone-200/10 p-3 flex flex-col justify-between text-[10px] font-mono z-10 select-none bg-stone-500/[0.03]">
              <div className="space-y-2">
                <div>
                  <span className="text-[9px] text-stone-400 block">状态</span>
                  <span className={`font-bold ${status === 'safe' ? 'text-emerald-500' : status === 'caution' ? 'text-amber-500 animate-pulse' : 'text-rose-500 font-black animate-pulse'}`}>
                    {status === 'safe' ? '悬停稳定' : status === 'caution' ? '轻微漂移' : '失控'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-stone-400 block">GPS</span>
                  <span className={status === 'danger' ? 'text-rose-500 font-bold' : 'text-emerald-500 font-bold'}>
                    {status === 'danger' ? '丢失' : '锁定'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between text-stone-400 text-[9px]">
                    <span>功耗</span>
                    <span className={powerLoad > 85 ? 'text-rose-500 font-bold' : 'text-stone-500'}>{powerLoad}%</span>
                  </div>
                  <div className="w-full h-1 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden mt-0.5">
                    <motion.div
                      className={`h-full ${powerLoad > 85 ? 'bg-rose-500' : powerLoad > 65 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      animate={{ width: `${powerLoad}%` }}
                      transition={{ type: "spring", stiffness: 80 }}
                    />
                  </div>
                </div>
                <div className="flex justify-between text-stone-400 text-[9px]">
                  <span>倾角</span>
                  <span className="text-stone-500">{Math.abs(Math.round(attitudeAngle))}°</span>
                </div>
              </div>
            </div>

            {/* Drone Simulator Main Stage */}
            <div className="flex-1 relative flex items-center justify-center p-4 z-10">
              
              {/* Artificial Horizon scale overlay */}
              <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 flex items-center justify-between opacity-20 pointer-events-none font-mono text-[8px] select-none text-stone-400">
                <span>-20°</span>
                <div className="w-12 h-[1px] bg-stone-400 dashed border-b border-dashed" />
                <div className="w-12 h-[1px] bg-stone-400 dashed border-b border-dashed" />
                <span>+20°</span>
              </div>

              {/* Drone Container - Roll (tilt) and shake based on wind state */}
              <motion.div
                animate={{
                  x: shakeX,
                  y: shakeY,
                  rotate: attitudeAngle
                }}
                transition={{
                  x: { repeat: Infinity, duration: status === 'danger' ? 0.08 : status === 'caution' ? 0.18 : 1.2, ease: "linear" },
                  y: { repeat: Infinity, duration: status === 'danger' ? 0.06 : status === 'caution' ? 0.14 : 1.5, ease: "easeInOut" },
                  rotate: { type: "spring", stiffness: 60, damping: 15 }
                }}
                className="relative w-24 h-24 flex items-center justify-center origin-center"
              >
                {/* Wind vector arrow */}
                {windSpeed > 0 && (
                  <div className="absolute -right-8 top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-70 pointer-events-none">
                    <span className="text-[9px] font-bold text-sky-400">风</span>
                    <motion.div
                      animate={{ x: [-5, 5, -5] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-0 h-0 border-t-4 border-b-4 border-r-6 border-t-transparent border-b-transparent border-r-sky-400"
                    />
                  </div>
                )}

                {/* Glow ring of flight stability */}
                <div className={`absolute inset-2 rounded-full filter blur-md transition-all duration-300 opacity-25 ${
                  status === 'danger' ? 'bg-rose-500 animate-ping' : status === 'caution' ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />

                {/* Stunning Drone Silhouette Frame */}
                <svg viewBox="0 0 120 120" className="w-20 h-20 drop-shadow-lg text-stone-800 dark:text-stone-100 transition-colors duration-300">
                  {/* Sturdy structural cross-arms */}
                  <path d="M 20 20 L 100 100" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
                  <path d="M 100 20 L 20 100" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.85" />
                  
                  {/* Central premium sleek flight computer chassis */}
                  <circle cx="60" cy="60" r="15" fill={theme.id === 'cyber' ? '#12131a' : '#1f2937'} stroke="currentColor" strokeWidth="2" />
                  <rect x="52" y="52" width="16" height="16" rx="4" fill="#374151" />

                  {/* Core Status Sensor LED eye */}
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="4.5" 
                    fill={status === 'danger' ? '#F43F5E' : status === 'caution' ? '#F59E0B' : '#10B981'} 
                    className="animate-pulse"
                  />
                  
                  {/* Custom GPS Puck Dome */}
                  <path d="M 50 48 Q 60 40 70 48 Z" fill="currentColor" opacity="0.9" />
                </svg>

                {/* Dynamic Rotating Rotor Blades */}
                {[
                  { id: 'TL', top: '10px', left: '10px' },
                  { id: 'TR', top: '10px', right: '10px' },
                  { id: 'BL', bottom: '10px', left: '10px' },
                  { id: 'BR', bottom: '10px', right: '10px' }
                ].map((rotor) => {
                  return (
                    <div 
                      key={rotor.id} 
                      className="absolute w-8 h-8 flex items-center justify-center"
                      style={{
                        top: rotor.top,
                        left: rotor.left,
                        right: rotor.right,
                        bottom: rotor.bottom
                      }}
                    >
                      {/* Motor pod circle */}
                      <div className="w-3.5 h-3.5 rounded-full bg-stone-900 border border-stone-400 z-10 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      </div>
                      
                      {/* Fast Rotating Blades */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: rotorDuration, ease: "linear" }}
                        className="absolute w-10 h-1 bg-stone-400/50 dark:bg-stone-200/50 rounded-full"
                      />
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: rotorDuration, ease: "linear" }}
                        className="absolute w-1 h-10 bg-stone-400/30 dark:bg-stone-200/30 rounded-full"
                      />
                    </div>
                  );
                })}
              </motion.div>

              {/* Floating Error Hud labels overlay */}
              <AnimatePresence>
                {status === 'danger' && (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none bg-rose-950/20 backdrop-blur-[1px] rounded-r-xl"
                  >
                    <div className="bg-rose-950/90 border border-rose-500/30 text-rose-300 text-[11px] px-3 py-1.5 rounded-lg flex flex-col items-center gap-1 text-center shadow-lg">
                      <AlertTriangle className="w-4 h-4 text-rose-500 animate-bounce" />
                      <span className="font-black text-red-400">姿态超限</span>
                      <span className="text-[10px]">电机过载</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Status Alert description */}
        <div className={`p-4 border text-xs leading-relaxed transition-all duration-300 ${alertColor} ${
          theme.id === 'cyber' 
            ? 'border-[#00F5FF]/30 rounded-lg' 
            : theme.id === 'newspaper'
              ? 'border-2 border-[#1B1917] rounded-none shadow-[2px_2px_0px_#1B1917]'
              : 'rounded-2xl'
        }`}>
          <div className="flex items-start gap-2.5">
            {status === 'safe' ? (
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${status === 'danger' ? 'text-rose-500 animate-pulse' : 'text-amber-500'}`} />
            )}
            <p className="font-medium">{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
