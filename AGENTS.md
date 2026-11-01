# Quy tắc cho bản React

Người dùng đổi nền tảng sang tự code ngày 01/11/2026. Yêu cầu giáo viên cho phép tự code. Thư mục này là bản dựng riêng; không ghi đè site Wix.

- React + TypeScript + Vite. Giữ nhận diện kem/nâu, ảnh, giá và nội dung nguồn trong `source/`.
- Dùng nội dung Wix `/website` làm nguồn. Phân biệt tái hiện nhận diện và nội dung với sao chép pixel tuyệt đối; phải ghi khác biệt.
- SEO và biên tập blog SEO để sau. Hai bài blog hiện tại là bản chuyển từ Wix, chưa nghiệm thu SEO.
- Chụp trước/sau thật tại `../evidence/react-vXX/`. Không ghi đè ảnh lượt trước. Báo cáo lỗi, tác động, cách sửa, kiểm chứng, bài học.
- Mobile: menu cạnh cart bên phải; submenu đóng mặc định; dialog dùng `showModal`, Escape, focus, vùng cuộn riêng; CTA không bị che.
- Kiểm tra 1440×900, 768×1024, 390×844; thêm 360/320 khi nguy cơ tràn. Ghi viewport thực tế.
- Không bịa giá biến thể 500 g; không giả thông báo gửi đơn/thanh toán thành công khi chưa có backend.
- Không nhập giỏ hàng, khách hàng hay token từ Wix. Không đặt khóa bí mật vào frontend.
- `npm run build` và `npm run verify` trước bàn giao. Hồi quy giỏ hàng khi thay đổi state/tính tiền.
