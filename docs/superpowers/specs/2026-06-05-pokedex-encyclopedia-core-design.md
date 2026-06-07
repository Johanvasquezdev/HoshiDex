# Pokédex Encyclopedia Core Design

## Decision

Build the first milestone as a Next.js App Router encyclopedia. The current Vite React app is treated as a UI prototype, while the PDF/imported screens define the product shape: a modern Pokédex with search, generations, detail tabs, stats, evolutions, forms, locations/media, and a premium creature showcase.

The first milestone is the encyclopedia foundation. The second layer is the 3D and ability showcase on Pokémon detail pages.

## Product Scope

The home experience is a National Pokédex browser:

- Search by Pokémon name.
- Filter by generation and region.
- Surface all mainline generations and current Pokémon species.
- Include regional forms, alternate varieties, and shiny state where PokeAPI provides sprites.
- Show dense but readable cards with type, number, artwork, and form cues.
- Keep loading, empty, and failure states polished.

The detail experience is an encyclopedia dossier:

- Header with number, name, types, species/category copy, and primary artwork.
- Tabs or sections for Overview, Stats, Evolutions, Forms, Abilities, Moves, Locations, and Media.
- Chart.js stat visualization plus readable stat rows.
- Evolution chain derived from species evolution data.
- Forms and regional variants derived from species varieties.
- Shiny and sprite/model toggles.
- Ability entries with descriptions, hidden ability state, and a future slot for generation-specific video/showcase media.

## Architecture

Migrate from Vite to Next.js with TypeScript and the App Router.

Core routes:

- `/` for the encyclopedia browser.
- `/pokemon/[idOrName]` for detail pages.
- `/generation/[generation]` for generation-focused browsing if it remains useful after the home filters.
- `/api/pokemon` route handlers for normalized list/search responses when client components need interactive filtering.
- `/api/pokemon/[idOrName]` route handler for normalized detail payloads and cache-friendly client hydration.

The app should prefer Server Components for initial data and shell rendering, then use client components where interaction is needed: search controls, filters, card hover motion, shiny/model toggles, charts, and Three.js scenes.

TanStack Query remains useful for interactive client-side requests and cache reuse, especially filtered lists and detail transitions. Next.js server fetch should be used for route-level initial data.

## Data Layer

Create a `src/lib/pokemon` domain layer with small focused modules:

- `pokeapi-client.ts`: typed fetch wrapper with cache/revalidation options and error normalization.
- `normalizers.ts`: converts raw PokeAPI resources into app models.
- `generations.ts`: generation and region lookup helpers derived from PokeAPI generation data.
- `species.ts`: species, varieties, flavor text, evolution chain, and genus helpers.
- `media.ts`: sprite, shiny, official artwork, animated sprite, Home artwork, future 3D model, and video fallback resolution.
- `types.ts`: shared app-level types.

PokeAPI is the primary source for species, Pokémon, generations, varieties, abilities, moves, stats, sprites, and evolution chains. Ability videos and universal 3D models are not guaranteed by PokeAPI, so the app needs a media manifest layer that can start empty and provide curated entries over time.

## Visual System

Use the existing PDF/imported design direction as the base: modern, image-led Pokédex UI with strong Pokémon artwork, dark detail surfaces when appropriate, vivid type colors, clean controls, and mobile-first detail composition.

The desktop experience should not become a marketing page. It should feel like a real tool: search and filters are prominent, cards are scannable, detail pages are rich but structured, and tabs/sections make repeat use efficient.

Radii should be controlled and consistent. Cards can be rounded, but avoid nesting cards inside cards. Use type color as accent, not as a one-note full-page palette.

## 3D And Ability Showcase Layer

The first milestone should include the structural slot for 3D/media, even if not every Pokémon has real 3D/video content yet.

Detail pages include a media stage that can render:

- Official artwork or animated sprite fallback.
- A Three.js showcase scene for type/ability energy when no model is available.
- A future model URL when the media manifest provides one.
- Ability showcase cards with game/generation labels and optional video/embed/source metadata.

The UI must clearly handle unavailable media without looking broken.

## Error Handling

Normalize failed PokeAPI requests into user-friendly states:

- List fetch failure: retry affordance and fallback copy.
- Detail not found: clear not-found page with return action.
- Partial media missing: fallback to official artwork, then default sprite, then Poké Ball placeholder.
- Missing species/evolution/ability copy: omit that sub-section or show a compact unavailable state.

## Testing And Verification

Implementation verification should include:

- `npm run build`.
- Type checking if configured.
- Browser verification of home search, generation filter, detail navigation, shiny toggle, forms links, chart rendering, and 3D/media fallback.
- Mobile and desktop viewport checks.
- Visual comparison against the accepted design direction from the PDF/imported screens.

## Deferred Work

Do not build a full database/admin backend in this milestone. Keep the data layer shaped so a database or content manifest can be added later for curated videos, 3D model URLs, game-specific ability clips, and richer location/game availability.
