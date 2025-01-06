import React from 'react';
import PropTypes from 'prop-types';
import '../styles/service-card.css';

const ServiceCard = ({ 
  item, 
  onCardClick, 
  onMouseEnter, 
  onMouseLeave, 
  isLoading, 
  className 
}) => {
  const { imgUrl, title, desc } = item || {};

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(item);
    }
  };

  return (
    <div
      className={`service__item ${className || ''}`}
      onClick={handleCardClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      role="button"
      tabIndex={0}
      aria-label={title || 'Service Item'}
      onKeyPress={(e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick()}
    >
      {isLoading ? (
        <div className="service__loading">
          <div className="loading-spinner" />
        </div>
      ) : (
        <>
          <div className="service__img">
            <img src={imgUrl || '/default-image.jpg'} alt={title || 'Service Image'} />
          </div>
          <h5>{title || 'Default Title'}</h5>
          <p>{desc || 'Default Description'}</p>
        </>
      )}
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
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
};

ServiceCard.defaultProps = {
  item: {
    imgUrl: '',
    title: 'Default Title',
    desc: 'Default Description',
  },
  onCardClick: null,
  onMouseEnter: null,
  onMouseLeave: null,
  isLoading: false,
  className: '',
};

export default ServiceCard;
