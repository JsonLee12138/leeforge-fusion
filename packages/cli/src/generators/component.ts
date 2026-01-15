import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

export async function generateComponent(name: string, options: any) {
  const componentsDir = "components";
  const componentPath = join(componentsDir, ...name.split("/").filter(Boolean));

  if (!existsSync(componentPath)) {
    mkdirSync(componentPath, { recursive: true });
  }

  const componentName = name.split("/").pop();
  const componentFile = join(componentPath, `${componentName}.tsx`);
  const content = `import { createSignal } from "solid-js";

export interface ${componentName}Props {
  label?: string;
}

export default function ${componentName}(props: ${componentName}Props) {
  const [count, setCount] = createSignal(0);

  return (
    <div class="component">
      <h3>{props.label || "${componentName}"}</h3>
      <p>Count: {count()}</p>
      <button onClick={() => setCount(c => c + 1)}>Click me</button>
    </div>
  );
}
`;

  if (options.dryRun) {
    console.log(`Would create: ${componentFile}`);
    console.log(content);
  } else {
    writeFileSync(componentFile, content);
    console.log(`Created: ${componentFile}`);
  }
}
