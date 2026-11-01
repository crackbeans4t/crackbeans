import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { randomBytes,scryptSync,randomUUID } from 'node:crypto';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
test('CMS/COD integration: isolated SQLite, no production mutation',async(t)=>{
  process.env.DATABASE_URL='';process.env.POSTGRES_URL='';delete process.env.VERCEL;
  process.env.CMS_DB_PATH=join(await mkdtemp(join(tmpdir(),'cb-api-')),'test.sqlite');
  const password='test-only-password-2026',salt=randomBytes(16).toString('hex');
  process.env.ADMIN_PASSWORD_HASH=`${salt}:${scryptSync(password,salt,64).toString('hex')}`;
  const {default:handler}=await import('./handler.ts');
  const server=createServer(handler);await new Promise<void>(resolve=>server.listen(0,'127.0.0.1',resolve));
  const address=server.address();assert.ok(address&&typeof address==='object');const base=`http://127.0.0.1:${address.port}`;
  async function request(path:string,method='GET',payload?:unknown,cookie=''){
    return fetch(base+path,{method,headers:{Origin:base,...(payload?{'Content-Type':'application/json'}:{}),...(cookie?{Cookie:cookie}:{})},body:payload?JSON.stringify(payload):undefined});
  }
  try{
    await t.test('protected CMS rejects anonymous writes',async()=>{assert.equal((await request('/api/admin/content','PUT',{content:{},revision:1})).status,401);});
    await t.test('cross-origin mutations rejected',async()=>{assert.equal((await fetch(base+'/api/login',{method:'POST',headers:{Origin:'https://invalid.example','Content-Type':'application/json'},body:'{}'})).status,403);});
    await t.test('wrong password rejected',async()=>{assert.equal((await request('/api/login','POST',{password:'incorrect'})).status,401);});
    const login=await request('/api/login','POST',{password});assert.equal(login.status,200);const cookie=login.headers.get('set-cookie')!.split(';')[0];
    const original=await(await request('/api/content')).json();
    await t.test('negative prices rejected',async()=>{const content=structuredClone(original.content);content.products[0].price=-1;assert.equal((await request('/api/admin/content','PUT',{content,revision:original.revision},cookie)).status,400);});
    await t.test('CMS revision prevents overwriting concurrent saves',async()=>{assert.equal((await request('/api/admin/content','PUT',{content:original.content,revision:original.revision},cookie)).status,200);assert.equal((await request('/api/admin/content','PUT',{content:original.content,revision:original.revision},cookie)).status,409);});
    await t.test('COD price computed server-side; replay creates one request',async()=>{const key=randomUUID(),payload={key,name:'Khách kiểm thử',phone:'0900000000',address:'Địa chỉ giả lập để kiểm thử phần mềm',note:'TEST LOCAL ONLY',consent:true,lines:[{id:original.content.products[0].id,grind:'Hạt',quantity:2,price:1}]};const first=await request('/api/orders','POST',payload);assert.equal(first.status,201);const result=await first.json();assert.equal(result.subtotal,original.content.products[0].price*2);assert.equal((await request('/api/orders','POST',payload)).status,200);const orders=await(await request('/api/admin/orders','GET',undefined,cookie)).json();assert.equal(orders.length,1);assert.equal(orders[0].status,'pending');assert.equal(orders[0].shipping,null);assert.equal((await request(`/api/admin/orders/${key}`,'PATCH',{status:'confirmed'},cookie)).status,200);});
    await t.test('logout invalidates session',async()=>{assert.equal((await request('/api/logout','POST',{},cookie)).status,200);assert.equal((await request('/api/admin/orders','GET',undefined,cookie)).status,401);});
  }finally{server.closeAllConnections();await new Promise<void>(resolve=>server.close(()=>resolve()));}
});
