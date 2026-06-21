import React, { useState, useEffect } from 'react';
import { Mail, FileText, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { apiCall } from '../../utils/api';
import './AdminNavbar.css';

export default function AdminNavbar({ onMessagesClick, onProposalsClick, unreadCount, pendingCount, toggleSidebar }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
      localStorage.setItem('admin_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('admin_theme', 'light');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('admin_theme') || 'dark';
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  }, []);

  return (
    <div className="admin-header">
      <button className="icon-btn" onClick={toggleSidebar} title="Toggle Sidebar">
        <span className="menu-icon">☰</span>
      </button>
      <div className="admin-header-title">Admin Panel</div>
      <div className="admin-header-actions">
        <button className="icon-btn theme-toggle" onClick={toggleTheme} title="Toggle Dark/Light Mode">
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="icon-btn" onClick={onProposalsClick} title="Project Proposals">
          <FileText size={22} />
          {pendingCount > 0 && <span className="unread-badge">{pendingCount}</span>}
        </button>
        <button className="icon-btn" onClick={onMessagesClick} title="Messages">
          <Mail size={22} />
          {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
        </button>
        {/* Sidebar toggle button */}
      
        <button className="icon-btn" onClick={() => {
          localStorage.removeItem('admin_token');
          navigate('/admin');
        }} title="Logout">
          Logout
        </button>
      </div>
    </div>
  );
}
