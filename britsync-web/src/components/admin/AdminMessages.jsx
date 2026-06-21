import React, { useState, useEffect } from 'react';
import { Mail, MailOpen, Trash2, Search, Loader2, X, User, Clock, MessageSquare, Phone, Briefcase } from 'lucide-react';
import { apiCall } from '../../utils/api';
import './AdminMessages.css';

const PAGE_SIZE = 20;

const filterOptions = [
  { value: '', label: 'All' },
  { value: 'unread', label: 'Unread' },
  { value: 'read', label: 'Read' },
];

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Scroll Lock for Message Modal
  useEffect(() => {
    if (selected) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [selected]);

  useEffect(() => {
    fetchMessages();
    // eslint-disable-next-line
  }, [search, filter, page]);

  async function fetchMessages() {
    setLoading(true);
    setError('');
    try {
      const res = await apiCall(`messages?search=${encodeURIComponent(search)}&filter=${filter}&page=${page}&limit=${PAGE_SIZE}`);
      setMessages(res.messages);
      setTotal(res.total);
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(msg) {
    setSelected(msg);
    if (!msg.isRead) markAsRead(msg._id);
  }

  async function markAsRead(id) {
    try {
      await apiCall(`messages/${id}/read`, { method: 'PATCH' });
      setMessages(msgs => msgs.map(m => m._id === id ? { ...m, isRead: true } : m));
    } catch { }
  }


  async function handleDelete(id) {
    if (!window.confirm('Delete this message?')) return;
    setDeleting(true);
    try {
      await apiCall(`messages/${id}`, { method: 'DELETE' });
      setMessages(msgs => msgs.filter(m => m._id !== id));
      setSelected(null);
      setSuccess('Message deleted');
    } catch {
      setError('Failed to delete message');
    } finally {
      setDeleting(false);
    }
  }

  async function handleMarkAllRead() {
    try {
      await apiCall('messages/mark-all-read', { method: 'PATCH' });
      setMessages(msgs => msgs.map(m => ({ ...m, isRead: true })));
      setSuccess('All marked as read');
    } catch {
      setError('Failed to mark all as read');
    }
  }

  // Pagination
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="admin-messages">
      <div className="messages-header">
        <h2><Mail size={20} /> Messages</h2>
        <div className="messages-actions">
          <button onClick={handleMarkAllRead} disabled={loading} title="Mark all as read">Mark all as read</button>
        </div>
      </div>
      <div className="messages-controls">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by email or text..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <select value={filter} onChange={e => { setFilter(e.target.value); setPage(1); }}>
          {filterOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div className="messages-list">
        {loading ? <Loader2 className="spin" /> : messages.length === 0 ? <div className="empty">No messages found.</div> : (
          <ul>
            {messages.map(msg => (
              <li
                key={msg._id}
                className={`msg-item${msg.isRead ? '' : ' unread'}${selected && selected._id === msg._id ? ' selected' : ''}`}
                onClick={() => handleSelect(msg)}
              >
                <span className="msg-icon">
                  {msg.isRead ? <MailOpen size={18} /> : <Mail size={18} />}
                </span>
                <span className="msg-email">{msg.userName || msg.email}</span>
                <span className="msg-preview">{msg.message?.slice(0, 50)}{msg.message?.length > 50 ? '...' : ''}</span>
                <span className="msg-date">{new Date(msg.createdAt).toLocaleDateString()}</span>
                {!msg.isRead && <span className="msg-unread-dot" />}
                <button className="msg-delete" onClick={e => { e.stopPropagation(); handleDelete(msg._id); }} disabled={deleting}><Trash2 size={16} /></button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="messages-pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} className={page === i + 1 ? 'active' : ''} onClick={() => setPage(i + 1)}>{i + 1}</button>
        ))}
      </div>
      {selected && (
        <div className="message-detail-modal" onClick={(e) => e.target.className === 'message-detail-modal' && setSelected(null)}>
          <div className="modal-content">
            <div className="modal-header">
              <div className="modal-header-content">
                <div className="modal-title-section">
                  <div className="modal-icon-wrapper">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className="modal-title">Contact Form Message</h3>
                    <div className="modal-subtitle">
                      <User size={14} />
                      <span>{selected.userEmail}</span>
                    </div>
                  </div>
                </div>
                <button className="modal-close-btn" onClick={() => setSelected(null)}>
                  <X size={20} />
                </button>
              </div>
              <div className="modal-meta">
                <div className="meta-item">
                  <Clock size={14} />
                  <span>{new Date(selected.createdAt).toLocaleString('en-US', {
                    dateStyle: 'full',
                    timeStyle: 'short'
                  })}</span>
                </div>
                {!selected.isRead && <span className="unread-badge">New</span>}
              </div>
            </div>
            <div className="modal-body">
              <div className="message-info-grid">
                <div className="info-item">
                  <div className="info-label">
                    <User size={16} />
                    <span>Name</span>
                  </div>
                  <div className="info-value">{selected.userName}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <Mail size={16} />
                    <span>Email</span>
                  </div>
                  <div className="info-value">
                    <a href={`mailto:${selected.email}`}>{selected.email}</a>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <Phone size={16} />
                    <span>Phone</span>
                  </div>
                  <div className="info-value">
                    <a href={`tel:${selected.phoneNumber}`}>{selected.phoneNumber}</a>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <Briefcase size={16} />
                    <span>Service</span>
                  </div>
                  <div className="info-value">{selected.serviceId?.title || 'N/A'}</div>
                </div>
              </div>
              <div className="message-content">
                <div className="message-label">Message:</div>
                <div className="message-text">{selected.message}</div>
              </div>
              <div className="message-actions">
                <a
                  href={`mailto:${selected.email}?subject=Re: Your Contact Form Inquiry`}
                  className="action-btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Reply via Email
                </a>
                <a
                  href={`tel:${selected.phoneNumber}`}
                  className="action-btn-secondary"
                >
                  Call {selected.userName}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      {(error || success) && <div className={`msg-toast ${error ? 'error' : 'success'}`}>{error || success}</div>}
    </div>
  );
}
