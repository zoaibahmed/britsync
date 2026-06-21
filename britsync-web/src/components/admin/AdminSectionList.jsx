
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, ArrowUp, ArrowDown } from 'lucide-react';
import Button from '../ui/Button';

const AdminSectionList = ({
    activeSection,
    items,
    onEdit,
    onDelete,
    onAdd,
    loading
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    // No drag-and-drop: rely on explicit order field and up/down controls

    const filteredItems = (items || []).filter(item => {
        const searchStr = searchTerm.toLowerCase();
        const title = (item.title || item.name || item.question || item.label || '').toLowerCase();
        const desc = (item.description || item.bio || item.role || item.answer || item.desc || item.value || '').toLowerCase();
        return title.includes(searchStr) || desc.includes(searchStr);
    });

    // No drag handlers

    // Helper to get display properties based on item data
    const getItemProps = (item) => {
        return {
            title: item.title || item.name || item.question || item.label || 'Untitled',
            subtitle: item.description || item.bio || item.role || item.answer || item.desc || item.value || '',
            image: item.image,
            tag: item.category || item.type || (item.phaseNumber ? `Phase ${item.phaseNumber}` : null)
        };
    };

    return (
        <div className="admin-section-list">
            <div className="section-header">
                <div>
                    <h2 className="section-title">Manage {activeSection.replace(/_/g, ' ')}</h2>
                    <p className="text-muted">{items.length} items</p>
                </div>
                <div className="actions-row">
                    <div className="search-bar">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button onClick={onAdd} className="add-btn">
                        <Plus size={18} /> Add New
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="loader-container">
                    <div className="loader"></div>
                </div>
            ) : (
                <div className="items-grid">
                    {filteredItems.length === 0 ? (
                        <div className="empty-state">
                            <p>No items found.</p>
                        </div>
                    ) : (
                        filteredItems.map(item => {
                            const { title, subtitle, image, tag } = getItemProps(item);
                            return (
                                <div key={item._id} className={`admin-card`}>
                                    {image && (
                                        <div className="admin-card-image">
                                            <img src={image} alt={title} />
                                        </div>
                                    )}
                                    <div className="admin-card-content">
                                        <div className="admin-card-header-row">
                                            <h3>{title}</h3>
                                            {/* Show order badge when present */}
                                            {typeof item.order !== 'undefined' && (
                                                <span className="admin-card-tag">#{item.order}</span>
                                            )}
                                            {tag && <span className="admin-card-tag">{tag}</span>}
                                        </div>
                                        <p className="admin-card-subtitle">{subtitle}</p>
                                    </div>
                                    <div className="admin-card-actions">
                                        {/* Reorder controls for services */}
                                        {activeSection === 'services' && (
                                            <>
                                                <button className="icon-btn" title="Move up" onClick={() => onReorder && onReorder(item._id, 'up')}>
                                                    <ArrowUp size={16} />
                                                </button>
                                                <button className="icon-btn" title="Move down" onClick={() => onReorder && onReorder(item._id, 'down')}>
                                                    <ArrowDown size={16} />
                                                </button>
                                                {/* Drag removed — use Order field or arrow buttons */}
                                            </>
                                        )}
                                        <button className="icon-btn edit" onClick={() => onEdit(item)}>
                                            <Edit2 size={16} />
                                        </button>
                                        <button className="icon-btn delete" onClick={() => onDelete(item._id)}>
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminSectionList;
