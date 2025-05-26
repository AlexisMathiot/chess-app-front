import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronDown, ChevronUp, Download, Share2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChessboardComponent from '../components/ChessboardComponent';
import { parsePgn, getMoves } from '../services/chessService';
import { Chess } from 'chess.js';

// Mock data for demonstration
const MOCK_GAMES = {
  '1': {
    id: '1',
    source: 'chess.com',
    white: 'GrandMaster123',
    black: 'chessmaster',
    date: '2023-09-15',
    result: '1-0',
    pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3 O-O 9. h3 Nb8 10. d4 Nbd7',
    timeControl: '10+0'
  },
  '2': {
    id: '2',
    source: 'lichess',
    white: 'chessmaster',
    black: 'QuickMate',
    date: '2023-09-10',
    result: '1/2-1/2',
    pgn: '1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 4. e3 O-O 5. Bd3 d5 6. cxd5 exd5 7. Nge2 Re8 8. O-O Bd6 9. a3 c6 10. b4 a5',
    timeControl: '5+3'
  },
  '3': {
    id: '3',
    source: 'chess.com',
    white: 'chessmaster',
    black: 'KingSlayer',
    date: '2023-09-05',
    result: '0-1',
    pgn: '1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4 Nf6 5. Nc3 a6 6. Be3 e6 7. f3 b5 8. Qd2 Nbd7 9. g4 h6 10. O-O-O b4',
    timeControl: '15+10'
  }
};

// Mock function to get analysis data
const getAnalysisData = (fen) => {
  // In a real app, this would call an analysis engine
  return {
    evaluation: Math.random() * 2 - 1, // -1 to 1
    bestMove: 'e4',
    depth: 20,
    lines: [
      { move: 'e4', evaluation: 0.8, continuation: 'e5 Nf3 Nc6' },
      { move: 'd4', evaluation: 0.6, continuation: 'd5 c4 e6' },
      { move: 'c4', evaluation: 0.5, continuation: 'c5 Nf3 Nc6' }
    ]
  };
};

const AnalysisPage = () => {
  const { gameId } = useParams();
  const [game, setGame] = useState(null);
  const [chess, setChess] = useState(null);
  const [currentFen, setCurrentFen] = useState('');
  const [moveHistory, setMoveHistory] = useState([]);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(true);
  const [analysisData, setAnalysisData] = useState(getAnalysisData(''));
  const [boardWidth, setBoardWidth] = useState(600);

  useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setBoardWidth(Math.min(window.innerWidth - 40, 400));
      } else if (window.innerWidth < 1024) {
        setBoardWidth(500);
      } else {
        setBoardWidth(600);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (gameId && MOCK_GAMES[gameId]) {
      const selectedGame = MOCK_GAMES[gameId];
      setGame(selectedGame);

      const newChess = parsePgn(selectedGame.pgn);
      setChess(newChess);
      setCurrentFen(newChess.fen());
      setMoveHistory(getMoves(newChess));
    } else {
      // No game ID or invalid ID, start with a new board
      const newChess = new Chess();
      setChess(newChess);
      setCurrentFen(newChess.fen());
      setMoveHistory([]);
    }
  }, [gameId]);

  const handlePositionChange = (fen) => {
    setCurrentFen(fen);
    // Update analysis data when position changes
    setAnalysisData(getAnalysisData(fen));
  };

  const toggleAnalysis = () => {
    setIsAnalysisOpen(!isAnalysisOpen);
  };

  // Group moves into pairs for display
  const getMovePairs = () => {
    const pairs = [];
    for (let i = 0; i < moveHistory.length; i += 2) {
      pairs.push({
        index: Math.floor(i / 2) + 1,
        white: moveHistory[i],
        black: moveHistory[i + 1] || ''
      });
    }
    return pairs;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {game && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {game.white} vs {game.black}
              </h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 text-sm text-gray-600">
                <span>
                  Source: {game.source === 'chess.com' ? 'Chess.com' : 'Lichess'}
                </span>
                <span>Date: {game.date}</span>
                <span>Result: {game.result}</span>
                <span>Time Control: {game.timeControl}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chessboard and Move List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-6 flex justify-center">
                <ChessboardComponent
                  pgn={game?.pgn}
                  width={boardWidth}
                  onPositionChange={handlePositionChange}
                />
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Move History</h2>
                  <div className="flex space-x-2">
                    <button
                      className="p-1 rounded hover:bg-gray-100"
                      title="Download PGN"
                    >
                      <Download size={18} className="text-gray-600" />
                    </button>
                    <button
                      className="p-1 rounded hover:bg-gray-100"
                      title="Share Analysis"
                    >
                      <Share2 size={18} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="max-h-60 overflow-y-auto p-4">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="w-1/6 text-left font-medium text-gray-500 text-sm">#</th>
                        <th className="w-2/5 text-left font-medium text-gray-500 text-sm">White</th>
                        <th className="w-2/5 text-left font-medium text-gray-500 text-sm">Black</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getMovePairs().map((pair) => (
                        <tr key={pair.index} className="hover:bg-gray-50">
                          <td className="py-2 text-gray-500">{pair.index}.</td>
                          <td className="py-2 font-medium">{pair.white}</td>
                          <td className="py-2 font-medium">{pair.black}</td>
                        </tr>
                      ))}
                      {moveHistory.length === 0 && (
                        <tr>
                          <td colSpan={3} className="py-4 text-center text-gray-500">
                            No moves to display
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Analysis and Tools */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div
                  className="border-b border-gray-200 px-6 py-4 flex justify-between items-center cursor-pointer"
                  onClick={toggleAnalysis}
                >
                  <h2 className="text-lg font-semibold">Analysis</h2>
                  <button className="p-1 rounded hover:bg-gray-100">
                    {isAnalysisOpen ? (
                      <ChevronUp size={18} className="text-gray-600" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-600" />
                    )}
                  </button>
                </div>

                {isAnalysisOpen && (
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Evaluation</span>
                        <span className={`font-semibold ${analysisData.evaluation > 0 ? 'text-green-600' :
                            analysisData.evaluation < 0 ? 'text-red-600' : 'text-gray-700'
                          }`}>
                          {analysisData.evaluation > 0 ? '+' : ''}{analysisData.evaluation.toFixed(2)}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${analysisData.evaluation > 0 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          style={{
                            width: `${Math.min(Math.abs(analysisData.evaluation) * 50 + 50, 100)}%`,
                            marginLeft: analysisData.evaluation < 0 ? 'auto' : 0,
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Best Lines</h3>
                      <div className="space-y-3">
                        {analysisData.lines.map((line, i) => (
                          <div key={i} className="bg-gray-50 p-3 rounded">
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-medium">{line.move}</span>
                              <span className={`text-sm ${line.evaluation > 0 ? 'text-green-600' :
                                  line.evaluation < 0 ? 'text-red-600' : 'text-gray-700'
                                }`}>
                                {line.evaluation > 0 ? '+' : ''}{line.evaluation.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {line.continuation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Engine Details</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-500">Depth</span>
                          <p className="font-medium">{analysisData.depth}</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <span className="text-gray-500">Engine</span>
                          <p className="font-medium">Stockfish 15</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-lg font-semibold">Game Statistics</h2>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">White</h3>
                      <div className="space-y-2">
                        <div className="bg-gray-50 p-2 rounded flex justify-between">
                          <span className="text-sm text-gray-500">Accuracy</span>
                          <span className="text-sm font-medium">87%</span>
                        </div>
                        <div className="bg-gray-50 p-2 rounded flex justify-between">
                          <span className="text-sm text-gray-500">Mistakes</span>
                          <span className="text-sm font-medium">2</span>
                        </div>
                        <div className="bg-gray-50 p-2 rounded flex justify-between">
                          <span className="text-sm text-gray-500">Blunders</span>
                          <span className="text-sm font-medium">0</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Black</h3>
                      <div className="space-y-2">
                        <div className="bg-gray-50 p-2 rounded flex justify-between">
                          <span className="text-sm text-gray-500">Accuracy</span>
                          <span className="text-sm font-medium">82%</span>
                        </div>
                        <div className="bg-gray-50 p-2 rounded flex justify-between">
                          <span className="text-sm text-gray-500">Mistakes</span>
                          <span className="text-sm font-medium">3</span>
                        </div>
                        <div className="bg-gray-50 p-2 rounded flex justify-between">
                          <span className="text-sm text-gray-500">Blunders</span>
                          <span className="text-sm font-medium">1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AnalysisPage;