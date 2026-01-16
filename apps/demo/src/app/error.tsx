export default function ErrorBoundary() {
  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="bg-white shadow rounded-lg p-8 max-w-md text-center">
        <div class="text-6xl mb-4">⚠️</div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h1>
        <p class="text-gray-600 mb-6">
          An unexpected error occurred. Please try refreshing the page.
        </p>
        <a
          href="/"
          class="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
