# HoshiDex Hybrid Ultimate: Advanced Filters and Compare Mode

## Goal

Transform the HoshiDex home experience from a modern card gallery into a game-loyal encyclopedia console. The next build should add advanced filtering and compare mode while shifting the visual language toward a Hybrid Ultimate Pokédex: classic red device identity, dark analysis panels, compact HOME-like data density, and modern dashboard polish.

## Visual Direction

The home screen becomes an in-game Pokédex workstation.

- Left rail: device-style navigation with region/generation shortcuts, maintenance links, and collection/compare entry points.
- Center scanner grid: compact Pokémon entries with dex number, artwork/sprite, type chips, compare action, and quick metadata.
- Right analysis panel: sticky filters on desktop, collapsible drawer on mobile.
- Bottom compare tray: appears when 1 or more Pokémon are selected and expands into a full compare view.
- Palette: red shell surfaces, near-black display panels, white metadata cards, type accent colors, subtle scanline/grid textures, restrained glass highlights.
- Typography: compact labels and readable stat text; no oversized marketing hero.

## Advanced Filters

Filters should combine with the existing search, generation, sort, and variant controls.

Initial filter set:

- Type: multi-select from Pokémon types.
- Ability: text search against ability names.
- Generation/region: keep existing generation dropdown, visually promoted into the device rail/filter panel.
- Variant/form: shiny-capable, regional, mega, special forms.
- Stat ranges: HP, Attack, Defense, Special Attack, Special Defense, Speed.
- Physical ranges: height and weight.
- Species flags: legendary, mythical, baby when species data is available.

The first implementation may fetch additional details only for the visible page to protect PokeAPI. Filters requiring details that are not available in the list endpoint should be applied after detail fetch and clearly reflected in totals as "visible matches" until a richer cache/index is added.

Active filters appear as chips with single-clear controls and a "clear all" action.

## Compare Mode

Cards gain a compare action separate from the card link. Selecting a Pokémon adds it to a compare tray.

Rules:

- Minimum useful compare: 2 Pokémon.
- Maximum compare: 4 Pokémon.
- Selecting an already-selected Pokémon removes it.
- The tray persists while browsing the current page session.
- Compare state is local only in this slice; Supabase collection saving comes later.

Compare view:

- Radar chart overlay using Chart.js.
- Side-by-side summary columns with image, dex number, generation, region, types, abilities, height, and weight.
- Type matchup summary once weakness data is available.
- Shiny/media preview slot using existing media fields.

## Data Flow

Current `/api/pokemon` remains the main list source.

Changes:

- Extend list query params to accept filters: `types`, `ability`, `minHp`, `maxHp`, `heightMin`, `heightMax`, etc.
- Normalize visible Pokémon details with enough fields for filtering and comparison.
- Add a `compare` client state module or hook so card/grid/tray components do not become tangled.
- Keep PokeAPI throttling and fallback cards intact.

## Components

New or changed components:

- `AdvancedFilterPanel`: device-style filter controls, active chips, clear actions.
- `CompareToggle`: icon button on each card.
- `CompareTray`: bottom or right-side selected Pokémon strip.
- `CompareDrawer` or `/compare`: expanded compare experience.
- `PokemonCard`: denser in-game entry style, with compare action and status indicators.
- `PokedexClient`: orchestration only; push filter and compare logic into helpers/hooks.

## Error Handling

- If detail filtering causes some card fetches to fail, keep the existing per-card fallback behavior.
- Compare view should show unavailable stats/media as explicit empty states, not broken panels.
- If filters produce zero results, show a device-style "no scan matches" state with clear filters action.

## Testing

Unit tests:

- Filter serialization and compatibility.
- Compare selection rules: max 4, toggle remove, no duplicates.
- API filter helper logic for numeric ranges and multi-select filters.

Build checks:

- `vitest run`
- `next build`

Browser verification:

- Desktop: filter panel, card grid, compare tray, expanded compare.
- Mobile: collapsible filters, no text overlap, compare tray remains usable.

## Figma Target

Create a Figma screen named `HoshiDex / Hybrid Ultimate Console`.

The screen should show:

- 1440px desktop frame.
- Red device shell around a dark app surface.
- Left rail with region/generation nav.
- Main scanner grid with 6-9 compact Pokémon cards.
- Right advanced filter panel.
- Bottom compare tray with 3 selected Pokémon.
- One expanded compare panel or modal state beside/below the main screen.

The design should stay loyal to in-game Pokédex cues without copying any official game UI exactly.
