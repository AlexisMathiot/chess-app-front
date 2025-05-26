import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight as ChessKnight, BookOpen, TrendingUp, Clock } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-red-700 to-red-900 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <ChessKnight size={56} />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Master Your Chess Strategy
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Analyze your games from chess.com and Lichess to find winning patterns, 
              missed opportunities, and improve your play.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-white text-red-700 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started Free
              </Link>
              <Link 
                to="/login" 
                className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Powerful Analysis Tools</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-red-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <TrendingUp size={28} className="text-red-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Game Statistics</h3>
                <p className="text-gray-600">
                  Get comprehensive statistics on your games. Track your progress 
                  and identify patterns in your play over time.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-red-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <BookOpen size={28} className="text-red-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Opening Database</h3>
                <p className="text-gray-600">
                  Explore your opening repertoire. Find weaknesses in your openings 
                  and discover new lines to improve your game.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-red-100 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                  <Clock size={28} className="text-red-700" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Time Analysis</h3>
                <p className="text-gray-600">
                  Analyze how you spend your time during games. Identify critical moments 
                  where time management is crucial.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Improve Your Chess?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of players who use Chess Analyzer to take their game to the next level.
            </p>
            <Link 
              to="/register" 
              className="bg-red-700 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-red-800 transition-colors"
            >
              Create Your Free Account
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

export default HomePage;