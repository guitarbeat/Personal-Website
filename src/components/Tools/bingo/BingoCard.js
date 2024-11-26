import React from 'react';
import PropTypes from 'prop-types';

import BingoItem from './BingoItem';

const BingoCard = ({ 
  bingoData, 
  checkedItems, 
  editIndex,
  hoveredIndex,
  onItemClick,
  onItemDoubleClick,
  onHover,
  onEdit,
  onBlur 
}) => (
  <div className="bingo-card" role="grid" aria-label="Bingo card">
    {bingoData.map((item, index) => (
      <BingoItem
        key={index}
        item={item}
        index={index}
        isChecked={checkedItems[index]}
        isEditing={editIndex === index}
        isHovered={hoveredIndex === index}
        onClick={() => onItemClick(index)}
        onDoubleClick={() => onItemDoubleClick(index)}
        onMouseEnter={() => onHover(index)}
        onMouseLeave={() => onHover(null)}
        onEdit={(key, value) => onEdit(index, key, value)}
        onBlur={onBlur}
      />
    ))}
  </div>
);

BingoCard.propTypes = {
  bingoData: PropTypes.arrayOf(
    PropTypes.shape({
      Goal: PropTypes.string,
      Description: PropTypes.string,
      Check: PropTypes.bool,
      ID: PropTypes.string
    })
  ).isRequired,
  checkedItems: PropTypes.arrayOf(PropTypes.bool).isRequired,
  editIndex: PropTypes.number,
  hoveredIndex: PropTypes.number,
  onItemClick: PropTypes.func.isRequired,
  onItemDoubleClick: PropTypes.func.isRequired,
  onHover: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired
};

export default BingoCard;