import { readdir,readFile,writeFile,mkdir } from 'node:fs/promises';
import sharp from 'sharp';
await mkdir('.local/image-originals',{recursive:true});
let saved=0;
for(const filename of await readdir('public/assets')){
  if(!filename.endsWith('.webp')||/-\d+w\.webp$/.test(filename))continue;
  const file=`public/assets/${filename}`,buffer=await readFile(file);
  try{await writeFile(`.local/image-originals/${filename}`,buffer,{flag:'wx'});}catch{}
  const original=await readFile(`.local/image-originals/${filename}`);
  for(const width of [360,720,1200])await sharp(original).resize({width,withoutEnlargement:true}).webp({quality:62,effort:5}).toFile(file.replace('.webp',`-${width}w.webp`));
  const next=await sharp(original).resize({width:1440,withoutEnlargement:true}).webp({quality:66,effort:5}).toBuffer();
  await writeFile(file,next);saved+=original.length-next.length;
}
console.log(`Base images reduced by ${Math.round(saved/1024)} KiB; 360/720/1200 responsive variants generated.`);
