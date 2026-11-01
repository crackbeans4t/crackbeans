import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from './content';
import { money, useCart } from './store';
export default function Checkout() {
  const cart=useCart(), {data}=useContent();
  const [busy,setBusy]=useState(false), [error,setError]=useState(''), [receipt,setReceipt]=useState('');
  const key=useRef(crypto.randomUUID());
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError('');
    const values=new FormData(event.currentTarget);
    try {
      const response=await fetch('/api/orders',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({key:key.current,name:values.get('name'),phone:String(values.get('phone')).replace(/[\s.-]/g,''),address:values.get('address'),note:values.get('note'),consent:values.get('consent')==='on',lines:cart.lines})});
      const result=await response.json();
      if(!response.ok) throw new Error(result.error || 'Không gửi được yêu cầu.');
      setReceipt(result.id);
    } catch(e) {setError(e instanceof Error ? e.message : 'Không thể kết nối. Vui lòng thử lại.');}
    finally {setBusy(false);}
  }
  if(receipt) return <section className="container checkout-result page-space"><p className="eyebrow">Đã nhận yêu cầu COD</p><h1>Cảm ơn bạn đã chọn Crack Beans.</h1><p>Mã yêu cầu <strong>{receipt.slice(0,8).toUpperCase()}</strong>. Cửa hàng sẽ liên hệ xác nhận sản phẩm, phí vận chuyển và lịch giao. Bạn thanh toán tiền mặt khi nhận hàng.</p><p>Đơn chưa được xác nhận giao hàng. Giỏ hàng được giữ để bạn tiện đối chiếu.</p><Link className="button" to="/san-pham">Tiếp tục khám phá</Link></section>;
  return <section className="container checkout page-space">
    <nav className="breadcrumbs" aria-label="Tiến trình đặt hàng"><Link to="/san-pham">Sản phẩm</Link><span>/</span><span>Thông tin giao hàng</span></nav>
    <p className="eyebrow">Crack Beans · Đặt hàng</p><h1>Một chút cà phê,<br/>gửi đến bạn.</h1>
    {!cart.count ? <div className="empty-state"><h2>Giỏ hàng đang trống</h2><p>Chọn hương vị bạn yêu thích trước khi đặt hàng.</p><Link className="button" to="/san-pham">Khám phá cà phê</Link></div> : <div className="checkout-layout">
      <form className="checkout-form" onSubmit={submit}>
        <h2>Thông tin người nhận</h2><p className="muted">Điền thông tin để cửa hàng liên hệ và xác nhận giao hàng.</p>
        <div className="form-two"><label>Họ và tên<input name="name" autoComplete="name" required minLength={2} maxLength={100} placeholder="Nguyễn Minh Anh"/></label><label>Số điện thoại<input name="phone" type="tel" autoComplete="tel" required pattern="(?:\+84|0)[0-9\s.\-]{9,14}" placeholder="09xx xxx xxx"/></label></div>
        <label>Địa chỉ nhận hàng<textarea name="address" autoComplete="street-address" required minLength={15} maxLength={400} rows={3} placeholder="Số nhà, đường, phường/xã, tỉnh/thành phố"/></label>
        <label>Ghi chú <span className="muted">(không bắt buộc)</span><textarea name="note" maxLength={1000} rows={2} placeholder="Khung giờ thuận tiện nhận cuộc gọi…"/></label>
        <section className="payment-method"><span className="eyebrow">Phương thức thanh toán</span><h3>Tiền mặt khi nhận hàng</h3><p>Thanh toán sau khi nhận sản phẩm. Cửa hàng sẽ xác nhận phí vận chuyển trước khi gửi.</p></section>
        <label className="consent"><input type="checkbox" name="consent" required/><span>Tôi đồng ý để Crack Beans sử dụng thông tin trên nhằm liên hệ, xử lý yêu cầu đặt hàng. <Link to="/chinh-sach/bao-mat">Chính sách bảo mật</Link>.</span></label>
        {error && <p role="alert" className="form-error">{error}</p>}
        <button className="button full" disabled={busy}>{busy?'Đang gửi yêu cầu…':'Gửi yêu cầu đặt hàng COD'}</button><small className="muted">Chưa thu tiền tại bước này. Hotline: <a href="tel:0767509715">076 750 9715</a>.</small>
      </form>
      <aside className="checkout-summary"><p className="eyebrow">Gu cà phê của bạn</p><h2>Sản phẩm đã chọn <span>({cart.count})</span></h2>
        {cart.lines.map(line=>{const p=data.products.find(p=>p.id===line.id);return p&&<div className="checkout-item" key={line.id+line.grind+line.size}><img src={p.images[0].src} alt="" width="72" height="90"/><div><Link to={`/san-pham/${p.id}`}>{p.name}</Link><small>{line.size === "500g" ? "500 g" : "250 g"} · {line.grind} · {line.quantity} gói</small><strong>{money(p.price*(line.size === "500g" ? 2 : 1)*line.quantity)}</strong></div></div>})}
        <div className="summary-totals"><div><span>Tạm tính</span><strong>{money(cart.total)}</strong></div><div><span>Phí vận chuyển</span><span>Xác nhận qua điện thoại</span></div><div className="summary-subtotal"><span>Tiền sản phẩm</span><strong>{money(cart.total)}</strong></div><small>Tổng thanh toán cuối cùng gồm tiền sản phẩm và phí giao hàng được xác nhận trước khi gửi.</small></div>
        <Link className="text-link" to="/san-pham">Chọn thêm cà phê</Link>
      </aside>
    </div>}
  </section>;
}
