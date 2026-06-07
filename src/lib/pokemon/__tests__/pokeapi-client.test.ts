import { describe, expect, it } from "vitest";
import { createRequestLimiter, isRetryablePokeApiError } from "../pokeapi-client";

describe("pokeapi client", () => {
  it("limits concurrent requests", async () => {
    const limit = createRequestLimiter(2);
    let active = 0;
    let maxActive = 0;

    await Promise.all(
      Array.from({ length: 6 }, () =>
        limit(async () => {
          active += 1;
          maxActive = Math.max(maxActive, active);
          await new Promise((resolve) => setTimeout(resolve, 5));
          active -= 1;
          return true;
        }),
      ),
    );

    expect(maxActive).toBeLessThanOrEqual(2);
  });

  it("paces request starts by a minimum interval", async () => {
    const limit = createRequestLimiter(1, { minIntervalMs: 10 });
    const starts: number[] = [];

    await Promise.all(
      Array.from({ length: 3 }, () =>
        limit(async () => {
          starts.push(Date.now());
          return true;
        }),
      ),
    );

    expect(starts[1] - starts[0]).toBeGreaterThanOrEqual(8);
    expect(starts[2] - starts[1]).toBeGreaterThanOrEqual(8);
  });

  it("retries rate limits and transient server errors only", () => {
    expect(isRetryablePokeApiError(429)).toBe(true);
    expect(isRetryablePokeApiError(503)).toBe(true);
    expect(isRetryablePokeApiError(404)).toBe(false);
  });
});
