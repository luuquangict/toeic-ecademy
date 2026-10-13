-- =========================================================================
-- TOEIC Audio Reports Schema for Supabase
-- Copy toàn bộ đoạn này và bấm RUN trong Supabase Dashboard -> SQL Editor
-- =========================================================================

-- 1. Tạo bảng audio_reports lưu trữ bài bị report theo track_key duy nhất
CREATE TABLE IF NOT EXISTS public.audio_reports (
  track_key TEXT PRIMARY KEY,
  track_title TEXT NOT NULL,
  reason TEXT NOT NULL,
  report_count INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Cấu hình Row Level Security (RLS) cho phép anon (khách vãng lai) thao tác
-- Xóa các policy cũ nếu có để tránh xung đột
DROP POLICY IF EXISTS "Allow public read audio_reports" ON public.audio_reports;
DROP POLICY IF EXISTS "Allow public insert audio_reports" ON public.audio_reports;
DROP POLICY IF EXISTS "Allow public update audio_reports" ON public.audio_reports;
DROP POLICY IF EXISTS "Allow public all audio_reports" ON public.audio_reports;

-- Bật RLS
ALTER TABLE public.audio_reports ENABLE ROW LEVEL SECURITY;

-- Tạo policy đầy đủ (SELECT, INSERT, UPDATE) kèm WITH CHECK (true)
CREATE POLICY "Allow public all audio_reports" ON public.audio_reports
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 3. Function RPC 'report_track' để TĂNG COUNT NGUYÊN TỬ (không cần SELECT count ra trước)
CREATE OR REPLACE FUNCTION public.report_track(
  p_track_key TEXT,
  p_track_title TEXT,
  p_reason TEXT
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.audio_reports (track_key, track_title, reason, report_count, updated_at)
  VALUES (p_track_key, p_track_title, p_reason, 1, NOW())
  ON CONFLICT (track_key)
  DO UPDATE SET
    report_count = public.audio_reports.report_count + 1,
    reason = EXCLUDED.reason,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cấp quyền gọi function này cho role anon (client không cần đăng nhập)
GRANT EXECUTE ON FUNCTION public.report_track(TEXT, TEXT, TEXT) TO anon, authenticated;
