# Pokédex Next.js Encyclopedia Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the Vite/Figma Pokédex UI into a Next.js App Router encyclopedia with a normalized Pokémon data layer and a future-ready 3D/ability showcase.

**Architecture:** Replace Vite routing with Next.js App Router routes. Keep interactive UI in client components, move shared Pokémon fetching and normalization into `src/lib/pokemon`, and expose route handlers for client-side filtering/detail hydration. The current PDF/exported UI remains the visual source, while the new data layer models the backend structure described in the spec.

**Tech Stack:** Next.js, React TSX, Tailwind CSS v4, TanStack Query, animejs, Three.js/React Three Fiber, Chart.js, PokeAPI.

---

## File Structure

- Modify `package.json`: switch scripts from Vite to Next.js, add Next/React versions and test script.
- Modify `postcss.config.mjs`: keep Tailwind v4 plugin compatible with Next.
- Create `next.config.mjs`: remote image allowlist for PokeAPI sprites.
- Create `tsconfig.json`: Next-friendly TS config and `@/*` alias.
- Create `next-env.d.ts`: Next generated type marker.
- Create `src/app/layout.tsx`: app shell and global styles.
- Create `src/app/page.tsx`: server entry for home encyclopedia route.
- Create `src/app/pokemon/[idOrName]/page.tsx`: server detail route.
- Create `src/app/api/pokemon/route.ts`: normalized list API route.
- Create `src/app/api/pokemon/[idOrName]/route.ts`: normalized detail API route.
- Create `src/app/providers.tsx`: TanStack Query provider.
- Create `src/app/components/AppShell.tsx`: persistent header and page chrome.
- Create `src/app/components/PokedexClient.tsx`: search, generation filter, animated card grid.
- Create `src/app/components/PokemonCard.tsx`: migrated card UI.
- Create `src/app/components/PokemonDetailClient.tsx`: detail interactions.
- Create `src/app/components/StatsRadar.tsx`: Chart.js radar client component.
- Create `src/app/components/AbilityShowcase.tsx`: Three.js media/showcase stage.
- Create `src/lib/pokemon/types.ts`: app domain types.
- Create `src/lib/pokemon/pokeapi-client.ts`: fetch wrapper.
- Create `src/lib/pokemon/media.ts`: sprite/model/video fallback resolver.
- Create `src/lib/pokemon/generations.ts`: generation/region helpers.
- Create `src/lib/pokemon/normalizers.ts`: raw PokeAPI to app models.
- Create `src/lib/pokemon/index.ts`: high-level list/detail functions.
- Create `src/lib/pokemon/__tests__/normalizers.test.ts`: first data-layer tests.
- Remove obsolete Vite files once Next runs: `index.html`, `vite.config.ts`, `src/main.tsx`, `src/app/App.tsx`, `src/app/routes.tsx`, `src/app/pages/*`.

## Task 1: Next.js Foundation

**Files:**
- Modify: `package.json`
- Create: `next.config.mjs`
- Create: `tsconfig.json`
- Create: `next-env.d.ts`
- Create: `src/app/layout.tsx`
- Create: `src/app/providers.tsx`

- [ ] **Step 1: Update dependencies and scripts**

Use this script block in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "test": "vitest run"
  }
}
```

Ensure dependencies include `next`, `react`, `react-dom`, `@vitejs/plugin-react` is removed, and `vite` is removed.

- [ ] **Step 2: Add Next config**

Create `next.config.mjs` with PokeAPI image hosts:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "img.pokemondb.net" }
    ]
  }
};

export default nextConfig;
```

- [ ] **Step 3: Add TypeScript config**

Create `tsconfig.json` with `@/*` alias to `src/*`.

- [ ] **Step 4: Add root layout and providers**

`layout.tsx` imports `src/styles/index.css`, wraps the body in `Providers`, and sets metadata. `providers.tsx` contains a client `QueryClientProvider`.

- [ ] **Step 5: Verify foundation**

Run `npm install --legacy-peer-deps`, then `npm run build`. Expected first result may fail because routes are not created yet; dependency resolution should succeed.

## Task 2: Pokémon Domain Layer

**Files:**
- Create: `src/lib/pokemon/types.ts`
- Create: `src/lib/pokemon/pokeapi-client.ts`
- Create: `src/lib/pokemon/media.ts`
- Create: `src/lib/pokemon/generations.ts`
- Create: `src/lib/pokemon/normalizers.ts`
- Create: `src/lib/pokemon/index.ts`
- Create: `src/lib/pokemon/__tests__/normalizers.test.ts`

- [ ] **Step 1: Write failing tests**

Create tests for `formatPokemonName`, `resolvePokemonMedia`, and generation lookup:

```ts
import { describe, expect, it } from "vitest";
import { getGenerationForPokemonId } from "../generations";
import { resolvePokemonMedia } from "../media";
import { formatPokemonName } from "../normalizers";

describe("pokemon normalizers", () => {
  it("formats hyphenated pokemon names for display", () => {
    expect(formatPokemonName("mr-mime")).toBe("Mr Mime");
    expect(formatPokemonName("nidoran-f")).toBe("Nidoran F");
  });

  it("finds the current generation for a national dex id", () => {
    expect(getGenerationForPokemonId(1)?.region).toBe("Kanto");
    expect(getGenerationForPokemonId(906)?.region).toBe("Paldea");
  });

  it("resolves official artwork before sprite fallback", () => {
    const media = resolvePokemonMedia({
      frontDefault: "/sprite.png",
      frontShiny: "/shiny.png",
      officialArtwork: "/official.png",
      officialShiny: null,
      animated: null,
      home: null
    });
    expect(media.primary).toBe("/official.png");
    expect(media.shiny).toBe("/shiny.png");
  });
});
```

- [ ] **Step 2: Run tests to verify red**

Run `npm test -- src/lib/pokemon/__tests__/normalizers.test.ts`. Expected: fail because modules do not exist.

- [ ] **Step 3: Implement data helpers**

Implement generation ranges, display-name formatting, media fallback, typed PokeAPI fetching, list normalization, detail normalization, species/evolution helpers, and exported `getPokemonList` / `getPokemonDetail`.

- [ ] **Step 4: Run tests to verify green**

Run `npm test -- src/lib/pokemon/__tests__/normalizers.test.ts`. Expected: pass.

## Task 3: Routes And API Handlers

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/app/pokemon/[idOrName]/page.tsx`
- Create: `src/app/api/pokemon/route.ts`
- Create: `src/app/api/pokemon/[idOrName]/route.ts`
- Create: `src/app/not-found.tsx`

- [ ] **Step 1: Implement home server page**

Fetch initial Pokémon data with `getPokemonList()` and pass it to `PokedexClient`.

- [ ] **Step 2: Implement detail server page**

Fetch normalized detail data with `getPokemonDetail(params.idOrName)` and render `PokemonDetailClient`. Call `notFound()` when missing.

- [ ] **Step 3: Implement route handlers**

Return normalized JSON for list and detail endpoints with `Response.json`.

- [ ] **Step 4: Verify route compile**

Run `npm run build`. Expected: routes compile or report only UI component gaps from Task 4.

## Task 4: Migrate Frontend UI

**Files:**
- Create: `src/app/components/AppShell.tsx`
- Create: `src/app/components/PokedexClient.tsx`
- Create: `src/app/components/PokemonCard.tsx`
- Create: `src/app/components/PokemonDetailClient.tsx`
- Create: `src/app/components/StatsRadar.tsx`
- Create: `src/app/components/AbilityShowcase.tsx`
- Modify: `src/styles/theme.css`

- [ ] **Step 1: Build app shell**

Use the existing PDF-style Pokédex header, sticky top bar, and `Outlet` replacement as `children`.

- [ ] **Step 2: Build home client**

Port search, generation filter, load-more, and animejs card entrance. Use props from the server page instead of fetching every card individually.

- [ ] **Step 3: Build card component**

Use type colors, official artwork, shiny/form cues, and Next `Link`.

- [ ] **Step 4: Build detail client**

Port tabs/sections, shiny toggle, artwork/model toggle, stats, dimensions, abilities, and forms.

- [ ] **Step 5: Build stats radar**

Register Chart.js modules in a client component and render a radar chart from normalized stats.

- [ ] **Step 6: Build ability showcase**

Use React Three Fiber for a type-colored energy scene when no curated model/video exists.

- [ ] **Step 7: Verify UI**

Run `npm run build`, then `npm run dev` and open `http://localhost:3000`.

## Task 5: Cleanup And Verification

**Files:**
- Delete: `index.html`
- Delete: `vite.config.ts`
- Delete: `src/main.tsx`
- Delete: `src/app/App.tsx`
- Delete: `src/app/routes.tsx`
- Delete: `src/app/pages/Home.tsx`
- Delete: `src/app/pages/PokemonDetail.tsx`

- [ ] **Step 1: Remove obsolete Vite files**

Delete Vite entry/routing files after Next routes build.

- [ ] **Step 2: Run final verification**

Run:

```bash
npm test
npm run build
```

- [ ] **Step 3: Browser verify**

Open `http://localhost:3000` and verify:

- home renders Pokémon cards,
- search filters names,
- generation filter changes visible list,
- detail page opens,
- shiny toggle changes media,
- forms links render when available,
- stats chart renders,
- 3D ability stage renders without a blank canvas.

- [ ] **Step 4: Record residual work**

Document any deferred media/model/video limitations in the final response.
