import React from 'react';

export default function Register() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black text-white p-12 text-center">
      <div className="max-w-md w-full p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
        <h1 className="text-4xl font-serif font-bold mb-6">Reality Bound</h1>
        <p className="text-white/60 uppercase tracking-[0.3em] text-[10px] mb-8">Your registration is being woven into the timeline.</p>
        <button onClick={() => window.location.hash = '/'} className="px-8 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition-all text-[10px] uppercase tracking-[0.4em] font-bold">Return to Core</button>
      </div>
    </div>
  );
}
