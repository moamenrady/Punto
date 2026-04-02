import React, { useState } from 'react';

const TicketDetailsModal = ({ ticket, isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState('details');

    if (!isOpen || !ticket) return null;

    const getCategoryTheme = (category) => {
        switch (category?.toLowerCase()) {
            case 'network': return 'badge-network';
            case 'hardware': return 'badge-hardware';
            case 'software': return 'badge-software';
            default: return 'badge-software';
        }
    };

    const getStatusTheme = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return 'badge-open';
            case 'in progress': return 'badge-inprogress';
            case 'closed': return 'badge-closed';
            default: return 'badge-open';
        }
    };

    const currentUserId = 'Me'; // Simple mock

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose} aria-label="Close">
                    <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>

                <h2 className="modal-header-title">{ticket.title}</h2>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                    <span className={`badge ${getCategoryTheme(ticket.category)}`}>{ticket.category}</span>
                    <span className={`badge ${getStatusTheme(ticket.status)}`}>{ticket.status}</span>
                </div>

                <div className="tabs-container">
                    <button className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>Details</button>
                    <button className={`tab-btn ${activeTab === 'solutions' ? 'active' : ''}`} onClick={() => setActiveTab('solutions')}>Solutions</button>
                    <button className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`} onClick={() => setActiveTab('chat')}>Chat</button>
                </div>

                {activeTab === 'details' && (
                    <div className="tab-content" style={{ animation: 'fadeIn 0.2s ease' }}>
                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{ticket.description}</p>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Assigned User</label>
                            <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem', fontWeight: 500 }}>Ahmed Ali</p>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Attachements</label>
                            <div className="file-upload" style={{ padding: '16px', background: 'transparent' }}>
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                                <span>No file attached</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'solutions' && (
                    <div className="tab-content" style={{ animation: 'fadeIn 0.2s ease' }}>
                        <div className="solution-box">Check your internet connection and try again</div>
                        <div className="solution-box">Restart VPN and refresh the network</div>
                        <div className="solution-box">Secure connection failed — please reconnect</div>
                    </div>
                )}

                {activeTab === 'chat' && (
                    <div className="chat-container" style={{ animation: 'fadeIn 0.2s ease' }}>
                        <div className="chat-messages">
                            <div className="chat-message them">
                                <div className="chat-avatar">AA</div>
                                <div>
                                    <div className="chat-meta"><span>Ahmed Ali</span> <span>06:05 PM</span></div>
                                    <div className="chat-bubble">Hi, I have an issues</div>
                                </div>
                            </div>

                            <div className="chat-message me">
                                <div className="chat-avatar">Me</div>
                                <div>
                                    <div className="chat-meta"><span>Me</span> <span>06:05 PM</span></div>
                                    <div className="chat-bubble">Hi, I have an issues</div>
                                </div>
                            </div>

                            <div className="chat-message them">
                                <div className="chat-avatar">AA</div>
                                <div>
                                    <div className="chat-meta"><span>Ahmed Ali</span> <span>06:05 PM</span></div>
                                    <div className="chat-bubble">Hi, I have an issues</div>
                                </div>
                            </div>

                            <div className="chat-message me">
                                <div className="chat-avatar">Me</div>
                                <div>
                                    <div className="chat-meta"><span>Me</span> <span>06:05 PM</span></div>
                                    <div className="chat-bubble">Hi, I have an issues</div>
                                </div>
                            </div>
                        </div>

                        <div className="chat-input-area">
                            <input type="text" className="chat-input" placeholder="Type Your Message" />
                            <button className="chat-attach" title="Attach file">
                                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                            </button>
                            <button className="chat-send" title="Send message">
                                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                            </button>
                        </div>
                    </div>
                )}

                <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(4px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
            </div>
        </div>
    );
};

export default TicketDetailsModal;
