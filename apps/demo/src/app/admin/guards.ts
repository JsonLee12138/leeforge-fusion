export const requireAuth = async (ctx: any, next: () => Promise<void>) => {
  const token = ctx.req?.header?.("Authorization");

  if (!token) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await validateToken(token);
  ctx.set("user", user);

  await next();
};

export const requireAdmin = async (ctx: any, next: () => Promise<void>) => {
  const user = ctx.get("user");

  if (!user || user.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  await next();
};

async function validateToken(token: string) {
  return { id: "1", role: "admin", name: "Admin User" };
}
