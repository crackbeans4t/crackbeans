import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const data=JSON.parse(await fs.readFile(new URL('../src/data.json',import.meta.url),'utf8'));
assert.equal(data.products.length,6);
assert.equal(new Set(data.products.map(p=>p.id)).size,6);
for(const p of data.products){assert.ok(p.price>0);assert.equal(p.images.length,2);assert.ok(p.description.length>40);for(const img of p.images)await fs.access(new URL('../public'+img.src,import.meta.url));}
for(const r of data.regions){assert.ok(r.text.length>150);assert.ok(!r.text.includes('₫'));}
assert.equal(data.articles.length,2);
console.log('Catalog: 6 unique products, 12 product images, prices, descriptions, 3 regions, 2 articles verified.');
