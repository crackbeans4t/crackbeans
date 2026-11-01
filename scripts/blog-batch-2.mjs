// Thêm 2 bài blog do nhóm cung cấp (01/11/2026). Nội dung giữ nguyên ý của nhóm;
// chỉ sửa lỗi định dạng khi sao chép (số bị lặp, chữ lặp, thiếu dấu cách).
import fs from 'node:fs';
const file = new URL('../src/data.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(file, 'utf8'));

const posts = [
  {
    id: 'hanh-trinh-ca-phe-dak-lak-cau-dat',
    title: 'Hành Trình Dấu Chân Cà Phê: Từ Đất Đỏ Đắk Lắk Đến Đỉnh Sương Cầu Đất, Lâm Đồng',
    keyword: 'vùng trồng cà phê Đắk Lắk Cầu Đất',
    description: 'Khám phá hành trình tuyển chọn hạt cà phê mộc của CRACK BEANS qua 3 vùng nguyên liệu: Đắk Lắk, Cầu Đất và Lâm Đồng. Nơi thổ nhưỡng kiến tạo hương vị.',
    updated: '2026-11-01',
    image: '/assets/region-dak-lak.webp',
    text: `Tại CRACK BEANS, chúng mình tin rằng một ly cà phê mộc hảo hạng không bắt đầu từ lồng rang, mà bắt đầu từ chính nơi hạt cà phê cất tiếng hát đầu tiên — thổ nhưỡng.

## Dấu chân nguồn gốc & triết lý "Archive Hybrid"

Không giấu giếm hay xào nấu thông điệp, hệ thống Coffee Archive của CRACK BEANS minh bạch 100% nguồn gốc từng mẻ hạt. Từ những rẫy cà phê di sản bạt ngàn nắng gió Đắk Lắk đến những đỉnh núi mù sương tại Cầu Đất (Lâm Đồng), mỗi vùng đất đều để lại "dấu vân tay" hương vị không thể lẫn lộn trên từng hạt rang.

## Đắk Lắk — Thủ phủ Bazan & tinh hoa Robusta di sản

Độ cao: 500m–800m so với mực nước biển.

Thổ nhưỡng: Đất đỏ Bazan cổ tầng dày, giàu khoáng chất hữu cơ.

Đặc tính hương vị: Đắng đậm sâu, đằm thắm, thân vị (body) dày và hậu vị đằm ngọt.

Nhắc đến cà phê Việt Nam là nhắc đến Đắk Lắk — nơi những gốc cà phê Robusta Sẻ di sản trên 25 năm tuổi cắm rễ sâu vào lòng đất đỏ. Nắng gió rực rỡ cùng biên độ nhiệt ngày đêm của vùng cao nguyên giúp quả cà phê tích tụ hàm lượng Caffeine tự nhiên mạnh mẽ và độ đằm đắm chuẩn mực.

Đây chính là "linh hồn" tạo nên sự tỉnh táo bứt phá trong các dòng hạt [Robusta Clean Daklak](/san-pham/robusta-clean-daklak), [Robusta Rang Bơ](/san-pham/robusta-clean-rang-bo) và [Robusta Sẻ](/san-pham/robusta-se) của CRACK BEANS.

## Cầu Đất & Núi Min (Lâm Đồng) — Thánh địa Arabica Specialty

Độ cao: 1.500m–1.650m so với mực nước biển.

Thổ nhưỡng: Đất mùn đồi núi cao, quanh năm sương bao phủ.

Đặc tính hương vị: Hương hoa tươi, vị chua thanh mượt mà, ngọt hậu sâu lắng.

Bước lên độ cao trên 1.500m tại Cầu Đất và đỉnh Núi Min (Trạm Hành, Lâm Đồng), khí hậu lạnh quanh năm khiến quả Arabica phát triển chậm rãi, chắt chiu trọn vẹn những gì tinh túy nhất của đất trời.

Hạt [Arabica S18](/san-pham/arabica-dark-roast-s18) khổng lồ hay dòng [Specialty Micro-lot Núi Min](/san-pham/specialty-nui-min) từ vùng đất này mang dải hương hoa nhài, vỏ cam và trái cây mọng rực rỡ. Kỹ thuật rang Dark Roast chuẩn xác của CRACK BEANS giúp triệt tiêu hoàn toàn vị chua gắt, chỉ giữ lại độ thơm nồng nã và vị ngọt hậu đằm thắm.

👉 Khám phá ngay 6 mẻ rang mộc từ các vùng nguyên liệu di sản tại [Trang Sản Phẩm](/san-pham) của CRACK BEANS, hoặc đọc tiếp [dải hương tự nhiên trong 6 mẻ hạt](/blog/giai-ma-dai-huong-6-me-hat-crack-beans).`,
  },
  {
    id: 'giai-ma-dai-huong-6-me-hat-crack-beans',
    title: 'Giải Mã Dải Hương Tự Nhiên Trong 6 Mẻ Hạt CRACK BEANS: Từ Sô-cô-la, Bơ Mộc Đến Hoa Nhài & Vỏ Cam',
    keyword: 'hương vị cà phê mộc',
    description: 'Tại sao cà phê mộc 100% không hương liệu lại có mùi sô-cô-la, mật ong, hoa nhài hay vỏ cam? Giải mã 6 dải hương tự nhiên trong từng dòng CRACK BEANS.',
    updated: '2026-11-01',
    image: '/assets/quiz-taste-dam.webp',
    text: `Một câu hỏi CRACK BEANS nhận được rất nhiều từ những người mới tập uống cà phê mộc: "Tại sao túi cà phê không tẩm hóa chất lại ghi nốt hương sô-cô-la, mật ong hay hoa nhài?"

## Cà phê mộc 100% có thực sự mang hương vị hoa quả & thảo mộc?

Câu trả lời nằm ở Phản ứng Maillard trong quá trình rang và phương pháp sơ chế quả chín. Khi hạt cà phê trải qua tiếng nổ đầu tiên (First Crack), hàng trăm hợp chất hương thơm tự nhiên vốn có trong hạt được giải phóng. Không cần một giọt hương liệu nhân tạo, 6 dòng sản phẩm của CRACK BEANS mang đến 6 dải hương nguyên bản đại diện cho cá tính của bạn.

## Bóc tách dải hương đặc trưng của 6 dòng cà phê CRACK BEANS

### 🍫 1. Sô-cô-la đen (Dark Chocolate) — Robusta Clean Đắk Lắk

Trải nghiệm: Vị đắng mộc đằm thắm, thơm nức nốt sô-cô-la đen nguyên chất.

Nguồn gốc hương: Nhờ phương pháp bắn màu loại bỏ 100% hạt hỏng và kỹ thuật rang Medium-Dark, các đường đôi trong hạt Robusta chuyển hóa thành vị đắng ngọt sâu đọng lại nơi cổ họng. [Xem Robusta Clean Daklak](/san-pham/robusta-clean-daklak).

### 🧈 2. Bơ mộc tự nhiên (Natural Butter) — Robusta Rang Bơ Mộc

Trải nghiệm: Vị đằm béo ký ức, thơm nức nực nỡ khi pha phin truyền thống.

Nguồn gốc hương: Áo lớp bơ Pháp mộc tự nhiên (≤0,5%) ngay trong lồng rang. Không bắp nếp độn, không hóa chất, mang lại ly cà phê phin sánh béo chuẩn gu. [Xem Robusta Rang Bơ](/san-pham/robusta-clean-rang-bo).

### 🍯 3. Mật ong rừng (Wild Honey) — Robusta Honey 99%

Trải nghiệm: Đắng dịu nhẹ, ngọt hậu kéo dài không cần thêm đường.

Nguồn gốc hương: Phương pháp sơ chế Honey giữ lại 99% lớp thịt quả đường mật tự nhiên trong quá trình phơi giàn High-bed ngập nắng. [Xem Robusta Honey 99%](/san-pham/robusta-honey-99).

### 🌿 4. Thảo mộc cổ thụ (Wild Herbs) — Robusta Sẻ Giống Cổ

Trải nghiệm: Đắng đậm di sản, thoảng hương thảo mộc khô và gỗ tuyết tùng.

Nguồn gốc hương: Thu hoạch từ những gốc cà phê cổ di sản trên 25 năm tuổi bám rễ sâu vào lòng đất đỏ Bazan, tạo nên thân vị vô cùng mạnh mẽ và tỉnh táo. [Xem Robusta Sẻ](/san-pham/robusta-se).

### 🍊 5. Vỏ cam chín (Citrus Peel) — Arabica Sàng 18 Rang Đậm

Trải nghiệm: Mê thơm ghét chua, thơm nồng nã hương vỏ cam nướng và sô-cô-la.

Nguồn gốc hương: Hạt Arabica Jumbo Screen Sàng 18 khổng lồ từ Núi Min được rang đậm chuẩn xác, triệt tiêu vị chua gắt và cô đọng tinh dầu vỏ cam tự nhiên. [Xem Arabica Dark Roast S18](/san-pham/arabica-dark-roast-s18).

### 🌸 6. Hoa nhài thanh khiết (Jasmine Blossom) — Specialty Núi Min Micro-lot

Trải nghiệm: Bùng nổ hương hoa nhài trắng tươi mát, vị chua thanh sáng như nước trái cây.

Nguồn gốc hương: Dòng Arabica Specialty sơ chế ướt (Washed) thu hoạch ở độ cao 1.650m, bảo toàn dải hương hoa và trái cây mọng tinh khôi nhất. [Xem Specialty Núi Min](/san-pham/specialty-nui-min).

## Tìm ra dải hương "chân ái" của bạn trong 30 giây

Bạn thuộc team thích vị đằm béo sô-cô-la hay mê mẩn dải hương hoa nhài vỏ cam thanh mát?

👉 Trải nghiệm ngay [quiz Grind Match](/?grind-match) trên website CRACK BEANS để tìm ra dòng hạt và nhận tem Custom Grind cá nhân hóa dành riêng cho bạn! Muốn biết hạt đến từ đâu? Đọc thêm [hành trình từ Đắk Lắk đến Cầu Đất](/blog/hanh-trinh-ca-phe-dak-lak-cau-dat).`,
  },
];

for (const post of posts) {
  const entry = { ...post, steps: [] };
  const i = data.articles.findIndex((a) => a.id === post.id);
  if (i >= 0) data.articles[i] = entry;
  else data.articles.push(entry);
}
fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
console.log(data.articles.map((a) => `${a.id}: ${a.text.split(/\s+/).length} từ`).join('\n'));
