import React from "react";
import { Menu, Sun, Moon } from "lucide-react";
import "./TopHeader.css";

export interface TopHeaderProps {
  title?: string;
  leftContent?: React.ReactNode;
  onOpenMobileMenu?: () => void;
  theme?: "dark" | "light";
  onToggleTheme?: () => void;
  rightAction?: React.ReactNode;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title,
  leftContent,
  onOpenMobileMenu,
  theme,
  onToggleTheme,
  rightAction,
}) => {
  return (
    <header className="top-header">
      <div className="top-header-left">
        {onOpenMobileMenu && (
          <button
            className="mobile-menu-btn"
            onClick={onOpenMobileMenu}
            title="Mở menu danh sách"
          >
            <Menu size={20} />
          </button>
        )}

        {leftContent}

        {title && <span className="page-indicator">{title}</span>}
      </div>

      <div className="top-header-right">
        {rightAction}

        {onToggleTheme && (
          <button
            className="btn-action theme-toggle-btn"
            onClick={onToggleTheme}
            title={theme === "dark" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"}
            style={{ padding: "6px 9px" }}
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        )}
      </div>
    </header>
  );
};

export default TopHeader;
