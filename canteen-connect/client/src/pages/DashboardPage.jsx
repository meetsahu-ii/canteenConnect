import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CrowdStatusGauge from '../components/CrowdStatusGauge';
import MenuItemCard from '../components/MenuItemCard';
import AdminPanel from '../components/AdminPanel';
import { useAuth } from '../context/AuthContext';
import { Clock, TrendingUp, Users } from 'lucide-react';
import axios from 'axios';

const DashboardPage = () => {
  const { user } = useAuth();
  const [crowdData, setCrowdData] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    // Set up interval to refresh crowd data every 30 seconds
    const interval = setInterval(fetchCrowdData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      await Promise.all([
        fetchCrowdData(),
        fetchMenuItems()
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCrowdData = async () => {
    try {
      const response = await axios.get('/api/crowd/latest');
      setCrowdData(response.data);
    } catch (error) {
      console.error('Error fetching crowd data:', error);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('/api/menu');
      setMenuItems(response.data);
    } catch (error) {
      console.error('Error fetching menu items:', error);
    }
  };

  const handleRatingUpdate = (itemId, newRating) => {
    setMenuItems(prev => 
      prev.map(item => 
        item._id === itemId 
          ? { ...item, averageRating: newRating }
          : item
      )
    );
  };

  // Get today's specials (first 6 items)
  const todaysSpecials = menuItems.slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-600">
            Here's what's happening at your canteen today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Crowd</p>
                <p className="text-2xl font-bold text-gray-900">
                  {crowdData?.personCount || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Menu Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {menuItems.length}
                </p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-2xl font-bold text-gray-900">
                  {crowdData?.timestamp 
                    ? new Date(crowdData.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })
                    : 'N/A'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Crowd Status */}
          <div className="lg:col-span-1">
            {crowdData && (
              <CrowdStatusGauge
                personCount={crowdData.personCount}
                crowdLevel={crowdData.crowdLevel}
                color={crowdData.color}
                timestamp={crowdData.timestamp}
              />
            )}
          </div>

          {/* Right Column - Today's Specials */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Today's Specials</h2>
              {user?.role === 'admin' && (
                <button
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="btn-primary"
                >
                  {showAdminPanel ? 'Hide Admin Panel' : 'Show Admin Panel'}
                </button>
              )}
            </div>

            {/* Admin Panel */}
            {showAdminPanel && user?.role === 'admin' && (
              <div className="mb-8">
                <AdminPanel />
              </div>
            )}

            {/* Menu Items Grid */}
            {todaysSpecials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {todaysSpecials.map((item) => (
                  <MenuItemCard
                    key={item._id}
                    item={item}
                    onRatingUpdate={handleRatingUpdate}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items yet</h3>
                <p className="text-gray-600">
                  {user?.role === 'admin' 
                    ? 'Add some delicious items to get started!' 
                    : 'Check back later for today\'s menu.'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
