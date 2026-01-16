import { JSX } from "solid-js";

export interface LayoutProps {
  children: JSX.Element;
}

export default function Layout(props: LayoutProps) {
  return (
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow-sm">
        <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16">
            <div class="flex items-center">
              <a href="/" class="text-xl font-bold text-gray-900">
                Demo App
              </a>
            </div>
            <div class="flex items-center space-x-4">
              <a href="/" class="text-gray-600 hover:text-gray-900">
                Home
              </a>
              <a href="/about" class="text-gray-600 hover:text-gray-900">
                About
              </a>
              <a href="/blog" class="text-gray-600 hover:text-gray-900">
                Blog
              </a>
              <a href="/dashboard" class="text-gray-600 hover:text-gray-900">
                Dashboard
              </a>
              <a href="/admin" class="text-gray-600 hover:text-gray-900">
                Admin
              </a>
            </div>
          </div>
        </nav>
      </header>
      <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {props.children}
      </main>
      <footer class="bg-white border-t mt-12">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p class="text-center text-gray-500 text-sm">
            © 2026 Leeforge Fusion Demo App
          </p>
        </div>
      </footer>
    </div>
  );
}
