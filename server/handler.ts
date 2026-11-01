import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { getContent, query, ready, limit, storage } from './repository.ts';
import { contentSchema, orderSchema } from './validation.ts';
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
async function body(req: IncomingMessage) {
  let text = ''; for await (const chunk of req) { text += chunk; if (Buffer.byteLength(text) > 1000000) throw new Error('Nội dung quá lớn'); }
  return JSON.parse(text || '{}');
}
function send(res: ServerResponse, code: number, data: unknown) { res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options':'nosniff' }); res.end(JSON.stringify(data)); }
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const path = (url.searchParams.has('route')?`/api/${url.searchParams.get('route')}`:url.pathname).replace(/\/$/, '');
    const method = req.method || 'GET';
    // Mutations are same-origin only, including login and public order requests.
    if (!['GET','HEAD'].includes(method)) {
      const origin = req.headers.origin;
      if (!origin || new URL(origin).host !== req.headers.host) return send(res, 403, { error: 'Nguồn yêu cầu không hợp lệ' });
      if (!req.headers['content-type']?.startsWith('application/json')) return send(res, 415, { error: 'Yêu cầu JSON' });
    }
    if (path === '/api/content' && method === 'GET') { const data = await getContent(); return send(res, 200, data); }
    await ready();
    const token = req.headers.cookie?.split(';').map(v => v.trim()).find(v => v.startsWith('cb_admin='))?.slice(9) || '';
    const authenticated = token && (await query('SELECT expires FROM cb_sessions WHERE token = $1 AND expires > $2', [hash(token), Date.now()])).length > 0;
    if (path === '/api/session' && method === 'GET') return send(res, 200, { authenticated: !!authenticated, storage, configured: !!process.env.ADMIN_PASSWORD_HASH });
    if (path === '/api/login' && method === 'POST') {
      const ip = process.env.VERCEL ? String(req.headers['x-forwarded-for'] || '').split(',')[0] : req.socket.remoteAddress || 'local';
      if (!await limit(`login:${ip}`, 10, 15 * 60000)) return send(res, 429, { error: 'Thử quá nhiều lần. Chờ 15 phút.' });
      const { password } = await body(req);
      const stored = process.env.ADMIN_PASSWORD_HASH;
      if (!stored) return send(res, 503, { error: 'Chưa cấu hình tài khoản quản trị. Xem docs/CMS.md.' });
      const [salt, value] = stored.split(':');
      const computed = scryptSync(typeof password === 'string' && password.length < 200 ? password : '', salt, 64);
      const expected = Buffer.from(value || '', 'hex');
      if (expected.length !== computed.length || !timingSafeEqual(expected, computed)) return send(res, 401, { error: 'Mật khẩu không đúng' });
      const session = randomBytes(32).toString('hex');
      await query('DELETE FROM cb_sessions WHERE expires < $1', [Date.now()]);
      await query('INSERT INTO cb_sessions (token, expires) VALUES ($1, $2)', [hash(session), Date.now() + 8 * 3600000]);
      res.setHeader('Set-Cookie', `cb_admin=${session}; Path=/api; HttpOnly; SameSite=Strict; Max-Age=28800${process.env.VERCEL ? '; Secure' : ''}`);
      return send(res, 200, { authenticated: true });
    }
    if (path === '/api/logout' && method === 'POST') {
      await query('DELETE FROM cb_sessions WHERE token = $1', [hash(token)]);
      res.setHeader('Set-Cookie','cb_admin=; Path=/api; HttpOnly; SameSite=Strict; Max-Age=0');
      return send(res, 200, { ok: true });
    }
    if (path === '/api/orders' && method === 'POST') {
      const parsed = orderSchema.safeParse(await body(req));
      if (!parsed.success) return send(res, 400, { error: 'Kiểm tra tên, số điện thoại, địa chỉ và sản phẩm.' });
      const input = parsed.data;
      const [existing] = await query('SELECT id FROM cb_orders WHERE id = $1', [input.key]);
      if (existing) return send(res, 200, { id: input.key, status: 'pending' });
      const ip = req.socket.remoteAddress || 'local';
      if (!await limit(`orders:${ip}`, 8, 3600000)) return send(res, 429, { error: 'Đã gửi nhiều yêu cầu. Vui lòng liên hệ cửa hàng.' });
      const { content } = await getContent();
      const lines = input.lines.map(line => {
        const p = content.products.find((p: {id:string}) => p.id === line.id);
        if (!p) throw new Error('Sản phẩm không còn trong catalogue');
        return { ...line, name: p.name, price: p.price * (line.size === "500g" ? 2 : 1) };
      });
      const order = { ...input, lines, subtotal: lines.reduce((n, l) => n + l.price * l.quantity, 0), shipping: null, payment: 'cod' };
      await query('INSERT INTO cb_orders (id, payload, created_at, status) VALUES ($1,$2,$3,$4) ON CONFLICT(id) DO NOTHING', [input.key, JSON.stringify(order), new Date().toISOString(), 'pending']);
      return send(res, 201, { id: input.key, status: 'pending', subtotal: order.subtotal });
    }
    if (!authenticated) return send(res, 401, { error: 'Vui lòng đăng nhập' });
    if (path === '/api/admin/content' && method === 'PUT') {
      const input = await body(req), parsed = contentSchema.safeParse(input.content);
      if (!parsed.success || !Number.isInteger(input.revision)) return send(res, 400, { error: parsed.error?.issues[0]?.message || 'Thiếu revision' });
      const rows = await query('UPDATE cb_content SET payload = $1, revision = revision + 1 WHERE id = 1 AND revision = $2 RETURNING revision', [JSON.stringify(parsed.data), input.revision]);
      if (!rows.length) return send(res, 409, { error: 'Dữ liệu đã đổi ở phiên khác. Tải lại trước khi sửa.' });
      return send(res, 200, { revision: Number(rows[0].revision) });
    }
    if (path === '/api/admin/orders' && method === 'GET') {
      const rows = await query('SELECT id, payload, status, created_at FROM cb_orders ORDER BY created_at DESC LIMIT 200');
      return send(res, 200, rows.map(row => ({ ...JSON.parse(String(row.payload)), status: row.status, createdAt: row.created_at })));
    }
    if (path.startsWith('/api/admin/orders/') && method === 'PATCH') {
      const { status } = await body(req);
      if (!['pending','confirmed','shipping','completed','cancelled'].includes(status)) return send(res, 400, { error: 'Trạng thái không hợp lệ' });
      const rows = await query('UPDATE cb_orders SET status = $1 WHERE id = $2 RETURNING id', [status, path.split('/').at(-1)]);
      return send(res, rows.length ? 200 : 404, rows.length ? { ok: true } : { error: 'Không tìm thấy đơn' });
    }
    send(res, 404, { error: 'Không tìm thấy API' });
  } catch (error) {
    const bad = error instanceof SyntaxError;
    send(res, bad ? 400 : 503, { error: bad ? 'JSON không hợp lệ' : 'Dịch vụ chưa sẵn sàng. Thử lại hoặc liên hệ cửa hàng.' });
  }
}
