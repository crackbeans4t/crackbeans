import fs from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const read = async name => JSON.parse(await fs.readFile(new URL(`source/${name}.json`,root),'utf8'));
const home=await read('home'), shop=await read('shop'), products=await read('products'), about=await read('about'), blog=await read('blog'), articles=await read('articles');
const images=[...home.images,...shop.images,...about.images,...blog.images,...products.flatMap(p=>p.images)];
const manifest=[];const names=new Map();
for(const image of images){
 if(!image.src?.startsWith('https://static.wixstatic.com/media/'))continue;
 const url=image.src.split('/v1/')[0],name=url.split('/').pop();
 if(names.has(name))continue;
 const response=await fetch(url);if(!response.ok)throw new Error(`${response.status} ${url}`);
 await fs.writeFile(new URL(`public/assets/${name}`,root),Buffer.from(await response.arrayBuffer()));
 names.set(name,true);manifest.push({file:`/assets/${name}`,url,alt:image.alt});
}
const local=img=>img?.src?'/assets/'+img.src.split('/v1/')[0].split('/').pop():'';
const prices=[120000,110000,140000,130000,160000,190000];
const slugs=['robusta-clean-daklak','robusta-clean-rang-bo','robusta-honey-99','robusta-se','arabica-dark-roast-s18','specialty-nui-min'];
const data=products.map((p,i)=>({id:slugs[i],name:p.name,price:prices[i],category:i<4?'Robusta':'Arabica',description:p.text.split('Mua ngay')[1]?.split('LIÊN KẾT NHANH')[0].trim()||'',images:shop.images.filter(x=>x.src&&/Túi zip|Bảng hướng dẫn/.test(x.alt)).slice((5-i)*2,(5-i)*2+2).map(x=>({src:local(x),alt:x.alt})),source:p.url}));
const regions=['ĐẮK LẮK','CẦU ĐẤT','NÚI MIN'].map((name,i)=>({name,text:home.text.slice(home.text.lastIndexOf(name+'\n')+name.length+1).trim().split('\n\n')[0]||'',image:local(home.images[i+7])}));
const output={products:data,assets:{logo:local(home.images[0]),hero:local(home.images[1]),seed:local(home.images[6]),regions:home.images.slice(7,10).map(local),about:local(about.images[1]),values:about.images.slice(2,5).map(local),shop:local(shop.images[1])},regions,articles:articles.map((a,i)=>({id:i===0?'pha-phin':'sau-dong-ca-phe',title:a.title,text:a.text,image:local(blog.images[i+1])}))};
await fs.writeFile(new URL('src/data.json',root),JSON.stringify(output,null,2));
await fs.writeFile(new URL('source/assets-manifest.json',root),JSON.stringify(manifest,null,2));
console.log(`Imported ${data.length} products, ${manifest.length} local assets.`);
