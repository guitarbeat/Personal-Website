import PropTypes from "prop-types";
import React from "react";

const BingoItem = ({
	index,
	text,
	description = "",
	category = "",
	checked = false,
	isHovered = false,
	isEditing = false,
	onClick = () => {},
	onDoubleClick = () => {},
	onHover = () => {},
	onEditComplete = () => {},
	editRef,
}) => {
	const handleKeyDown = (e) => {
		if (e.key === "Enter" || e.key === "Escape") {
			e.preventDefault();
			onEditComplete(index, e.target.value);
		}
	};

	return (
		<div
			className={`bingo-item ${checked ? "checked" : ""} ${isHovered ? "hovered" : ""} category-${category.toLowerCase().replace(/\s+/g, "-")}`}
			onClick={() => onClick(index)}
			onDoubleClick={() => onDoubleClick(index)}
			onMouseEnter={() => onHover(index)}
			onMouseLeave={() => onHover(null)}
			role="button"
			tabIndex={0}
		>
			<div className="item-content">
				{isEditing ? (
					<input
						ref={editRef}
						type="text"
						defaultValue={text}
						onKeyDown={handleKeyDown}
						onBlur={(e) => onEditComplete(index, e.target.value)}
						className="edit-input"
						autoFocus
					/>
				) : (
					<>
						<div className="text">{text}</div>
						{description && (
							<div
								className="description"
								style={{ opacity: isHovered ? 1 : 0 }}
							>
								{description}
							</div>
						)}
						{checked && (
							<div className="checkmark">
								<svg viewBox="0 0 24 24" width="24" height="24">
									<path
										fill="currentColor"
										d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
									/>
								</svg>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};

BingoItem.propTypes = {
	index: PropTypes.number.isRequired,
	text: PropTypes.string.isRequired,
	description: PropTypes.string,
	category: PropTypes.string,
	checked: PropTypes.bool.isRequired,
	isHovered: PropTypes.bool.isRequired,
	isEditing: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired,
	onDoubleClick: PropTypes.func.isRequired,
	onHover: PropTypes.func.isRequired,
	onEditComplete: PropTypes.func.isRequired,
	editRef: PropTypes.object,
};

export default BingoItem;
