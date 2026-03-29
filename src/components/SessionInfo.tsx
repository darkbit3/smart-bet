import React from 'react';
import { Clock, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/UserContext';

export const SessionInfo: React.FC = () => {
  const { user, sessionTimeRemaining, logout } = useAuth();

  if (!user) return null;

  const formatTime = (minutes: number): string => {
    if (minutes <= 0) return 'Expired';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getTimeColor = (minutes: number): string => {
    if (minutes <= 0) return 'text-red-500';
    if (minutes <= 5) return 'text-orange-500';
    if (minutes <= 30) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-gray-900 rounded-lg border border-gray-800">
      <div className="flex items-center gap-2">
        <Clock className={`w-4 h-4 ${getTimeColor(sessionTimeRemaining)}`} />
        <span className={`text-sm font-medium ${getTimeColor(sessionTimeRemaining)}`}>
          Session: {formatTime(sessionTimeRemaining)}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400">
          {user.username}
        </span>
        <button
          onClick={logout}
          className="p-1 text-gray-400 hover:text-white transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
