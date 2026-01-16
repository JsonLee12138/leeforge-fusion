export async function GET() {
  return Response.json({
    posts: [
      { id: 1, title: "Getting Started", author: "Alice" },
      { id: 2, title: "Advanced Topics", author: "Bob" },
      { id: 3, title: "Best Practices", author: "Charlie" },
    ],
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  return Response.json({
    id: Date.now(),
    ...body,
    status: "published",
  });
}
