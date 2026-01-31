import React, { Suspense, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "wouter";
import { Canvas } from "@react-three/fiber";
import Particles from "../components/Particles/Particles";
import { svgPathProperties } from "svg-path-properties";

const BackgroundStudio = ({ eraAccentColor, className }) => (
  <div className={`bg-black overflow-hidden ${className}`}>
    <Canvas camera={{ position: [0, 0, 20], fov: 75 }}>
      <Suspense fallback={null}>
        <Particles
          particleCount={200}
          particleColors={[eraAccentColor, "#ffffff", "#888888"]}
          particleBaseSize={2}
          speed={0.01}
        />
      </Suspense>
    </Canvas>
  </div>
);

export default function Events() {
  const [, setLocation] = useLocation();
  const eraAccentColor = "#00f0ff";

  const [securedIds, setSecuredIds] = useState(() =>
    JSON.parse(localStorage.getItem("yenixa.securedEvents") || "[]")
  );

  const [activeNodeId, setActiveNodeId] = useState(null);
  const [buttonState, setButtonState] = useState(null);
  const [isArchivePounding, setIsArchivePounding] = useState(false);

  const rawMoments = useMemo(
    () => [
      { id: 1, t: 0.05, title: "IT Manager", time: "Eon 0", description: "The first vibration in the void that birthed the river of time." },
      { id: 2, t: 0.1, title: "Best Manager", time: "Eon 2.4", description: "Vast cosmic bodies drift into perfect resonance, unlocking spatial gates." },
      { id: 3, t: 0.16, title: "HR", time: "Eon 5.1", description: "Consciousness begins to perceive its own duration for the first time." },
      { id: 4, t: 0.22, title: "Marketing", time: "Year 1200 PC", description: "A civilization built on frozen moments, where time was traded as currency." },
      { id: 5, t: 0.28, title: "Finance", time: "Year 2045 AC", description: "The boundary between biological and digital time finally collapses." },
      { id: 6, t: 0.34, title: "Start Up Pitch", time: "Year 2102 AC", description: "The timeline splits into a thousand threads, creating the Multiverse." },
      { id: 7, t: 0.4, title: "Best From Waste", time: "Year 3000 AC", description: "A century where no music was played, only the hum of the temporal string." },
      { id: 8, t: 0.46, title: "Photography Challenge", time: "Cycle 12", description: "Humanity reaches the highest point of technological integration." },
      { id: 9, t: 0.52, title: "Quiz", time: "Cycle 14", description: "A localized failure causes three decades to happen in reverse." },
      { id: 10, t: 0.58, title: "Coding", time: "Cycle 21", description: "All divergent timelines are woven back into a single luminous thread." },
      { id: 11, t: 0.64, title: "E-Sports", time: "Era Alpha", description: "New life forms emerge that breathe light and speak in frequencies." },
      { id: 12, t: 0.7, title: "Mock Press", time: "Era Delta", description: "A temporary tear in the corridor reveals what lies outside of time." },
      { id: 13, t: 0.76, title: "Cooking Without Fire", time: "Era Omega", description: "The entire corridor vibrates in sympathy with a distant star." },
      { id: 14, t: 0.82, title: "League of Legends", time: "Last Epoch", description: "The final door before the end of the journey becomes visible." },
      { id: 15, t: 0.88, title: "Crime Scene", time: "Point Zero", description: "Gravity and time become indistinguishable at this final node." },
      { id: 16, t: 0.98, title: "Web Designing", time: "Infinity", description: "The journey ends where it began, in a moment that never passes." },
    ],
    []
  );

  const stringPathD = "M50,0 C85,200 15,400 50,600 C85,800 15,1000 50,1200 C85,1400 15,1600 50,1800 C85,2000 15,2200 50,2400 C85,2600 15,2800 50,3000 C85,3200 15,3400 50,3600";

  const momentsWithCoords = useMemo(() => {
    const props = new svgPathProperties(stringPathD);
    const totalLength = props.getTotalLength();
    return rawMoments.map((m) => {
      const point = props.getPointAtLength(m.t * totalLength);
      return { ...m, x: point.x, y: point.y };
    });
  }, [rawMoments, stringPathD]);

  const handleSecure = (e, node) => {
    e.stopPropagation();
    const isSecured = securedIds.some((s) => (s.id || s) === node.id);
    if (!isSecured) {
      const newSecured = [...securedIds, node];
      setSecuredIds(newSecured);
      localStorage.setItem("yenixa.securedEvents", JSON.stringify(newSecured));
    }
  };

  const activeNode = momentsWithCoords.find((m) => m.id === activeNodeId);
  const isCurrentSecured = activeNode && securedIds.some((s) => (s.id || s) === activeNode.id);

  return (
    <div className="relative w-full bg-black text-white select-none overflow-x-hidden" onClick={() => setActiveNodeId(null)}>
      <div className="fixed inset-0 z-0">
        <BackgroundStudio eraAccentColor={eraAccentColor} className="absolute inset-0" />
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />
      </div>
      <div className="fixed left-1/2 -translate-x-1/2 w-64 sm:w-96 h-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent pointer-events-none z-1" />

      <header className="sticky top-0 z-50 w-full pt-10 pb-6 flex flex-col items-center pointer-events-none">
        <div className="fixed top-10 left-6 sm:left-10 pointer-events-auto flex items-center gap-4 z-[100]">
          <div className="cursor-pointer group flex items-center" onClick={() => setLocation("/")}>
            <span className="text-xl md:text-2xl font-serif font-bold tracking-tighter text-white group-hover:text-white/80 transition-colors drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              Yenixa <span className="italic font-light opacity-60">2026</span>
            </span>
          </div>
        </div>
        <div className="fixed top-10 right-6 sm:right-10 pointer-events-auto flex items-center gap-4 z-[100]">
          <motion.button
            onClick={() => setLocation("/archive")}
            animate={isArchivePounding ? { scale: [1, 1.15, 1, 1.15, 1], boxShadow: ["0 0 0px rgba(0,240,255,0)", "0 0 20px rgba(0,240,255,0.6)", "0 0 0px rgba(0,240,255,0)", "0 0 20px rgba(0,240,255,0.6)", "0 0 0px rgba(0,240,255,0)"] } : {}}
            transition={{ duration: 1.5 }}
            className="px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-full bg-black/40 border border-white/20 backdrop-blur-xl flex items-center gap-3 group hover:bg-white/10 transition-all shadow-lg"
          >
            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full group-hover:scale-125 transition-transform shadow-[0_0_8px_#00f0ff]" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Archive ({securedIds.length})</span>
          </motion.button>
        </div>

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 mb-2 font-serif">CHRONICLE OF EVENTS</p>
          <h1 className="text-xl sm:text-3xl font-serif font-bold tracking-[0.2em]">THE TEMPORAL CORRIDOR</h1>
          <div className="w-24 h-[1px] bg-white/20 mx-auto mt-4" />
        </motion.div>
      </header>

      <div className="relative w-full z-10 flex flex-col items-center" style={{ height: "3800px" }}>
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 3800" preserveAspectRatio="none">
          <motion.path d={stringPathD} fill="none" stroke={eraAccentColor} strokeWidth="0.4" strokeOpacity="0.3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, ease: "easeInOut" }} />
          {momentsWithCoords.map((node) => {
            const isActive = activeNodeId === node.id;
            const isAnchored = securedIds.some((s) => (s.id || s) === node.id);
            return (
              <g key={node.id} className="cursor-pointer pointer-events-auto" onClick={(e) => { e.stopPropagation(); setActiveNodeId(isActive ? null : node.id); }}>
                <circle cx={node.x} cy={node.y} r={isActive ? 10 : 6} fill={eraAccentColor} className="transition-all duration-700 ease-out" style={{ filter: isActive ? "blur(6px)" : "blur(4px)", opacity: isActive ? 0.8 : isAnchored ? 0.5 : 0.2 }} />
                <circle cx={node.x} cy={node.y} r={isActive ? 3 : 1.8} fill={isAnchored || isActive ? "white" : "transparent"} stroke="white" strokeWidth={isActive ? 0.8 : 0.3} strokeOpacity={isAnchored || isActive ? 1 : 0.4} className="transition-all duration-500" />
                {isAnchored && <circle cx={node.x} cy={node.y} r="4" fill="none" stroke="white" strokeWidth="0.1" strokeOpacity="0.2" />}
              </g>
            );
          })}
        </svg>
        <div className="absolute inset-0 pointer-events-none">
          {momentsWithCoords.map((node) => (
            <div key={`title-${node.id}`} className="absolute left-0 w-full flex justify-center transition-opacity duration-500" style={{ top: `${node.y + 12}px`, opacity: activeNodeId && activeNodeId !== node.id ? 0.2 : 0.9 }}>
              <div className="text-white font-serif font-black uppercase tracking-[0.4em] text-[10px] sm:text-xs text-center" style={{ textShadow: "0 0 10px rgba(0,240,255,0.8), 0 0 20px rgba(0,240,255,0.4)", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>
                {node.title}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none z-[1100]">
        <div className="relative w-full h-full">
          <AnimatePresence mode="wait">
            {activeNode && (
              <motion.div key={activeNode.id} initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 5, scale: 0.95 }} transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }} className="absolute pointer-events-auto left-1/2 -translate-x-1/2" style={{ top: `${activeNode.y - 20}px`, transform: "translate(-50%, -100%)" }} onClick={(e) => e.stopPropagation()}>
                <div className="w-[85vw] max-w-[340px] p-6 rounded-2xl bg-black/95 backdrop-blur-2xl border border-white/20 shadow-[0_0_40px_rgba(0,240,255,0.15),0_20px_50px_rgba(0,0,0,0.8)] mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-cyan-400/80 font-bold">{activeNode.time}</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3 tracking-tight text-white">{activeNode.title}</h3>
                  <p className="text-[13px] text-white/80 leading-relaxed mb-6 font-sans">{activeNode.description}</p>
                  <button onClick={(e) => { if (isCurrentSecured) return; handleSecure(e, activeNode); setButtonState({ id: activeNode.id, text: "GO TO ARCHIVES" }); setTimeout(() => { setButtonState({ id: activeNode.id, text: "EVENT CHOSEN" }); setTimeout(() => { setActiveNodeId(null); setButtonState(null); setIsArchivePounding(true); setTimeout(() => setIsArchivePounding(false), 2000); }, 800); }, 1200); }} className={`w-full py-3.5 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold transition-all duration-500 border ${isCurrentSecured ? "bg-cyan-500/30 border-cyan-500/50 text-cyan-200" : "bg-white/10 border-white/20 active:scale-95 text-white"}`}>
                    {buttonState?.id === activeNode.id ? buttonState.text : (isCurrentSecured ? "EVENT CHOSEN" : "CHOOSE THIS EVENT")}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {activeNodeId && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-[900] pointer-events-auto" onClick={() => setActiveNodeId(null)} />}
      </AnimatePresence>

      <footer className="fixed bottom-0 left-0 w-full p-6 sm:p-10 z-[800] flex justify-between items-end pointer-events-none">
        <div className="flex flex-col gap-3 pointer-events-auto">
          <span className="text-[8px] uppercase tracking-[0.4em] text-white/20">Temporal Glyph</span>
          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-black/40 backdrop-blur-lg">
            <motion.div className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-[0_0_10px_#00f0ff]" animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
          </div>
        </div>
        <div className="flex gap-4 pointer-events-auto">
          <button onClick={() => setLocation("/")} className="w-14 h-14 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center group hover:bg-white/10 transition-all">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
