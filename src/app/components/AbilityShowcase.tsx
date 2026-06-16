"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Bounds, MeshDistortMaterial, OrbitControls, Sphere, useGLTF } from "@react-three/drei";
import { Box, Clapperboard, Info, Sparkles } from "lucide-react";
import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { buildAbilityMediaShowcase } from "@/lib/pokemon/showcase";
import type { PokemonAbility, PokemonShowcaseMediaAsset } from "@/lib/pokemon/types";
import { useMaintenanceStore } from "@/lib/maintenance/use-maintenance-store";

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

function ModelAsset({ url }: { url: string }) {
  const gltf = useGLTF(url);
  const scene = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  return (
    <Bounds fit clip observe margin={1.2}>
      <primitive object={scene} />
    </Bounds>
  );
}

class ModelErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(previousProps: { children: ReactNode; fallback: ReactNode }) {
    if (previousProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function normalizePokemonKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function AbilityShowcase({
  pokemonName,
  mainType,
  color,
  abilities,
  generationLabel,
  modelUrl,
  videoUrl,
  mediaAssets = [],
}: {
  pokemonName: string;
  mainType: string;
  color: string;
  abilities: PokemonAbility[];
  generationLabel: string;
  modelUrl: string | null;
  videoUrl: string | null;
  mediaAssets?: PokemonShowcaseMediaAsset[];
}) {
  const store = useMaintenanceStore();
  const pokemonKey = normalizePokemonKey(pokemonName);
  const storeMediaAssets = useMemo(() => {
    return store.mediaAssets.filter((asset) => {
      if (asset.pokemonId === pokemonKey) return true;
      const managedPokemon = store.pokemon.find((item) => item.id === asset.pokemonId);
      return managedPokemon ? normalizePokemonKey(managedPokemon.name) === pokemonKey : false;
    });
  }, [pokemonKey, store.mediaAssets, store.pokemon]);
  const mergedMediaAssets = useMemo(() => {
    const byId = new Map<string, PokemonShowcaseMediaAsset>();
    [...mediaAssets, ...storeMediaAssets].forEach((asset) => byId.set(asset.id, asset));
    return Array.from(byId.values());
  }, [mediaAssets, storeMediaAssets]);
  const showcase = useMemo(
    () =>
      buildAbilityMediaShowcase({
        pokemonName,
        mainType,
        generationLabel,
        abilities,
        modelUrl,
        videoUrl,
        mediaAssets: mergedMediaAssets,
      }),
    [abilities, generationLabel, mainType, mergedMediaAssets, modelUrl, pokemonName, videoUrl],
  );
  const [selectedAssetId, setSelectedAssetId] = useState(showcase.assets[0]?.id ?? "");
  const selectedAsset = showcase.assets.find((asset) => asset.id === selectedAssetId) ?? showcase.assets[0];

  useEffect(() => {
    if (!showcase.assets.some((asset) => asset.id === selectedAssetId)) {
      setSelectedAssetId(showcase.assets[0]?.id ?? "");
    }
  }, [selectedAssetId, showcase.assets]);

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white p-6 text-slate-950 shadow-2xl shadow-slate-200/70 sm:p-10 dark:border-white/10 dark:bg-slate-950 dark:text-white dark:shadow-black/40">
      <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(circle_at_20%_20%,rgba(239,68,68,0.16),transparent_25%),radial-gradient(circle_at_80%_40%,rgba(14,165,233,0.14),transparent_18%)] dark:opacity-10 dark:[background-image:radial-gradient(circle_at_20%_20%,white,transparent_25%),radial-gradient(circle_at_80%_40%,white,transparent_18%)]" />
      <div className="relative z-10">
        <h2 className="mb-2 flex items-center gap-3 text-2xl font-black sm:text-3xl">
          <Sparkles className="h-7 w-7 fill-red-500 text-red-500 dark:fill-white dark:text-white" />
          Ability Showcase
        </h2>
        <p className="mb-6 max-w-2xl text-sm font-medium leading-6 text-slate-600 dark:text-slate-400">
          A media-ready stage for {pokemonName}. Add model or video rows in Media Assets to replace placeholder energy with real showcase footage.
        </p>
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-2xl shadow-slate-200/70 dark:border-white/10 dark:bg-black/50 dark:shadow-black/40">
          {selectedAsset?.kind === "video" && selectedAsset.url ? (
            <video src={selectedAsset.url} className="h-full w-full object-cover" controls />
          ) : (
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              {selectedAsset?.kind === "model" && selectedAsset.url ? (
                <ModelErrorBoundary fallback={<EnergyOrb color={color} />}>
                  <Suspense fallback={<EnergyOrb color={color} />}>
                    <ModelAsset url={selectedAsset.url} />
                  </Suspense>
                </ModelErrorBoundary>
              ) : (
                <EnergyOrb color={color} />
              )}
              <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
            </Canvas>
          )}
          <div className="pointer-events-none absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-white/85 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-lg shadow-slate-300/50 backdrop-blur-md dark:bg-black/60 dark:text-white dark:shadow-none">
            <Info className="h-3.5 w-3.5" />
            {selectedAsset?.kind === "placeholder" ? `${mainType} energy` : selectedAsset?.kind}
          </div>
        </div>
        {selectedAsset && (
          <div className="mt-4 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:grid-cols-[1fr_auto] sm:items-center dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
            <div>
              <div className="text-sm font-black">{selectedAsset.label}</div>
              <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">{selectedAsset.description}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wide text-slate-600 dark:text-slate-300">
              <span className="rounded-full bg-slate-200 px-3 py-1 dark:bg-white/10">{selectedAsset.game}</span>
              <span className="rounded-full bg-slate-200 px-3 py-1 dark:bg-white/10">{selectedAsset.generationLabel}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 dark:bg-white/10">
                {selectedAsset.kind === "model" && <Box className="h-3 w-3" />}
                {selectedAsset.kind === "video" && <Clapperboard className="h-3 w-3" />}
                {selectedAsset.kind === "placeholder" && <Sparkles className="h-3 w-3" />}
                {selectedAsset.kind}
              </span>
              {selectedAsset.sourceUrl && (
                <a
                  href={selectedAsset.sourceUrl}
                  className="rounded-full bg-slate-200 px-3 py-1 transition hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20"
                >
                  Source
                </a>
              )}
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
                  ? "border-red-200 bg-red-50 text-slate-950 shadow-sm dark:border-white/20 dark:bg-white/10 dark:text-white dark:shadow-none"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:border-red-200 hover:bg-red-50/60 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/10"
              }`}
            >
              <div className="text-sm font-black">{asset.label}</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                {asset.kind === "placeholder" ? "Awaiting video/model asset" : "Real media asset"}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
