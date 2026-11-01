import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { render } from '../.local/ssr/entry-server.js';
const data=JSON.parse(await readFile('src/data.json','utf8'));
const template=await readFile('dist/index.html','utf8');
const routes=['/','/san-pham','/ve-chung-toi','/blog','/lien-he',...data.products.map(p=>`/san-pham/${p.id}`),...data.articles.map(p=>`/blog/${p.id}`),...['giao-hang','doi-tra','bao-mat','dieu-khoan'].map(p=>`/chinh-sach/${p}`)];
for(const route of [...routes,'/thanh-toan','/admin']){
  const rendered=render(route);
  const heads=rendered.match(/<title>[\s\S]*?<\/title>|<meta[^>]*>|<link[^>]*rel="canonical"[^>]*>/g)||[];
  let body=rendered;for(const head of heads)body=body.replace(head,'');
  const html=template.replace('</head>',heads.join('')+'</head>').replace('<div id="root"></div>',`<div id="root">${body}</div>`);
  const directory=route==='/'?'dist':`dist${route}`;await mkdir(directory,{recursive:true});await writeFile(`${directory}/index.html`,html);
}
const origin='https://crackbeans.vercel.app';
await writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(p=>`<url><loc>${origin}${p}</loc></url>`).join('')}</urlset>`);
await writeFile('dist/robots.txt',`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /thanh-toan\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`);
console.log(`Pre-rendered ${routes.length} public routes + noindex checkout/admin.`);
