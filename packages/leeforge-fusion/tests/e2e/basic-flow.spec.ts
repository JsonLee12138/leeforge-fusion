import { test, expect } from "@playwright/test";

test.describe("基本用户流程", () => {
  test("访问首页", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Leeforge/);
    await expect(page.locator("h1")).toContainText(/Welcome|Home/i);
  });

  test("导航到文章列表", async ({ page }) => {
    await page.goto("/");

    const postsLink = page.locator("a[href='/posts']");
    await expect(postsLink).toBeVisible();
    await postsLink.click();

    await expect(page).toHaveURL(/\/posts$/);
  });

  test("查看文章详情", async ({ page }) => {
    await page.goto("/posts");

    const postLink = page.locator("a[href*='/posts/']").first();
    await expect(postLink).toBeVisible();
    await postLink.click();

    await expect(page).toHaveURL(/\/posts\/\d+$/);
  });

  test("访问受保护页面", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/login$/);
  });

  test("表单提交", async ({ page }) => {
    await page.goto("/posts");

    const createButton = page
      .locator("button, a")
      .filter({ hasText: /create|new/i });
    if (await createButton.isVisible()) {
      await createButton.click();

      await page.fill('input[name="title"]', "Test Post");
      await page.fill('textarea[name="content"]', "Test Content");

      const submitButton = page.locator("button[type='submit']");
      await submitButton.click();

      await expect(page.locator(".success, .notification")).toBeVisible();
    }
  });
});

test.describe("API 测试", () => {
  test("GET /api/posts", async ({ request }) => {
    const response = await request.get("/api/posts");
    expect(response.ok()).toBeTruthy();

    const posts = await response.json();
    expect(Array.isArray(posts)).toBeTruthy();
  });

  test("POST /api/posts", async ({ request }) => {
    const response = await request.post("/api/posts", {
      data: { title: "New Post", content: "Content" },
    });

    expect(response.status()).toBe(201);

    const post = await response.json();
    expect(post.title).toBe("New Post");
  });
});

test.describe("性能测试", () => {
  test("页面加载时间", async ({ page }) => {
    const start = Date.now();
    await page.goto("/");
    const loadTime = Date.now() - start;

    expect(loadTime).toBeLessThan(2000);
  });

  test("SSR 渲染", async ({ page }) => {
    await page.goto("/");

    const body = await page.textContent("body");
    expect(body).toBeTruthy();
    expect((body || "").length).toBeGreaterThan(0);
  });
});
