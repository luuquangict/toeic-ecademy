# HƯỚNG DẪN BÓC TÁCH & ĐỒNG BỘ KỊCH BẢN AUDIO TOEIC (SOP & PROMPT)

> **Cách dùng cho bạn:**  
> Khi bạn có một bộ sách TOEIC mới hoặc muốn bóc tách thêm các track audio khác (gồm thư mục file MP3 và file PDF Script / Answer Key), bạn chỉ cần mở một phiên chat mới với AI, gửi kèm file này cùng đường dẫn:  
> 1. Thư mục chứa audio (ví dụ: `D:\TOEIC\...\Audio`)  
> 2. File PDF kịch bản (ví dụ: `D:\TOEIC\...\KEY - SCRIPT.pdf`)  
> AI sẽ đọc quy trình này và tự động chạy script xử lý chuẩn xác 100% mốc thời gian và câu chữ mà **không cần mò mẫm hay thử nghiệm lại từ đầu**!

---

## 🎯 YÊU CẦU DÀNH CHO AI ASSISTANT

Bạn đang làm việc trên dự án **TOEIC Master Hub** (React + TypeScript + Vite) tại thư mục `d:\Jobs\MegaSmartHome\toeic-summary`.

Nhiệm vụ của bạn là: **Bóc tách danh sách các câu từ file PDF kịch bản của sách, đo mốc thời gian (start - end) trực tiếp từ file âm thanh MP3, và lưu vào file kịch bản tương tác `src/data/audioScripts.json`.**

---

## ⚠️ 3 CẠM BẪY CẦN TUYỆT ĐỐI TRÁNH (BÀI HỌC THỰC TẾ)

1. **Cạm bẫy 1: Nhạc dạo đầu đĩa (Intro Theme Music)**  
   * Ở track đầu tiên của mỗi đĩa CD (như `01_01`), thường có **15 – 25 giây nhạc dạo** và phần đọc hướng dẫn chung.  
   * *Tuyệt đối KHÔNG* dùng thuật toán cắt khoảng lặng mù quáng từ giây 0.0 vì sẽ nhận nhầm các nhịp nhạc dạo thành lựa chọn `Option A`.  
   * *Giải pháp*: Phải loại bỏ đoạn nhạc dạo và chỉ bắt đầu tính từ khi giọng xướng câu hỏi / hướng dẫn của bài xuất hiện.

2. **Cạm bẫy 2: Nhầm Câu hỏi (Question) thành Option A ở Part 2**  
   * Ở Part 2, cấu trúc mỗi câu là: **Câu hỏi ➔ Option A ➔ Option B ➔ Option C**.  
   * Nếu đếm số đoạn âm thanh mà quên tính câu hỏi, toàn bộ các lựa chọn phía sau sẽ bị lệch 1 bậc (khi bấm câu C âm thanh sẽ phát ra câu B).  
   * *Giải pháp*: Phải gán đúng mốc cho Câu hỏi (`Q1`, `Q2`), sau đó mới đến `A`, `B`, `C`.

3. **Cạm bẫy 3: Dùng Speech-to-Text để sinh mặt chữ (Text)**  
   * *Tuyệt đối KHÔNG* dùng AI Speech-to-Text để sinh text câu vì rất dễ nghe sai chính tả, sai từ nối, tên riêng và ngữ pháp so với sách.  
   * *Giải pháp*: **100% mặt chữ Text phải được trích xuất từ file PDF kịch bản gốc của sách**. Âm thanh MP3 chỉ dùng để đo mốc thời gian `start` và `end`.

---

## 📂 1. ĐỊNH DẠNG DỮ LIỆU CHUẨN (`src/data/audioScripts.json`)

Cấu trúc mỗi track trong mảng JSON phải tuân thủ nghiêm ngặt schema tinh gọn sau:

```json
{
  "key": "01_01",
  "unit": 1,
  "track": 1,
  "fileName": "01_01 - TOEIC Preparation Vol 1.mp3",
  "part": 1,
  "partTitle": "Part 1: Photographs",
  "topic": "Human Actions - Gardening & Planting",
  "duration": 56.35,
  "sentences": [
    {
      "id": 1,
      "label": "Intro",
      "text": "Part 1. Photo Descriptions. Unit 1. Practice. Number 1.",
      "start": 22.5,
      "end": 36.2
    },
    {
      "id": 2,
      "label": "A",
      "text": "A woman is wearing gloves.",
      "start": 37.0,
      "end": 40.5
    },
    {
      "id": 3,
      "label": "B",
      "text": "A woman is using a shovel.",
      "start": 41.0,
      "end": 44.5
    },
    {
      "id": 4,
      "label": "C",
      "text": "A woman is watering a plant.",
      "start": 45.2,
      "end": 48.8
    },
    {
      "id": 5,
      "label": "D",
      "text": "A woman is arranging flowers.",
      "start": 49.5,
      "end": 53.2
    }
  ]
}
```

### Quy ước trường `label`:
* **Part 1**: `Intro`, `A`, `B`, `C`, `D`
* **Part 2**: `Q1`, `A`, `B`, `C`, `Q2`, `A`, `B`, `C` (Part 2 không có D)
* **Part 3**: `M` (Man), `W` (Woman)
* **Part 4**: `1`, `2`, `3`... (đánh số theo từng câu trong đoạn độc thoại)

> **Lưu ý sạch sẽ**: KHÔNG thêm các trường thừa thãi như `speaker`, `type`, hay `isCorrect`. Chỉ giữ đúng 5 trường: `id`, `label`, `text`, `start`, `end`.

---

## 🛠️ 2. CÔNG CỤ & THƯ VIỆN PYTHON CẦN DÙNG

Chạy trực tiếp trên máy thông qua Python:
* `pypdf`: Đọc và trích xuất text từ file PDF Script/Key.
* `miniaudio`: Giải mã trực tiếp file MP3 thành mảng byte PCM thô trong vài mili-giây (cực nhanh, không cần cài FFmpeg).
* `numpy`: Tính toán năng lượng âm thanh (RMS Energy Windowing) để phát hiện giọng nói (VAD).
* `speech_recognition`: Cắt nhanh 1 đoạn âm thanh kiểm tra đối soát nếu cần xác định vị trí câu hỏi.

Lệnh cài đặt nếu máy chưa có:
```bash
pip install pypdf miniaudio numpy speechrecognition
```

---

## 🚀 3. QUY TRÌNH THỰC HIỆN 3 BƯỚC

### Bước 1: Trích xuất Text từ file PDF Script
1. Dùng `pypdf.PdfReader` đọc các trang kịch bản tương ứng với Unit đang xử lý.
2. Bóc tách từng mục (`Practice`, `Exercises A`, `Exercises B`, `Actual Questions`...).
3. Làm sạch text: Xóa bỏ các ký tự xuống dòng vô nghĩa giữa từ, chuẩn hóa dấu câu.

### Bước 2: Đo sóng âm thanh (Energy VAD Alignment)
1. Đọc file MP3 bằng `miniaudio.decode()`.
2. Chuyển đổi sang mảng mono float32: `samples.reshape(-1, nch).mean(axis=1)`.
3. Tính RMS theo khung thời gian: cửa sổ `40ms`, bước nhảy `20ms`.
4. Tìm các đoạn có tiếng nói vượt ngưỡng năng lượng (`threshold = max_energy * 0.06`).
5. Gộp các khoảng ngắt nghỉ giữa các từ trong cùng một câu (`pause < 0.65s`).
6. Bỏ qua đoạn nhạc dạo và lời dẫn chung ở đầu, khớp từng đoạn tiếng nói với danh sách câu từ Bước 1 để lấy `start` và `end`.

### Bước 3: Xuất và kiểm tra chất lượng
1. Ghi đè vào `src/data/audioScripts.json`.
2. Kiểm tra các điều kiện chất lượng:
   * Mọi câu đều có `start < end`.
   * Câu sau phải có `start >= end` của câu trước.
   * `start` không bao giờ được bắt đầu trong đoạn nhạc dạo.
3. Chạy lệnh kiểm tra TypeScript:
   ```bash
   npm run build
   ```

---

## 📋 SCRIPT MẪU PYTHON (COPY VÀ CHẠY NGAY)

Dưới đây là khung script mẫu để AI thực thi batch xử lý:

```python
import os
import json
import miniaudio
import numpy as np

def extract_voice_segments(mp3_path, min_duration=0.45, merge_pause=0.65):
    with open(mp3_path, "rb") as f:
        sound = miniaudio.decode(f.read())
    
    sr = sound.sample_rate
    nch = sound.nchannels
    raw = np.frombuffer(sound.samples, dtype=np.int16)
    samples = raw.reshape(-1, nch).mean(axis=1).astype(np.float32) if nch > 1 else raw.astype(np.float32)
    dur = len(samples) / sr
    
    win = int(sr * 0.04)
    hop = int(sr * 0.02)
    energies = [np.sqrt(np.mean(samples[i:i+win]**2)) for i in range(0, len(samples)-win, hop)]
    energies = np.array(energies)
    times = np.arange(len(energies)) * (hop / sr)
    
    thresh = np.max(energies) * 0.06
    is_active = energies > thresh
    
    raw_segs = []
    in_s, s_t = False, 0
    for t, act in zip(times, is_active):
        if act and not in_s:
            in_s, s_t = True, t
        elif not act and in_s:
            in_s = False
            raw_segs.append((s_t, t))
    if in_s:
        raw_segs.append((s_t, times[-1]))
        
    merged = []
    for s, e in raw_segs:
        if not merged or s - merged[-1][1] >= merge_pause:
            merged.append([s, e])
        else:
            merged[-1][1] = e
            
    valid = [(round(s, 2), round(e, 2)) for s, e in merged if (e - s) >= min_duration]
    return dur, valid
```

---

## ✅ CHECKLIST NGHIỆM THU

Trước khi báo cáo hoàn thành cho người dùng, AI phải kiểm tra:
- [ ] Text 100% khớp với nội dung sách in trong PDF (không phải chữ do AI tự đoán).
- [ ] Bấm câu nào trên giao diện thì âm thanh phát đúng câu đó (không lệch câu trước / câu sau).
- [ ] Không có trường thừa thãi trong file JSON.
- [ ] Lệnh `npm run build` kết thúc với mã `code 0` (không có lỗi TypeScript).
