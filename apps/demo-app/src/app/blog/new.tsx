import { createSignal } from "solid-js";

export default function NewPost() {
  const [title, setTitle] = createSignal("");
  const [content, setContent] = createSignal("");
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!title() || !content()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    setTimeout(() => {
      setLoading(false);
      setTitle("");
      setContent("");
      alert("Post created successfully!");
    }, 1000);
  };

  return (
    <div class="max-w-2xl mx-auto">
      <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-6">Create New Post</h1>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title()}
              onInput={(e) => setTitle(e.currentTarget.value)}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter post title"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              value={content()}
              onInput={(e) => setContent(e.currentTarget.value)}
              rows={8}
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Write your content here..."
              required
            />
          </div>

          {error() && (
            <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              Error: {error()}
            </div>
          )}

          <div class="flex justify-end space-x-3">
            <a
              href="/blog"
              class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={loading()}
              class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {loading() ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>

      {title() && (
        <div class="mt-6 bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-3">Preview</h2>
          <div class="border-t pt-4">
            <h3 class="text-lg font-medium text-gray-900 mb-2">{title()}</h3>
            <p class="text-gray-700 whitespace-pre-wrap">{content()}</p>
          </div>
        </div>
      )}
    </div>
  );
}
