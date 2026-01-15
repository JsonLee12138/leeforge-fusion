export async function render(url: string) {
  return `<!DOCTYPE html>
<html>
  <head>
    <title>Leeforge Fusion Demo</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { font-family: system-ui; margin: 0; background: #f5f5f5; }
    </style>
  </head>
  <body>
    <div id="root">Demo App</div>
  </body>
</html>`;
}
