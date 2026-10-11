import React, { useState } from 'react';
import { 
  Sparkles, 
  ExternalLink, 
  Copy, 
  Check, 
  X, 
  Search, 
  Headphones, 
  BookOpen 
} from 'lucide-react';

interface QuizletItem {
  session: string;
  type: 'listening' | 'reading' | 'global';
  title: string;
  topic: string;
  url: string;
}

export const allQuizletList: QuizletItem[] = [
  {
    session: "Toàn khóa",
    type: "global",
    title: "600 Từ Vựng TOEIC Căn Bản",
    topic: "Tổng hợp từ vựng TOEIC nền tảng xuất hiện nhiều nhất trong đề thi",
    url: "https://quizlet.com/133289919/600-tu-vung-toeic-flash-cards/?i=73nq5i&x=1jqt"
  },
  {
    session: "Buổi 2",
    type: "listening",
    title: "Quizlet Listening 1 - Unit 1: Part 1",
    topic: "Tranh tả người (Photos of People), hành động mắt/tay/chân, tư thế",
    url: "https://quizlet.com/1194046606/flashcards?funnelUUID=661ad734-193e-4807-95f7-0cdbb0f13253"
  },
  {
    session: "Buổi 3",
    type: "reading",
    title: "Quizlet Reading 2 - Unit 2: Adj & Adv",
    topic: "Tính từ, trạng từ, tính từ đuôi -ly, từ vừa là Adj vừa là Adv, so sánh",
    url: "https://quizlet.com/vn/1192105919/toeic-pre-reading-2-adj-adv-flash-cards/?funnelUUID=ffe8a747-2c29-45d8-9cbe-b5d8358f35fb"
  },
  {
    session: "Buổi 4",
    type: "listening",
    title: "Quizlet Listening 2 - Unit 2: Part 1",
    topic: "Tranh tả vật & cảnh (Objects & Scenes), nội thất, giao thông",
    url: "https://quizlet.com/vn/1208232078/to-pre-lis-2-photos-of-object-scenes-flash-cards/?new"
  },
  {
    session: "Buổi 5",
    type: "reading",
    title: "Quizlet Reading 3 - Unit 3: Verb Tenses",
    topic: "Các thì ngữ pháp (Hiện tại đơn, Quá khứ đơn, Tương lai, Tiếp diễn, Hoàn thành)",
    url: "https://quizlet.com/1192789810/flashcards?funnelUUID=0ef38878-27ad-4b17-9443-a1017d1ce814"
  },
  {
    session: "Buổi 6",
    type: "listening",
    title: "Quizlet Listening 3 - Unit 3: Part 2",
    topic: "Câu hỏi thông tin Who, What, Which, dấu hiệu trả lời và bẫy Part 2",
    url: "https://quizlet.com/1210498948/flashcards?funnelUUID=ad9ac91d-fa3a-47cc-b438-804bf50a603b"
  },
  {
    session: "Buổi 7",
    type: "reading",
    title: "Quizlet Reading 4 - Unit 4: Active & Passive",
    topic: "Câu chủ động & bị động (Be + V-pp các thì, mẹo nhận biết tân ngữ)",
    url: "https://quizlet.com/1193075390/flashcards?funnelUUID=f43eca73-806a-4e2b-bb93-20cd86d2aca1"
  },
  {
    session: "Buổi 8",
    type: "listening",
    title: "Quizlet Listening 4 - Unit 4: Part 2",
    topic: "Câu hỏi When, Where, Why, How và từ vựng giao thông phương tiện",
    url: "https://quizlet.com/1193919008/flashcards?funnelUUID=c2169e6c-fdfc-473f-b171-d3ffa6b7c3e7"
  },
  {
    session: "Buổi 9",
    type: "reading",
    title: "Quizlet Reading 5+6: To-V & Gerunds",
    topic: "To-V và Danh động từ V-ing (chức năng, cụm cố định, sau giới từ)",
    url: "https://quizlet.com/1194235509/flashcards?funnelUUID=e80c9b8d-1332-41d3-a772-4ba9da3bb2d0"
  },
  {
    session: "Buổi 10",
    type: "listening",
    title: "Quizlet Listening 5 - Unit 5: Part 2",
    topic: "Câu hỏi Yes/No, Modal Verbs và từ vựng Kế toán & Đầu tư",
    url: "https://quizlet.com/1214577473/flashcards?funnelUUID=ee9753b9-be65-4af2-8e24-e644feccfb1f"
  },
  {
    session: "Buổi 11",
    type: "reading",
    title: "Quizlet Reading 7 - Unit 7: Participles",
    topic: "Phân từ V-ing vs V-pp, tính từ chỉ cảm xúc, cụm phân từ rút gọn",
    url: "https://quizlet.com/vn/1195007847/toeic-pre-read-7-participle-flash-cards/?funnelUUID=e35ba8ed-ea18-4c02-a77a-786c05c57d63"
  },
  {
    session: "Buổi 13",
    type: "listening",
    title: "Quizlet Listening 6 - Unit 6: Part 2",
    topic: "Câu hỏi phủ định, câu hỏi đuôi, câu hỏi gián tiếp, câu hỏi 'OR'",
    url: "https://quizlet.com/vn/960706053/listening-6-part-2-other-types-of-questions-flash-cards/?i=73nq5i&x=1jqt"
  },
  {
    session: "Buổi 14",
    type: "reading",
    title: "Quizlet Reading 8 - Unit 8: Conjunctions & Preps",
    topic: "FANBOYS, liên từ tương quan, phân biệt Liên từ + SV vs Giới từ + N",
    url: "https://quizlet.com/vn/1219203105/to-pre-read-89-conjunction-prep-flash-cards/?i=73nq5i&x=1qqt"
  },
  {
    session: "Buổi 15",
    type: "listening",
    title: "Quizlet Listening 7 - Unit 7: Part 3",
    topic: "Part 3 Business Activities & Special Events, kỹ thuật paraphrase",
    url: "https://quizlet.com/1220030691/flashcards?funnelUUID=d476926d-3edc-4845-b823-2eb51e7cbef8"
  }
];

interface QuizletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuizletModal: React.FC<QuizletModalProps> = ({ isOpen, onClose }) => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'listening' | 'reading'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const filteredItems = allQuizletList.filter((item) => {
    const matchFilter = 
      filterType === 'all' || 
      item.type === filterType || 
      (filterType === 'listening' && item.type === 'listening') ||
      (filterType === 'reading' && item.type === 'reading');

    const q = searchQuery.toLowerCase();
    const matchSearch = 
      !searchQuery || 
      item.session.toLowerCase().includes(q) ||
      item.title.toLowerCase().includes(q) ||
      item.topic.toLowerCase().includes(q);

    return matchFilter && matchSearch;
  });

  return (
    <div className="modal active" onClick={onClose}>
      <div 
        className="modal-box" 
        style={{ maxWidth: '780px', width: '95%', maxHeight: '88vh', display: 'flex', flexDirection: 'column' }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header" style={{ marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ 
              background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', 
              color: '#fff', 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Sparkles size={18} />
            </span>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800 }}>Kho Tổng Hợp Link Quizlet Toàn Khóa</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-sub)' }}>
                Tất cả 14+ bộ Flashcard Quizlet từ Buổi 2 đến Buổi 15 • Bấm là mở ngay
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <div className="search-input-wrapper" style={{ flex: 1, minWidth: '220px' }}>
            <Search size={14} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Tìm theo buổi, chủ đề từ vựng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-chips" style={{ minWidth: '220px' }}>
            <button
              className={`chip-btn ${filterType === 'all' ? 'active' : ''}`}
              onClick={() => setFilterType('all')}
            >
              Tất cả ({allQuizletList.length})
            </button>
            <button
              className={`chip-btn ${filterType === 'listening' ? 'active' : ''}`}
              onClick={() => setFilterType('listening')}
            >
              Listening
            </button>
            <button
              className={`chip-btn ${filterType === 'reading' ? 'active' : ''}`}
              onClick={() => setFilterType('reading')}
            >
              Reading
            </button>
          </div>
        </div>

        {/* Scrollable list */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
          {filteredItems.map((item, idx) => {
            const isCopied = copiedUrl === item.url;
            return (
              <div 
                key={idx}
                style={{
                  background: 'var(--bg-card-sub)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '3px 8px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                    background: item.type === 'listening' ? 'rgba(59, 130, 246, 0.15)' :
                                item.type === 'reading' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)',
                    color: item.type === 'listening' ? '#60a5fa' :
                           item.type === 'reading' ? '#34d399' : '#c084fc',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {item.type === 'listening' && <Headphones size={11} />}
                    {item.type === 'reading' && <BookOpen size={11} />}
                    {item.type === 'global' && <Sparkles size={11} />}
                    <span>{item.session}</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text-main)' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--text-sub)' }}>
                      {item.topic}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleCopy(item.url)}
                    className="btn-action"
                    title="Sao chép link"
                    style={{ padding: '6px 10px', fontSize: '11.5px' }}
                  >
                    {isCopied ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
                    <span>{isCopied ? 'Đã chép' : 'Chép'}</span>
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-action"
                    style={{ 
                      padding: '6px 12px', 
                      fontSize: '11.5px', 
                      background: 'linear-gradient(135deg, #4f46e5, #4338ca)', 
                      color: '#fff', 
                      borderColor: '#4f46e5' 
                    }}
                  >
                    <span>Mở ngay</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
