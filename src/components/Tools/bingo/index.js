import React, { useState, useEffect } from 'react';
import './bingo.scss';

const ROWS = 5;
const COLS = 5;
const FREE_SPACE = "FREE";

const BingoGame = () => {
  const [board, setBoard] = useState([]);
  const [selectedCells, setSelectedCells] = useState(new Set());
  const [isWinner, setIsWinner] = useState(false);
  const [calledNumbers, setCalledNumbers] = useState([]);
  const [currentNumber, setCurrentNumber] = useState(null);

  // Generate random number for bingo (1-75)
  const generateNumber = () => {
    return Math.floor(Math.random() * 75) + 1;
  };

  // Initialize board
  useEffect(() => {
    const newBoard = [];
    const usedNumbers = new Set();
    
    for (let i = 0; i < ROWS; i++) {
      const row = [];
      for (let j = 0; j < COLS; j++) {
        if (i === 2 && j === 2) {
          row.push(FREE_SPACE);
          continue;
        }
        
        let num;
        do {
          // Each column has its own range:
          // B (1-15), I (16-30), N (31-45), G (46-60), O (61-75)
          const min = j * 15 + 1;
          const max = min + 14;
          num = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (usedNumbers.has(num));
        
        usedNumbers.add(num);
        row.push(num);
      }
      newBoard.push(row);
    }
    
    setBoard(newBoard);
    // Mark the free space as selected
    setSelectedCells(new Set([`2-2`]));
  }, []);

  // Check for winning combinations
  const checkWinner = (newSelectedCells) => {
    // Check rows
    for (let i = 0; i < ROWS; i++) {
      let rowComplete = true;
      for (let j = 0; j < COLS; j++) {
        if (!newSelectedCells.has(`${i}-${j}`)) {
          rowComplete = false;
          break;
        }
      }
      if (rowComplete) return true;
    }

    // Check columns
    for (let j = 0; j < COLS; j++) {
      let colComplete = true;
      for (let i = 0; i < ROWS; i++) {
        if (!newSelectedCells.has(`${i}-${j}`)) {
          colComplete = false;
          break;
        }
      }
      if (colComplete) return true;
    }

    // Check diagonals
    let diagonal1 = true;
    let diagonal2 = true;
    for (let i = 0; i < ROWS; i++) {
      if (!newSelectedCells.has(`${i}-${i}`)) diagonal1 = false;
      if (!newSelectedCells.has(`${i}-${4-i}`)) diagonal2 = false;
    }

    return diagonal1 || diagonal2;
  };

  // Handle cell click
  const handleCellClick = (row, col) => {
    const cellKey = `${row}-${col}`;
    const newSelectedCells = new Set(selectedCells);
    
    if (selectedCells.has(cellKey)) {
      newSelectedCells.delete(cellKey);
    } else {
      newSelectedCells.add(cellKey);
    }
    
    setSelectedCells(newSelectedCells);
    
    if (checkWinner(newSelectedCells)) {
      setIsWinner(true);
    }
  };

  // Call a new number
  const callNumber = () => {
    let newNumber;
    do {
      newNumber = generateNumber();
    } while (calledNumbers.includes(newNumber));
    
    setCurrentNumber(newNumber);
    setCalledNumbers([...calledNumbers, newNumber]);
  };

  // Reset game
  const resetGame = () => {
    setSelectedCells(new Set([`2-2`]));
    setIsWinner(false);
    setCalledNumbers([]);
    setCurrentNumber(null);
    
    // Generate new board
    const newBoard = [];
    const usedNumbers = new Set();
    
    for (let i = 0; i < ROWS; i++) {
      const row = [];
      for (let j = 0; j < COLS; j++) {
        if (i === 2 && j === 2) {
          row.push(FREE_SPACE);
          continue;
        }
        
        let num;
        do {
          const min = j * 15 + 1;
          const max = min + 14;
          num = Math.floor(Math.random() * (max - min + 1)) + min;
        } while (usedNumbers.has(num));
        
        usedNumbers.add(num);
        row.push(num);
      }
      newBoard.push(row);
    }
    
    setBoard(newBoard);
  };

  return (
    <div className="bingo-container">
      <div className="header">
        <h1>BINGO</h1>
        <div className="controls">
          <button onClick={callNumber} disabled={isWinner}>
            Call Number
          </button>
          <button onClick={resetGame}>New Game</button>
        </div>
      </div>

      <div className="number-display">
        {currentNumber && (
          <div className="current-number">
            <span>{String.fromCharCode(66 + Math.floor((currentNumber - 1) / 15))}</span>
            <span>{currentNumber}</span>
          </div>
        )}
        <div className="called-numbers">
          {calledNumbers.slice(-5).map((num, idx) => (
            <div key={idx} className="previous-number">
              {String.fromCharCode(66 + Math.floor((num - 1) / 15))}-{num}
            </div>
          ))}
        </div>
      </div>

      <div className="bingo-board">
        <div className="column-headers">
          <div>B</div>
          <div>I</div>
          <div>N</div>
          <div>G</div>
          <div>O</div>
        </div>
        {board.map((row, i) => (
          <div key={i} className="board-row">
            {row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                className={`bingo-cell ${selectedCells.has(`${i}-${j}`) ? 'selected' : ''} 
                           ${cell === FREE_SPACE ? 'free' : ''} 
                           ${calledNumbers.includes(cell) ? 'called' : ''}`}
                onClick={() => handleCellClick(i, j)}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>

      {isWinner && (
        <div className="winner-overlay">
          <div className="winner-content">
            <h2>BINGO!</h2>
            <p>Congratulations! You've won!</p>
            <button onClick={resetGame}>Play Again</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BingoGame;
