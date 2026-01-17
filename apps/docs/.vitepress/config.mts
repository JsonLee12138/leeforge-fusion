import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Leeforge Fusion",
  description:
    "A server-side rendering (SSR) framework similar to Next.js, developed using the Vite + SolidJS + Tanstack ecosystem.",
  base: "/leeforge/",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Quick Start", link: "/quick-start" },
      { text: "Core Concepts", link: "/core-concepts" },
      { text: "CLI", link: "/cli" },
      { text: "API", link: "/api" },
      { text: "Examples", link: "/examples" },
    ],

    sidebar: [
      {
        text: "Getting Started",
        items: [
          { text: "Introduction", link: "/" },
          { text: "Quick Start", link: "/quick-start" },
        ],
      },
      {
        text: "Core Concepts",
        items: [
          {
            text: "File-Based Routing",
            link: "/core-concepts#file-based-routing",
          },
          { text: "Layouts", link: "/core-concepts#layouts" },
          { text: "Error Boundaries", link: "/core-concepts#error-boundaries" },
          { text: "Loading States", link: "/core-concepts#loading-states" },
          { text: "Data Loading", link: "/core-concepts#data-loading" },
          { text: "Middleware", link: "/core-concepts#middleware" },
          { text: "Route Guards", link: "/core-concepts#route-guards" },
          { text: "Server Actions", link: "/core-concepts#server-actions" },
          { text: "API Routes", link: "/core-concepts#api-routes" },
        ],
      },
      {
        text: "CLI Reference",
        items: [
          { text: "Overview", link: "/cli" },
          { text: "Commands", link: "/cli#commands" },
          { text: "Generated Code", link: "/cli#generated-code" },
        ],
      },
      {
        text: "API Reference",
        items: [
          { text: "Overview", link: "/api" },
          { text: "Core Exports", link: "/api#core-exports" },
          { text: "Middleware Functions", link: "/api#middleware-functions" },
          { text: "Types", link: "/api#types" },
        ],
      },
      {
        text: "Examples",
        items: [
          { text: "Overview", link: "/examples" },
          { text: "Blog Application", link: "/examples#blog-application" },
          { text: "Todo Application", link: "/examples#todo-application" },
          {
            text: "Authentication Flow",
            link: "/examples#authentication-flow",
          },
        ],
      },
    ],

    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/JsonLee12138/leeforge-fusion",
      },
    ],
  },
});
