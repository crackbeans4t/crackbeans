# Crack Beans — React + TypeScript

Bản dựng riêng từ website Wix `/website`, theo yêu cầu chuyển sang tự code ngày **01/11/2026**. Yêu cầu giáo viên cho phép WordPress, Wix **hoặc tự code**; ảnh gốc tại [yêu cầu môn học](../requirements/teacher-requirements.png).

**Xem bản chạy:** http://127.0.0.1:5173/ — đã mở trong trình duyệt Codex. Đây là bản local, chưa triển khai công khai.

## Chạy dự án

```powershell
cd D:\Wix\crack-beans-react
npm ci
npm run dev
```

```powershell
npm test
npm run verify
npm run build
npm run preview
```

Node.js 22+; thư mục kết quả `dist/`. Host cần trả `index.html` cho các đường dẫn ứng dụng. Có cấu hình `vercel.json`; không cần kết nối Wix để chạy.

## Đã chuyển và sửa

- Trang chủ: hero, triết lý, hai sản phẩm Arabica nổi bật, câu trích dẫn, ba vùng nguyên liệu.
- Giới thiệu: câu chuyện thương hiệu, ba giá trị, cam kết.
- Danh mục: sáu sản phẩm, lọc Robusta/Arabica, sắp xếp theo giá.
- Chi tiết: ảnh bao bì + hướng dẫn pha, xem ảnh đầy đủ, Hạt/Bột, số lượng, thêm giỏ.
- Blog: hai bài hiện có từ Wix; bổ sung năm ảnh pha phin. Chưa thực hiện SEO.
- Liên hệ: địa chỉ, giờ mở cửa, gọi điện và email theo thông tin gốc.
- Header nền kem bám khi cuộn: desktop 80 px, mobile 64 px. Mobile có menu sát giỏ bên phải.
- Popup menu đóng danh mục con mặc định; popup sản phẩm và giỏ có vùng cuộn riêng; checkout không bị nội dung dài đẩy khỏi màn hình.
- Giỏ lưu riêng trong trình duyệt, tăng/giảm/xóa, phân biệt Hạt/Bột, tính tổng. Không nhập giỏ Wix.

Giữ nhận diện kem/nâu, logo, ảnh, nội dung chính và giá 250 g. Có chỉnh khoảng cách, kích cỡ chữ, bố cục, nhãn menu tiếng Việt và gộp PRODUCT/SHOP. **Không khẳng định sao chép pixel tuyệt đối.**

## Giới hạn cần biết

- Chưa có backend đơn hàng, tài khoản, tồn kho hoặc thanh toán trực tuyến. Trang thanh toán thông báo rõ, hướng dẫn liên hệ cửa hàng; không giả gửi đơn thành công.
- Gói 500 g chưa có bảng giá được xác minh đầy đủ nên hiển thị liên hệ. Không tự nhân đôi giá 250 g.
- Các trang chính sách hiện là thông tin hỗ trợ tạm thời, chưa phải bốn chính sách kinh doanh hoàn chỉnh. Bản soạn trước nằm ở `../content/policies/`.
- Hai bài blog gốc còn cần rà soát nội dung kỹ hơn. Đã sửa đoạn Honey bị chép nhầm rang bơ; chưa nghiệm thu SEO, dữ liệu có cấu trúc hay Core Web Vitals.
- Website Wix vẫn là hệ thống riêng. Dữ liệu React là bản chụp, không đồng bộ tự động.

## Tài nguyên và minh chứng

- Ưu tiên tài nguyên người dùng cung cấp: `D:\Wix\assets`. Đã dùng 24 ảnh; [bảng ánh xạ](source/user-assets-manifest.json).
- `source/`: nội dung gốc Wix, URL nguồn, danh mục ảnh, bản trích nhãn PDF; `source/original-assets/`: ảnh gốc tải từ Wix để đối chiếu.
- `public/assets/`: bản WebP dùng trên giao diện. Font được đóng gói cục bộ.
- [Báo cáo chuyển sang React, trước/sau và bài học](../reports/CB-015.md).
- [Báo cáo tài nguyên mới và nội dung](../reports/CB-016.md).
- [Kiểm thử và giới hạn](docs/VERIFICATION.md).
- [Ảnh phiên đầu](../evidence/react-v01/), [ảnh bản dùng tài nguyên mới trong Codex](../evidence/react-v02/).
- [Quy tắc tiếp tục dự án](AGENTS.md).

Các kiểm thử đa thiết bị là mô phỏng viewport, không phải kiểm thử điện thoại vật lý.
