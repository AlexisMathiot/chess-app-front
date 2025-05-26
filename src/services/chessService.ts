import { Chess } from 'chess.js';
import { Game } from '../types';

// Helper function to parse PGN
export const parsePgn = (pgn: string): Chess => {
  const chess = new Chess();
  try {
    chess.loadPgn(pgn);
    return chess;
  } catch (error) {
    console.error('Failed to parse PGN:', error);
    return chess;
  }
};

// Get moves from chess instance
export const getMoves = (chess: Chess): string[] => {
  return chess.history();
};

// Get current position FEN
export const getCurrentFen = (chess: Chess): string => {
  return chess.fen();
};

// Make a move
export const makeMove = (chess: Chess, move: string): boolean => {
  try {
    const result = chess.move(move);
    return !!result;
  } catch (error) {
    console.error('Invalid move:', error);
    return false;
  }
};

// Get possible moves for a piece
export const getLegalMoves = (chess: Chess, square: string): string[] => {
  const moves = chess.moves({ square, verbose: true });
  return moves.map(move => move.to);
};

// Check if game is over
export const isGameOver = (chess: Chess): boolean => {
  return chess.isGameOver();
};

// Get game result
export const getGameResult = (chess: Chess): string => {
  if (chess.isCheckmate()) return 'Checkmate';
  if (chess.isDraw()) {
    if (chess.isStalemate()) return 'Stalemate';
    if (chess.isThreefoldRepetition()) return 'Threefold Repetition';
    if (chess.isInsufficientMaterial()) return 'Insufficient Material';
    return 'Draw';
  }
  if (chess.isCheck()) return 'Check';
  return '';
};

// Mock function to fetch games from platforms (in a real app, this would call an API)
export const fetchGames = async (platform: 'chess.com' | 'lichess', username: string): Promise<Game[]> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data - in a real app, this would be real data from the API
  return [
    {
      id: `${Date.now()}-1`,
      source: platform,
      white: username,
      black: 'Opponent1',
      date: new Date().toISOString().split('T')[0],
      result: '1-0',
      pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7',
      timeControl: '10+0'
    },
    {
      id: `${Date.now()}-2`,
      source: platform,
      white: 'Opponent2',
      black: username,
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      result: '0-1',
      pgn: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3 d5',
      timeControl: '5+3'
    }
  ];
};