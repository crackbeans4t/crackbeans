# Kiểm thử — 01/11/2026

## Tự động

- `npm test`: 3 test đạt. Dữ liệu giỏ lỗi không làm hỏng ứng dụng; loại sản phẩm/biến thể không tồn tại và số lượng ngoài 1–99; tách Hạt/Bột, chống dòng lưu trùng.
- `npm run verify`: đủ sáu sản phẩm, giá dương, 12 ảnh, mô tả, ba đoạn vùng nguyên liệu, hai bài blog.
- `npm run build`: TypeScript và Vite đạt sau khi thêm kiểu Node cho file test.

## Trình duyệt

18 lượt đo trên bản đầu; 18 lượt trên bản dùng tài nguyên người dùng trong Codex. Các trang: trang chủ, danh mục, giới thiệu, Núi Min, blog, liên hệ. Desktop 1440×900; tablet 768×1024; mobile 390×844. Không tràn ngang, mỗi trang một h1. Không có ảnh đã tải bị lỗi trong vùng nhìn của lượt mobile; chưa khẳng định toàn bộ ảnh lazy ngoài màn hình đã tải.

Lượt đầu thêm danh mục 360×800, 320×800; cart 320×800. Header bám nền khi cuộn cuối HOME; footer đủ nhóm.

Luồng đã thử: menu mở/đóng; danh mục đóng mặc định; mở danh mục chọn Arabica; đổi query ngay trên danh mục và tự đóng menu; quick view; thêm Hạt; thêm Bột; đổi số lượng; tổng giá; reload giữ cart; sang trang thanh toán hỗ trợ; Escape; Shift+Tab và Tab quay vòng; trả focus nút mở.

Giỏ nhiều dòng: 7 sản phẩm tổng 1.040.000 ₫, nút checkout nằm 738,4–788 px trong chiều cao 844. Giỏ Bột trong Codex: 2 gói Núi Min = 380.000 ₫. Không tạo đơn, không gọi điện/gửi email, không tác động giỏ Wix.

## Giới hạn

Chưa kiểm thử điện thoại vật lý, Safari/iOS, đọc màn hình, hiệu năng/Core Web Vitals, cổng thanh toán, backend. Chính sách và biến thể 500 g còn cần hoàn thiện. Bản local không phải bản deploy.

Codex có hệ số hiển thị 0,9. Kích thước kiểm thử lấy từ DOM sau khi bù viewport, không từ độ rộng ảnh JPEG. Ảnh `attempt-viewport-433x937.jpg` là lượt chưa đúng viewport, không dùng làm bằng chứng 390×844.

Ảnh `react-v01/source-500g-*.jpg` chỉ là lượt thử chọn biến thể chưa xác nhận cập nhật giá; không dùng làm bảng giá 500 g.

Kiểm tra cuối trong Codex: sắp xếp giá tăng dần hiển thị 110.000, 120.000, 130.000, 140.000, 160.000, 190.000 ₫. Đã reset viewport, mở trang chủ. Giỏ local còn dữ liệu thử 2 gói Bột Núi Min; không có đơn hàng được gửi.

