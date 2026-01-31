import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from '@/assets/images/logo.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navItems = [
    { name: "About", path: "/about" },
    { name: "Events", path: "/about" },
    { name: "Contact", path: "/about" },
    { name: "Brochure", path: "/about" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-12 py-6 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/5">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="cursor-pointer group flex items-center" onClick={() => (window.location.hash = "/")}>
          <span className="text-xl md:text-2xl font-serif font-bold tracking-tighter text-white group-hover:text-white/80 transition-colors">
            Yenixa <span className="italic font-light opacity-60">2026</span>
          </span>
        </motion.div>
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <motion.button key={item.name} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -2, textShadow: "0 0 8px rgba(255,255,255,0.5)" }} onClick={() => (window.location.hash = item.path)} className="text-[10px] md:text-[11px] uppercase tracking-[0.3em] font-bold text-white/70 hover:text-white transition-all">
              {item.name}
            </motion.button>
          ))}
        </div>
        <button className="md:hidden p-2 text-white/70 hover:text-white transition-colors z-[60]" onClick={() => setIsOpen(!isOpen)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </nav>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] md:hidden" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed top-0 right-0 w-[280px] h-full bg-black/90 backdrop-blur-xl border-l border-white/10 z-[56] md:hidden p-12 flex flex-col pt-32">
              <div className="flex flex-col space-y-8">
                {navItems.map((item, i) => (
                  <motion.button key={item.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} onClick={() => { setIsOpen(false); window.location.hash = item.path; }} className="text-left text-sm uppercase tracking-[0.4em] font-bold text-white/60 hover:text-white transition-all">
                    {item.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const Footer = () => (
  <footer className="w-full relative z-10 bg-black/80 backdrop-blur-xl border-t border-white/5 py-16 px-6 md:px-12">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div className="space-y-6">
          <div className="cursor-pointer group flex items-center" onClick={() => (window.location.hash = "/")}>
            <img src={logoImg} alt="Logo" className="h-16 w-auto object-contain transition-opacity group-hover:opacity-80" />
          </div>
          <p className="text-sm text-white/60 leading-relaxed font-light max-w-xl">
            Yenepoya (Deemed to be University) brings you a world-class educational experience in the pristine surroundings of a tranquil South Indian town. Yenepoya (Deemed to be University) is accredited as 'A+' by NAAC in the year 2022 and ranked 95th in the NIRF ranking of 2024. Yenepoya Institute of Arts, Science, Commerce, and Management (YIASCM) is a constituent unit of YENEPOYA (Deemed to be University), instituted in 2017 with a vision to provide quality and industry-aligned higher education.
          </p>
        </div>
      </div>
      <hr className="border-white/10 mb-8" />
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center space-x-4">
          <a href="https://www.instagram.com/yenixa_2025" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 text-white/60 hover:text-white transition-colors group">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-instagram group-hover:drop-shadow-[0_0_8px_white]" viewBox="0 0 16 16">
              <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.282.11-.705.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.007-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
            </svg>
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold">yenixa_2026</span>
          </a>
        </div>
        <p className="text-[9px] uppercase tracking-[0.4em] text-white/30">
          Designed & Developed by: <span className="text-white/50">Team YENOVA</span>
        </p>
      </div>
    </div>
  </footer>
);

export default function About() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/30 overflow-x-hidden font-sans relative">
      <Navbar />
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-50" />
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px]" />
      </div>
      <div className="relative z-10 container mx-auto px-6 pt-48 pb-20 max-w-5xl">
        <div className="mb-10 md:mb-14">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
            <span className="text-[10px] uppercase tracking-[0.45em] font-bold text-white/50">Event Date</span>
            <span className="w-10 h-[1px] bg-white/15" aria-hidden="true" />
            <span className="text-[12px] md:text-[13px] tracking-[0.28em] uppercase text-white/80">February 16, 2026</span>
          </div>
        </div>
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-24">
          <div className="flex items-center space-x-4 mb-8"><div className="w-12 h-[1px] bg-white/20" /><h2 className="text-[10px] tracking-[0.6em] text-white/40 uppercase font-bold">About YENIXA 2026</h2></div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-8 leading-tight">The Pinnacle of <br /><span className="italic font-light opacity-50 text-3xl md:text-5xl">Cultural Convergence.</span></h1>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed font-light">
            Welcome to YENIXA 2026, a prestigious national-level inter-college fest built around a single immersive experience—a journey through time. This year, YENIXA breaks boundaries by uniting intellect, innovation, and strategy into one powerful track that transcends eras. Participants become time travelers, navigating past, present, and future through a sequence of interconnected challenges. Drawing from Management, Commerce, Humanities, IT, and interdisciplinary thinking, each phase tests decision-making, logic, creativity, and adaptability. Every choice alters the timeline. Every challenge unlocks the next era. From decoding historical patterns and solving present-day analytical problems to forecasting futuristic innovations, YENIXA 2026 is designed as a race against time—where strategy matters, intelligence evolves, and only the sharpest minds survive the paradox. This is not just a competition. It’s a continuum of ideas, a trial of foresight, and a test of how well you can master time itself. With high stakes, shifting timelines, and one unified battlefield, YENIXA 2026 redefines what an inter-college fest can be. The clock is ticking. The timeline is unstable. Will you restore the future—or rewrite it?
          </p>
        </motion.section>
        <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-24">
          <div className="flex items-center space-x-4 mb-8"><div className="w-12 h-[1px] bg-white/20" /><h2 className="text-[10px] tracking-[0.6em] text-white/40 uppercase font-bold">History</h2></div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight mb-8 leading-tight">A Legacy of <br /><span className="italic font-light opacity-50 text-3xl md:text-5xl">Relentless Innovation.</span></h1>
          <p className="text-lg md:text-xl text-white/70 leading-relaxed font-light">
            YENIXA 2.0, the vibrant inter-college fest of Yenepoya Institute of Arts, Science, Commerce, and Management, was successfully held in 2024, bringing together talent and enthusiasm from across 25 participating colleges. With an impressive turnout of 600 participants, the fest featured two major events Series, a dynamic management fest, and Scifier, an engaging science fest. The event served as a platform for students to showcase their skills, compete in various challenges, and foster a spirit of innovation and collaboration. YENIXA 1.0 was a grand success, setting the stage for an even bigger and better YENIXA 2026.
          </p>
        </motion.section>
      </div>
      <Footer />
    </div>
  );
}
