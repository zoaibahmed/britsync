import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X } from 'lucide-react';

interface Option {
    value: string;
    label: string;
}

interface SelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    searchable?: boolean;
    label?: string;
}

export const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Select option...',
    disabled = false,
    error,
    searchable = false,
    label
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    const selectedOption = options.find(opt => opt.value === value);

    const updateCoords = () => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setCoords({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    };

    useEffect(() => {
        if (isOpen) {
            updateCoords();
            // Recalculate on scroll/resize
            window.addEventListener('scroll', updateCoords, true);
            window.addEventListener('resize', updateCoords);
        }
        return () => {
            window.removeEventListener('scroll', updateCoords, true);
            window.removeEventListener('resize', updateCoords);
        };
    }, [isOpen]);

    // Handle click outside to close
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                triggerRef.current &&
                !triggerRef.current.contains(event.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (disabled) return;
        setIsOpen(!isOpen);
        setSearchTerm('');
    };

    const handleSelect = (val: string) => {
        onChange(val);
        setIsOpen(false);
    };

    const filteredOptions = searchable
        ? options.filter(opt => opt.label.toLowerCase().includes(searchTerm.toLowerCase()))
        : options;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', width: '100%', position: 'relative' }}>
            {label && (
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>
                    {label}
                </label>
            )}
            <button
                ref={triggerRef}
                type="button"
                onClick={handleToggle}
                disabled={disabled}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    backgroundColor: disabled ? '#f8fafc' : 'white',
                    border: error ? '1px solid #ef4444' : '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    color: selectedOption ? '#0f172a' : '#94a3b8',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    outline: 'none',
                    transition: 'all 0.15s ease',
                    boxShadow: 'var(--shadow-sm)'
                }}
            >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={14} style={{ color: '#64748b', transition: 'transform 0.15s ease', transform: isOpen ? 'rotate(180deg)' : 'none' }} />
            </button>

            {error && (
                <span style={{ fontSize: '0.7rem', color: '#ef4444', marginTop: '0.1rem' }}>{error}</span>
            )}

            {isOpen && createPortal(
                <div
                    ref={dropdownRef}
                    style={{
                        position: 'absolute',
                        top: coords.top + 4,
                        left: coords.left,
                        width: coords.width,
                        maxHeight: '220px',
                        backgroundColor: 'white',
                        border: '1px solid #cbd5e1',
                        borderRadius: '6px',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                        zIndex: 99999,
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {searchable && (
                        <div style={{ display: 'flex', alignItems: 'center', padding: '0.4rem 0.6rem', borderBottom: '1px solid #f1f5f9', gap: '0.25rem', position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                            <Search size={12} style={{ color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{
                                    border: 'none',
                                    outline: 'none',
                                    width: '100%',
                                    fontSize: '0.75rem',
                                    color: '#0f172a',
                                    padding: '2px'
                                }}
                            />
                            {searchTerm && (
                                <button type="button" onClick={() => setSearchTerm('')} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                    <X size={12} style={{ color: '#94a3b8' }} />
                                </button>
                            )}
                        </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {filteredOptions.length === 0 ? (
                            <div style={{ padding: '0.6rem 0.8rem', fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center' }}>
                                No options found
                            </div>
                        ) : (
                            filteredOptions.map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleSelect(opt.value);
                                    }}
                                    style={{
                                        display: 'flex',
                                        width: '100%',
                                        padding: '0.5rem 0.75rem',
                                        textAlign: 'left',
                                        border: 'none',
                                        background: opt.value === value ? '#eff6ff' : 'transparent',
                                        color: opt.value === value ? '#2563eb' : '#334155',
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                        transition: 'background 0.1s ease'
                                    }}
                                    onMouseEnter={e => {
                                        if (opt.value !== value) {
                                            e.currentTarget.style.backgroundColor = '#f8fafc';
                                        }
                                    }}
                                    onMouseLeave={e => {
                                        if (opt.value !== value) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }
                                    }}
                                >
                                    {opt.label}
                                </button>
                            ))
                        )}
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};
