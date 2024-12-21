import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SearchResultList = ({ results }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    // Add more logic here, e.g., navigating to a detail page or opening a modal.
    console.log('Selected item:', item);
  };

  return (
    <div className="search-result-list">
      <h2>Search Results</h2>
      {results.length > 0 ? (
        <ul>
          {results.map((result, index) => (
            <li 
              key={index} 
              onClick={() => handleItemClick(result)} 
              className="search-result-item"
            >
              <h3>{result.title}</h3>
              <p>{result.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found.</p>
      )}
      {selectedItem && (
        <div className="selected-item-details">
          <h3>Details for: {selectedItem.title}</h3>
          <p>{selectedItem.description}</p>
        </div>
      )}
    </div>
  );
};

SearchResultList.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SearchResultList;
