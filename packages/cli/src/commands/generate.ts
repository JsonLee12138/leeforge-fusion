export async function generateCommand(
  type: "page" | "api" | "component",
  name: string,
  options: any,
) {
  const generators = {
    page: () => import("../generators/page").then((m) => m.generatePage),
    api: () => import("../generators/api").then((m) => m.generateAPI),
    component: () =>
      import("../generators/component").then((m) => m.generateComponent),
  };

  if (!generators[type as keyof typeof generators]) {
    console.error(`Unknown type: ${type}`);
    console.error("Valid types: page, api, component");
    process.exit(1);
  }

  const generator = await generators[type as keyof typeof generators]();
  await generator(name, options);
}
