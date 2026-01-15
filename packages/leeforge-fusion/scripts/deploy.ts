import { existsSync, writeFileSync } from "fs";
import { join } from "path";

export interface DeployOptions {
  outputDir?: string;
  port?: number;
  nodeVersion?: string;
}

export function generateDockerfile(options: DeployOptions = {}): string {
  const port = options.port || 3000;
  const nodeVersion = options.nodeVersion || "20";

  return `FROM node:${nodeVersion}-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --omit=dev
COPY dist ./dist
RUN addgroup -g 1001 -S nodejs && adduser -S leeforge -u 1001
RUN chown -R leeforge:nodejs /app
USER leeforge
EXPOSE ${port}
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD node -e "require('http').get('http://localhost:${port}/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
CMD ["node", "dist/server/prod-server.js"]
`;
}

export function generateDockerCompose(options: DeployOptions = {}): string {
  const port = options.port || 3000;

  return `version: '3.8'
services:
  leeforge:
    build: .
    ports:
      - "${port}:${port}"
    environment:
      - NODE_ENV=production
      - PORT=${port}
    restart: unless-stopped
`;
}

export function generateEnvExample(): string {
  return `NODE_ENV=production
PORT=3000
API_BASE_URL=http://localhost:3000/api
`;
}

export async function checkProductionBuild(distDir?: string): Promise<boolean> {
  const defaultDistDir = distDir || join(process.cwd(), "dist");
  
  if (!existsSync(defaultDistDir)) {
    console.error("❌ dist directory not found");
    return false;
  }

  const requiredFiles = [
    join(defaultDistDir, "client", "index.html"),
    join(defaultDistDir, "server", "routes.js"),
  ];

  for (const file of requiredFiles) {
    if (!existsSync(file)) {
      console.error(`❌ Missing required file: ${file}`);
      return false;
    }
  }

  console.log("✅ Production build validation passed");
  return true;
}

export function createDeployPackage(outputDir?: string): void {
  const dir = outputDir || join(process.cwd(), "deploy");
  
  if (!existsSync(dir)) {
    require('fs').mkdirSync(dir, { recursive: true });
  }

  writeFileSync(join(dir, "Dockerfile"), generateDockerfile());
  writeFileSync(join(dir, "docker-compose.yml"), generateDockerCompose());
  writeFileSync(join(dir, ".env.example"), generateEnvExample());
  
  require('fs').chmodSync(join(dir, "deploy.sh"), 0o755);

  console.log(`✅ Deployment files created in ${dir}`);
}
