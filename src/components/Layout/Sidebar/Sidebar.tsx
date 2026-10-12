import React from "react";
import { X } from "lucide-react";
import { AppLogo } from "../AppLogo";
import "./Sidebar.css";

export interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
  onGoHome?: () => void;
  children: React.ReactNode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onCloseMobile,
  onGoHome,
  children,
}) => {
  const handleLogoClick = () => {
    if (onGoHome) {
      onCloseMobile();
      onGoHome();
    }
  };

  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand-row">
            <AppLogo onClick={handleLogoClick} />
            <button
              className="mobile-close-btn"
              onClick={onCloseMobile}
              title="Đóng menu"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="sidebar-content-body">{children}</div>
      </aside>

      {/* Backdrop overlay on mobile */}
      {isOpen && <div className="sidebar-backdrop" onClick={onCloseMobile} />}
    </>
  );
};

export default Sidebar;
