import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

export async function generateAPI(name: string, options: any) {
  const apiDir = "app/api";
  const apiPath = join(apiDir, ...name.split("/").filter(Boolean));

  if (!existsSync(apiPath)) {
    mkdirSync(apiPath, { recursive: true });
  }

  const apiFile = join(apiPath, "route.ts");
  const content = `export async function GET({ request, params }) {
  return Response.json({ message: "GET ${name}" });
}

export async function POST({ request, params }) {
  const body = await request.json();
  return Response.json({ message: "POST ${name}", data: body });
}
`;

  if (options.dryRun) {
    console.log(`Would create: ${apiFile}`);
    console.log(content);
  } else {
    writeFileSync(apiFile, content);
    console.log(`Created: ${apiFile}`);
  }
}
