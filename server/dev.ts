import { createServer } from 'node:http';
try { process.loadEnvFile('.env.local'); } catch { /* Environment can also be supplied by the host. */ }
const { default: handler } = await import('./handler.ts');
createServer(handler).listen(8787, '127.0.0.1', () => console.log('CMS API: http://127.0.0.1:8787'));
