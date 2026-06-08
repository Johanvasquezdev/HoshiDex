# Hybrid Filters Compare Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the Hybrid Ultimate HoshiDex home screen with advanced filtering and local compare mode.

**Architecture:** Extend the existing Next.js App Router app without changing the route structure. Keep `/api/pokemon` as the list source, add focused filter/compare helpers under `src/lib/pokemon`, and split client UI into small components so `PokedexClient` remains orchestration.

**Tech Stack:** Next.js, React, TypeScript, Tailwind, TanStack Query, Chart.js, Anime.js, PokeAPI, existing Supabase-ready maintenance layer.

---

## File Structure

- Create `src/lib/pokemon/advanced-filters.ts`: filter state types, query serialization, range matching helpers, active filter chip helpers.
- Create `src/lib/pokemon/compare.ts`: compare selection rules and display helpers.
- Modify `src/lib/pokemon/types.ts`: add list/detail fields needed by filters and compare: `stats`, `height`, `weight`, `abilities`, `speciesFlags`.
- Modify `src/lib/pokemon/normalizers.ts`: include stats, height, weight, and abilities in list summaries.
- Modify `src/lib/pokemon/index.ts`: apply advanced filters after visible detail fetch while keeping PokeAPI throttling.
- Modify `src/app/api/pokemon/route.ts`: accept advanced filter query params.
- Create `src/app/components/AdvancedFilterPanel.tsx`: device-style filters and chips.
- Create `src/app/components/CompareTray.tsx`: selected Pokémon strip and expanded analysis.
- Modify `src/app/components/PokemonCard.tsx`: add compare toggle and denser in-game card style.
- Modify `src/app/components/PokedexClient.tsx`: wire filters, query key, compare state, and Hybrid layout.
- Add tests in `src/lib/pokemon/__tests__/advanced-filters.test.ts` and `src/lib/pokemon/__tests__/compare.test.ts`.

---

### Task 1: Advanced Filter Model

**Files:**
- Create: `src/lib/pokemon/advanced-filters.ts`
- Test: `src/lib/pokemon/__tests__/advanced-filters.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, it } from "vitest";
import {
  DEFAULT_ADVANCED_FILTERS,
  advancedFiltersToSearchParams,
  getActiveFilterChips,
  matchesAdvancedFilters,
  type FilterablePokemon,
} from "../advanced-filters";

const pokemon = (overrides: Partial<FilterablePokemon> = {}): FilterablePokemon => ({
  types: ["grass", "dark"],
  abilities: ["overgrow", "protean"],
  stats: { hp: 76, attack: 110, defense: 70, specialAttack: 81, specialDefense: 70, speed: 123 },
  height: 15,
  weight: 312,
  speciesFlags: { legendary: false, mythical: false, baby: false },
  ...overrides,
});

describe("advanced filters", () => {
  it("serializes only active filters", () => {
    const params = advancedFiltersToSearchParams({
      ...DEFAULT_ADVANCED_FILTERS,
      types: ["grass", "fire"],
      ability: "protean",
      minSpeed: 90,
    });

    expect(params.get("types")).toBe("grass,fire");
    expect(params.get("ability")).toBe("protean");
    expect(params.get("minSpeed")).toBe("90");
    expect(params.has("maxSpeed")).toBe(false);
  });

  it("matches type, ability, stats, and body ranges", () => {
    expect(matchesAdvancedFilters(pokemon(), {
      ...DEFAULT_ADVANCED_FILTERS,
      types: ["grass"],
      ability: "prot",
      minSpeed: 120,
      maxWeight: 400,
    })).toBe(true);

    expect(matchesAdvancedFilters(pokemon(), {
      ...DEFAULT_ADVANCED_FILTERS,
      types: ["water"],
    })).toBe(false);
  });

  it("creates active filter chips", () => {
    expect(getActiveFilterChips({
      ...DEFAULT_ADVANCED_FILTERS,
      types: ["grass"],
      legendary: true,
      minAttack: 100,
    }).map((chip) => chip.label)).toEqual(["Type: grass", "Legendary", "Attack >= 100"]);
  });
});
```

- [ ] **Step 2: Run failing test**

Run: `.\node_modules\.bin\vitest.cmd run src\lib\pokemon\__tests__\advanced-filters.test.ts`

Expected: fail because `advanced-filters.ts` does not exist.

- [ ] **Step 3: Implement filter helpers**

Create `src/lib/pokemon/advanced-filters.ts` with:

```ts
export type StatKey = "hp" | "attack" | "defense" | "specialAttack" | "specialDefense" | "speed";

export type AdvancedFilters = {
  types: string[];
  ability: string;
  minHp: number | null;
  maxHp: number | null;
  minAttack: number | null;
  maxAttack: number | null;
  minDefense: number | null;
  maxDefense: number | null;
  minSpecialAttack: number | null;
  maxSpecialAttack: number | null;
  minSpecialDefense: number | null;
  maxSpecialDefense: number | null;
  minSpeed: number | null;
  maxSpeed: number | null;
  minHeight: number | null;
  maxHeight: number | null;
  minWeight: number | null;
  maxWeight: number | null;
  legendary: boolean;
  mythical: boolean;
  baby: boolean;
};

export type FilterablePokemon = {
  types: string[];
  abilities?: string[];
  stats?: Record<StatKey, number>;
  height?: number;
  weight?: number;
  speciesFlags?: { legendary: boolean; mythical: boolean; baby: boolean };
};

export const DEFAULT_ADVANCED_FILTERS: AdvancedFilters = {
  types: [],
  ability: "",
  minHp: null,
  maxHp: null,
  minAttack: null,
  maxAttack: null,
  minDefense: null,
  maxDefense: null,
  minSpecialAttack: null,
  maxSpecialAttack: null,
  minSpecialDefense: null,
  maxSpecialDefense: null,
  minSpeed: null,
  maxSpeed: null,
  minHeight: null,
  maxHeight: null,
  minWeight: null,
  maxWeight: null,
  legendary: false,
  mythical: false,
  baby: false,
};
```

- [ ] **Step 4: Run test green**

Run: `.\node_modules\.bin\vitest.cmd run src\lib\pokemon\__tests__\advanced-filters.test.ts`

Expected: pass.

---

### Task 2: Compare Selection Model

**Files:**
- Create: `src/lib/pokemon/compare.ts`
- Test: `src/lib/pokemon/__tests__/compare.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, it } from "vitest";
import { toggleComparedPokemon } from "../compare";
import type { PokemonSummary } from "../types";

const summary = (id: number): PokemonSummary => ({
  id,
  name: `pokemon-${id}`,
  displayName: `Pokemon ${id}`,
  types: ["normal"],
  generation: null,
  media: { primary: null, shiny: null, animated: null, modelUrl: null, videoUrl: null, fallback: "" },
  isRegionalOrSpecial: false,
});

describe("compare selection", () => {
  it("adds and removes selected pokemon", () => {
    const one = toggleComparedPokemon([], summary(1));
    expect(one.map((pokemon) => pokemon.id)).toEqual([1]);
    expect(toggleComparedPokemon(one, summary(1))).toEqual([]);
  });

  it("caps compare selection at four pokemon", () => {
    const selected = [summary(1), summary(2), summary(3), summary(4)];
    expect(toggleComparedPokemon(selected, summary(5)).map((pokemon) => pokemon.id)).toEqual([1, 2, 3, 4]);
  });
});
```

- [ ] **Step 2: Run failing test**

Run: `.\node_modules\.bin\vitest.cmd run src\lib\pokemon\__tests__\compare.test.ts`

Expected: fail because `compare.ts` does not exist.

- [ ] **Step 3: Implement compare helper**

Create `src/lib/pokemon/compare.ts` with max-four toggle logic.

- [ ] **Step 4: Run test green**

Run: `.\node_modules\.bin\vitest.cmd run src\lib\pokemon\__tests__\compare.test.ts`

Expected: pass.

---

### Task 3: Pokemon Summary Data Enrichment

**Files:**
- Modify: `src/lib/pokemon/types.ts`
- Modify: `src/lib/pokemon/normalizers.ts`
- Modify: `src/lib/pokemon/index.ts`
- Modify: `src/app/api/pokemon/route.ts`

- [ ] **Step 1: Extend summary types**

Add optional `stats`, `height`, `weight`, `abilities`, and `speciesFlags` to `PokemonSummary`.

- [ ] **Step 2: Normalize list details**

Update `normalizePokemonSummary` to map stats and body fields from `RawPokemon`.

- [ ] **Step 3: Parse advanced filters in route**

Read the new search params and pass them to `getPokemonList`.

- [ ] **Step 4: Apply filters**

Use `matchesAdvancedFilters` after detail fetch. Species flags default false until richer species indexing is added.

- [ ] **Step 5: Verify**

Run: `.\node_modules\.bin\vitest.cmd run`

Expected: all tests pass.

---

### Task 4: Hybrid Filter UI

**Files:**
- Create: `src/app/components/AdvancedFilterPanel.tsx`
- Modify: `src/app/components/PokedexClient.tsx`

- [ ] **Step 1: Build filter panel**

Create a client component with type chips, ability input, stat inputs, body inputs, species flag toggles, active chips, and clear all.

- [ ] **Step 2: Wire query state**

Add `advancedFilters` to `PokedexClient`, query key, and fetch query params.

- [ ] **Step 3: Preserve reset behavior**

Reset visible limit when advanced filters change.

- [ ] **Step 4: Verify no empty-layout regressions**

Run: `.\node_modules\.bin\next.cmd build`

Expected: build passes.

---

### Task 5: Compare UI

**Files:**
- Create: `src/app/components/CompareTray.tsx`
- Modify: `src/app/components/PokemonCard.tsx`
- Modify: `src/app/components/PokedexClient.tsx`

- [ ] **Step 1: Add compare button**

Card compare action must use `event.preventDefault()` so it does not navigate.

- [ ] **Step 2: Add compare tray**

Show selected Pokémon, max-four status, remove actions, and an expanded analysis panel with a radar-style stat comparison.

- [ ] **Step 3: Wire state**

Use `toggleComparedPokemon` from `PokedexClient` and pass selection state to cards and tray.

- [ ] **Step 4: Verify**

Run: `.\node_modules\.bin\vitest.cmd run`

Expected: all tests pass.

---

### Task 6: Hybrid Visual Pass

**Files:**
- Modify: `src/app/components/PokedexClient.tsx`
- Modify: `src/app/components/PokemonCard.tsx`
- Modify: `src/app/components/AppShell.tsx` if needed
- Modify: `src/styles/theme.css` if needed

- [ ] **Step 1: Rework layout**

Move the home screen into a red shell, dark display, left rail, center scanner grid, right filter panel, and compare tray.

- [ ] **Step 2: Mobile layout**

Stack rail/header/filter/grid/tray with no overlapping text.

- [ ] **Step 3: Verify visually**

Run local app at `http://localhost:5173` and inspect desktop/mobile.

- [ ] **Step 4: Final checks**

Run:

```powershell
.\node_modules\.bin\vitest.cmd run
$env:NODE_OPTIONS='--max-old-space-size=4096'; .\node_modules\.bin\next.cmd build
```

Expected: tests and build pass.
