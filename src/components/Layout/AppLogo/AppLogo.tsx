import React from 'react';
import { Sparkles } from 'lucide-react';
import './AppLogo.css';

interface AppLogoProps {
  onClick?: () => void;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ onClick, className = '' }) => {
  return (
    <div
      className={`app-brand-logo ${className}`}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
      title={onClick ? 'Quay về Trang Chủ' : undefined}
    >
      <div className="app-brand-icon">
        <Sparkles size={18} color="var(--accent-cyan)" />
      </div>
      <span className="app-brand-text">TOEIC Prep Hub</span>
    </div>
  );
};

export default AppLogo;
