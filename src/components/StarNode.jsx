import React from 'react';

export default function StarNode({ x, y, color = '#00f0ff', size = 12 }) {
  const s = Math.max(10, Math.min(14, size));

  return (
    <div
      className="star-node absolute pointer-events-none"
      style={{
        left: x,
        top: y,
        width: s,
        height: s,
        transform: 'translate(-50%, -50%)',
        ['--star-color']: color,
      }}
      aria-hidden="true"
    >
      <div
        className="star-node-core"
        style={{
          width: s,
          height: s,
          borderRadius: 9999,
          background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.65), var(--star-color) 55%, rgba(0,0,0,0) 72%)`,
          boxShadow: `0 0 ${Math.round(s * 1.8)}px rgba(255,255,255,0.12)`,
        }}
      />
      <div
        className="star-node-glow"
        style={{
          position: 'absolute',
          inset: -Math.round(s * 1.4),
          borderRadius: 9999,
          background: `radial-gradient(circle, color-mix(in oklab, var(--star-color) 60%, rgba(255,255,255,0.35)) 0%, rgba(0,0,0,0) 68%)`,
          opacity: 0.9,
          filter: 'blur(0.2px)',
        }}
      />
    </div>
  );
}
