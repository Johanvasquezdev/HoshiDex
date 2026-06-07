"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, MeshDistortMaterial, OrbitControls, Sphere } from "@react-three/drei";
import { Box, Clapperboard, Info, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { buildAbilityMediaShowcase } from "@/lib/pokemon/showcase";
import type { PokemonAbility } from "@/lib/pokemon/types";

function EnergyOrb({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.32;
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={2.35}>
      <MeshDistortMaterial
        attach="material"
        color={color}
        distort={0.4}
        speed={2}
        roughness={0.25}
        metalness={0.75}
      />
    </Sphere>
  );
}

export function AbilityShowcase({
  pokemonName,
  mainType,
  color,
  abilities,
  generationLabel,
  modelUrl,
  videoUrl,
}: {
  pokemonName: string;
  mainType: string;
  color: string;
  abilities: PokemonAbility[];
  generationLabel: string;
  modelUrl: string | null;
  videoUrl: string | null;
}) {
  const showcase = useMemo(
    () =>
      buildAbilityMediaShowcase({
        pokemonName,
        mainType,
        generationLabel,
        abilities,
        modelUrl,
        videoUrl,
      }),
    [abilities, generationLabel, mainType, modelUrl, pokemonName, videoUrl],
  );
  const [selectedAssetId, setSelectedAssetId] = useState(showcase.assets[0]?.id ?? "");
  const selectedAsset = showcase.assets.find((asset) => asset.id === selectedAssetId) ?? showcase.assets[0];

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-6 text-white shadow-2xl sm:p-10">
      <div className="absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_25%),radial-gradient(circle_at_80%_40%,white,transparent_18%)]" />
      <div className="relative z-10">
        <h2 className="mb-2 flex items-center gap-3 text-2xl font-black sm:text-3xl">
          <Sparkles className="h-7 w-7 fill-white" />
          Ability Showcase
        </h2>
        <p className="mb-6 max-w-2xl text-sm font-medium leading-6 text-slate-400">
          A media-ready stage for {pokemonName}. Each ability now has a game, generation, model, and video slot that can connect to backend media later.
        </p>
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/10 bg-black/50 shadow-2xl">
          {selectedAsset?.kind === "video" && selectedAsset.url ? (
            <video src={selectedAsset.url} className="h-full w-full object-cover" controls />
          ) : (
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <Environment preset="city" />
              <EnergyOrb color={color} />
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
            </Canvas>
          )}
          <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
            <Info className="h-3.5 w-3.5" />
            {selectedAsset?.kind === "placeholder" ? `${mainType} energy` : selectedAsset?.kind}
          </div>
        </div>
        {selectedAsset && (
          <div className="mt-4 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <div className="text-sm font-black">{selectedAsset.label}</div>
              <p className="mt-1 text-xs leading-5 text-slate-400">{selectedAsset.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wide text-slate-300">
              <span className="rounded-full bg-white/10 px-3 py-1">{selectedAsset.game}</span>
              <span className="rounded-full bg-white/10 px-3 py-1">{selectedAsset.generationLabel}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1">
                {selectedAsset.kind === "model" ? <Box className="h-3 w-3" /> : <Clapperboard className="h-3 w-3" />}
                {selectedAsset.kind}
              </span>
            </div>
          </div>
        )}
        <div className="mt-5 flex gap-3 overflow-x-auto pb-1">
          {showcase.assets.map((asset) => (
            <button
              type="button"
              key={asset.id}
              onClick={() => setSelectedAssetId(asset.id)}
              className={`min-w-52 rounded-xl border p-4 text-left transition ${
                asset.id === selectedAsset?.id
                  ? "border-white/20 bg-white/10 text-white"
                  : "border-white/10 bg-white/[0.04] text-slate-300"
              }`}
            >
              <div className="text-sm font-black">{asset.label}</div>
              <div className="mt-1 text-xs text-slate-400">
                {asset.kind === "placeholder" ? "Awaiting video/model asset" : "Real media asset"}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
