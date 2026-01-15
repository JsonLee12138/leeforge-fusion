import { glob } from "glob";
import { readFileSync } from "fs";
import { join, relative } from "path";
import type { APIRoute, HTTPMethod } from "./types";

export class APIScanner {
  private apiDir: string;

  constructor(apiDir: string) {
    this.apiDir = apiDir;
  }

  async scan(): Promise<APIRoute[]> {
    const pattern = join(this.apiDir, "**", "route.ts");
    const files = await glob(pattern);

    return Promise.all(
      files.map(async (file) => ({
        path: this.parsePath(file),
        file,
        methods: await this.extractMethods(file),
      })),
    );
  }

  private parsePath(file: string): string {
    const relativePath = relative(this.apiDir, file);
    const dirPath = relativePath.replace(/\/route\.ts$/, "");

    let path =
      "/" +
      dirPath
        .split("/")
        .filter(Boolean)
        .map((part) => {
          const match = part.match(/^\[(.+)\]$/);
          return match ? `:${match[1]}` : part;
        })
        .join("/");

    if (path === "/.") {
      path = "/";
    }

    return path;
  }

  private async extractMethods(file: string): Promise<HTTPMethod[]> {
    const content = readFileSync(file, "utf-8");
    const methods: HTTPMethod[] = [];

    const directExports = content.match(
      /export\s+(?:async\s+)?function\s+(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/g,
    );
    if (directExports) {
      directExports.forEach((match) => {
        const method = match.match(
          /function\s+(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/,
        )?.[1] as HTTPMethod;
        if (method && !methods.includes(method)) {
          methods.push(method);
        }
      });
    }

    const appCalls = content.match(
      /app\.(get|post|put|delete|patch|head|options)\(/g,
    );
    if (appCalls) {
      appCalls.forEach((match) => {
        const method = match.match(
          /app\.(get|post|put|delete|patch|head|options)\(/,
        )?.[1] as HTTPMethod;
        if (method && !methods.includes(method)) {
          methods.push(method);
        }
      });
    }

    return methods.sort();
  }
}
