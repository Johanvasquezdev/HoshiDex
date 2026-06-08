
  # HoshiDex

  HoshiDex is a modern Pokédex encyclopedia and maintenance UI. The original design source is available at https://www.figma.com/design/YbOzgioVEQGmvLqI79XANx/Modern-Pokedex-UI.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Supabase connection

  The maintenance screens can use Supabase directly when these variables are set:

  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-or-publishable-key
  ```

  Run the SQL in `supabase/migrations/20260606122000_hoshidex_maintenance.sql`
  in the Supabase SQL Editor, or apply it with the Supabase CLI once installed.
  It creates the `regiones`, `tipos`, `pokemones`, and `pokemon_media_assets`
  tables used by the current CRUD screens and future 3D/video media slots.

  The included RLS policies are permissive for the prototype so the public anon
  key can create, edit, and delete maintenance data. Tighten these policies
  behind authenticated admin users before treating the data as production-safe.

  ## Express/Sequelize backend connection

  The maintenance screens use localStorage by default. For the backend path from
  the original PDF, run the Express/Sequelize API and point the frontend at it:

  ```env
  NEXT_PUBLIC_POKEDEX_BACKEND_URL=http://localhost:4000
  DATABASE_URL=postgresql://postgres.project-ref:password@aws-0-region.pooler.supabase.com:5432/postgres
  BACKEND_PORT=4000
  BACKEND_CORS_ORIGIN=http://localhost:5173
  ```

  Use the Supabase Session pooler connection string from Database settings for
  the local Express backend. Transaction pooler strings on port `6543` are meant
  for temporary/serverless connections and may require prepared statements to be
  disabled.
  The Sequelize backend uses SSL and the existing `public.regiones`,
  `public.tipos`, `public.pokemones`, and `public.pokemon_media_assets` tables.
  Run the SQL migration above first, then start the API:

  ```bash
  npm run backend
  ```

  Optional development bootstrap:

  ```env
  SEQUELIZE_SYNC=true
  SEQUELIZE_SEED=true
  ```

  Keep both disabled once the schema is managed by Supabase migrations.

  The frontend expects these JSON endpoints:

  - `GET/POST /api/pokemones`
  - `PUT/DELETE /api/pokemones/:id`
  - `GET/POST /api/regiones`
  - `PUT/DELETE /api/regiones/:id`
  - `GET/POST /api/tipos`
  - `PUT/DELETE /api/tipos/:id`

  Pokemon records use `name`, `imageUrl`, `regionId`, `primaryTypeId`, and
  `secondaryTypeId`.

  ## PokeAPI protection

  Server-side PokeAPI requests are throttled and cached. Optional tuning:

  ```env
  POKEAPI_MAX_CONCURRENCY=3
  POKEAPI_MIN_INTERVAL_MS=120
  POKEAPI_MAX_RETRIES=2
  ```

  The client retries `429` and transient `5xx` responses with backoff.
  
