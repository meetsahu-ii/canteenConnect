import React from 'react';
import { Users, TrendingUp, AlertTriangle } from 'lucide-react';

const CrowdStatusGauge = ({ personCount, crowdLevel, color, timestamp }) => {
  // Calculate gauge percentage (assuming max capacity is 100 people)
  const maxCapacity = 100;
  const percentage = Math.min((personCount / maxCapacity) * 100, 100);
  
  // Get status icon and color
  const getStatusIcon = () => {
    if (crowdLevel === 'Crowded') {
      return <AlertTriangle className="w-6 h-6 text-red-500" />;
    } else if (crowdLevel === 'Busy') {
      return <TrendingUp className="w-6 h-6 text-yellow-500" />;
    } else {
      return <Users className="w-6 h-6 text-green-500" />;
    }
  };

  const getStatusColor = () => {
    switch (crowdLevel) {
      case 'Crowded':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Busy':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Crowd Status</h3>
        {getStatusIcon()}
      </div>

      {/* Gauge Visualization */}
      <div className="mb-6">
        <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 ease-out ${
              crowdLevel === 'Crowded' ? 'bg-red-500' :
              crowdLevel === 'Busy' ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>0</span>
          <span>{Math.round(maxCapacity / 2)}</span>
          <span>{maxCapacity}</span>
        </div>
      </div>

      {/* Status Details */}
      <div className={`inline-flex items-center px-3 py-2 rounded-full border ${getStatusColor()}`}>
        <span className="text-sm font-medium">{crowdLevel}</span>
      </div>

      {/* Person Count */}
      <div className="mt-4">
        <div className="text-3xl font-bold text-gray-900">{personCount}</div>
        <div className="text-sm text-gray-500">people currently in canteen</div>
      </div>

      {/* Last Updated */}
      {timestamp && (
        <div className="mt-4 text-xs text-gray-400">
          Last updated: {new Date(timestamp).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default CrowdStatusGauge;
