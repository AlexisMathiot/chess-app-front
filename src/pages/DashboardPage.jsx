import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Plus, Clock, Calendar, RefreshCw } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [games, setGames] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importUsername, setImportUsername] = useState('');
  const [importSource, setImportSource] = useState('chess.com');

  const handleImport = async (e) => {
    e.preventDefault();

    if (!importUsername) return;

    setIsImporting(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, you would fetch actual games from the selected source
      const newGames = [
        {
          id: `${Date.now()}`,
          source: importSource,
          white: importUsername,
          black: 'Opponent',
          date: new Date().toISOString().split('T')[0],
          result: '1-0',
          pgn: '1. e4 e5 2. Nf3 Nc6 3. Bb5',
          timeControl: '10+0'
        }
      ];

      setGames(prev => [...newGames, ...prev]);
      setIsImporting(false);
      setImportUsername('');
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.username}</p>
            </div>

            <Link
              to="/analysis"
              className="mt-4 md:mt-0 flex items-center bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 transition-colors"
            >
              <Plus size={18} className="mr-2" />
              New Analysis
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-xl font-semibold">Recent Games</h2>
                </div>

                {games.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {games.map((game) => (
                      <div key={game.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">
                                {game.source === 'chess.com' ? 'Chess.com' : 'Lichess'}
                              </span>
                              <span>•</span>
                              <span className="text-sm text-gray-500">
                                <Clock size={14} className="inline mr-1" />
                                {game.timeControl}
                              </span>
                              <span>•</span>
                              <span className="text-sm text-gray-500">
                                <Calendar size={14} className="inline mr-1" />
                                {game.date}
                              </span>
                            </div>
                            <h3 className="font-medium mt-1">
                              {game.white} vs {game.black}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Result: <span className="font-medium">{game.result}</span>
                            </p>
                          </div>

                          <Link
                            to={`/analysis/${game.id}`}
                            className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200 transition-colors"
                          >
                            Analyze
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <p className="text-gray-500">No games found. Import your games to get started.</p>
                  </div>
                )}
              </div>

              <div className="mt-6 bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-xl font-semibold">Statistics</h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded">
                      <h3 className="text-sm font-medium text-gray-500">Total Games</h3>
                      <p className="text-2xl font-bold mt-2">{games.length}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <h3 className="text-sm font-medium text-gray-500">Win Rate</h3>
                      <p className="text-2xl font-bold mt-2">67%</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <h3 className="text-sm font-medium text-gray-500">Average ELO</h3>
                      <p className="text-2xl font-bold mt-2">1450</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h2 className="text-xl font-semibold">Import Games</h2>
                </div>
                <div className="p-6">
                  <form onSubmit={handleImport}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform
                      </label>
                      <div className="flex space-x-4">
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio h-4 w-4 text-red-700"
                            value="chess.com"
                            checked={importSource === 'chess.com'}
                            onChange={() => setImportSource('chess.com')}
                          />
                          <span className="ml-2">Chess.com</span>
                        </label>
                        <label className="inline-flex items-center">
                          <input
                            type="radio"
                            className="form-radio h-4 w-4 text-red-700"
                            value="lichess"
                            checked={importSource === 'lichess'}
                            onChange={() => setImportSource('lichess')}
                          />
                          <span className="ml-2">Lichess</span>
                        </label>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        value={importUsername}
                        onChange={(e) => setImportUsername(e.target.value)}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
                        placeholder={`Your ${importSource} username`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isImporting || !importUsername}
                      className="w-full flex justify-center items-center bg-red-700 text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300"
                    >
                      {isImporting ? (
                        <>
                          <RefreshCw size={18} className="animate-spin mr-2" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Upload size={18} className="mr-2" />
                          Import Games
                        </>
                      )}
                    </button>
                  </form>

                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Upload PGN File</h3>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <div className="flex justify-center">
                        <Upload size={24} className="text-gray-400" />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        Drag and drop PGN files here, or click to upload
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pgn"
                      />
                      <button
                        type="button"
                        className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Select File
                      </button>
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

export default DashboardPage;