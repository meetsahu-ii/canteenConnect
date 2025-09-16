import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu as MenuIcon, Users } from 'lucide-react';
import axios from 'axios';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [crowd, setCrowd] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const fetchCrowd = async () => {
      try {
        const res = await axios.get('/api/crowd/latest');
        setCrowd(res.data);
      } catch (e) {
        // ignore
      }
    };
    fetchCrowd();
    const id = setInterval(fetchCrowd, 30000);
    return () => clearInterval(id);
  }, []);

  const crowdBadge = crowd ? (
    <span
      className={`ml-2 text-xs px-2 py-1 rounded-full border ${
        crowd.crowdLevel === 'Crowded'
          ? 'bg-red-50 text-red-600 border-red-200'
          : crowd.crowdLevel === 'Busy'
          ? 'bg-yellow-50 text-yellow-600 border-yellow-200'
          : 'bg-green-50 text-green-600 border-green-200'
      }`}
      title={`${crowd.personCount} people`}
    >
      <span className="inline-flex items-center gap-1">
        <Users className="w-3 h-3" />
        {crowd.crowdLevel}
      </span>
    </span>
  ) : null;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Canteen Connect</span>
            </Link>
            
            <nav className="hidden md:flex space-x-6">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/menu" 
                className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors inline-flex items-center"
              >
                Menu
                {crowdBadge}
              </Link>
            </nav>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{user?.username}</span>
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                {user?.role}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
