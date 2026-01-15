export default function Admin() {
  const data = {
    users: 1234,
    posts: 567,
    reports: 12,
    pending: 5,
  };

  return (
    <div class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6 border-l-4 border-red-500">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
        <p class="text-gray-600">Administrator access required</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4 text-red-600">
            User Management
          </h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span>Total Users</span>
              <span class="font-bold">{data.users}</span>
            </div>
            <div class="flex justify-between">
              <span>Pending Approvals</span>
              <span class="font-bold text-orange-500">{data.pending}</span>
            </div>
            <button class="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Manage Users
            </button>
          </div>
        </div>

        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold mb-4 text-red-600">
            Content Moderation
          </h2>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span>Total Posts</span>
              <span class="font-bold">{data.posts}</span>
            </div>
            <div class="flex justify-between">
              <span>Reports</span>
              <span class="font-bold text-orange-500">{data.reports}</span>
            </div>
            <button class="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Review Reports
            </button>
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-4 text-red-600">System Controls</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button class="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
            Backup DB
          </button>
          <button class="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
            Clear Logs
          </button>
          <button class="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
            Restart API
          </button>
          <button class="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
            View Metrics
          </button>
        </div>
      </div>

      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 class="font-semibold text-red-800 mb-2">⚠️ Restricted Area</h3>
        <p class="text-red-700 text-sm">
          You are viewing the admin panel. All actions are logged and monitored.
          Ensure you have proper authorization before making changes.
        </p>
      </div>
    </div>
  );
}
