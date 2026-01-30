"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Html, Line, OrbitControls } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { useInView } from "framer-motion";
import * as THREE from "three";
import { cn } from "@/lib/utils";

// Colors matching the Data Brutalism theme
const COLORS = {
  royalBlue: "#4169E1",
  royalBlueDark: "#2C4A9E",
  royalBlueLight: "#6B8EE8",
  white: "#FFFFFF",
  black: "#0A0A0A",
  gray: "#525252",
  muted: "#E8E8E3",
};

// Layer configuration
const LAYERS = [
  {
    id: "blockchain",
    name: "BLOCKCHAIN LAYER",
    subtitle: "Ownership & Immutability",
    description: "Distributed ledger providing tamper-proof ownership records, transaction history, and decentralized consensus.",
    color: COLORS.royalBlueDark,
    yPosition: -2,
    features: ["Consensus Mechanism", "Immutable Records", "Decentralized Storage"],
  },
  {
    id: "smart-contract",
    name: "SMART CONTRACT LAYER",
    subtitle: "Logic & Economy",
    description: "Automated business logic enabling trustless transactions, tokenomics, and programmable digital assets.",
    color: COLORS.royalBlue,
    yPosition: 0,
    features: ["Asset Tokenization", "Automated Rules", "Economic Protocols"],
  },
  {
    id: "application",
    name: "APPLICATION LAYER",
    subtitle: "User Experience",
    description: "Frontend interfaces where users interact with virtual worlds, marketplaces, and social experiences.",
    color: COLORS.royalBlueLight,
    yPosition: 2,
    features: ["Virtual Worlds", "Marketplaces", "Social Interactions"],
  },
];

// Animated particle that flows between layers
function TransactionParticle({
  startY,
  endY,
  delay,
  isActive,
}: {
  startY: number;
  endY: number;
  delay: number;
  isActive: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [progress, setProgress] = useState(0);

  useFrame((state, delta) => {
    if (!isActive || !meshRef.current) return;

    const time = (state.clock.getElapsedTime() - delay) % 3;
    if (time < 0) return;

    const t = Math.min(time / 2, 1);
    setProgress(t);

    // Bezier-like path for smooth flow
    const x = Math.sin(t * Math.PI) * 0.5;
    const y = startY + (endY - startY) * t;
    const z = Math.cos(t * Math.PI) * 0.3;

    meshRef.current.position.set(x, y, z);
    meshRef.current.scale.setScalar(1 - t * 0.5 + 0.5);
  });

  if (!isActive) return null;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.08, 16, 16]} />
      <meshStandardMaterial
        color={COLORS.white}
        emissive={COLORS.royalBlue}
        emissiveIntensity={0.8}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// Individual layer box with hover effects
function LayerBox({
  layer,
  isActive,
  isHovered,
  onHover,
  onUnhover,
}: {
  layer: (typeof LAYERS)[0];
  isActive: boolean;
  isHovered: boolean;
  onHover: () => void;
  onUnhover: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const [hoverScale, setHoverScale] = useState(1);

  useFrame((_, delta) => {
    const targetScale = isHovered || isActive ? 1.05 : 1;
    setHoverScale((prev) => THREE.MathUtils.lerp(prev, targetScale, delta * 5));

    if (meshRef.current) {
      meshRef.current.scale.set(hoverScale, 1, hoverScale);
    }
    if (edgesRef.current) {
      edgesRef.current.scale.set(hoverScale, 1, hoverScale);
    }
  });

  const boxGeometry = useMemo(() => new THREE.BoxGeometry(4, 0.8, 3), []);
  const edgesGeometry = useMemo(() => new THREE.EdgesGeometry(boxGeometry), [boxGeometry]);

  return (
    <group position={[0, layer.yPosition, 0]}>
      {/* Main box */}
      <mesh
        ref={meshRef}
        onPointerEnter={(e) => {
          e.stopPropagation();
          onHover();
          document.body.style.cursor = "pointer";
        }}
        onPointerLeave={() => {
          onUnhover();
          document.body.style.cursor = "auto";
        }}
      >
        <boxGeometry args={[4, 0.8, 3]} />
        <meshStandardMaterial
          color={layer.color}
          transparent
          opacity={isActive || isHovered ? 0.95 : 0.7}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Wireframe edges - brutalist aesthetic */}
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[boxGeometry]} />
        <lineBasicMaterial
          color={isActive || isHovered ? COLORS.white : COLORS.black}
          linewidth={2}
        />
      </lineSegments>

      {/* Layer label */}
      <Text
        position={[0, 0, 1.6]}
        fontSize={0.22}
        color={COLORS.white}
        anchorX="center"
        anchorY="middle"
      // Default font used
      >
        {layer.name}
      </Text>

      <Text
        position={[0, -0.25, 1.6]}
        fontSize={0.12}
        color={COLORS.white}
        anchorX="center"
        anchorY="middle"
        // Default font used
        fillOpacity={0.8}
      >
        {layer.subtitle}
      </Text>

      {/* Feature nodes on the layer */}
      {layer.features.map((feature, index) => (
        <group key={feature} position={[(index - 1) * 1.2, 0.5, 0]}>
          <mesh>
            <boxGeometry args={[0.15, 0.15, 0.15]} />
            <meshStandardMaterial
              color={COLORS.white}
              emissive={isActive ? COLORS.royalBlue : COLORS.black}
              emissiveIntensity={isActive ? 0.5 : 0}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Connection lines between layers
function ConnectionLines({ activeLayer }: { activeLayer: string | null }) {
  const lines = useMemo(() => {
    const connections: { start: THREE.Vector3; end: THREE.Vector3; key: string }[] = [];

    for (let i = 0; i < LAYERS.length - 1; i++) {
      const startY = LAYERS[i].yPosition + 0.4;
      const endY = LAYERS[i + 1].yPosition - 0.4;

      // Multiple connection lines for visual effect
      [-1, 0, 1].forEach((xOffset) => {
        connections.push({
          start: new THREE.Vector3(xOffset * 0.8, startY, 0),
          end: new THREE.Vector3(xOffset * 0.8, endY, 0),
          key: `${i}-${xOffset}`,
        });
      });
    }

    return connections;
  }, []);

  return (
    <group>
      {lines.map(({ start, end, key }) => (
        <Line
          key={key}
          points={[start, end]}
          color={activeLayer ? COLORS.royalBlue : COLORS.gray}
          lineWidth={activeLayer ? 2 : 1}
          dashed
          dashScale={10}
          dashSize={0.1}
          gapSize={0.05}
        />
      ))}
    </group>
  );
}

// Animated grid floor
function GridFloor() {
  return (
    <group position={[0, -3.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <gridHelper
        args={[20, 20, COLORS.royalBlueDark, COLORS.gray]}
        rotation={[Math.PI / 2, 0, 0]}
      />
    </group>
  );
}

// Main 3D Scene
function Scene({
  activeLayer,
  setActiveLayer,
  hoveredLayer,
  setHoveredLayer,
}: {
  activeLayer: string | null;
  setActiveLayer: (layer: string | null) => void;
  hoveredLayer: string | null;
  setHoveredLayer: (layer: string | null) => void;
}) {
  const { camera } = useThree();

  // Set initial camera position for isometric view
  useEffect(() => {
    camera.position.set(6, 4, 6);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={0.5} color={COLORS.royalBlue} />

      {/* Grid floor */}
      <GridFloor />

      {/* Layer boxes */}
      {LAYERS.map((layer) => (
        <LayerBox
          key={layer.id}
          layer={layer}
          isActive={activeLayer === layer.id}
          isHovered={hoveredLayer === layer.id}
          onHover={() => setHoveredLayer(layer.id)}
          onUnhover={() => setHoveredLayer(null)}
        />
      ))}

      {/* Connection lines */}
      <ConnectionLines activeLayer={activeLayer} />

      {/* Transaction particles */}
      {[0, 0.5, 1, 1.5, 2, 2.5].map((delay, i) => (
        <TransactionParticle
          key={i}
          startY={-1.6}
          endY={1.6}
          delay={delay}
          isActive={activeLayer !== null}
        />
      ))}

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        autoRotate={!activeLayer && !hoveredLayer}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

// Layer selector buttons
function LayerSelector({
  activeLayer,
  setActiveLayer,
  hoveredLayer,
}: {
  activeLayer: string | null;
  setActiveLayer: (layer: string | null) => void;
  hoveredLayer: string | null;
}) {
  return (
    <div className="absolute left-4 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2">
      {LAYERS.slice().reverse().map((layer) => (
        <button
          key={layer.id}
          onClick={() => setActiveLayer(activeLayer === layer.id ? null : layer.id)}
          className={cn(
            "group flex items-center gap-3 border-2 px-4 py-2 font-mono text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer",
            activeLayer === layer.id
              ? "border-primary bg-primary text-primary-foreground"
              : hoveredLayer === layer.id
                ? "border-primary bg-primary/10 text-foreground"
                : "border-foreground/30 bg-background/80 text-foreground hover:border-primary hover:bg-primary/5"
          )}
        >
          <span
            className="h-3 w-3 border"
            style={{
              backgroundColor: layer.color,
              borderColor: COLORS.black,
            }}
          />
          <span className="hidden sm:inline">{layer.name}</span>
          <span className="sm:hidden">{layer.id.charAt(0).toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}

// Info panel for selected layer
function InfoPanel({
  activeLayer,
  hoveredLayer,
}: {
  activeLayer: string | null;
  hoveredLayer: string | null;
}) {
  const displayLayer = activeLayer || hoveredLayer;
  const layer = LAYERS.find((l) => l.id === displayLayer);

  if (!layer) {
    return (
      <div className="absolute bottom-4 right-4 z-10 max-w-xs border-2 border-foreground/20 bg-background/90 p-4 backdrop-blur-sm">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Select or hover a layer
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Explore how blockchain architecture enables decentralized metaverse economies.
        </p>
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 right-4 z-10 max-w-xs border-2 border-primary bg-background/95 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <span
          className="h-4 w-4 border border-foreground"
          style={{ backgroundColor: layer.color }}
        />
        <h4 className="font-mono text-sm font-bold uppercase tracking-wider">
          {layer.name}
        </h4>
      </div>
      <p className="mt-1 font-mono text-xs text-primary">{layer.subtitle}</p>
      <p className="mt-3 text-sm leading-relaxed text-foreground/80">
        {layer.description}
      </p>
      <div className="mt-4 border-t border-foreground/20 pt-3">
        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Key Components
        </p>
        <ul className="mt-2 space-y-1">
          {layer.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <span className="h-1.5 w-1.5 bg-primary" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Loading fallback
function LoadingFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-foreground">
      <div className="h-8 w-8 animate-spin border-2 border-primary border-t-transparent" />
      <p className="mt-4 font-mono text-xs uppercase tracking-wider text-background/70">
        Loading 3D Scene...
      </p>
    </div>
  );
}

// Main exported component
export function MetaverseArchitecture3D({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.4 });
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full overflow-hidden border-2 border-foreground bg-foreground",
        className
      )}
      style={{ height: "600px" }}
    >
      {/* Header */}
      <div className="absolute left-0 right-0 top-0 z-10 border-b-2 border-foreground/30 bg-foreground/95 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-background">
              Metaverse Architecture
            </h3>
            <p className="font-mono text-xs text-background/60">
              Interactive 3D Technical Stack
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse bg-primary" />
            <span className="font-mono text-xs uppercase text-background/60">
              {isInView ? "Active" : "Paused"}
            </span>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ fov: 45, near: 0.1, far: 1000 }}
          style={{ background: COLORS.black }}
        >
          <Scene
            activeLayer={activeLayer}
            setActiveLayer={setActiveLayer}
            hoveredLayer={hoveredLayer}
            setHoveredLayer={setHoveredLayer}
          />
        </Canvas>
      </Suspense>

      {/* Layer selector */}
      <LayerSelector
        activeLayer={activeLayer}
        setActiveLayer={setActiveLayer}
        hoveredLayer={hoveredLayer}
      />

      {/* Info panel */}
      <InfoPanel activeLayer={activeLayer} hoveredLayer={hoveredLayer} />

      {/* Instruction hint */}
      <div className="absolute bottom-4 left-4 z-10">
        <p className="font-mono text-xs text-background/50">
          Drag to rotate / Select layer to explore
        </p>
      </div>
    </div>
  );
}
