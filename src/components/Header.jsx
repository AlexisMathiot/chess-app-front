import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight as ChessKnight, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-red-700 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <ChessKnight size={28} />
          <span className="font-bold text-xl">Chess Analyzer</span>
        </Link>

        <nav>
          <ul className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className="text-white hover:text-gray-200 transition-colors duration-200 font-medium"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/analysis"
                    className="text-white hover:text-gray-200 transition-colors duration-200 font-medium"
                  >
                    Analysis
                  </Link>
                </li>
                <li className="relative">
                  {/* Groupe pour le hover dropdown */}
                  <div className="group">
                    <button className="flex items-center space-x-2 text-white hover:text-gray-200 transition-colors duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded px-2 py-1">
                      <User size={18} />
                      <span>{user?.username}</span>
                      {/* Icône chevron pour indiquer le dropdown */}
                      <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Menu dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                      >
                        <User size={16} className="mr-3 text-gray-400" />
                        Profile
                      </Link>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                      >
                        <LogOut size={16} className="mr-3 text-gray-400" />
                        Logout
                      </button>
                    </div>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className="hover:text-gray-200 transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="bg-white text-red-700 px-4 py-2 rounded hover:bg-gray-100 transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;