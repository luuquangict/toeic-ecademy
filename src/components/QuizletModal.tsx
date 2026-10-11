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
import { allQuizletList } from '../data/quizlet';


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
