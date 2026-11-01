import { readFile,writeFile } from 'node:fs/promises';
const base='https://crackbeans.vercel.app';
const access=await readFile('.local/admin-access.md','utf8');
const password=access.match(/Mật khẩu: (.+)/)?.[1];
const login=await fetch(`${base}/api/login`,{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({password})});
const cookie=login.headers.get('set-cookie')?.split(';')[0];
console.log('Admin login:',login.status);
if(!login.ok){console.log(await login.text());process.exit(1);}
const response=await fetch(`${base}/api/admin/orders`,{headers:{Cookie:cookie}});
console.log('Protected orders:',response.status);
const orders=await response.json();console.log('Order count:',orders.length);
const session=await fetch(`${base}/api/session`,{headers:{Cookie:cookie}});console.log('Session authenticated:',(await session.json()).authenticated);
await fetch(`${base}/api/logout`,{method:'POST',headers:{Origin:base,'Content-Type':'application/json',Cookie:cookie},body:'{}'});
await writeFile('.local/live-api-check.json',JSON.stringify({login:login.status,orders:response.status,orderCount:orders.length,checked:new Date().toISOString()},null,2));
