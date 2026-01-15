export interface HTMLTemplateOptions {
  appHtml: string;
  dehydratedState: any;
  routerState: any;
  user?: any;
  apiBase?: string;
}

export function generateHTML(options: HTMLTemplateOptions): string {
  const dehydratedStateJson = JSON.stringify(options.dehydratedState);
  const routerStateJson = JSON.stringify(options.routerState);
  const userJson = JSON.stringify(options.user || null);
  const apiBaseJson = JSON.stringify(options.apiBase || "/api");

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Leeforge App</title>
    <meta name="description" content="Leeforge Fusion SSR Application" />
  </head>
  <body>
    <div id="root">${options.appHtml}</div>
    <script>
      window.__DEHYDRATED_STATE__ = ${dehydratedStateJson};
      window.__ROUTER_STATE__ = ${routerStateJson};
      window.__USER__ = ${userJson};
      window.__API_BASE__ = ${apiBaseJson};
    </script>
    <script type="module" src="/src/client/entry.tsx"></script>
  </body>
</html>`;
}
