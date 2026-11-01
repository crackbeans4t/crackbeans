import { useLocation } from 'react-router-dom';
import { useContent, type Content } from './content';
import { formatWeight, minPrice, variantsOf } from './catalog';
export const SITE_URL='https://crackbeans.vercel.app';
// Từ khóa chính mỗi trang nằm trong title, meta description và H1 (xem reports/SEO-REACT.md).
const descriptions:Record<string,[string,string]>={
  '/':['Cà phê rang mộc nguyên bản Robusta, Arabica | Crack Beans','Crack Beans – cà phê rang mộc Việt Nam: 6 dòng Robusta, Arabica từ Đắk Lắk, Cầu Đất, Núi Min. Chọn hạt hoặc bột 250 g, 500 g, đặt hàng COD.'],
  '/san-pham':['Mua cà phê rang mộc Robusta & Arabica | Crack Beans','Mua cà phê rang mộc Crack Beans: 4 dòng Robusta, 2 dòng Arabica, giá từ {min}/250 g. Chọn hạt hoặc bột, thanh toán khi nhận hàng.'],
  '/ve-chung-toi':['Về Crack Beans – Thương hiệu cà phê rang mộc Việt','Câu chuyện Crack Beans: thương hiệu cà phê rang mộc Việt, minh bạch vùng nguyên liệu, tối giản trong thiết kế và giữ hương vị nguyên bản mỗi mẻ rang.'],
  '/blog':['Blog kiến thức cà phê: pha phin, chọn hạt | Crack Beans','Kiến thức cà phê từ Crack Beans: cách pha cà phê phin ngon tại nhà, phân biệt cà phê Robusta và Arabica, chọn hạt rang mộc hợp gu.'],
  '/lien-he':['Liên hệ Crack Beans – Tư vấn cà phê rang mộc','Liên hệ Crack Beans qua 076 750 9715 hoặc crackbeans.4t@gmail.com để được tư vấn chọn cà phê rang mộc, cách pha và hỗ trợ đơn hàng COD.'],
  '/thanh-toan':['Thông tin giao hàng & đặt COD | Crack Beans','Gửi yêu cầu đặt cà phê Crack Beans, thanh toán tiền mặt khi nhận hàng. Cửa hàng liên hệ xác nhận phí giao hàng trước khi gửi.'],
  '/admin':['Quản trị nội dung | Crack Beans','Trang đăng nhập quản trị Crack Beans.'],
};
// Cắt mô tả ở ranh giới từ, tối đa ~155 ký tự để không bị Google rút gọn.
const clip=(text:string,max=155)=>{const t=text.replace(/\s+/g,' ').trim();if(t.length<=max)return t;const cut=t.slice(0,max-1);return cut.slice(0,cut.lastIndexOf(' ')).replace(/[,.;:–-]$/,'')+'…';};
const titleCase=(name:string)=>name.split(' ').map(w=>/\d/.test(w)?w:w.charAt(0)+w.slice(1).toLowerCase()).join(' ');
export function metadata(path:string,data:Content){
  const product=data.products.find(p=>path===`/san-pham/${p.id}`),article=data.articles.find(p=>path===`/blog/${p.id}`);
  const policy:Record<string,string>={'giao-hang':'Chính sách giao hàng','doi-tra':'Đổi trả và hoàn tiền','bao-mat':'Chính sách bảo mật','dieu-khoan':'Điều khoản sử dụng'};
  const known=!!descriptions[path]||!!product||!!article||!!policy[path.split('/')[2]];
  const productTitle=product&&[`${titleCase(product.name)} – Cà phê ${product.category} rang mộc | Crack Beans`,`${titleCase(product.name)} – Cà phê ${product.category} | Crack Beans`].find(t=>t.length<=60);
  const title=product?productTitle||`${titleCase(product.name)} | Crack Beans`:article?(`${article.title} | Crack Beans`.length<=60?`${article.title} | Crack Beans`:article.title):descriptions[path]?.[0]||`${policy[path.split('/')[2]]||'Không tìm thấy trang'} | Crack Beans`;
  const min=Math.min(...data.products.map(minPrice)).toLocaleString('vi-VN')+' ₫';
  const description=product?clip(`${titleCase(product.name)} ${variantsOf(product)[0].price.toLocaleString('vi-VN')} ₫/${formatWeight(variantsOf(product)[0].weight)}: ${product.description}`):article?clip((article as {description?:string}).description||article.text.split(/\n\s*\n/)[0]):clip((descriptions[path]?.[1]||'Thông tin hỗ trợ khách hàng và chính sách của Crack Beans.').replace('{min}',min));
  const canonical=SITE_URL+(path==='/'?'/':path);
  const image=SITE_URL+(product?.images[0].src||article?.image||data.assets.shop);
  const robots=path==='/admin'||path==='/thanh-toan'||!known?'noindex, nofollow':'index, follow, max-image-preview:large';
  const organization={'@type':'Organization','@id':`${SITE_URL}/#organization`,name:'Crack Beans',url:SITE_URL,logo:SITE_URL+data.assets.logo,telephone:'+84767509715',email:'crackbeans.4t@gmail.com',sameAs:['https://www.instagram.com/crackbeans.4t/','https://www.facebook.com/profile.php?id=61595407495990']};
  const crumbs=[{'@type':'ListItem',position:1,name:'Trang chủ',item:SITE_URL+'/'}];
  if(path!=='/')crumbs.push({'@type':'ListItem',position:2,name:product?'Sản phẩm':article?'Blog':title.split('|')[0].trim(),item:SITE_URL+(product?'/san-pham':article?'/blog':path)});
  if(product||article)crumbs.push({'@type':'ListItem',position:3,name:product?.name||article!.title,item:canonical});
  const graph:unknown[]=[organization,{'@type':'WebSite','@id':`${SITE_URL}/#website`,url:SITE_URL,name:'Crack Beans',inLanguage:'vi-VN',publisher:{'@id':`${SITE_URL}/#organization`}}, {'@type':'BreadcrumbList',itemListElement:crumbs}];
  if(product)graph.push({'@type':'Product',name:product.name,description:product.description,image:product.images.map(i=>SITE_URL+i.src),sku:product.id,brand:{'@type':'Brand',name:'Crack Beans'},category:`Cà phê ${product.category}`,offers:{'@type':'AggregateOffer',url:canonical,priceCurrency:'VND',lowPrice:minPrice(product),highPrice:Math.max(...variantsOf(product).map(v=>v.price)),offerCount:variantsOf(product).length,itemCondition:'https://schema.org/NewCondition'}});
  const meta=article as {keyword?:string;updated?:string}|undefined;
  if(article)graph.push({'@type':'BlogPosting',headline:article.title,description,image,mainEntityOfPage:canonical,...(meta?.keyword?{keywords:meta.keyword}:{}),...(meta?.updated?{dateModified:meta.updated}:{}),author:{'@type':'Organization',name:'Crack Beans'},publisher:{'@id':`${SITE_URL}/#organization`},inLanguage:'vi-VN'});
  return{title,description,canonical,image,robots,jsonld:{'@context':'https://schema.org','@graph':graph}};
}
export default function Seo(){
  const {pathname}=useLocation(),{data}=useContent(),seo=metadata(pathname,data);
  return <><title>{seo.title}</title><meta name="description" content={seo.description}/><meta name="robots" content={seo.robots}/><link rel="canonical" href={seo.canonical}/><meta property="og:title" content={seo.title}/><meta property="og:description" content={seo.description}/><meta property="og:url" content={seo.canonical}/><meta property="og:image" content={seo.image}/><meta property="og:locale" content="vi_VN"/><meta property="og:type" content={pathname.startsWith('/blog/')?'article':'website'}/><meta property="og:site_name" content="Crack Beans"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content={seo.title}/><meta name="twitter:description" content={seo.description}/><meta name="twitter:image" content={seo.image}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(seo.jsonld).replace(/</g,'\\u003c')}}/></>;
}
