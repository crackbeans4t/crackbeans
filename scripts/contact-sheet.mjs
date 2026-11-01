import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
const source=process.argv[2],output=process.argv[3];
const files=(await fs.readdir(source)).filter(f=>/\.(jpe?g|png)$/i.test(f));
const columns=4,w=300,h=280,composite=[];
for(let i=0;i<files.length;i++){
 const thumb=await sharp(path.join(source,files[i])).resize({width:w-16,height:h-42,fit:'inside'}).flatten({background:'#f5eedf'}).png().toBuffer();
 const meta=await sharp(thumb).metadata();let x=(i%columns)*w,y=Math.floor(i/columns)*h;
 composite.push({input:thumb,left:x+Math.floor((w-meta.width)/2),top:y});
 const safe=files[i].replaceAll('&','&amp;').replaceAll('<','&lt;');
 composite.push({input:Buffer.from(`<svg width="300" height="36"><rect width="300" height="36" fill="#fff"/><text x="8" y="23" font-size="13" fill="#222">${safe}</text></svg>`),left:x,top:y+h-36});
}
await sharp({create:{width:columns*w,height:Math.ceil(files.length/columns)*h,channels:3,background:'#eee'}}).composite(composite).jpeg({quality:90}).toFile(output);
