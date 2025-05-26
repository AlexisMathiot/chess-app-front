import React, { useState, useEffect } from 'react';
import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js';
import { ArrowLeft, ArrowRight, RotateCcw, RotateCw } from 'lucide-react';

function ChessboardComponent({ pgn = '', width = 500, onPositionChange }) {
  const [chess] = useState(new Chess());
  const [fen, setFen] = useState(chess.fen());
  const [history, setHistory] = useState([]);
  const [currentMove, setCurrentMove] = useState(-1);
  const [orientation, setOrientation] = useState('white');

  useEffect(() => {
    if (pgn) {
      try {
        chess.loadPgn(pgn);
        setHistory(chess.history({ verbose: true }));
        setFen(chess.fen());
        setCurrentMove(-1);
        
        if (onPositionChange) {
          onPositionChange(chess.fen());
        }
      } catch (error) {
        console.error('Failed to load PGN:', error);
      }
    }
  }, [pgn, chess, onPositionChange]);

  const handleSquareClick = (square) => {
    if (currentMove === history.length - 1 || history.length === 0) {
      try {
        const moves = chess.moves({ square, verbose: true });
        
        if (moves.length > 0) {
          console.log('Possible moves:', moves);
        }
      } catch (e) {
        // Ignore errors from invalid selections
      }
    }
  };
  
  const resetBoard = () => {
    chess.reset();
    setFen(chess.fen());
    setHistory([]);
    setCurrentMove(-1);
    
    if (onPositionChange) {
      onPositionChange(chess.fen());
    }
  };
  
  const flipBoard = () => {
    setOrientation(orientation === 'white' ? 'black' : 'white');
  };
  
  const goToMove = (moveIndex) => {
    const tempChess = new Chess();
    
    if (moveIndex >= -1 && moveIndex < history.length) {
      if (moveIndex === -1) {
        tempChess.reset();
      } else {
        tempChess.loadPgn(pgn);
        const moves = tempChess.history({ verbose: true });
        
        tempChess.reset();
        for (let i = 0; i <= moveIndex; i++) {
          tempChess.move(moves[i]);
        }
      }
      
      setCurrentMove(moveIndex);
      setFen(tempChess.fen());
      
      if (onPositionChange) {
        onPositionChange(tempChess.fen());
      }
    }
  };
  
  const goToPrevMove = () => {
    goToMove(currentMove - 1);
  };
  
  const goToNextMove = () => {
    goToMove(currentMove + 1);
  };
  
  const goToStart = () => {
    goToMove(-1);
  };
  
  const goToEnd = () => {
    goToMove(history.length - 1);
  };

  return (
    <div className="flex flex-col">
      <div className="self-center">
        <Chessboard
          width={width}
          position={fen}
          orientation={orientation}
          onSquareClick={handleSquareClick}
          boardStyle={{
            borderRadius: '4px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
          }}
          darkSquareStyle={{ backgroundColor: '#b03030' }}
          lightSquareStyle={{ backgroundColor: '#f0f0f0' }}
        />
      </div>
      
      <div className="mt-4 flex justify-center space-x-2">
        <button
          onClick={goToStart}
          disabled={currentMove === -1}
          className="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          title="Go to start"
        >
          <ArrowLeft size={18} className="text-gray-700" />
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        
        <button
          onClick={goToPrevMove}
          disabled={currentMove === -1}
          className="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          title="Previous move"
        >
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        
        <button
          onClick={goToNextMove}
          disabled={currentMove === history.length - 1}
          className="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          title="Next move"
        >
          <ArrowRight size={18} className="text-gray-700" />
        </button>
        
        <button
          onClick={goToEnd}
          disabled={currentMove === history.length - 1}
          className="p-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
          title="Go to end"
        >
          <ArrowRight size={18} className="text-gray-700" />
          <ArrowRight size={18} className="text-gray-700" />
        </button>
        
        <button
          onClick={resetBoard}
          className="p-2 rounded bg-gray-100 hover:bg-gray-200"
          title="Reset board"
        >
          <RotateCcw size={18} className="text-gray-700" />
        </button>
        
        <button
          onClick={flipBoard}
          className="p-2 rounded bg-gray-100 hover:bg-gray-200"
          title="Flip board"
        >
          <RotateCw size={18} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
}

export default ChessboardComponent;