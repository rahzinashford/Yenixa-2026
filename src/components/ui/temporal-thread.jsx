import React, { useMemo } from 'react';

export 
  id?: string | number;
  center: { x: number; y: number };
  [k: string]: any;
}

export 
  starNodes?[];
  width?: number;
  height?: number;
  options?: {
    color?: string;
    strokeWidth?: number;
    glowColor?: string;
    amplitude?: number;
    margin?: number;
  };
}

 y: number };

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

function makeAlternatingSpline(points[], width: number, amplitude: number, margin: number) {
  if (points.length === 0) return { d: '', controls: [] as { cp1; cp2; p }[] };
  if (points.length === 1) return { d: `M ${points[0].x} ${points[0].y}`, controls: [] as { cp1; cp2; p }[] };

  // Deterministic, event-derived weave:
  // - Each segment alternates gently left/right
  // - Control points are derived from the segment direction and local spacing
  // - No randomness, no per-render sway
  // - Always clamped to viewport
  const innerMinX = margin;
  const innerMaxX = width - margin;

  let d = `M ${points[0].x} ${points[0].y}`;
  const controls: { cp1; cp2; p }[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];

    const dy = Math.max(1, p2.y - p1.y);
    const segLen = Math.hypot(p2.x - p1.x, p2.y - p1.y);

    // How far we push control points down the segment.
    // Short segments get tighter handles; long segments get longer handles.
    const handle = clamp(dy * 0.45, 28, 160);

    // Weave strength derived from spacing (not random).
    const localAmp = clamp(amplitude * Math.min(1, dy / 260), 10, amplitude);
    const sign = i % 2 === 0 ? 1 : -1;

    // A gentle sideways bias, anchored to segment and alternating.
    // If the segment already leans to one side, we reduce weave to avoid extreme bends.
    const naturalLean = clamp((p2.x - p1.x) / Math.max(1, dy), -0.6, 0.6);
    const weave = sign * localAmp * (1 - Math.abs(naturalLean) * 0.65);

    // Control points start along the segment direction (keeps it "mathematically derived" from events)
    // then receive a gentle perpendicular-ish x push (the weave).
    let cp1 = { x: p1.x + weave, y: p1.y + handle };
    let cp2 = { x: p2.x - weave, y: p2.y - handle };

    // Clamp inside the viewport so the curve never exits.
    cp1 = { x: clamp(cp1.x, innerMinX, innerMaxX), y: clamp(cp1.y, 0, Number.POSITIVE_INFINITY) };
    cp2 = { x: clamp(cp2.x, innerMinX, innerMaxX), y: clamp(cp2.y, 0, Number.POSITIVE_INFINITY) };

    d += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p2.x} ${p2.y}`;
    controls.push({ cp1, cp2, p: p2 });

    // If two points share the exact same y (rare, but possible), avoid degenerate handles.
    // (We already guard dy with Math.max(1, ...), so path remains stable.)
    void segLen;
  }

  return { d, controls };
}

// Evaluate X on a monotonic-y cubic Bezier segment using binary search.
// Assumes y is monotonic within the segment (true with our control strategy: cp1y > p1y and cp2y < p2y).
function cubicAt(p0: number, p1: number, p2: number, p3: number, t: number) {
  const it = 1 - t;
  return it * it * it * p0 + 3 * it * it * t * p1 + 3 * it * t * t * p2 + t * t * t * p3;
}

function xAtYForSegment(p0, c1, c2, p3, y: number) {
  let lo = 0;
  let hi = 1;

  // Clamp y to segment range
  const yMin = Math.min(p0.y, p3.y);
  const yMax = Math.max(p0.y, p3.y);
  const yy = clamp(y, yMin, yMax);

  for (let i = 0; i < 26; i++) {
    const mid = (lo + hi) / 2;
    const ym = cubicAt(p0.y, c1.y, c2.y, p3.y, mid);
    if (ym < yy) lo = mid;
    else hi = mid;
  }

  const t = (lo + hi) / 2;
  return cubicAt(p0.x, c1.x, c2.x, p3.x, t);
}

export function sampleThreadXAtY(points[], controls: { cp1; cp2; p }[], y: number) {
  if (points.length === 0) return 0;
  if (points.length === 1) return points[0].x;

  // Find the segment containing y.
  // points are expected sorted by y.
  const first = points[0];
  const last = points[points.length - 1];
  if (y <= first.y) return first.x;
  if (y >= last.y) return last.x;

  let idx = 0;
  for (let i = 0; i < points.length - 1; i++) {
    if (y >= points[i].y && y <= points[i + 1].y) {
      idx = i;
      break;
    }
  }

  const p0 = points[idx];
  const seg = controls[idx];
  const p3 = points[idx + 1];

  if (!seg) {
    return p0.x;
  }

  const x = xAtYForSegment(p0, seg.cp1, seg.cp2, p3, y);
  return Number.isFinite(x) ? x : p0.x;
}

export default function TemporalThread({
  starNodes = [],
  width = 1200,
  height = 800,
  options = {},
}) {
  const {
    color = '#FFD86B',
    strokeWidth = 6,
    glowColor = 'rgba(255,216,107,0.5)',
    amplitude = Math.max(18, Math.min(110, Math.round(width * 0.055))),
    margin = 18,
  } = options;

  const sorted = useMemo(() => {
    return [...starNodes].sort((a, b) => a.center.y - b.center.y);
  }, [starNodes]);

  const points = useMemo(() => {
    const innerMinX = margin;
    const innerMaxX = width - margin;
    return sorted.map((s) => ({
      x: clamp(s.center.x, innerMinX, innerMaxX),
      y: clamp(s.center.y, 0, height),
    }));
  }, [sorted, width, height, margin]);

  const spline = useMemo(() => makeAlternatingSpline(points, width, amplitude, margin), [points, width, amplitude, margin]);

  const junctions = useMemo(
    () =>
      sorted.map((s) => {
        const x = sampleThreadXAtY(points, spline.controls, s.center.y);
        const safeX = Number.isFinite(x) ? x : clamp(s.center.x, margin, width - margin);
        const r = clamp(strokeWidth * 1.35, 8, 16);
        return { id: s.id ?? `${s.center.x}-${s.center.y}`, x: safeX, y: s.center.y, r };
      }),
    [sorted, points, spline.controls, strokeWidth, width, margin]
  );

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ overflow: 'hidden', pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        <filter id="threadHalo" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="threadGrad" x1="0" x2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#fff2d2" stopOpacity="0.9" />
          <stop offset="1" stopColor={color} stopOpacity="0.95" />
        </linearGradient>

        <radialGradient id="junctionGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={glowColor} stopOpacity="0.9" />
          <stop offset="0.45" stopColor={glowColor} stopOpacity="0.35" />
          <stop offset="1" stopColor={glowColor} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft halo stroke */}
      <path
        d={spline.d}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth * 2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.16"
        filter="url(#threadHalo)"
      />

      {/* Bold core stroke */}
      <path
        d={spline.d}
        fill="none"
        stroke="url(#threadGrad)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ mixBlendMode: 'screen' }}
      />

      <g pointerEvents="none">
        {junctions.map((j) => (
          <circle
            key={String(j.id)}
            cx={j.x}
            cy={j.y}
            r={j.r}
            fill="url(#junctionGrad)"
            opacity={0.95}
            style={{ mixBlendMode: 'screen' }}
          />
        ))}
      </g>
    </svg>
  );
}
