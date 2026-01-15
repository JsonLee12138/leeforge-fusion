export default function Dashboard() {
  const stats = {
    totalUsers: 1234,
    activeSessions: 456,
    postsToday: 23,
    serverUptime: "99.9%",
  };

  return (
    <div class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p class="text-gray-600">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white shadow rounded-lg p-6 border-l-4 border-blue-500">
          <div class="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
          <div class="text-gray-600 mt-1">Total Users</div>
        </div>
        <div class="bg-white shadow rounded-lg p-6 border-l-4 border-green-500">
          <div class="text-2xl font-bold text-gray-900">
            {stats.activeSessions}
          </div>
          <div class="text-gray-600 mt-1">Active Sessions</div>
        </div>
        <div class="bg-white shadow rounded-lg p-6 border-l-4 border-purple-500">
          <div class="text-2xl font-bold text-gray-900">{stats.postsToday}</div>
          <div class="text-gray-600 mt-1">Posts Today</div>
        </div>
        <div class="bg-white shadow rounded-lg p-6 border-l-4 border-orange-500">
          <div class="text-2xl font-bold text-gray-900">
            {stats.serverUptime}
          </div>
          <div class="text-gray-600 mt-1">Server Uptime</div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Recent Activity</h2>
          <div class="space-y-3">
            <div class="flex justify-between items-center border-b pb-2">
              <span>New user registration</span>
              <span class="text-sm text-gray-500">2 min ago</span>
            </div>
            <div class="flex justify-between items-center border-b pb-2">
              <span>Post published</span>
              <span class="text-sm text-gray-500">15 min ago</span>
            </div>
            <div class="flex justify-between items-center border-b pb-2">
              <span>Server backup completed</span>
              <span class="text-sm text-gray-500">1 hour ago</span>
            </div>
            <div class="flex justify-between items-center">
              <span>System update installed</span>
              <span class="text-sm text-gray-500">3 hours ago</span>
            </div>
          </div>
        </div>

        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
          <div class="space-y-3">
            <a
              href="/blog/new"
              class="block w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-center"
            >
              Create New Post
            </a>
            <a
              href="/admin/users"
              class="block w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-center"
            >
              Manage Users
            </a>
            <a
              href="/admin/settings"
              class="block w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-center"
            >
              System Settings
            </a>
            <button class="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Clear Cache
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4">System Status</h2>
        <div class="space-y-2">
          <div class="flex justify-between">
            <span>API Server</span>
            <span class="text-green-500 font-semibold">✓ Online</span>
          </div>
          <div class="flex justify-between">
            <span>Database</span>
            <span class="text-green-500 font-semibold">✓ Connected</span>
          </div>
          <div class="flex justify-between">
            <span>Cache</span>
            <span class="text-green-500 font-semibold">✓ Active</span>
          </div>
          <div class="flex justify-between">
            <span>CDN</span>
            <span class="text-green-500 font-semibold">✓ Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}
