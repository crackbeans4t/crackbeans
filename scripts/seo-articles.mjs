// Ghi 2 bài blog đã tối ưu SEO vào src/data.json (nguồn seed + bản dựng tĩnh).
// Thông tin thương hiệu lấy từ bài gốc trên Wix; phần mở rộng là kiến thức pha chế phổ thông.
import fs from 'node:fs';
const file = new URL('../src/data.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const phin = data.articles.find((a) => a.id === 'pha-phin' || a.id === 'cach-pha-ca-phe-phin');
const six = data.articles.find((a) => a.id === 'sau-dong-ca-phe' || a.id === 'ca-phe-robusta-va-arabica');

Object.assign(phin, {
  id: 'cach-pha-ca-phe-phin',
  title: 'Cách pha cà phê phin ngon tại nhà: 5 bước chuẩn vị',
  keyword: 'cách pha cà phê phin',
  description: 'Cách pha cà phê phin ngon tại nhà với 5 bước: làm nóng phin, nén bột, ủ 30 ml nước 90–95°C, chiết xuất 4–5 phút. Kèm mẹo chọn hạt từ Crack Beans.',
  updated: '2026-11-01',
  text: `Cách pha cà phê phin ngon không cần dụng cụ đắt tiền, chỉ cần đúng nhiệt độ nước, đúng thời gian ủ và một chút kiên nhẫn. Bài viết này hướng dẫn quy trình 5 bước pha phin truyền thống theo tiêu chuẩn của CRACK BEANS, giúp bạn khai thác trọn vẹn hương vị cà phê mộc nguyên bản ngay tại nhà.

Pha phin là nét văn hóa thưởng thức cà phê đặc trưng của người Việt. Để có được một ly cà phê thơm ngon, đậm đà, việc tuân thủ đúng kỹ thuật từng bước quan trọng không kém việc chọn hạt.

## Chuẩn bị trước khi pha cà phê phin

Dụng cụ: Một chiếc phin (đế, thân phin, nắp gài và nắp đậy), ly chịu nhiệt và ấm nước nóng.

Cà phê: Cà phê bột xay vừa dành cho phin. Bột quá mịn làm nước chảy rất chậm và dễ đắng gắt; bột quá thô làm nước chảy nhanh, ly cà phê nhạt. Nếu mua cà phê hạt, hãy xay ngay trước khi pha để giữ hương thơm.

Nước: Nước sạch đun sôi rồi để nguội bớt về khoảng 90°C - 95°C. Nước sôi sùng sục dễ làm cháy bột và tạo vị đắng khét.

## 5 bước pha cà phê phin chuẩn vị

### Bước 1 — Làm nóng và cho cà phê

Làm nóng phin và ly bằng nước sôi, sau đó lau khô (giúp giữ nhiệt độ ổn định trong suốt quá trình chiết xuất). Cho lượng cà phê vừa đủ vào phin và lắc nhẹ để bột cà phê trải đều bề mặt.

### Bước 2 — Đặt nắp gài

Đặt nhẹ nắp gài (nắp nén) lên trên bề mặt bột cà phê. Ấn nhẹ tay để cố định lớp bột, giúp nước thấm đều và không bị nổi bọt khí khi rót nước.

### Bước 3 — Rót nước lần 1 và ủ

Rót lần 1 khoảng 30ml nước nóng (nhiệt độ chuẩn từ 90°C - 95°C) theo vòng tròn trên đế và đều khắp bề mặt để nước thấm đều vào bột cà phê.

Đậy nắp và ủ trong khoảng 45 - 60 giây để bột cà phê hấp thụ nước, nở đều và giải phóng tối đa tầng hương thơm.

### Bước 4 — Rót nước lần 2

Rót tiếp khoảng 40ml nước nóng nữa theo vòng tròn đều đặn để nước tiếp tục ngấm sâu và chiết xuất trọn vẹn tinh chất cà phê.

Đậy nắp lại và chờ đợi quá trình nhỏ giọt hoàn tất (tổng thời gian chiết xuất dao động từ 4 đến 5 phút).

### Bước 5 — Thưởng thức

Khi phin ngừng nhỏ giọt, nhấc phin ra và thưởng thức ngay. Bạn có thể uống đen, thêm đá hoặc pha cùng sữa đặc tùy khẩu vị.

## Những lỗi thường gặp khi pha phin

Nước chảy quá nhanh: Bột xay quá thô hoặc nắp gài đặt quá lỏng. Hãy dùng bột mịn hơn một chút và ấn nắp gài chắc tay hơn.

Nước không chảy hoặc chảy quá chậm: Bột quá mịn hoặc nén quá chặt. Nới nhẹ nắp gài, lần sau dùng bột thô hơn.

Cà phê đắng gắt, khét: Nước quá nóng hoặc thời gian chiết xuất kéo dài. Để nước nguội về 90°C - 95°C và giữ tổng thời gian trong khoảng 4 - 5 phút.

Cà phê nhạt, thiếu hương: Bỏ qua bước ủ hoặc dùng ít cà phê. Đừng bỏ bước rót 30ml đầu tiên và ủ 45 - 60 giây.

## Nên chọn cà phê nào để pha phin?

Dòng Robusta đậm vị là lựa chọn quen thuộc cho phin truyền thống. [Robusta Clean Daklak](/san-pham/robusta-clean-daklak) hợp với người thích ly cà phê đen mạnh mẽ, còn [Robusta Clean 100% Rang Bơ](/san-pham/robusta-clean-rang-bo) cho ly cà phê sữa đá béo thơm. Nếu muốn so sánh kỹ hơn, xem bài [cà phê Robusta và Arabica: 6 dòng hạt rang mộc](/blog/ca-phe-robusta-va-arabica).

Pha một ly cà phê phin ngon không chỉ là kỹ thuật, mà còn là một nghệ thuật thư giãn. Với quy trình 5 bước chuẩn xác trên từ CRACK BEANS, chúc bạn sẽ luôn tự tay pha chế thành công những ly cà phê mộc nguyên bản, đậm đà và trọn vẹn cảm xúc mỗi ngày!`,
});

Object.assign(six, {
  id: 'ca-phe-robusta-va-arabica',
  title: 'Cà phê Robusta và Arabica: 6 dòng hạt rang mộc nên thử',
  keyword: 'cà phê robusta và arabica',
  description: 'So sánh cà phê Robusta và Arabica qua 6 dòng hạt rang mộc của Crack Beans: vùng trồng, cách sơ chế, hương vị và cách pha phù hợp với từng gu.',
  updated: '2026-11-01',
  text: `Cà phê Robusta và Arabica là hai giống cà phê phổ biến nhất thế giới, nhưng mỗi loại mang một tính cách rất riêng. Bài viết này giúp bạn phân biệt Robusta và Arabica, rồi giới thiệu 6 dòng hạt rang mộc chủ lực tại CRACK BEANS để bạn chọn đúng gu của mình.

Khi thưởng thức một ly cà phê ngon, điều đầu tiên bạn cần biết không phải là những lời quảng cáo hào nhoáng, mà là nguồn gốc và thông số rõ ràng của hạt cà phê. Tại CRACK BEANS, chúng tôi theo đuổi phong cách tối giản công nghiệp (Industrial Minimalism) và sự minh bạch tuyệt đối: mỗi gói cà phê đều được định danh rõ ràng về vùng trồng, độ cao, phương pháp sơ chế và mức độ rang.

## Robusta và Arabica khác nhau thế nào?

Hương vị: Robusta thường đắng đậm, body dày, nhiều nốt cacao và chocolate đen. Arabica thường có vị chua thanh, hương thơm phức hợp hơn với các nốt hoa, trái cây.

Hàm lượng caffeine: Robusta có hàm lượng caffeine cao hơn Arabica, nên ly cà phê mạnh và tỉnh táo hơn.

Vùng trồng: Robusta phát triển tốt ở vùng thấp, nắng nóng như Tây Nguyên. Arabica cần độ cao và khí hậu mát mẻ hơn, như Cầu Đất (Lâm Đồng).

Cách pha phù hợp: Robusta hợp với phin truyền thống và cà phê sữa đá. Arabica hợp với pha máy, pour over hoặc các món có sữa như Latte, Cappuccino.

## 4 dòng cà phê Robusta rang mộc

### 1. Robusta Clean Daklak — Đậm đà, mạnh mẽ

Đặc điểm: Sơ chế ướt sạch, mức rang đậm.

Hương vị: Nốt cacao đậm, vị đắng mạnh mẽ và lớp body dày dặn, hậu vị chocolate đen kéo dài.

Phù hợp nhất với: Người thích pha phin truyền thống hoặc espresso đậm vị để khởi đầu ngày mới năng động. [Xem Robusta Clean Daklak](/san-pham/robusta-clean-daklak).

### 2. Robusta Clean 100% Rang Bơ — Chuẩn vị truyền thống

Đặc điểm: Sự kết hợp giữa hạt Robusta tuyển chọn và phương pháp rang tẩm bơ thủ công.

Hương vị: Thơm béo mùi bơ Pháp, vị đắng đậm đà hòa quyện cùng hậu vị caramel ngọt ngào.

Phù hợp nhất với: Những ai yêu thích ly cà phê sữa đá đậm đà, béo ngậy đúng chất Sài Gòn. [Xem Robusta Rang Bơ](/san-pham/robusta-clean-rang-bo).

### 3. Robusta Honey 99% — Ngọt ngào hương mật ong

Sơ chế mật ong đỏ/vàng từ hạt chín cao nguyên. Mang nốt hương mật ong rừng và trái cây sấy, hậu vị ngọt sâu mượt mà. [Xem Robusta Honey 99%](/san-pham/robusta-honey-99).

### 4. Robusta Sẻ (Thuần Chủng) — Nét mộc Cao Nguyên

Đặc điểm: Hạt Robusta sẻ nguyên bản, sơ chế ướt, không tẩm ướp tạp chất.

Hương vị: Thoảng hương bánh mì nướng, mạch nha và thảo mộc khô. Vị chua thanh lịch kết hợp đắng phức hợp, cân bằng như lụa.

Phù hợp nhất với: Những người sành cà phê mộc, muốn tìm lại hương vị thuần khiết của di sản cao nguyên. [Xem Robusta Sẻ](/san-pham/robusta-se).

## 2 dòng cà phê Arabica rang mộc

### 5. Arabica Dark Roast S18 — Đẳng cấp Cầu Đất

Đặc điểm: Hạt Arabica kích thước sàng 18 từ vùng Cầu Đất, rang đậm (Dark Roast).

Hương vị: Chocolate đen, chút khói nhẹ và vỏ cam. Đắng cacao rõ nét, giảm thiểu vị chua, hậu vị sạch sẽ.

Phù hợp nhất với: Làm nền tảng hoàn hảo cho các món Latte, Cappuccino hoặc Americano pha máy. [Xem Arabica Dark Roast S18](/san-pham/arabica-dark-roast-s18).

### 6. Specialty Núi Min — Hương hoa tinh tế

Đặc điểm: Cà phê đặc sản cao cấp trồng ở độ cao 1550m - 1650m, rang vừa.

Hương vị: Nốt hương hoa nhài, hoa trắng và cam chanh thanh nhẹ. Vị chua sáng tinh tế, hậu vị mật ong kéo dài.

Phù hợp nhất với: Những tín đồ yêu thích dòng specialty pha thủ công (Pour Over) hoặc trải nghiệm hương vị cà phê hiện đại. [Xem Specialty Núi Min](/san-pham/specialty-nui-min).

## Nên chọn Robusta hay Arabica?

Chọn Robusta nếu bạn thích ly cà phê đậm, đắng rõ, uống phin hoặc cà phê sữa đá mỗi sáng. Chọn Arabica nếu bạn thích vị chua thanh, hương thơm tinh tế hoặc thường pha máy, pour over.

Tất cả các sản phẩm đều có sẵn hai định lượng 250g và 500g (tùy chọn Dạng Hạt hoặc Dạng Bột) để bạn dễ dàng sử dụng tại nhà hoặc quán. Xem toàn bộ [cà phê Robusta](/san-pham?loai=Robusta) và [cà phê Arabica](/san-pham?loai=Arabica), hoặc đọc thêm [cách pha cà phê phin ngon tại nhà](/blog/cach-pha-ca-phe-phin).`,
});

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(data.articles.map((a) => `${a.id}: ${a.text.split(/\s+/).length} từ`).join('\n'));
