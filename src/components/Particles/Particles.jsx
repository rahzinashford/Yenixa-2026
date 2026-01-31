import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Particles = ({ 
  particleCount = 200, 
  particleColors = ["#ffffff"],
  particleBaseSize = 10,
  speed = 0.1,
}) => {
  const points = useRef();
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < particleCount; i++) {
      const x = THREE.MathUtils.randFloatSpread(2000);
      const y = THREE.MathUtils.randFloatSpread(2000);
      const z = THREE.MathUtils.randFloatSpread(2000);
      const color = new THREE.Color(particleColors[Math.floor(Math.random() * particleColors.length)]);
      temp.push({ x, y, z, color, speed: Math.random() * speed });
    }
    return temp;
  }, [particleCount, particleColors, speed]);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    particles.forEach((p, i) => {
      pos[i * 3] = p.x;
      pos[i * 3 + 1] = p.y;
      pos[i * 3 + 2] = p.z;
      col[i * 3] = p.color.r;
      col[i * 3 + 1] = p.color.g;
      col[i * 3 + 2] = p.color.b;
    });
    return [pos, col];
  }, [particles, particleCount]);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.getElapsedTime();
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      points.current.geometry.attributes.position.array[i3 + 1] -= speed * 10;
      if (points.current.geometry.attributes.position.array[i3 + 1] < -1000) {
        points.current.geometry.attributes.position.array[i3 + 1] = 1000;
      }
    }
    points.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={particleBaseSize}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation={true}
      />
    </points>
  );
};

export default Particles;
