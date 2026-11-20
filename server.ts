import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { createApi } from './api.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = createApi({ enableFuelUpdates: true, enableMockGuestOrders: process.env.NODE_ENV !== 'production' });

  const injectAbsoluteSocialMeta = (html: string, req: express.Request): string => {
    const proto = String(req.headers['x-forwarded-proto'] || req.protocol || 'https')
      .split(',')[0]
      .trim();
    const host = String(req.headers['x-forwarded-host'] || req.headers.host || '')
      .split(',')[0]
      .trim();
    const origin = process.env.APP_URL
      ? process.env.APP_URL.replace(/\/$/, '')
      : host
      ? `${proto}://${host}`
      : '';
    if (!origin) return html;
    return html
      .replace(/content="\/og-preview\.jpg"/g, `content="${origin}/og-preview.jpg"`)
      .replace(/content="\/"/g, `content="${origin}/"`)
      .replace(/href="\/"/g, `href="${origin}/"`)
      .replace(/"image": "\/og-preview\.jpg"/g, `"image": "${origin}/og-preview.jpg"`)
      .replace(/"logo": "\/favicon-192\.png"/g, `"logo": "${origin}/favicon-192.png"`);
  };

  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.get('/', async (req, res, next) => {
      try {
        const rawHtml = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        const transformed = await vite.transformIndexHtml(req.originalUrl, rawHtml);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(injectAbsoluteSocialMeta(transformed, req));
      } catch (err) {
        next(err);
      }
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath, { maxAge: '7d', index: false }));
    app.get('*', (req, res) => {
      const indexFile = path.join(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        const html = fs.readFileSync(indexFile, 'utf-8');
        res.status(200).set({ 'Content-Type': 'text/html' }).send(injectAbsoluteSocialMeta(html, req));
      } else {
        res.status(404).send('Build not found');
      }
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DANNY PIZZA server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});
