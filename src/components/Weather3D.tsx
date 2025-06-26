import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cloud, CloudFog, CloudRain, CloudLightning, CloudSnow } from '@react-three/drei';
import * as THREE from 'three';

interface Weather3DProps {
  condition: string;
  temperature: number;
  isDay: boolean;
}

const WeatherParticles = ({ condition, temperature }: { condition: string; temperature: number }) => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = useMemo(() => {
    switch (condition) {
      case 'Rain': return 1000;
      case 'Snow': return 800;
      case 'Thunderstorm': return 500;
      default: return 200;
    }
  }, [condition]);

  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [particleCount]);

  useFrame((state) => {
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] -= 0.05;
        if (positions[i * 3 + 1] < -5) {
          positions[i * 3 + 1] = 10;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const particleColor = useMemo(() => {
    switch (condition) {
      case 'Rain': return new THREE.Color(0x4cc9f0);
      case 'Snow': return new THREE.Color(0xffffff);
      case 'Thunderstorm': return new THREE.Color(0x7209b7);
      default: return new THREE.Color(0xadb5bd);
    }
  }, [condition]);

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={condition === 'Snow' ? 0.1 : 0.05}
        color={particleColor}
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
};

const WeatherClouds = ({ condition }: { condition: string }) => {
  const cloudsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.001;
    }
  });

  const cloudCount = useMemo(() => {
    switch (condition) {
      case 'Clouds': return 8;
      case 'Rain': return 6;
      case 'Thunderstorm': return 4;
      default: return 3;
    }
  }, [condition]);

  return (
    <group ref={cloudsRef}>
      {Array.from({ length: cloudCount }).map((_, i) => (
        <Cloud
          key={i}
          position={[
            (Math.random() - 0.5) * 15,
            Math.random() * 3 + 2,
            (Math.random() - 0.5) * 15
          ]}
          scale={[1 + Math.random() * 0.5, 1 + Math.random() * 0.3, 1 + Math.random() * 0.5]}
          speed={0.4}
          width={10}
          depth={1.5}
          segments={20}
        />
      ))}
    </group>
  );
};

const WeatherScene = ({ condition, temperature, isDay }: Weather3DProps) => {
  const sceneRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (sceneRef.current) {
      sceneRef.current.rotation.y += 0.002;
    }
  });

  const ambientColor = useMemo(() => {
    if (isDay) {
      switch (condition) {
        case 'Clear': return new THREE.Color(0x87ceeb);
        case 'Clouds': return new THREE.Color(0xb0c4de);
        case 'Rain': return new THREE.Color(0x708090);
        case 'Thunderstorm': return new THREE.Color(0x2f4f4f);
        default: return new THREE.Color(0x87ceeb);
      }
    } else {
      return new THREE.Color(0x191970);
    }
  }, [condition, isDay]);

  return (
    <group ref={sceneRef}>
      {/* Ambient lighting */}
      <ambientLight intensity={isDay ? 0.6 : 0.2} color={ambientColor} />
      
      {/* Directional light (sun/moon) */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={isDay ? 1 : 0.3}
        color={isDay ? 0xffffff : 0x4cc9f0}
      />
      
      {/* Weather particles */}
      {['Rain', 'Snow', 'Thunderstorm'].includes(condition) && (
        <WeatherParticles condition={condition} temperature={temperature} />
      )}
      
      {/* Clouds */}
      {['Clouds', 'Rain', 'Thunderstorm'].includes(condition) && (
        <WeatherClouds condition={condition} />
      )}
      
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color={isDay ? 0x90ee90 : 0x2d5016}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  );
};

const Weather3D: React.FC<Weather3DProps> = ({ condition, temperature, isDay }) => {
  return (
    <div className="weather-3d-container">
      <Canvas
        camera={{ position: [0, 5, 10], fov: 60 }}
        style={{ height: '300px', width: '100%' }}
      >
        <WeatherScene condition={condition} temperature={temperature} isDay={isDay} />
      </Canvas>
    </div>
  );
};

export default Weather3D; 