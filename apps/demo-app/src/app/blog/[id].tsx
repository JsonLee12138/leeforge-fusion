export default function BlogPost() {
  const posts = {
    1: {
      id: 1,
      title: "Getting Started with Leeforge",
      content:
        "Welcome to Leeforge Fusion! This is a demo post showing how server-side data fetching works with dynamic routes.",
      date: "2026-01-15",
    },
    2: {
      id: 2,
      title: "Understanding SSR",
      content:
        "Server-side rendering is a core feature of Leeforge Fusion. It allows you to render your components on the server and hydrate them on the client.",
      date: "2026-01-14",
    },
    3: {
      id: 3,
      title: "Middleware Deep Dive",
      content:
        "Middleware in Leeforge Fusion is built on Hono, providing a powerful way to handle cross-cutting concerns like authentication, logging, and error handling.",
      date: "2026-01-13",
    },
    4: {
      id: 4,
      title: "Server Actions Guide",
      content:
        "Server actions allow you to call server-side functions from your components in a type-safe way, with automatic serialization and error handling.",
      date: "2026-01-12",
    },
  };

  const post = posts[1] || {
    id: 0,
    title: "Not Found",
    content: "Post not found",
    date: "",
  };

  return (
    <div class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <a
          href="/blog"
          class="text-blue-500 hover:text-blue-700 mb-4 inline-block"
        >
          ← Back to Blog
        </a>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
        <p class="text-sm text-gray-500 mb-6">{post.date}</p>
        <div class="prose max-w-none text-gray-700">
          <p>{post.content}</p>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">Comments</h2>
        <div class="space-y-4">
          <div class="bg-gray-50 p-4 rounded">
            <p class="text-sm text-gray-600 mb-2">Great introduction!</p>
            <p class="text-xs text-gray-500">By Alex • 2 hours ago</p>
          </div>
          <div class="bg-gray-50 p-4 rounded">
            <p class="text-sm text-gray-600 mb-2">
              Very helpful, thanks for sharing!
            </p>
            <p class="text-xs text-gray-500">By Jordan • 5 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
