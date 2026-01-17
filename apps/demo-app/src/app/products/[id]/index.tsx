import { createServerData } from "@leeforge/fusion/data";
import { Route } from "@tanstack/solid-router";

// Mock product data (same as products page)
const mockProducts = [
  {
    id: 1,
    name: "Leeforge Fusion 框架",
    price: 999,
    description: "现代化的全栈 SSR 框架，基于 Solid.js 构建",
    category: "框架",
    features: ["文件-based 路由", "SSR 支持", "中间件系统", "类型安全"],
  },
  {
    id: 2,
    name: "TypeScript 高级教程",
    price: 299,
    description: "深入学习 TypeScript 的高级特性和最佳实践",
    category: "教程",
    features: ["泛型详解", "类型体操", "高级类型", "实战项目"],
  },
  {
    id: 3,
    name: "React 组件库",
    price: 599,
    description: "企业级 React 组件库，包含 50+ 常用组件",
    category: "组件",
    features: ["50+ 组件", "主题定制", "响应式设计", "TypeScript 支持"],
  },
  {
    id: 4,
    name: "Node.js 后端服务",
    price: 799,
    description: "高性能 Node.js 后端服务模板，支持微服务架构",
    category: "后端",
    features: ["微服务架构", "RESTful API", "数据库集成", "认证授权"],
  },
  {
    id: 5,
    name: "Vue3 实战项目",
    price: 499,
    description: "基于 Vue3 和 Vite 的完整项目实战教程",
    category: "教程",
    features: ["Vue3 新特性", "Composition API", "Vite 构建", "Pinia 状态管理"],
  },
  {
    id: 6,
    name: "CSS 框架工具包",
    price: 199,
    description: "现代化的 CSS 工具包，包含动画、布局等常用样式",
    category: "样式",
    features: ["CSS 变量", "动画库", "响应式布局", "暗黑模式"],
  },
];

export default function ProductDetail() {
  const { id } = Route.useParams();

  const product = createServerData(async ({ params }) => {
    // 模拟 API 延迟
    await new Promise((resolve) => setTimeout(resolve, 200));

    // 查找产品
    const foundProduct = mockProducts.find((p) => p.id === parseInt(params.id));

    if (!foundProduct) {
      throw new Error("产品未找到");
    }

    return foundProduct;
  });

  return (
    <div class="page">
      {product() ? (
        <>
          <a
            href="/products"
            class="btn"
            style="background: #718096; margin-bottom: 1rem;"
          >
            ← 返回产品列表
          </a>

          <h1>{product()?.name}</h1>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2rem;">
            <div>
              <div style="background: #f7fafc; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                <h3 style="color: #2d3748; margin-bottom: 0.5rem;">价格</h3>
                <div class="price" style="font-size: 2rem;">
                  ¥{product()?.price}
                </div>
              </div>

              <div style="background: #f7fafc; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem;">
                <h3 style="color: #2d3748; margin-bottom: 0.5rem;">分类</h3>
                <p style="color: #4a5568;">🏷️ {product()?.category}</p>
              </div>

              <div style="background: #f7fafc; padding: 1.5rem; border-radius: 8px;">
                <h3 style="color: #2d3748; margin-bottom: 0.5rem;">描述</h3>
                <p style="color: #4a5568; line-height: 1.6;">
                  {product()?.description}
                </p>
              </div>
            </div>

            <div>
              <div style="background: #f7fafc; padding: 1.5rem; border-radius: 8px;">
                <h3 style="color: #2d3748; margin-bottom: 1rem;">
                  ✨ 功能特性
                </h3>
                <ul style="list-style: none; padding: 0;">
                  {product()?.features.map((feature: string) => (
                    <li style="padding: 0.5rem 0; color: #4a5568; border-bottom: 1px solid #e2e8f0;">
                      ✅ {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div style="margin-top: 1rem;">
                <button class="btn" style="width: 100%;">
                  立即购买
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div class="loading">加载中...</div>
      )}
    </div>
  );
}

export const loader = async ({ params }) => {
  return {
    title: `产品详情 - ${params.id}`,
    productId: params.id,
  };
};

export const guards = [];
