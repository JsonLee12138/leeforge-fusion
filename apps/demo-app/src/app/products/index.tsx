import { createServerData } from "@leeforge/fusion/data";

// Mock product data (模拟后端数据)
const mockProducts = [
  {
    id: 1,
    name: "Leeforge Fusion 框架",
    price: 999,
    description: "现代化的全栈 SSR 框架，基于 Solid.js 构建",
    category: "框架",
  },
  {
    id: 2,
    name: "TypeScript 高级教程",
    price: 299,
    description: "深入学习 TypeScript 的高级特性和最佳实践",
    category: "教程",
  },
  {
    id: 3,
    name: "React 组件库",
    price: 599,
    description: "企业级 React 组件库，包含 50+ 常用组件",
    category: "组件",
  },
  {
    id: 4,
    name: "Node.js 后端服务",
    price: 799,
    description: "高性能 Node.js 后端服务模板，支持微服务架构",
    category: "后端",
  },
  {
    id: 5,
    name: "Vue3 实战项目",
    price: 499,
    description: "基于 Vue3 和 Vite 的完整项目实战教程",
    category: "教程",
  },
  {
    id: 6,
    name: "CSS 框架工具包",
    price: 199,
    description: "现代化的 CSS 工具包，包含动画、布局等常用样式",
    category: "样式",
  },
];

export default function Products() {
  const products = createServerData(async () => {
    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockProducts;
  });

  return (
    <div class="page">
      <h1>📦 产品列表</h1>
      <p style="color: #666; margin-bottom: 2rem;">
        浏览我们的精选产品，所有产品都使用 Mock 数据模拟
      </p>

      {products() ? (
        <div class="product-grid">
          {products()?.map((product: any) => (
            <a href={`/products/${product.id}`} class="product-card">
              <h3>{product.name}</h3>
              <div class="price">¥{product.price}</div>
              <div class="description">{product.description}</div>
              <div style="margin-top: 0.5rem; color: #667eea; font-size: 0.85rem;">
                🏷️ {product.category}
              </div>
            </a>
          ))}
        </div>
      ) : (
        <div class="loading">加载中...</div>
      )}

      <div style="margin-top: 2rem; padding: 1rem; background: #f7fafc; border-radius: 8px;">
        <p style="color: #4a5568;">
          💡 提示：点击任意产品查看详情，体验动态路由和 SSR 数据加载
        </p>
      </div>
    </div>
  );
}

export const loader = async () => {
  return {
    title: "产品列表",
    count: mockProducts.length,
  };
};

export const guards = [];
