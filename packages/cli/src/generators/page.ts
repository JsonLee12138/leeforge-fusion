import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

export async function generatePage(name: string, options: any) {
  const appDir = "app";
  const pagePath = join(appDir, ...name.split("/").filter(Boolean));

  if (!existsSync(pagePath)) {
    mkdirSync(pagePath, { recursive: true });
  }

  const pageFile = join(pagePath, "index.tsx");
  const content = `import { createSignal } from "solid-js";
import { createServerData } from "@leeforge/fusion/data";

export default function Page() {
  const [count, setCount] = createSignal(0);
  const data = createServerData(async ({ params, queryClient }) => {
    return { message: "Hello from ${name}" };
  });

  return (
    <div>
      <h1>${name}</h1>
      <p>Count: {count()}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
      <p>Data: {data()?.message}</p>
    </div>
  );
}

export const loader = async ({ queryClient, params }) => {
  return { message: "Hello from ${name}" };
};

export const guards = [];
`;

  if (options.dryRun) {
    console.log(`Would create: ${pageFile}`);
    console.log(content);
  } else {
    writeFileSync(pageFile, content);
    console.log(`Created: ${pageFile}`);
  }
}
