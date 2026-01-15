import { Hono } from "hono";
import type { APIRoute } from "./types";

export class APIRegistry {
  private app: Hono;

  constructor() {
    this.app = new Hono();
  }

  async register(routes: APIRoute[]): Promise<Hono> {
    for (const route of routes) {
      try {
        const module = await import(route.file);

        if (module.default) {
          this.app.route(route.path, module.default);
        }
      } catch (error) {
        console.error(`Failed to register API route ${route.path}:`, error);
        throw error;
      }
    }
    return this.app;
  }

  getApp(): Hono {
    return this.app;
  }
}
