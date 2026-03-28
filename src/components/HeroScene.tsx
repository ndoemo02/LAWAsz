import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type ParticleMeta = {
  velocity: number;
  drift: number;
  swirl: number;
  life: number;
  maxLife: number;
  originX: number;
  originZ: number;
};

const BRICKS_MODEL_URL = "/models/bricks.glb";
const MEAT_MODEL_URL = "/models/cc0_-_slice_of_ham_1k.glb";
type GltfAsset = { scene: THREE.Object3D };

type SceneErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type SceneErrorBoundaryState = {
  hasError: boolean;
};

class SceneErrorBoundary extends Component<SceneErrorBoundaryProps, SceneErrorBoundaryState> {
  override state: SceneErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): SceneErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error) {
    console.error("HeroScene model fallback enabled due to runtime error:", error);
  }

  override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

function ProceduralFallbackScene() {
  return (
    <>
      <mesh position={[0, 0.2, -2.8]}>
        <planeGeometry args={[20, 12]} />
        <meshStandardMaterial color="#241714" roughness={0.92} metalness={0.04} />
      </mesh>
      <mesh position={[0, -1.8, 0.85]}>
        <sphereGeometry args={[0.9, 24, 24]} />
        <meshStandardMaterial color="#5c2e0e" roughness={0.88} metalness={0.04} />
      </mesh>
      <mesh position={[0, 0.2, 0.82]}>
        <cylinderGeometry args={[0.03, 0.03, 4.6, 12]} />
        <meshStandardMaterial color="#b7b7b7" metalness={0.85} roughness={0.25} />
      </mesh>
    </>
  );
}

function cloneAndNormalize(source: THREE.Object3D, targetMaxAxis = 1) {
  const clone = source.clone(true);
  const bounds = new THREE.Box3().setFromObject(clone);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const dominantAxis = Math.max(size.x, size.y, size.z, 0.001);

  clone.position.sub(center);
  clone.scale.setScalar(targetMaxAxis / dominantAxis);

  return clone;
}

function BricksBackdropModel() {
  const { scene } = useLoader(GLTFLoader, BRICKS_MODEL_URL) as GltfAsset;
  const bricks = useMemo(() => cloneAndNormalize(scene, 10.2), [scene]);

  return (
    <group position={[0, -0.42, -3.38]} rotation={[0, Math.PI, 0]}>
      <primitive object={bricks} />
    </group>
  );
}

function ProceduralLavaBase({ isMobile }: { isMobile: boolean }) {
  const lavaRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!lavaRef.current) {
      return;
    }

    const pulse = 1 + Math.sin(clock.elapsedTime * 1.6) * 0.035;
    lavaRef.current.scale.setScalar(pulse);
    lavaRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.28) * 0.14;
  });

  return (
    <group ref={lavaRef} position={[isMobile ? 0 : 0.25, -1.92, 0.66]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.52, 1.08, 48]} />
        <meshStandardMaterial color="#2a1308" emissive="#4b1508" emissiveIntensity={0.22} roughness={0.86} metalness={0.04} />
      </mesh>
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.76, 0.94, 0.16, 36]} />
        <meshStandardMaterial color="#38180c" emissive="#5c1d0a" emissiveIntensity={0.34} roughness={0.78} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.12, 0]}>
        <torusGeometry args={[0.48, 0.14, 20, 44]} />
        <meshStandardMaterial color="#8d2f0c" emissive="#ff5d12" emissiveIntensity={0.5} roughness={0.42} metalness={0.06} />
      </mesh>
      <mesh position={[0.07, 0.17, -0.05]} rotation={[0.22, 0.45, 0.08]}>
        <sphereGeometry args={[0.15, 18, 18]} />
        <meshStandardMaterial color="#b23f10" emissive="#ff7d1c" emissiveIntensity={0.44} roughness={0.5} metalness={0.04} />
      </mesh>
      <mesh position={[-0.12, 0.14, 0.08]} rotation={[-0.16, -0.4, -0.08]}>
        <sphereGeometry args={[0.12, 18, 18]} />
        <meshStandardMaterial color="#932f0f" emissive="#ff6316" emissiveIntensity={0.38} roughness={0.52} metalness={0.04} />
      </mesh>
    </group>
  );
}

function FireLights() {
  const fireLight = useRef<THREE.PointLight>(null);
  const rimLight = useRef<THREE.PointLight>(null);
  const topLight = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    if (fireLight.current) {
      fireLight.current.intensity = 2.2 + Math.sin(time * 4.2) * 0.36 + Math.sin(time * 8.3) * 0.2;
    }

    if (rimLight.current) {
      rimLight.current.intensity = 1 + Math.sin(time * 2.4 + 1.1) * 0.16;
    }

    if (topLight.current) {
      topLight.current.intensity = 0.85 + Math.cos(time * 1.2) * 0.08;
    }
  });

  return (
    <>
      <ambientLight intensity={0.2} color="#1a120d" />
      <pointLight ref={fireLight} color="#ff6a00" intensity={2.4} distance={10} decay={2} position={[0, -1.45, 1.7]} />
      <pointLight ref={rimLight} color="#ff3d00" intensity={1} distance={11} decay={2} position={[-2.4, 1.4, 2.2]} />
      <pointLight ref={topLight} color="#ffb67d" intensity={0.9} distance={8} decay={2} position={[0, 2.3, 2.8]} />
      <pointLight color="#ff9500" intensity={0.55} distance={7} decay={2} position={[2.2, 0.6, 2.3]} />
    </>
  );
}

export function LayeredMeatSpit({ isMobile }: { isMobile: boolean }) {
  const { scene } = useLoader(GLTFLoader, MEAT_MODEL_URL) as GltfAsset;
  const { camera, gl } = useThree();
  const spitRef = useRef<THREE.Group>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const pointerNdcRef = useRef(new THREE.Vector2(2, 2));
  const pointerInsideRef = useRef(false);
  const hoverRef = useRef(false);
  const burstUntilRef = useRef(0);
  const scaleRef = useRef(isMobile ? 0.9 : 2.05);
  const normalizedSlice = useMemo(() => cloneAndNormalize(scene, 1), [scene]);
  const baseScale = isMobile ? 0.9 : 2.05;
  const basePosition: [number, number, number] = isMobile ? [0, 0.36, 0.86] : [0.2, 1.36, 1.25];
  const tiltX = isMobile ? 0.01 : -0.18;

  const layers = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => ({
        y: -1.42 + index * 0.245,
        rotY: index * 0.58 + (index % 2 === 0 ? 0.22 : -0.24),
        rotZ: index % 2 === 0 ? 0.08 : -0.08,
        wobble: 0.02 + index * 0.002,
        scale: 0.52 + (index % 3) * 0.045,
        offsetX: (index % 2 === 0 ? -1 : 1) * (0.02 + (index % 3) * 0.004),
        offsetZ: ((index + 1) % 2 === 0 ? -1 : 1) * (0.02 + ((index + 1) % 3) * 0.004),
      })),
    [],
  );
  const layerSlices = useMemo(
    () => Array.from({ length: layers.length }, () => normalizedSlice.clone(true)),
    [layers.length, normalizedSlice],
  );
  const emissiveMaterials = useMemo(() => {
    const mats = new Set<THREE.MeshStandardMaterial>();

    layerSlices.forEach((slice) => {
      slice.traverse((node) => {
        if (!(node as THREE.Mesh).isMesh) {
          return;
        }

        const mesh = node as THREE.Mesh;
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        materials.forEach((material) => {
          if (material && "emissiveIntensity" in material) {
            const standardMaterial = material as THREE.MeshStandardMaterial;
            standardMaterial.color.set("#9b5833");
            standardMaterial.roughness = 0.44;
            standardMaterial.metalness = 0.04;
            standardMaterial.emissive.set("#5a1b07");
            mats.add(standardMaterial);
          }
        });
      });
    });

    return [...mats];
  }, [layerSlices]);

  const updatePointerNdc = (clientX: number, clientY: number) => {
    const rect = gl.domElement.getBoundingClientRect();
    pointerNdcRef.current.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    pointerNdcRef.current.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  };

  const checkIntersection = () => {
    if (!spitRef.current || !pointerInsideRef.current) {
      hoverRef.current = false;
      return false;
    }

    raycasterRef.current.setFromCamera(pointerNdcRef.current, camera);
    const hits = raycasterRef.current.intersectObject(spitRef.current, true);
    const isHovering = hits.length > 0;
    hoverRef.current = isHovering;
    return isHovering;
  };

  useEffect(() => {
    const canvas = gl.domElement;

    const onPointerMove = (event: PointerEvent) => {
      pointerInsideRef.current = true;
      updatePointerNdc(event.clientX, event.clientY);
    };

    const onPointerLeave = () => {
      pointerInsideRef.current = false;
      hoverRef.current = false;
    };

    const triggerBurst = () => {
      if (checkIntersection()) {
        burstUntilRef.current = performance.now() + 1200;
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      updatePointerNdc(event.clientX, event.clientY);
      triggerBurst();
    };

    const onTouchStart = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) {
        return;
      }

      pointerInsideRef.current = true;
      updatePointerNdc(touch.clientX, touch.clientY);
      triggerBurst();
    };

    canvas.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.addEventListener("pointerleave", onPointerLeave, { passive: true });
    canvas.addEventListener("pointerdown", onPointerDown, { passive: true });
    canvas.addEventListener("touchstart", onTouchStart, { passive: true });

    return () => {
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("touchstart", onTouchStart);
    };
  }, [camera, gl]);

  useFrame(({ clock }, delta) => {
    if (!spitRef.current) {
      return;
    }

    const hovered = checkIntersection();
    const burstActive = performance.now() < burstUntilRef.current;
    const spinBoost = (hovered ? 0.22 : 0) + (burstActive ? 0.48 : 0);
    const targetScale = burstActive ? 1.08 : hovered ? 1.03 : 1;
    const targetEmissive = burstActive ? 0.26 : hovered ? 0.1 : 0.02;

    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, targetScale * baseScale, 0.11);
    spitRef.current.scale.setScalar(scaleRef.current);
    spitRef.current.rotation.y += delta * (0.42 + spinBoost);
    spitRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.52) * (isMobile ? 0.04 : 0.06);
    spitRef.current.rotation.x = tiltX + Math.cos(clock.elapsedTime * 0.35) * 0.02;

    emissiveMaterials.forEach((material) => {
      material.emissiveIntensity = targetEmissive;
    });
  });

  return (
    <group ref={spitRef} position={basePosition}>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 5.6, 12]} />
        <meshStandardMaterial color="#b7b7b7" metalness={0.85} roughness={0.25} />
      </mesh>

      {layers.map((layer, index) => (
        <group
          key={index}
          position={[layer.offsetX, layer.y, layer.offsetZ]}
          rotation={[Math.PI / 2 + layer.wobble, layer.rotY, layer.rotZ]}
          scale={[layer.scale, layer.scale * 0.9, layer.scale * 1.06]}
        >
          <primitive object={layerSlices[index]} />
        </group>
      ))}
    </group>
  );
}

function seedParticle(meta: ParticleMeta, index: number, ember = false) {
  meta.originX = (Math.random() - 0.5) * (ember ? 0.92 : 0.55);
  meta.originZ = (Math.random() - 0.5) * (ember ? 0.78 : 0.48);
  meta.velocity = ember ? 0.009 + Math.random() * 0.012 : 0.014 + Math.random() * 0.02;
  meta.drift = (Math.random() - 0.5) * (ember ? 0.024 : 0.014);
  meta.swirl = (Math.random() - 0.5) * 0.9;
  meta.maxLife = ember ? 75 + Math.random() * 55 : 42 + Math.random() * 28;
  meta.life = (index / 12) % meta.maxLife;
}

function setParticleColor(colors: Float32Array, index: number, progress: number, ember = false) {
  const stride = index * 3;

  if (ember) {
    colors[stride] = 1;
    colors[stride + 1] = 0.72 + progress * 0.18;
    colors[stride + 2] = 0.35 + progress * 0.4;
    return;
  }

  if (progress < 0.4) {
    colors[stride] = 1;
    colors[stride + 1] = 0.28 + progress * 0.45;
    colors[stride + 2] = 0.02;
  } else if (progress < 0.72) {
    colors[stride] = 1;
    colors[stride + 1] = 0.58 + (progress - 0.4) * 0.8;
    colors[stride + 2] = 0.04 + (progress - 0.4) * 0.22;
  } else {
    colors[stride] = 1;
    colors[stride + 1] = 0.84 + (progress - 0.72) * 0.35;
    colors[stride + 2] = 0.22 + (progress - 0.72) * 0.38;
  }
}

function FireParticles({ fireCount, emberCount }: { fireCount: number; emberCount: number }) {
  const fireRef = useRef<THREE.Points>(null);
  const emberRef = useRef<THREE.Points>(null);

  const fireMeta = useMemo(() => {
    const particles = Array.from({ length: fireCount }, () => ({
      velocity: 0,
      drift: 0,
      swirl: 0,
      life: 0,
      maxLife: 0,
      originX: 0,
      originZ: 0,
    }));

    particles.forEach((meta, index) => seedParticle(meta, index, false));
    return particles;
  }, [fireCount]);

  const emberMeta = useMemo(() => {
    const particles = Array.from({ length: emberCount }, () => ({
      velocity: 0,
      drift: 0,
      swirl: 0,
      life: 0,
      maxLife: 0,
      originX: 0,
      originZ: 0,
    }));

    particles.forEach((meta, index) => seedParticle(meta, index, true));
    return particles;
  }, [emberCount]);

  const firePositions = useMemo(() => new Float32Array(fireCount * 3), [fireCount]);
  const fireColors = useMemo(() => new Float32Array(fireCount * 3), [fireCount]);
  const emberPositions = useMemo(() => new Float32Array(emberCount * 3), [emberCount]);
  const emberColors = useMemo(() => new Float32Array(emberCount * 3), [emberCount]);

  useFrame(({ clock }) => {
    const time = clock.elapsedTime;

    fireMeta.forEach((meta, index) => {
      meta.life += 1;

      if (meta.life >= meta.maxLife) {
        seedParticle(meta, index, false);
        meta.life = 0;
      }

      const progress = meta.life / meta.maxLife;
      const sway = Math.sin(time * 4 + progress * 8 + meta.swirl) * 0.08;
      const stride = index * 3;

      firePositions[stride] = meta.originX + meta.drift * meta.life * 0.14 + sway;
      firePositions[stride + 1] = progress * 1.75;
      firePositions[stride + 2] = meta.originZ + Math.cos(time * 2.6 + meta.swirl) * 0.04;

      setParticleColor(fireColors, index, progress, false);
    });

    emberMeta.forEach((meta, index) => {
      meta.life += 1;

      if (meta.life >= meta.maxLife) {
        seedParticle(meta, index, true);
        meta.life = 0;
      }

      const progress = meta.life / meta.maxLife;
      const stride = index * 3;
      const lift = Math.sin(time * 3 + index) * 0.02;

      emberPositions[stride] = meta.originX + meta.drift * meta.life * 0.26 + Math.sin(time * 2 + meta.swirl) * 0.08;
      emberPositions[stride + 1] = progress * 2.6 + lift;
      emberPositions[stride + 2] = meta.originZ + Math.cos(time * 1.8 + meta.swirl) * 0.07;

      setParticleColor(emberColors, index, progress, true);
    });

    if (fireRef.current) {
      const geometry = fireRef.current.geometry;
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
    }

    if (emberRef.current) {
      const geometry = emberRef.current.geometry;
      geometry.attributes.position.needsUpdate = true;
      geometry.attributes.color.needsUpdate = true;
    }
  });

  return (
    <group position={[0, -1.95, 1.1]}>
      <points ref={fireRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[firePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[fireColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          transparent
          opacity={0.85}
          size={0.18}
          sizeAttenuation
          depthWrite={false}
          vertexColors
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points ref={emberRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[emberPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[emberColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          transparent
          opacity={0.95}
          size={0.1}
          sizeAttenuation
          depthWrite={false}
          vertexColors
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

function SceneModels({ isMobile }: { isMobile: boolean }) {
  return (
    <SceneErrorBoundary fallback={<ProceduralFallbackScene />}>
      <Suspense fallback={<ProceduralFallbackScene />}>
        <BricksBackdropModel />
        <ProceduralLavaBase isMobile={isMobile} />
      </Suspense>
    </SceneErrorBoundary>
  );
}

function SceneContent({
  fireCount,
  emberCount,
  isMobile,
}: {
  fireCount: number;
  emberCount: number;
  isMobile: boolean;
}) {
  return (
    <>
      <color attach="background" args={["#090909"]} />
      <fog attach="fog" args={["#090909", 5.8, 12]} />
      <FireLights />
      <SceneModels isMobile={isMobile} />
      <FireParticles fireCount={fireCount} emberCount={emberCount} />
    </>
  );
}

export function HeroScene() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleVisibility = () => {
      setIsVisible(!document.hidden);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleVisibility();
    handleResize();

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[#090909] shadow-[0_40px_140px_rgba(0,0,0,0.7)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,106,0,0.18),transparent_35%),linear-gradient(180deg,rgba(10,10,10,0.1),rgba(10,10,10,0.72)_72%,rgba(10,10,10,0.96))]" />
      <Canvas
        camera={{ position: [0, 0.2, 6], fov: 34 }}
        dpr={[1, 1.5]}
        frameloop={isVisible ? "always" : "never"}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <SceneContent fireCount={isMobile ? 80 : 150} emberCount={isMobile ? 12 : 24} isMobile={isMobile} />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#090909] via-[#090909]/80 to-transparent" />
    </div>
  );
}
