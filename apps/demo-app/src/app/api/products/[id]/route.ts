// Mock product data API (same as products route)
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

export async function GET({ request, params }: any) {
  // 模拟 API 延迟
  await new Promise((resolve) => setTimeout(resolve, 200));

  const productId = parseInt(params.id);
  const product = mockProducts.find((p) => p.id === productId);

  if (!product) {
    return Response.json(
      {
        success: false,
        error: "产品未找到",
        productId: productId,
      },
      { status: 404 },
    );
  }

  return Response.json({
    success: true,
    data: product,
    timestamp: new Date().toISOString(),
  });
}

export async function PUT({ request, params }: any) {
  const body = await request.json();
  const productId = parseInt(params.id);

  const productIndex = mockProducts.findIndex((p) => p.id === productId);

  if (productIndex === -1) {
    return Response.json(
      {
        success: false,
        error: "产品未找到",
      },
      { status: 404 },
    );
  }

  // 更新产品
  mockProducts[productIndex] = {
    ...mockProducts[productIndex],
    ...body,
    updatedAt: new Date().toISOString(),
  };

  return Response.json({
    success: true,
    data: mockProducts[productIndex],
    message: "产品更新成功",
  });
}

export async function DELETE({ request, params }: any) {
  const productId = parseInt(params.id);

  const productIndex = mockProducts.findIndex((p) => p.id === productId);

  if (productIndex === -1) {
    return Response.json(
      {
        success: false,
        error: "产品未找到",
      },
      { status: 404 },
    );
  }

  // 删除产品
  const deletedProduct = mockProducts.splice(productIndex, 1)[0];

  return Response.json({
    success: true,
    data: deletedProduct,
    message: "产品删除成功",
  });
}
