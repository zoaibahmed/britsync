import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const TeamMemberPanel = ({ member, onClose, position }) => {
  return (
    <motion.div
      className={`popup-content team-popup team-panel-${position}`}
      initial={{ x: position === 'left' ? '-40%' : '40%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: position === 'left' ? '-40%' : '40%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      onClick={e => e.stopPropagation()}
      style={{ position: 'fixed', top: '50%', [position]: '5vw', transform: 'translateY(-50%)', zIndex: 1002 }}
    >
      <button className="popup-close" onClick={onClose}>
        <X />
      </button>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <img src={member.image} alt={member.name} style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }} />
        <div>
          <h2 className="text-gradient" style={{ marginBottom: '0.5rem' }}>{member.name}</h2>
          <p style={{ color: 'var(--color-blue)', marginBottom: '1rem', fontWeight: 600 }}>{member.role}</p>
          <p style={{ color: 'var(--text-muted)' }}>{member.bio}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TeamMemberPanel;
