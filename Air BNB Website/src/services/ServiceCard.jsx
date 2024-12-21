import React from 'react';
import PropTypes from 'prop-types';
import '../styles/service-card.css';

const ServiceCard = ({ item, onCardClick }) => {
  const { imgUrl, title, desc } = item;

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(item);
    }
  };

  return (
    <div 
      className="service__item" 
      onClick={handleCardClick} 
      role="button" 
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleCardClick()}
    >
      <div className="service__img">
        <img src={imgUrl} alt={title || 'Service Image'} />
      </div>
      <h5>{title}</h5>
      <p>{desc}</p>
    </div>
  );
};

ServiceCard.propTypes = {
  item: PropTypes.shape({
    imgUrl: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
  }),
  onCardClick: PropTypes.func,
};

ServiceCard.defaultProps = {
  item: {
    imgUrl: '',
    title: 'Default Title',
    desc: 'Default Description',
  },
  onCardClick: null,
};

export default ServiceCard;
