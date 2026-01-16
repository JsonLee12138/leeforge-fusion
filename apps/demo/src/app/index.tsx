import { createSignal } from "solid-js";

export default function Home() {
  const [count, setCount] = createSignal(0);

  return (
    <div class="space-y-6">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Leeforge Fusion
        </h1>
        <p class="text-xl text-gray-600">
          A modern full-stack framework for Solid.js
        </p>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-2xl font-semibold mb-4">Interactive Counter</h2>
        <div class="flex items-center justify-center space-x-4">
          <button
            onClick={() => setCount((c) => c - 1)}
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            -
          </button>
          <span class="text-3xl font-mono">{count()}</span>
          <button
            onClick={() => setCount((c) => c + 1)}
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            +
          </button>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-2xl font-semibold mb-4">Quick Links</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <a
            href="/about"
            class="px-4 py-2 bg-blue-500 text-white rounded text-center hover:bg-blue-600"
          >
            About
          </a>
          <a
            href="/blog"
            class="px-4 py-2 bg-green-500 text-white rounded text-center hover:bg-green-600"
          >
            Blog
          </a>
          <a
            href="/dashboard"
            class="px-4 py-2 bg-purple-500 text-white rounded text-center hover:bg-purple-600"
          >
            Dashboard
          </a>
          <a
            href="/admin"
            class="px-4 py-2 bg-red-500 text-white rounded text-center hover:bg-red-600"
          >
            Admin
          </a>
        </div>
      </div>
    </div>
  );
}
