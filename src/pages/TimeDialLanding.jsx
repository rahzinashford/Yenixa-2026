import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "@/assets/images/logo.png";
import bgVideo from "@/assets/videos/background.mp4";
import bgVideoMobile from "@/assets/videos/background_mobile.mp4";

export default function TimeDialLanding() {
  const [rotationAngle, setRotationAngle] = useState(0);
  const [activePage, setActivePage] = useState("about");
  const [isEntering, setIsEntering] = useState(false);
  const [warpDirection, setWarpDirection] = useState(1);
  const dialRef = useRef(null);
  const isDragging = useRef(false);
  const startAngle = useRef(0);
  const currentRotation = useRef(0);

  const pages = [
    { id: "about", name: "ABOUT", path: "/about", angle: 0 },
    { id: "events", name: "EVENTS", path: "/about", angle: 90 },
    { id: "brochure", name: "BROCHURE", path: "/about", angle: 180 },
    { id: "contact", name: "CONTACT", path: "/about", angle: 270 },
  ];

  const getNearestPage = (ang) => {
    let norm = ang % 360;
    if (norm < 0) norm += 360;

    let nearest = pages[0];
    let minDiff = 360;

    pages.forEach((p) => {
      let diff = Math.abs(norm - p.angle);
      if (diff > 180) diff = 360 - diff;
      if (diff < minDiff) {
        minDiff = diff;
        nearest = p;
      }
    });
    return nearest;
  };

  const getAngle = (clientX, clientY) => {
    if (!dialRef.current) return 0;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = clientX - centerX;
    const dy = clientY - centerY;
    let degrees = Math.atan2(dy, dx) * (180 / Math.PI);
    return degrees;
  };

  const handleStart = (e) => {
    if (isEntering) return;
    isDragging.current = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startAngle.current = getAngle(clientX, clientY) - currentRotation.current;
  };

  const handleMove = (e) => {
    if (!isDragging.current || isEntering) return;
    if (e.cancelable) e.preventDefault();

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    const currentAngle = getAngle(clientX, clientY);
    let delta = currentAngle - startAngle.current;

    if (delta - currentRotation.current > 180) delta -= 360;
    if (delta - currentRotation.current < -180) delta += 360;

    currentRotation.current = delta;
    setRotationAngle(delta);

    const nearest = getNearestPage(delta);
    if (nearest.id !== activePage) {
      setActivePage(nearest.id);
      if (
        typeof window !== "undefined" &&
        window.navigator &&
        window.navigator.vibrate
      ) {
        window.navigator.vibrate(10);
      }
    }
  };

  const handleEnd = () => {
    if (!isDragging.current || isEntering) return;
    isDragging.current = false;

    let norm = currentRotation.current % 360;
    if (norm < 0) norm += 360;

    const nearest = getNearestPage(currentRotation.current);
    let diff = nearest.angle - norm;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    const finalTargetAngle = currentRotation.current + diff;
    setRotationAngle(finalTargetAngle);
    currentRotation.current = finalTargetAngle;

    setTimeout(() => {
      initiateTimeWarp(nearest.path);
    }, 500);
  };

  const initiateTimeWarp = (path) => {
    setIsEntering(true);
    setWarpDirection(Math.random() > 0.5 ? 1 : -1);
    setTimeout(() => {
      window.location.hash = path;
    }, 2000);
  };

  useEffect(() => {
    const handleGlobalMove = (e) => handleMove(e);
    const handleGlobalEnd = () => handleEnd();

    window.addEventListener("mousemove", handleGlobalMove);
    window.addEventListener("mouseup", handleGlobalEnd);
    window.addEventListener("touchmove", handleGlobalMove, { passive: false });
    window.addEventListener("touchend", handleGlobalEnd);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMove);
      window.removeEventListener("mouseup", handleGlobalEnd);
      window.removeEventListener("touchmove", handleGlobalMove);
      window.removeEventListener("touchend", handleGlobalEnd);
    };
  }, [isEntering]);

  return (
    <div
      className={`world present ${isEntering ? "is-warping" : ""} relative w-screen h-screen overflow-x-hidden overflow-y-auto text-white flex flex-col items-center select-none transition-all duration-[1500ms] ease-in-out`}
    >
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none opacity-40">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover hidden md:block"
        >
          <source src={bgVideo} type="video/mp4" />
        </video>
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover md:hidden"
        >
          <source
            src={bgVideoMobile}
            type="video/mp4"
          />
        </video>
      </div>

      <nav className="fixed top-0 left-0 w-full h-24 flex items-center justify-center z-50 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="pointer-events-auto"
        >
          <img
            src={logoImg}
            alt="Logo"
            className="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          />
        </motion.div>
      </nav>

      <div className="min-h-screen w-full flex flex-col items-center justify-center relative z-10 pt-48 pb-20">
        <div
          ref={dialRef}
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          className={`relative flex items-center justify-center ${isEntering ? "pointer-events-none" : "cursor-grab active:cursor-grabbing"}`}
          style={{
            width: "min(85vw, 500px)",
            height: "min(85vw, 500px)",
            aspectRatio: "1/1",
          }}
        >
          <motion.div
            animate={
              isEntering
                ? {
                    rotate: rotationAngle + warpDirection * 1080,
                    scale: [1, 0.9, 1.2],
                    filter: ["blur(0px)", "blur(4px)", "blur(0px)"],
                  }
                : { rotate: rotationAngle }
            }
            transition={
              isEntering
                ? { duration: 2, ease: "expoIn" }
                : { type: "spring", stiffness: 100, damping: 20 }
            }
            className={`absolute inset-0 rounded-full border border-white/10 dial-glow dial present ${isEntering ? "bloom-active" : ""} bg-black/40 backdrop-blur-md overflow-hidden transition-all duration-500`}
          >
            <div className="absolute inset-0 dial-inner-radial" />
            <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-white/10 to-transparent blur-md opacity-40 pointer-events-none" />
            <div className="absolute inset-[2%] rounded-full border border-white/20 shadow-[inset_0_0_15px_rgba(255,255,255,0.05)]" />

            {pages.map((p) => (
              <div
                key={p.id}
                className="absolute top-0 left-1/2 w-full h-full origin-center"
                style={{ transform: `translateX(-50%) rotate(${p.angle}deg)` }}
              >
                <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center">
                  <div
                    className={`w-1 h-3 md:h-4 ${activePage === p.id ? "bg-white shadow-[0_0_10px_white]" : "bg-white/20"} transition-all duration-300`}
                  />
                  <span
                    className={`mt-1 md:mt-2 text-[7px] md:text-[8px] tracking-[0.2em] md:tracking-[0.3em] font-bold ${activePage === p.id ? "text-white" : "text-white/20"} transition-all duration-300`}
                  >
                    {p.name}
                  </span>
                </div>
              </div>
            ))}

            {Array.from({ length: 60 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 left-1/2 w-[1px] h-full origin-bottom"
                style={{ transform: `translateX(-50%) rotate(${i * 6}deg)` }}
              >
                <div
                  className={`w-full ${i % 5 === 0 ? "h-[5%] md:h-[6%] bg-white/40" : "h-[2%] md:h-[3%] bg-white/10"}`}
                />
              </div>
            ))}
          </motion.div>

          <motion.svg
            className="absolute inset-[-10%] md:inset-[-8%] w-[120%] md:w-[116%] h-[120%] md:h-[116%] pointer-events-none z-0"
            viewBox="0 0 100 100"
            animate={{ rotate: rotationAngle }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <defs>
              <path
                id="outerTextPath"
                d="M 50,50 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0"
              />
              <filter id="glow">
                <feGaussianBlur stdDeviation="0.8" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <text
              fontSize="1.8"
              letterSpacing="0.25em"
              className="font-sans font-bold uppercase fill-white/60 md:text-[2px]"
              filter="url(#glow)"
              style={{ textShadow: "0 0 8px rgba(255,255,255,0.5)" }}
            >
              <textPath
                href="#outerTextPath"
                startOffset="25%"
                textAnchor="middle"
              >
                ROTATE TO SELECT DESTINATIONS •
              </textPath>
            </text>
            <text
              fontSize="1.8"
              letterSpacing="0.25em"
              className="font-sans font-bold uppercase fill-white/60 md:text-[2px]"
              filter="url(#glow)"
              style={{ textShadow: "0 0 8px rgba(255,255,255,0.5)" }}
            >
              <textPath
                href="#outerTextPath"
                startOffset="75%"
                textAnchor="middle"
              >
                ROTATE TO SELECT DESTINATIONS •
              </textPath>
            </text>
          </motion.svg>

          <div className="relative z-20 text-center flex flex-col items-center justify-center p-4 md:p-8 pointer-events-none">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{
                opacity: isEntering ? 0 : 1,
                y: isEntering ? -20 : 0,
                scale: 1,
              }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute -top-[140px] md:-top-20 font-sans tracking-[0.4em] md:tracking-[0.6em] transition-colors duration-500 whitespace-nowrap text-[12px] md:text-lg font-black text-white"
              style={{
                textShadow:
                  "0 0 15px rgba(255,255,255,1), 0 0 30px rgba(255,255,255,0.6)",
              }}
            >
              {isEntering
                ? "WARPING..."
                : pages.find((p) => p.id === activePage)?.name}
            </motion.div>

            <h1
              className={`font-serif text-2xl md:text-5xl font-bold tracking-[0.15em] md:tracking-[0.2em] text-white text-glow mb-1 md:mb-2 transition-all duration-[2000ms] ${isEntering ? "scale-150 blur-lg opacity-0" : ""}`}
            >
              YENIXA
            </h1>
            <div
              className={`h-[1px] w-8 md:w-12 bg-white/30 my-1 md:my-2 shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-[2000ms] ${isEntering ? "w-0 opacity-0" : ""}`}
            ></div>
            <p
              className={`font-sans text-lg md:text-2xl font-bold tracking-[0.3em] md:tracking-[0.4em] transition-all duration-[2000ms] ${isEntering ? "translate-y-10 opacity-0 blur-md" : "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"}`}
            >
              FEBRUARY 16
            </p>
            <p
              className={`font-sans text-[8px] md:text-[10px] uppercase tracking-[0.25em] md:tracking-[0.3em] mt-2 md:mt-4 transition-all duration-[2000ms] ${isEntering ? "translate-y-10 opacity-0 blur-md" : "text-white/40"}`}
            >
              Intercollege Fest 2026
            </p>
          </div>
        </div>
      </div>

      <footer className="w-full relative z-10 bg-black/80 backdrop-blur-xl border-t border-white/5 py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div className="space-y-6">
              <div
                className="cursor-pointer group flex items-center"
                onClick={() => (window.location.hash = "/")}
              >
                <img
                  src={logoImg}
                  alt="Logo"
                  className="h-16 w-auto object-contain transition-opacity group-hover:opacity-80"
                />
              </div>
              <p className="text-sm text-white/60 leading-relaxed font-light max-w-xl">
                Yenepoya (Deemed to be University) brings you a world-class
                educational experience in the pristine surroundings of a
                tranquil South Indian town. Yenepoya (Deemed to be University)
                is accredited as 'A+' by NAAC in the year 2022 and ranked 95th
                in the NIRF ranking of 2024. Yenepoya Institute of Arts,
                Science, Commerce, and Management (YIASCM) is a constituent unit
                of YENEPOYA (Deemed to be University), instituted in 2017 with a
                vision to provide quality and industry-aligned higher education.
              </p>
            </div>
          </div>
          <hr className="border-white/10 mb-8" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-4">
              <a
                href="https://www.instagram.com/yenixa_2025"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-white/60 hover:text-white transition-colors group"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-instagram group-hover:drop-shadow-[0_0_8px_white]"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.282.11-.705.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.007-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                </svg>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">
                  yenixa_2026
                </span>
              </a>
            </div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-white/30">
              Designed & Developed by:{" "}
              <span className="text-white/50">Team YENOVA</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
