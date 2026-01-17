import { JSX } from "solid-js";

export interface LayoutProps {
  children: JSX.Element;
}

export default function Layout(props: LayoutProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Leeforge Fusion Demo - 全栈 SSR 应用</title>
        <link rel="stylesheet" href="/src/styles/global.css" />
      </head>
      <body>
        <div class="min-h-screen">
          <header class="header">
            <nav class="nav">
              <a href="/" class="nav-link">
                首页
              </a>
              <a href="/about" class="nav-link">
                关于
              </a>
              <a href="/products" class="nav-link">
                产品
              </a>
              <a href="/contact" class="nav-link">
                联系
              </a>
            </nav>
          </header>
          <main class="main-content">{props.children}</main>
          <footer class="footer">
            <p>© 2025 Leeforge Fusion Demo - 使用 SSR 构建的全栈应用</p>
          </footer>
        </div>
      </body>
    </html>
  );
}
