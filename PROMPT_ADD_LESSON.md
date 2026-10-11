# HƯỚNG DẪN CẬP NHẬT BUỔI HỌC TOEIC MỚI

> **Cách dùng cho bạn:**  
> Khi có nội dung buổi học mới từ cô giáo, bạn chỉ cần mở một khung chat mới với AI, kéo file này vào kèm theo nội dung cô gửi (hoặc paste thẳng vào phần `[NỘI DUNG CÔ GIÁO GỬI]` ở cuối file).  
> AI sẽ tự động đọc, chuẩn hóa và chèn vào code cho bạn mà không cần phải giải thích lại từ đầu!

---

## 🎯 YÊU CẦU DÀNH CHO AI ASSISTANT

Bạn đang làm việc trên dự án **TOEIC Prep Hub** (React + TypeScript + Vite) tại thư mục `d:\Jobs\MegaSmartHome\toeic-summary`.

Nhiệm vụ của bạn là: **Đọc nội dung buổi học mới mà cô giáo gửi, trích xuất thông tin chuẩn chỉnh và cập nhật vào mã nguồn của dự án.**

---

### 1. File cần cập nhật:
1. `src/data/lessons.ts`: Thêm object buổi học mới vào mảng `lessonsData`.
2. `src/components/QuizletModal.tsx`: Nếu buổi học có link Quizlet, thêm một mục vào mảng `allQuizletList`.
3. `document.md`: Ghi chép nối tiếp nội dung gốc của cô giáo vào cuối file để lưu trữ raw data.

---

### 2. Định dạng chuẩn của 1 buổi học trong `src/data/lessons.ts`:
Tuân thủ đúng kiểu dữ liệu trong `src/types.ts`:

```typescript
{
  id: "buoi-X", // Ví dụ: "buoi-16"
  sessionNum: X, // Số buổi, ví dụ: 16
  type: "listening" | "reading", // Loại kỹ năng
  badge: "Listening • Unit X • Part X", // Hoặc "Reading • Unit X • Parts X, X"
  title: "Buổi X: [Tên Bài Học Tiếng Việt]",
  desc: "[Mô tả tóm tắt 1 câu về nội dung chính của buổi]",
  core: [
    {
      title: "[Tên cấu trúc / thì / quy tắc]",
      code: "[Công thức ngắn gọn]",
      desc: "[Giải thích và ví dụ cụ thể]"
    }
  ],
  grids: [
    {
      title: "[Chủ đề từ vựng / Phân loại]",
      items: [
        "[Từ vựng 1, Từ vựng 2...]",
        "[Cụm từ 1, Cụm từ 2...]"
      ]
    }
  ],
  tips: [
    {
      tag: "MẸO LÀM BÀI" | "BẪY CỰC NGUY HIỂM" | "CHIẾN LƯỢC",
      text: "[Nội dung mẹo nhận biết, bẫy cần tránh]"
    }
  ],
  homework: {
    deadline: "[Hạn nộp chính xác do cô ghi]",
    tasks: [
      "[Tên bài tập LMS 1]",
      "[Tên bài tập LMS 2]",
      "[Student's Book: Chuẩn bị bài tiếp theo]"
    ],
    links: [
      // CHỈ LẤY LINK QUIZLET CHÍNH THỨC, TUYỆT ĐỐI BỎ QUA CÁC LINK BLOOKET/GAME HẾT HẠN
      { 
        name: "Quizlet Buổi X ([Tên chủ đề])", 
        url: "https://quizlet.com/...", 
        isQuizlet: true 
      }
    ]
  }
}
```

---

### 3. Cập nhật vào `src/components/QuizletModal.tsx`:
Nếu có link Quizlet mới, thêm vào mảng `allQuizletList`:
```typescript
{
  session: "Buổi X",
  type: "listening" | "reading",
  title: "Quizlet [Tên bộ từ vựng]",
  topic: "[Tóm tắt các từ vựng trong bộ]",
  url: "https://quizlet.com/..."
}
```

---

### 4. Quy tắc bắt buộc:
* **Font & Ngôn ngữ:** Giữ phong cách tiếng Việt chuẩn, mạch lạc, dễ hiểu cho người ôn thi TOEIC.
* **Lọc link:** Tuyệt đối **KHÔNG** đưa link Blooket hoặc link game tạm thời vào vì chúng sẽ hết hạn sau buổi học.
* **Kiểm tra Build:** Sau khi cập nhật xong, chạy lệnh `npm run build` để đảm bảo không bị lỗi cú pháp hay TypeScript.
* **Tự động Git (nếu được yêu cầu):** Commit với message dạng `feat: add buoi X - [ten bai]` và push lên nhánh `main`.

---

## 📝 [NỘI DUNG CÔ GIÁO GỬI - DÁN VÀO ĐÂY]

*(Dán nội dung tin nhắn hoặc bài review của cô giáo vào bên dưới)*

```markdown

```
