# TOEIC Audio A-B Loop Controller (Chrome Extension)

Extension hỗ trợ lặp đoạn âm thanh A-B trực tiếp trên các website học tiếng Anh của trung tâm mà không cần can thiệp mã nguồn website.

## Tính năng
- **Bắt audio tự động**: Tự động nhận diện và gắn vào bất kỳ thẻ audio/video nào trên trang (kể cả audio tải động khi làm bài tập).
- **Sóng âm thanh (Waveform)**: Hiển thị 200 vạch sóng âm trực quan, đổi màu theo tiến trình phát.
- **Kéo thả mốc A & B**:
  - Mốc **[A]** (Vàng): Đặt thời điểm bắt đầu.
  - Mốc **[B]** (Đỏ): Đặt thời điểm kết thúc.
  - Vùng sáng ở giữa thể hiện khoảng lặp A-B.
  - Kim Playhead (xanh cyan) chạy theo thời gian thực.
  - Click vào thanh sóng âm để tua nhanh tới thời điểm bất kỳ.
- **Mặc định lặp lại A-B**: Luôn tự động lặp lại liên tục từ A tới B.
- **4 nút điều khiển**:
  1. `Phát lại từ [A]`: Lập tức quay lại điểm A và phát.
  2. `📍 Đặt [A] (mm:ss)`: Đặt mốc A tại giây đang nghe.
  3. `🏁 Đặt [B] (mm:ss)`: Đặt mốc B tại giây đang nghe.
  4. `Reset toàn bài`: Đặt lại A về 00:00 và B về hết bài.
- **Giao diện Shadow DOM**: Không bị vỡ style bởi CSS của trang web trung tâm, có thể kéo di chuyển vị trí và thu nhỏ khi cần.

## Hướng dẫn cài đặt vào Google Chrome
1. Mở Google Chrome, truy cập vào đường dẫn: `chrome://extensions`
2. Bật công tắc **Developer mode** (Chế độ dành cho nhà phát triển) ở góc trên bên phải.
3. Bấm vào nút **Load unpacked** (Tải tiện ích đã giải nén) ở góc trên bên trái.
4. Chọn thư mục:
   `d:\Jobs\MegaSmartHome\toeic-summary\chrome-extensions`
5. Truy cập vào trang web học TOEIC của trung tâm, mở audio nghe và trải nghiệm!
