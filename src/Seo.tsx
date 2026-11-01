import { useLocation } from 'react-router-dom';
import { useContent, type Content } from './content';
export const SITE_URL='https://crackbeans.vercel.app';
const descriptions:Record<string,[string,string]>={
  '/':['Crack Beans — Cà phê rang mộc Việt Nam','Khám phá cà phê Robusta và Arabica của Crack Beans. Sáu dòng cà phê rang mộc, thông tin vùng nguyên liệu và hướng dẫn pha phin tại nhà.'],
  '/san-pham':['Cà phê Robusta & Arabica rang mộc | Crack Beans','Chọn cà phê Robusta, Arabica, rang bơ hoặc Honey phù hợp gu. Xem giá 250 g, mô tả hương vị và đặt hàng tiền mặt khi nhận hàng tại Crack Beans.'],
  '/ve-chung-toi':['Câu chuyện thương hiệu cà phê Việt | Crack Beans','Tìm hiểu triết lý Crack Beans: trân trọng hạt cà phê Việt, chia sẻ vùng nguyên liệu và giữ hương vị nguyên bản trong mỗi mẻ rang.'],
  '/blog':['Hướng dẫn pha cà phê & chọn hạt | Crack Beans','Góc cà phê Crack Beans: hướng dẫn pha phin 5 bước và tìm hiểu các dòng Robusta, Arabica để chọn hương vị phù hợp với bạn.'],
  '/lien-he':['Liên hệ Crack Beans — Tư vấn cà phê & đơn hàng','Liên hệ Crack Beans qua 076 750 9715 hoặc crackbeans.4t@gmail.com. Tư vấn chọn hạt, cách pha và hỗ trợ yêu cầu đặt hàng COD.'],
  '/thanh-toan':['Thông tin giao hàng & đặt COD | Crack Beans','Gửi yêu cầu đặt cà phê Crack Beans, thanh toán tiền mặt khi nhận hàng. Cửa hàng liên hệ xác nhận phí giao hàng trước khi gửi.'],
  '/admin':['Quản trị nội dung | Crack Beans','Trang đăng nhập quản trị Crack Beans.'],
};
export function metadata(path:string,data:Content){
  const product=data.products.find(p=>path===`/san-pham/${p.id}`),article=data.articles.find(p=>path===`/blog/${p.id}`);
  const policy:Record<string,string>={'giao-hang':'Chính sách giao hàng','doi-tra':'Đổi trả và hoàn tiền','bao-mat':'Chính sách bảo mật','dieu-khoan':'Điều khoản sử dụng'};
  const known=!!descriptions[path]||!!product||!!article||!!policy[path.split('/')[2]];
  const title=product?`${product.name} — Cà phê 250 g | Crack Beans`:article?`${article.title} | Crack Beans`:descriptions[path]?.[0]||`${policy[path.split('/')[2]]||'Không tìm thấy trang'} | Crack Beans`;
  const description=product?`${product.description} Gói 250 g, giá ${product.price.toLocaleString('vi-VN')} ₫. Đặt COD cùng Crack Beans.`:article?article.text.replace(/^.*?phút đọc\s*/s,'').trim().replace(/\s+/g,' ').slice(0,158):descriptions[path]?.[1]||'Thông tin hỗ trợ khách hàng và chính sách của Crack Beans.';
  const canonical=SITE_URL+(path==='/'?'/':path);
  const image=SITE_URL+(product?.images[0].src||article?.image||data.assets.shop);
  const robots=path==='/admin'||path==='/thanh-toan'||!known?'noindex, nofollow':'index, follow, max-image-preview:large';
  const organization={'@type':'Organization','@id':`${SITE_URL}/#organization`,name:'Crack Beans',url:SITE_URL,logo:SITE_URL+data.assets.logo,telephone:'+84767509715',email:'crackbeans.4t@gmail.com',sameAs:['https://www.instagram.com/crackbeans.4t/']};
  const crumbs=[{'@type':'ListItem',position:1,name:'Trang chủ',item:SITE_URL+'/'}];
  if(path!=='/')crumbs.push({'@type':'ListItem',position:2,name:product?'Sản phẩm':article?'Blog':title.split('|')[0].trim(),item:SITE_URL+(product?'/san-pham':article?'/blog':path)});
  if(product||article)crumbs.push({'@type':'ListItem',position:3,name:product?.name||article!.title,item:canonical});
  const graph:unknown[]=[organization,{'@type':'WebSite','@id':`${SITE_URL}/#website`,url:SITE_URL,name:'Crack Beans',inLanguage:'vi-VN',publisher:{'@id':`${SITE_URL}/#organization`}}, {'@type':'BreadcrumbList',itemListElement:crumbs}];
  if(product)graph.push({'@type':'Product',name:product.name,description:product.description,image:product.images.map(i=>SITE_URL+i.src),sku:product.id,brand:{'@type':'Brand',name:'Crack Beans'},offers:{'@type':'Offer',url:canonical,priceCurrency:'VND',price:product.price}});
  if(article)graph.push({'@type':'BlogPosting',headline:article.title,description,image,mainEntityOfPage:canonical,author:{'@type':'Organization',name:'Crack Beans'},publisher:{'@id':`${SITE_URL}/#organization`},inLanguage:'vi-VN'});
  return{title,description,canonical,image,robots,jsonld:{'@context':'https://schema.org','@graph':graph}};
}
export default function Seo(){
  const {pathname}=useLocation(),{data}=useContent(),seo=metadata(pathname,data);
  return <><title>{seo.title}</title><meta name="description" content={seo.description}/><meta name="robots" content={seo.robots}/><link rel="canonical" href={seo.canonical}/><meta property="og:title" content={seo.title}/><meta property="og:description" content={seo.description}/><meta property="og:url" content={seo.canonical}/><meta property="og:image" content={seo.image}/><meta property="og:locale" content="vi_VN"/><meta property="og:type" content={pathname.startsWith('/blog/')?'article':'website'}/><meta property="og:site_name" content="Crack Beans"/><meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content={seo.title}/><meta name="twitter:description" content={seo.description}/><meta name="twitter:image" content={seo.image}/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(seo.jsonld).replace(/</g,'\\u003c')}}/></>;
}
