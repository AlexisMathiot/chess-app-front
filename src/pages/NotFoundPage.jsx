import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight as ChessKnight, Home } from 'lucide-react';

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
          <ChessKnight size={80} className="text-red-700" />
        </div>
        <h1 className="mt-6 text-4xl font-extrabold text-gray-900">404</h1>
        <h2 className="mt-2 text-2xl font-bold text-gray-900">Page not found</h2>
        <p className="mt-4 text-gray-600">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <Home size={20} className="mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;