import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, Component } from "react";
import { useReducedMotion, useInView } from "framer-motion";
import * as THREE from "three";
function Stars({ reduced }) {
  const ref = useRef();
  const starPixels = useMemo(() => {
    const size = 64;
    const pixels = new Uint8Array(size * size * 4);
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const radius = Math.hypot(
          ((x + 0.5) / size - 0.5) * 2,
          ((y + 0.5) / size - 0.5) * 2,
        );
        const fade = Math.max(0, 1 - radius);
        const offset = (y * size + x) * 4;
        pixels[offset] = pixels[offset + 1] = pixels[offset + 2] = 255;
        pixels[offset + 3] = Math.round(255 * fade * fade * (3 - 2 * fade));
      }
    }
    return pixels;
  }, []);
  const points = useMemo(() => {
    const a = new Float32Array(1500);
    let seed = 71;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    for (let i = 0; i < a.length; i++) a[i] = (random() - 0.5) * 25;
    return a;
  }, []);
  useFrame((state, delta) => {
    if (!reduced && ref.current) {
      ref.current.rotation.y += delta * 0.006;
      ref.current.rotation.x =
        state.pointer.y * 0.018 + Math.min(window.scrollY, 12000) * 0.000009;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#baa5e2"
        size={0.024}
        transparent
        opacity={0.56}
        alphaTest={0.01}
        sizeAttenuation
        depthWrite={false}
      >
        <dataTexture
          attach="map"
          args={[starPixels, 64, 64, THREE.RGBAFormat]}
          magFilter={THREE.LinearFilter}
          minFilter={THREE.LinearFilter}
          needsUpdate
        />
      </pointsMaterial>
    </points>
  );
}
function Orb({ reduced }) {
  const group = useRef();
  useFrame((state, delta) => {
    if (reduced) return;
    group.current.rotation.y += delta * 0.09;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.09;
    group.current.rotation.x = state.pointer.y * 0.09;
  });
  return (
    <group ref={group} rotation={[0.3, 0, -0.28]}>
      <mesh>
        <sphereGeometry args={[1.42, 64, 64]} />
        <meshStandardMaterial
          color="#130c22"
          metalness={0.94}
          roughness={0.32}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.435, 38, 25]} />
        <meshBasicMaterial
          color="#70449c"
          wireframe
          transparent
          opacity={0.13}
        />
      </mesh>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2 + 0.12 * i, 0.18 * i, 0.1]}>
          <torusGeometry args={[1.76 + i * 0.1, 0.009, 8, 160]} />
          <meshBasicMaterial
            color={i % 2 ? "#b3a0ef" : "#974bff"}
            transparent
            opacity={0.65 - i * 0.1}
          />
        </mesh>
      ))}
      <pointLight position={[-3, 2, 3]} color="#9a55ff" intensity={35} />
      <pointLight position={[3, -1, 2]} color="#f48ad3" intensity={12} />
      <ambientLight intensity={0.15} />
    </group>
  );
}
class Boundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="space-fallback" />
    ) : (
      this.props.children
    );
  }
}
export default function SpaceBackground() {
  const reduced = useReducedMotion();
  return (
    <div className="space-background" aria-hidden="true">
      <Boundary>
        <Canvas
          camera={{ position: [0, 0, 5] }}
          dpr={[1, 1.4]}
          frameloop={reduced ? "demand" : "always"}
          gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
        >
          <Stars reduced={reduced} />
        </Canvas>
      </Boundary>
      {!reduced && <span className="shooting-star" />}
    </div>
  );
}
export function HeroOrb() {
  const reduced = useReducedMotion();
  const container = useRef();
  const visible = useInView(container, { margin: "100px" });
  return (
    <div ref={container} className="orb-canvas" aria-hidden="true">
      <Boundary>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 48 }}
          dpr={[1, 1.5]}
          frameloop={reduced || !visible ? "demand" : "always"}
        >
          <Orb reduced={reduced} />
        </Canvas>
      </Boundary>
    </div>
  );
}
