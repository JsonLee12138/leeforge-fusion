export async function GET() {
  return Response.json({
    users: [
      { id: 1, name: "Alice", email: "alice@example.com", role: "admin" },
      { id: 2, name: "Bob", email: "bob@example.com", role: "user" },
      { id: 3, name: "Charlie", email: "charlie@example.com", role: "user" },
    ],
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({
    id: Date.now(),
    ...body,
    createdAt: new Date().toISOString(),
  });
}
