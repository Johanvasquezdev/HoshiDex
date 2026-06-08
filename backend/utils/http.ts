import type { Response } from "express";

export function sendNotFound(response: Response, label: string) {
  return response.status(404).json({ error: `${label} not found` });
}

export function sendError(response: Response, error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected backend error";
  const status = message.toLowerCase().includes("not found") ? 404 : 500;

  return response.status(status).json({ error: message });
}
