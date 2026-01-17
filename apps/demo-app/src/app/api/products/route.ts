// Mock product data API
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

export async function GET({ request, params }: any) {
  // 模拟 API 延迟
  await new Promise((resolve) => setTimeout(resolve, 100));

  return Response.json({
    success: true,
    data: mockProducts,
    count: mockProducts.length,
    timestamp: new Date().toISOString(),
  });
}

export async function POST({ request }: any) {
  const body = await request.json();

  // 模拟创建新产品
  const newProduct = {
    id: mockProducts.length + 1,
    ...body,
    createdAt: new Date().toISOString(),
  };

  mockProducts.push(newProduct);

  return Response.json({
    success: true,
    data: newProduct,
    message: "产品创建成功",
  });
}
