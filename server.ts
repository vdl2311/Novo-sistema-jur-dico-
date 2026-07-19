import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import app from './api/server-source';

async function startServer() {
  const PORT = 3000;

  // Integrate Vite dev server middleware in development
  if (process.env.NODE_ENV !== 'production') {
    console.log('[Backend] Running in DEVELOPMENT mode. Mounting Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('[Backend] Running in PRODUCTION mode. Serving compiled static files...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Backend] Full-stack Express + Vite server running on http://localhost:${PORT}`);
  });
}

startServer();
