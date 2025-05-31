import { Chess } from 'chess.js';

// Helper function to parse PGN
export const parsePgn = (pgn) => {
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
export const getMoves = (chess) => {
  return chess.history();
};

// Get current position FEN
export const getCurrentFen = (chess) => {
  return chess.fen();
};

// Make a move
export const makeMove = (chess, move) => {
  try {
    const result = chess.move(move);
    return !!result;
  } catch (error) {
    console.error('Invalid move:', error);
    return false;
  }
};

// Get possible moves for a piece
export const getLegalMoves = (chess, square) => {
  const moves = chess.moves({ square, verbose: true });
  return moves.map(move => move.to);
};

// Check if game is over
export const isGameOver = (chess) => {
  return chess.isGameOver();
};

// Get game result
export const getGameResult = (chess) => {
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
// services/chessService.js
import axios from 'axios';

const CHESS_COM_API = 'https://api.chess.com/pub';

export const chessService = {
  // Récupérer le profil d'un joueur
  async getPlayerProfile(username) {
    try {
      const response = await axios.get(`${CHESS_COM_API}/player/${username}`);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération du profil: ${error.message}`);
    }
  },

  // Récupérer les parties d'un mois spécifique
  async getPlayerGames(username, year, month) {
    try {
      const response = await axios.get(`${CHESS_COM_API}/player/${username}/games/${year}/${month.toString().padStart(2, '0')}`);
      return response.data.games || [];
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des parties: ${error.message}`);
    }
  },

  // Récupérer les parties récentes (plusieurs mois)
  async getRecentGames(username, monthsBack = 3) {
    const games = [];
    const currentDate = new Date();

    for (let i = 0; i < monthsBack; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      try {
        const monthGames = await this.getPlayerGames(username, year, month);
        games.push(...monthGames);
      } catch (error) {
        console.warn(`Impossible de récupérer les parties de ${year}/${month}:`, error.message);
      }
    }

    return games.sort((a, b) => b.end_time - a.end_time); // Tri par date décroissante
  },

  // Récupérer les stats d'un joueur
  async getPlayerStats(username) {
    try {
      const response = await axios.get(`${CHESS_COM_API}/player/${username}/stats`);
      return response.data;
    } catch (error) {
      throw new Error(`Erreur lors de la récupération des stats: ${error.message}`);
    }
  },

  // Analyser une partie (convertir PGN en format analysable)
  parseGame(game) {
    return {
      id: game.uuid,
      white: game.white.username,
      black: game.black.username,
      whiteRating: game.white.rating,
      blackRating: game.black.rating,
      result: game.white.result, // 'win', 'checkmated', 'agreed', etc.
      timeControl: game.time_control,
      timeClass: game.time_class, // 'rapid', 'blitz', 'bullet', etc.
      pgn: game.pgn,
      url: game.url,
      startTime: new Date(game.start_time * 1000),
      endTime: new Date(game.end_time * 1000),
      rules: game.rules // 'chess', 'bughouse', etc.
    };
  }
};