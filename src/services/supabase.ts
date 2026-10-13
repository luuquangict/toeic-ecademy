import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl !== "https://your-project.supabase.co" &&
    supabaseAnonKey !== "your-anon-key"
);

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

export interface AudioReportItem {
  track_key: string;
  track_title: string;
  reason: string;
  report_count: number;
  updated_at: string;
}

/**
 * Gửi báo cáo bài nghe lên Supabase.
 * Cơ chế: Gọi RPC 'report_track' trong Supabase (PostgreSQL) để thực hiện
 * INSERT ... ON CONFLICT (track_key) DO UPDATE SET report_count = audio_reports.report_count + 1
 * -> Hoàn toàn nguyên tử, KHÔNG cần phải SELECT count ra trước rồi mới increase.
 */
export async function submitAudioReport(
  trackKey: string,
  trackTitle: string,
  reason: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: "Chưa cấu hình VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY trong file .env",
    };
  }

  try {
    // 1. Thử gọi RPC atomic increment
    const { error: rpcError } = await supabase.rpc("report_track", {
      p_track_key: trackKey,
      p_track_title: trackTitle,
      p_reason: reason,
    });

    if (!rpcError) {
      return { success: true };
    }

    console.warn("RPC report_track chưa được tạo hoặc lỗi, chuyển sang fallback auto-increment:", rpcError);

    // 2. Fallback nếu chưa tạo function RPC trên Supabase:
    // Lấy count hiện tại để tăng lên 1 mà không làm gián đoạn người dùng
    const { data: existing } = await supabase
      .from("audio_reports")
      .select("report_count")
      .eq("track_key", trackKey)
      .maybeSingle();

    const currentCount = existing ? (existing.report_count ?? 0) : 0;
    const newCount = currentCount + 1;

    const { error: upsertError } = await supabase.from("audio_reports").upsert(
      {
        track_key: trackKey,
        track_title: trackTitle,
        reason: reason,
        report_count: newCount,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "track_key" }
    );

    if (upsertError) {
      return { success: false, error: upsertError.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Lỗi không xác định khi gửi report" };
  }
}

/**
 * Lấy danh sách các bài đã bị report từ Supabase
 */
export async function fetchAudioReports(): Promise<{
  data: AudioReportItem[];
  error?: string;
}> {
  if (!isSupabaseConfigured) {
    return {
      data: [],
      error: "Chưa cấu hình VITE_SUPABASE_URL và VITE_SUPABASE_ANON_KEY trong file .env",
    };
  }

  try {
    const { data, error } = await supabase
      .from("audio_reports")
      .select("track_key, track_title, reason, report_count, updated_at")
      .order("report_count", { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }

    return { data: (data as AudioReportItem[]) || [] };
  } catch (err: any) {
    return {
      data: [],
      error: err?.message || "Lỗi không xác định khi tải danh sách report",
    };
  }
}
