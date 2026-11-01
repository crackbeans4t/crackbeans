import type { ImgHTMLAttributes } from 'react';
export default function Image({src,sizes='(min-width: 1200px) 600px, (min-width: 701px) 50vw, 100vw',...props}:ImgHTMLAttributes<HTMLImageElement>){
  const responsive=typeof src==='string'&&src.startsWith('/assets/')&&src.endsWith('.webp');
  return <img {...props} src={src} sizes={responsive?sizes:undefined} srcSet={responsive?[360,720,1200].map(w=>`${src.replace('.webp',`-${w}w.webp`)} ${w}w`).join(', '):undefined} decoding="async"/>;
}
