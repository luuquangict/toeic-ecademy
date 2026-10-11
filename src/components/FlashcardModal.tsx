import React, { useState } from 'react';
import { Flashcard } from '../types';
import { 
  Zap, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw 
} from 'lucide-react';

interface FlashcardModalProps {
  cards: Flashcard[];
  isOpen: boolean;
  onClose: () => void;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({
  cards,
  isOpen,
  onClose,
}) => {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen || cards.length === 0) return null;

  const currentCard = cards[index];

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % cards.length);
    setIsFlipped(false);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + cards.length) % cards.length);
    setIsFlipped(false);
  };

  return (
    <div className="modal active" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="var(--accent-amber)" />
            <h4 style={{ fontSize: '16px', fontWeight: 800 }}>Flashcard Ôn Nhanh Bẫy & Mẹo</h4>
          </div>
          <button 
            onClick={onClose} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer' 
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="flashcard" onClick={() => setIsFlipped(!isFlipped)}>
          <div className="fc-q">{currentCard.q}</div>
          {!isFlipped ? (
            <div className="fc-hint">
              <RotateCcw size={13} style={{ display: 'inline', marginRight: '5px' }} />
              Bấm vào thẻ để lật xem đáp án
            </div>
          ) : (
            <div className="fc-a" style={{ display: 'block' }}>
              {currentCard.a}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn-action" onClick={handlePrev}>
            <ChevronLeft size={16} />
            <span>Thẻ Trước</span>
          </button>

          <span style={{ fontSize: '12px', color: 'var(--text-sub)', fontWeight: 600 }}>
            {index + 1} / {cards.length}
          </span>

          <button 
            className="btn-action" 
            onClick={handleNext}
            style={{ background: 'var(--accent-blue)', color: '#fff', borderColor: 'var(--accent-blue)' }}
          >
            <span>Thẻ Tiếp</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
