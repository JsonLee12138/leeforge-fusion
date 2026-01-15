export default function BlogIndex() {
  const posts = [
    { id: 1, title: "Getting Started with Leeforge", date: "2026-01-15" },
    { id: 2, title: "Understanding SSR", date: "2026-01-14" },
    { id: 3, title: "Middleware Deep Dive", date: "2026-01-13" },
    { id: 4, title: "Server Actions Guide", date: "2026-01-12" },
  ];

  return (
    <div class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Blog Posts</h1>
        <p class="text-gray-600">
          Exploring Leeforge Fusion features and best practices
        </p>
      </div>

      <div class="space-y-4">
        {posts.map((post) => (
          <a
            href={`/blog/${post.id}`}
            class="block bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div class="flex justify-between items-start">
              <div>
                <h2 class="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h2>
                <p class="text-sm text-gray-500">{post.date}</p>
              </div>
              <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Read →
              </span>
            </div>
          </a>
        ))}
      </div>

      <div class="bg-white shadow rounded-lg p-6 text-center">
        <a
          href="/blog/new"
          class="inline-block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold"
        >
          Create New Post
        </a>
      </div>
    </div>
  );
}
