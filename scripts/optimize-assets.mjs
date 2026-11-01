import fs from 'node:fs/promises';
import sharp from 'sharp';
const root=new URL('../',import.meta.url);
const path=new URL('src/data.json',root);
let json=await fs.readFile(path,'utf8');
const files=[...new Set([...json.matchAll(/\/assets\/[^"\s]+/g)].map(m=>m[0]))];
let before=0,after=0;
for(const file of files){const input=new URL('public'+file,root),output=file.replace(/\.(jpe?g|png)$/i,'.webp');
 const source=await fs.readFile(input);before+=source.length;
 const buffer=await sharp(source).resize({width:1600,withoutEnlargement:true}).webp({quality:84}).toBuffer();
 await fs.writeFile(new URL('public'+output,root),buffer);after+=buffer.length;json=json.split(file).join(output);
}
await fs.writeFile(path,json);await fs.writeFile(new URL('source/optimization.json',root),JSON.stringify({before,after,files:files.length},null,2));
console.log(`${files.length} assets: ${Math.round(before/1024)} KB → ${Math.round(after/1024)} KB`);
