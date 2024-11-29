import React from 'react';
import PropTypes from 'prop-types';

import BingoItem from './BingoItem';

const BingoCard = ({
  bingoData,
  checkedItems,
  hoveredIndex,
  editIndex,
  onItemClick,
  onItemDoubleClick,
  onItemHover,
  onEditComplete,
  editRef,
  categories
}) => {
  const ROW_SIZE = 5;
  
  return (
    <div className="bingo-card">
      <div className="bingo-grid">
        {bingoData.slice(0, ROW_SIZE * ROW_SIZE).map((item, index) => (
          <BingoItem
            key={index}
            index={index}
            text={item.goal}
            description={item.description || ''}
            category={item.category}
            checked={checkedItems[index] || false}
            isHovered={hoveredIndex === index}
            isEditing={editIndex === index}
            onClick={onItemClick}
            onDoubleClick={onItemDoubleClick}
            onHover={onItemHover}
            onEditComplete={onEditComplete}
            editRef={editIndex === index ? editRef : null}
          />
        ))}
      </div>
    </div>
  );
};

BingoCard.propTypes = {
  bingoData: PropTypes.arrayOf(
    PropTypes.shape({
      check: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
      category: PropTypes.string,
      goal: PropTypes.string,
      description: PropTypes.string,
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ).isRequired,
  checkedItems: PropTypes.arrayOf(PropTypes.bool).isRequired,
  hoveredIndex: PropTypes.number,
  editIndex: PropTypes.number,
  onItemClick: PropTypes.func.isRequired,
  onItemDoubleClick: PropTypes.func.isRequired,
  onItemHover: PropTypes.func.isRequired,
  onEditComplete: PropTypes.func.isRequired,
  editRef: PropTypes.object,
  categories: PropTypes.objectOf(
    PropTypes.arrayOf(
      PropTypes.shape({
        check: PropTypes.oneOfType([PropTypes.bool, PropTypes.number]),
        category: PropTypes.string,
        goal: PropTypes.string,
        description: PropTypes.string,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    )
  ).isRequired
};

export default BingoCard;