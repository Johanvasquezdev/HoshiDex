const POKEAPI_BASE_URL = "https://pokeapi.co/api/v2";
const POKEAPI_CONCURRENCY = Number(process.env.POKEAPI_MAX_CONCURRENCY ?? 3);
const POKEAPI_MIN_INTERVAL_MS = Number(process.env.POKEAPI_MIN_INTERVAL_MS ?? 120);
const POKEAPI_MAX_RETRIES = Number(process.env.POKEAPI_MAX_RETRIES ?? 2);
let devDispatcher: unknown;
const responseCache = new Map<string, Promise<unknown>>();

export class PokeApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "PokeApiError";
  }
}

export function createRequestLimiter(
  maxConcurrent: number,
  options?: { minIntervalMs?: number },
) {
  let active = 0;
  let lastStartTime = 0;
  let timer: ReturnType<typeof setTimeout> | null = null;
  const queue: (() => void)[] = [];
  const minIntervalMs = Math.max(0, options?.minIntervalMs ?? 0);

  function runNext() {
    if (timer) return;
    if (active >= maxConcurrent) return;
    const next = queue.shift();
    if (!next) return;

    const now = Date.now();
    const waitMs = Math.max(0, lastStartTime + minIntervalMs - now);

    timer = setTimeout(() => {
      timer = null;
      active += 1;
      lastStartTime = Date.now();
      next();
      runNext();
    }, waitMs);
  }

  return function limit<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      queue.push(() => {
        task()
          .then(resolve, reject)
          .finally(() => {
            active -= 1;
            runNext();
          });
      });
      runNext();
    });
  };
}

const limitPokeApiRequest = createRequestLimiter(POKEAPI_CONCURRENCY, {
  minIntervalMs: POKEAPI_MIN_INTERVAL_MS,
});

export async function pokeApiFetch<T>(
  pathOrUrl: string,
  init?: RequestInit & { next?: { revalidate?: number } },
): Promise<T> {
  const url = pathOrUrl.startsWith("http")
    ? pathOrUrl
    : `${POKEAPI_BASE_URL}${pathOrUrl}`;
  const method = init?.method ?? "GET";
  const cacheKey = method === "GET" ? url : null;

  if (cacheKey && responseCache.has(cacheKey)) {
    return responseCache.get(cacheKey) as Promise<T>;
  }

  const requestPromise = limitPokeApiRequest(() =>
    retryPokeApiFetch(() => performPokeApiFetch<T>(url, init)),
  );
  if (cacheKey) responseCache.set(cacheKey, requestPromise);

  try {
    return await requestPromise;
  } catch (error) {
    if (cacheKey) responseCache.delete(cacheKey);
    throw error;
  }
}

export function isRetryablePokeApiError(status?: number) {
  return status === 429 || (typeof status === "number" && status >= 500 && status <= 599);
}

async function retryPokeApiFetch<T>(task: () => Promise<T>): Promise<T> {
  let attempt = 0;

  while (true) {
    try {
      return await task();
    } catch (error) {
      const status = error instanceof PokeApiError ? error.status : undefined;
      if (attempt >= POKEAPI_MAX_RETRIES || !isRetryablePokeApiError(status)) {
        throw error;
      }

      await wait(250 * 2 ** attempt);
      attempt += 1;
    }
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function performPokeApiFetch<T>(
  url: string,
  init?: RequestInit & { next?: { revalidate?: number } },
): Promise<T> {
  if (typeof window === "undefined" && process.env.VERCEL !== "1") {
    const { Agent, request } = await import("undici");
    devDispatcher ??= new Agent({ connect: { rejectUnauthorized: false } });
    const response = await request(url, {
      dispatcher: devDispatcher as InstanceType<typeof Agent>,
      method: init?.method ?? "GET",
    });

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw new PokeApiError(`PokeAPI request failed for ${url}`, response.statusCode);
    }

    return response.body.json() as Promise<T>;
  }

  const requestInit = {
    ...init,
    next: init?.next ?? { revalidate: 60 * 60 * 24 },
  };

  const response = await fetch(url, requestInit);

  if (!response.ok) {
    throw new PokeApiError(`PokeAPI request failed for ${url}`, response.status);
  }

  return response.json() as Promise<T>;
}

export function extractIdFromUrl(url: string): number {
  const id = url.split("/").filter(Boolean).pop();
  return id ? Number(id) : 0;
}
