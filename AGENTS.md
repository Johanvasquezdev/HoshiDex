# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

HoshiDex is a Next.js 16, React 19, TypeScript Pokemon encyclopedia and maintenance platform. It has two main surfaces:

- Public Pokedex experience for browsing, filtering, comparing, and viewing Pokemon details.
- Maintenance/admin-style screens for managing Pokemon, regions, types, and media assets.

The data model is hybrid: live Pokemon data comes from PokeAPI, while managed catalog and media data can use local demo data, Supabase, or the Express/Postgres backend.

## Repository Layout

- `src/app/` - Next.js App Router pages, layout, providers, and UI components.
- `src/app/components/` - client-facing React components for the Pokedex experience.
- `src/app/utils/` - app-level utility code.
- `src/lib/pokemon/` - Pokemon domain logic, API clients, filters, comparison, media, and normalizers.
- `src/lib/maintenance/` - maintenance data types, seed data, backend client, and local store.
- `src/lib/supabase/` - Supabase client setup.
- `src/styles/` - global CSS, theme, Tailwind entrypoints, and fonts.
- `backend/` - Express, Sequelize, Postgres backend path.
- `supabase/migrations/` - Supabase schema migrations.
- `docs/` - presentation and screenshot assets.
- `guidelines/` - project guidance placeholder.

## Commands

Use npm; the repository has a `package-lock.json`.

- `npm run dev` - start the Next.js dev server on `0.0.0.0:5173`.
- `npm run build` - run the production Next.js build.
- `npm run test` - run Vitest.
- `npm run backend:dev` - run the Express backend in watch mode.
- `npm run backend` - run the Express backend once.
- `npm run backend:sync` - run the backend sync script.

## Coding Conventions

- Use TypeScript with strict mode. Avoid `any` unless there is a narrow, documented reason.
- Prefer existing domain helpers in `src/lib/pokemon/` and `src/lib/maintenance/` over duplicating transformation logic inside components.
- Use the `@/*` path alias for imports from `src`.
- Keep UI components focused on presentation and interaction; keep data normalization, filtering, comparison, and showcase mapping in library modules.
- Preserve the App Router split between server and client components. Add `"use client"` only when state, effects, browser APIs, or client-only libraries require it.
- Keep optional media support resilient. Missing video, model, or external media data should produce a usable fallback state instead of breaking the public detail page.
- Do not introduce unrelated refactors while fixing a targeted issue.

## UI And Styling

- Follow the existing visual system in `src/styles/` and nearby components before adding new patterns.
- Tailwind CSS 4 is available through the existing style setup.
- Use `lucide-react` for general icons when an icon is needed.
- Radix UI primitives are available for accessible controls; prefer existing local usage patterns.
- Keep maintenance screens work-focused and scannable. Avoid marketing-style sections for admin workflows.
- For 3D or media showcase changes, verify fallback, video, and model states when possible.

## Data And Backend Notes

- PokeAPI-backed logic lives under `src/lib/pokemon/`.
- Maintenance data contracts live under `src/lib/maintenance/types.ts` and corresponding backend models/routes.
- When changing maintenance schema behavior, check both `backend/` and `supabase/migrations/`.
- Environment configuration for the backend is centralized in `backend/config/`.
- Do not commit secrets or hard-coded service credentials.

## Testing And Verification

- Run `npm run test` for logic changes when feasible.
- Run `npm run build` for changes that affect routing, data loading, TypeScript contracts, or production rendering.
- For backend changes, also exercise the relevant backend command or route logic where practical.
- If a command cannot be run because dependencies, services, or credentials are unavailable, state that clearly in the final response.

## Agent Workflow

- Read the relevant files before editing; this project has several parallel data paths.
- Keep changes small and scoped to the requested behavior.
- Preserve user changes in the working tree. Do not reset, checkout, or delete unrelated files.
- Prefer adding focused tests for domain logic in `src/lib/` when behavior changes.
- Update README or docs only when behavior, setup, or user-facing capabilities change.
