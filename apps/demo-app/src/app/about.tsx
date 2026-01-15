export default function About() {
  return (
    <div class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">
          About Leeforge Fusion
        </h1>
        <p class="text-gray-700 mb-4">
          Leeforge Fusion is a modern full-stack framework built on Solid.js
          that provides file-based routing, server-side rendering, middleware,
          and server actions.
        </p>
        <p class="text-gray-700 mb-4">
          This demo application showcases the key features of the framework.
        </p>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-2xl font-semibold mb-4">Technology Stack</h2>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <h3 class="font-semibold text-gray-900">Frontend</h3>
            <ul class="text-gray-700 mt-2 space-y-1">
              <li>Solid.js 1.9</li>
              <li>TanStack Router</li>
              <li>TanStack Query</li>
            </ul>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">Backend</h3>
            <ul class="text-gray-700 mt-2 space-y-1">
              <li>Hono Middleware</li>
              <li>Express Server</li>
              <li>Vite Build Tool</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
