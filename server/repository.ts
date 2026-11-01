import { neon } from '@neondatabase/serverless';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

type Row = Record<string, unknown>;
let init: Promise<void> | undefined;
let local: import('node:sqlite').DatabaseSync | undefined;
const connection = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const sql = connection ? neon(connection) : null;
export const storage = sql ? 'Neon Postgres' : 'SQLite local';
export async function query(statement: string, values: unknown[] = []): Promise<Row[]> {
  if (sql) {
    // Neon tự tạm dừng khi rảnh; request đầu tiên lúc đang khởi động có thể lỗi mạng, nên thử lại một lần.
    try { return await sql.query(statement, values) as Row[]; }
    catch (error) {
      if (!/fetch failed|ECONNRESET|ETIMEDOUT|terminated|socket/i.test(String((error as Error)?.message))) throw error;
      await new Promise((r) => setTimeout(r, 400));
      return await sql.query(statement, values) as Row[];
    }
  }
  if (process.env.VERCEL) throw new Error('DATABASE_URL chưa được cấu hình');
  if (!local) {
    await mkdir(resolve('.local'), { recursive: true });
    const { DatabaseSync } = await import('node:sqlite');
    local = new DatabaseSync(process.env.CMS_DB_PATH || resolve('.local/cms.sqlite'));
    local.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;');
  }
  const stmt = local.prepare(statement.replace(/\$\d+/g, '?'));
  if (/^\s*(SELECT|WITH)/i.test(statement) || /RETURNING/i.test(statement)) return stmt.all(...values as import('node:sqlite').SQLInputValue[]) as Row[];
  stmt.run(...values as import('node:sqlite').SQLInputValue[]);
  return [];
}
export async function ready() {
  return init ??= (async () => {
    await query('CREATE TABLE IF NOT EXISTS cb_content (id INTEGER PRIMARY KEY, payload TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 1)');
    await query('CREATE TABLE IF NOT EXISTS cb_orders (id TEXT PRIMARY KEY, payload TEXT NOT NULL, created_at TEXT NOT NULL, status TEXT NOT NULL)');
    await query('CREATE TABLE IF NOT EXISTS cb_sessions (token TEXT PRIMARY KEY, expires BIGINT NOT NULL)');
    await query('CREATE TABLE IF NOT EXISTS cb_limits (id TEXT PRIMARY KEY, count INTEGER NOT NULL, expires BIGINT NOT NULL)');
    await query('CREATE TABLE IF NOT EXISTS cb_surveys (id TEXT PRIMARY KEY, payload TEXT NOT NULL, created_at TEXT NOT NULL)');
    const seed = await readFile(resolve('src/data.json'), 'utf8');
    await query('INSERT INTO cb_content (id, payload, revision) VALUES (1, $1, 1) ON CONFLICT(id) DO NOTHING', [seed]);
  })().catch((e) => { init = undefined; throw e; });
}
export async function getContent() {
  await ready();
  const [row] = await query('SELECT payload, revision FROM cb_content WHERE id = 1');
  return { content: JSON.parse(String(row.payload)), revision: Number(row.revision) };
}
export async function limit(key: string, max: number, milliseconds: number) {
  await ready();
  const now = Date.now();
  const [row] = await query('INSERT INTO cb_limits (id, count, expires) VALUES ($1, 1, $2) ON CONFLICT(id) DO UPDATE SET count = CASE WHEN cb_limits.expires < $3 THEN 1 ELSE cb_limits.count + 1 END, expires = CASE WHEN cb_limits.expires < $4 THEN $5 ELSE cb_limits.expires END RETURNING count', [key, now + milliseconds, now, now, now + milliseconds]);
  return Number(row.count) <= max;
}
