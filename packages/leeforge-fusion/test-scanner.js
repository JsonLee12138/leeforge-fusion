import { RouteScanner } from "./src/router/scanner.js";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function testScanner() {
  console.log("Testing Route Scanner...");

  const scanner = new RouteScanner({
    appDir: join(__dirname, "test-app", "app"),
  });

  try {
    const result = await scanner.scan();

    console.log("\n=== Routes Found ===");
    console.log(JSON.stringify(result.routes, null, 2));

    console.log("\n=== Conflicts ===");
    console.log(result.conflicts);

    console.log("\n=== Test Passed! ===");
  } catch (error) {
    console.error("Test Failed:", error);
    process.exit(1);
  }
}

testScanner();
