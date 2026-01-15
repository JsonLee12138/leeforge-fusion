import { hydrateApp } from "./hydration";

if (typeof window !== "undefined") {
  hydrateApp();
}
