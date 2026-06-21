import React from 'react';
import { motion } from 'framer-motion';

const TeamMemberCard = ({ member, index, onClick, isBlurred, isActive, position }) => {
  return (
    <motion.div
      className={`team-card${isBlurred ? ' blurred' : ''}${isActive ? ' active' : ''}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={!isActive ? { y: -10 } : {}}
      onClick={onClick}
      data-position={position}
      style={{
        filter: isBlurred ? 'blur(4px) grayscale(0.5)' : 'none',
        opacity: isBlurred ? 0.4 : 1,
        pointerEvents: isActive || !isBlurred ? 'auto' : 'none',
        zIndex: isActive ? 2 : 1,
        transition: 'filter 0.4s, opacity 0.4s',
      }}
    >
      <div className="team-img-wrapper">
        <img src={member.image} alt={member.name} />
      </div>
      <h3>{member.name}</h3>
      <p>{member.role}</p>
    </motion.div>
  );
};

export default TeamMemberCard;
