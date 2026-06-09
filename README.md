# HoshiDex

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=0f172a)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-ready-3FCF8E?style=for-the-badge&logo=supabase&logoColor=0f172a)
![Three.js](https://img.shields.io/badge/Three.js-media_showcase-111827?style=for-the-badge&logo=threedotjs)
![Vitest](https://img.shields.io/badge/Vitest-tested-6E9F18?style=for-the-badge&logo=vitest&logoColor=white)

## English

### What It Is

HoshiDex is a modern Pokemon encyclopedia and maintenance platform. It combines a polished public Pokedex experience with admin-ready catalog tools for managing Pokemon, regions, types, and media assets.

The project is built to feel like a real product rather than a static demo: users can browse Pokemon, inspect detailed profiles, compare entries, filter by advanced traits, and view ability showcases that can use real video or 3D model assets.

A project presentation is available here: [docs/HoshiDex_Project_Presentation.pptx](docs/HoshiDex_Project_Presentation.pptx).

### What It Does

- Presents a modern Pokedex interface for discovering Pokemon.
- Shows detailed Pokemon pages with stats, abilities, forms, evolution data, and media.
- Supports advanced filters and comparison workflows.
- Provides maintenance screens for managed catalog data.
- Lets selected Pokemon display real ability media through video or 3D model assets.
- Keeps the public encyclopedia experience resilient even when optional media data is unavailable.
- Supports local demo usage, Supabase-backed persistence, or an Express/Postgres backend path.

### What It Has

- Public Pokemon browsing experience.
- Pokemon detail pages with rich visual sections.
- Managed catalog home for system-created Pokemon.
- Maintenance UI for Pokemon, regions, types, and media assets.
- Ability showcase component with placeholder, video, and 3D model states.
- Backend-ready data plumbing for managed content.
- Supabase migration for the maintenance schema.
- Test coverage for core Pokemon logic and media showcase mapping.
- Screenshot slots under `docs/screenshots/` for future README and presentation visuals.

### Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS.
- UI and interaction: lucide-react, Radix UI components, responsive app shell.
- Data: PokeAPI, TanStack Query, Supabase client.
- Backend: Express, Sequelize, Postgres.
- Media and 3D: Three.js, React Three Fiber, Drei.
- Testing: Vitest.
- Tooling: Next.js build pipeline, TypeScript, Node.js.

### Project Guide

HoshiDex is organized around two product surfaces.

The public surface is the encyclopedia experience. It focuses on exploration, detail, comparison, filtering, and visual presentation.

The maintenance surface is the administration experience. It focuses on managing system-owned catalog data and attaching media assets that can enrich the public Pokemon detail pages.

The data model is intentionally hybrid. Live Pokemon data comes from PokeAPI, while managed content can live locally during demos or persist through Supabase or an Express-backed Postgres workflow. This keeps the app flexible for portfolio review, classroom demos, and future production hardening.

The media asset workflow is the most important extension point. It allows HoshiDex to move beyond placeholder visuals by attaching real video or model assets to selected Pokemon and, optionally, specific abilities.

### Roadmap Ideas

- Add authenticated admin access for all maintenance screens.
- Add file upload and storage support for media assets.
- Add stronger source and provenance checks for video and model URLs.
- Improve server-side joins for richer Pokemon detail responses.
- Add more polished empty states for missing media.
- Add CI for tests, type checks, and production builds.
- Add deployment documentation and environment-specific setup notes.
- Expand screenshot coverage for the README and project presentation.

---

## Español

### Qué Es

HoshiDex es una enciclopedia Pokemon moderna con una plataforma de mantenimiento integrada. Combina una experiencia pública tipo Pokedex con herramientas administrativas para gestionar Pokemon, regiones, tipos y recursos multimedia.

El proyecto está pensado para sentirse como un producto real, no como una demo estática: los usuarios pueden explorar Pokemon, revisar perfiles detallados, comparar entradas, filtrar por características avanzadas y ver showcases de habilidades con videos o modelos 3D reales.

La presentación del proyecto está disponible aquí: [docs/HoshiDex_Project_Presentation.pptx](docs/HoshiDex_Project_Presentation.pptx).

### Qué Hace

- Presenta una interfaz moderna para descubrir Pokemon.
- Muestra páginas de detalle con estadísticas, habilidades, formas, evolución y contenido visual.
- Soporta filtros avanzados y flujos de comparación.
- Incluye pantallas de mantenimiento para datos administrados.
- Permite mostrar videos o modelos 3D reales en el showcase de habilidades.
- Mantiene estable la experiencia pública incluso si los datos multimedia opcionales no están disponibles.
- Puede funcionar como demo local, con persistencia en Supabase o con backend Express/Postgres.

### Qué Tiene

- Experiencia pública para explorar Pokemon.
- Páginas de detalle con secciones visuales completas.
- Catálogo administrado para Pokemon creados en el sistema.
- Mantenimiento para Pokemon, regiones, tipos y assets multimedia.
- Componente de showcase de habilidades con estados de placeholder, video y modelo 3D.
- Data plumbing listo para backend.
- Migración de Supabase para el esquema de mantenimiento.
- Pruebas para lógica central de Pokemon y mapeo de media assets.
- Espacios reservados para screenshots en `docs/screenshots/`.

### Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS.
- UI e interacción: lucide-react, componentes Radix UI, app shell responsive.
- Datos: PokeAPI, TanStack Query, cliente de Supabase.
- Backend: Express, Sequelize, Postgres.
- Media y 3D: Three.js, React Three Fiber, Drei.
- Testing: Vitest.
- Tooling: pipeline de build de Next.js, TypeScript, Node.js.

### Guía Del Proyecto

HoshiDex está organizado alrededor de dos superficies principales.

La superficie pública es la experiencia de enciclopedia. Está enfocada en exploración, detalle, comparación, filtros y presentación visual.

La superficie de mantenimiento es la experiencia administrativa. Está enfocada en gestionar datos propios del sistema y asociar assets multimedia que enriquecen las páginas públicas de detalle.

El modelo de datos es híbrido por diseño. Los datos vivos de Pokemon vienen de PokeAPI, mientras que el contenido administrado puede vivir localmente para demos o persistirse con Supabase o con un flujo Express/Postgres. Esto permite que el proyecto sea flexible para portafolio, demos y futuros pasos hacia producción.

El flujo de media assets es el punto de extensión más importante. Permite que HoshiDex pase de placeholders visuales a videos o modelos reales asociados a Pokemon específicos y, opcionalmente, a habilidades concretas.

### Ideas Para Roadmap

- Agregar autenticación para las pantallas administrativas.
- Agregar soporte de upload y storage para assets multimedia.
- Fortalecer validaciones de fuente y procedencia para videos y modelos.
- Mejorar joins del lado del servidor para respuestas de detalle más completas.
- Agregar estados vacíos más pulidos cuando falte media.
- Agregar CI para pruebas, type checks y builds de producción.
- Agregar documentación de despliegue y configuración por ambiente.
- Ampliar la cobertura de screenshots para el README y la presentación.
