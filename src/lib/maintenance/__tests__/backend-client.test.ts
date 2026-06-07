import { describe, expect, it } from "vitest";
import { hasMaintenanceBackend } from "../backend-client";

describe("maintenance backend client", () => {
  it("does not require a backend URL for local-first development", () => {
    expect(hasMaintenanceBackend()).toBe(false);
  });
});

