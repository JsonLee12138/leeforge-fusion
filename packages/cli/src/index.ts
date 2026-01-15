#!/usr/bin/env node
import { Command } from "commander";

export const program = new Command()
  .name("leeforge")
  .version("1.0.0")
  .description("Modern full-stack framework for SolidJS");

program
  .command("dev")
  .description("Start development server")
  .option("-p, --port <number>", "Port number", "3000")
  .action(async (options) => {
    const { devCommand } = await import("./commands/dev");
    await devCommand({ port: parseInt(options.port) });
  });

program
  .command("build")
  .description("Build for production")
  .action(async () => {
    const { buildCommand } = await import("./commands/build");
    await buildCommand();
  });

program
  .command("generate")
  .alias("g")
  .description("Generate code (page, api, component)")
  .argument("<type>", "Type to generate: page, api, component")
  .argument("<name>", "Name of the item")
  .option("--dry-run", "Show what would be generated")
  .action(async (type, name, options) => {
    const { generateCommand } = await import("./commands/generate");
    await generateCommand(type, name, options);
  });

program.parse();
