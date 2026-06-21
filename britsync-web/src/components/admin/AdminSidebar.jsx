import React, { useRef } from 'react';
import { Layout, LogOut } from 'lucide-react';

const AdminSidebar = ({
    sections,
    activeSection,
    setActiveSection,
    isOpen,
    toggleSidebar,
    onLogout
}) => {
    const navRef = useRef(null);
    const dragStart = useRef({ y: 0, scrollTop: 0, isDragging: false, hasMoved: false });

    const handleMouseDown = (e) => {
        if (e.button !== 0) return; // Only drag with left click
        const nav = navRef.current;
        if (!nav) return;
        dragStart.current = {
            y: e.pageY,
            scrollTop: nav.scrollTop,
            isDragging: true,
            hasMoved: false
        };
        nav.style.cursor = 'grabbing';
        nav.style.userSelect = 'none';
        nav.style.scrollBehavior = 'auto'; // Immediate scrolling feedback
    };

    const handleMouseMove = (e) => {
        if (!dragStart.current.isDragging) return;
        const nav = navRef.current;
        if (!nav) return;

        const deltaY = e.pageY - dragStart.current.y;
        if (Math.abs(deltaY) > 5) {
            dragStart.current.hasMoved = true;
        }
        nav.scrollTop = dragStart.current.scrollTop - deltaY;
    };

    const handleMouseUpOrLeave = () => {
        if (!dragStart.current.isDragging) return;
        dragStart.current.isDragging = false;
        const nav = navRef.current;
        if (nav) {
            nav.style.cursor = '';
            nav.style.userSelect = '';
            nav.style.scrollBehavior = '';
        }
    };

    const handleItemClick = (e, sectionId) => {
        if (dragStart.current.hasMoved) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        setActiveSection(sectionId);
    };

    return (
        <aside className={`admin-sidebar ${isOpen ? 'open' : 'closed'}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo-icon">
                    <Layout size={20} />
                </div>
                {isOpen && <h2>Admin</h2>}
            </div>

            <nav 
                className="sidebar-nav"
                ref={navRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                style={{ cursor: 'grab' }}
                data-lenis-prevent
            >
                {sections.map(section => (
                    <button
                        key={section.id}
                        className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
                        onClick={(e) => handleItemClick(e, section.id)}
                        title={!isOpen ? section.label : ''}
                    >
                        {section.icon}
                        {isOpen && <span>{section.label}</span>}
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button
                    className="nav-item logout-btn"
                    onClick={onLogout}
                >
                    <LogOut size={20} />
                    {isOpen && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
