import React from 'react';

const PlayerStats = ({ player }) => {
  if (!player) return null;

  // Calculate efficiency rating
  const calculateEfficiency = () => {
    const pts = parseFloat(player.stats.ppg) || 0;
    const reb = parseFloat(player.stats.rpg) || 0;
    const ast = parseFloat(player.stats.apg) || 0;
    return ((pts + (reb * 1.2) + (ast * 1.5)) / 3).toFixed(1);
  };

  return (
    <div className="w-full p-4">
      <div className="bg-white rounded-lg shadow-md p-6 gold-box-shadow">
        <h2 className="text-2xl font-bold text-black mb-4">Player Performance Profile</h2>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Stat Cards */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-black">Key Statistics</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              <div className="bg-gray-100 p-4 rounded-md border border-btn-gold border-opacity-20 hover:border-opacity-50 transition-all">
                <h4 className="text-sm text-black font-medium">Points</h4>
                <p className="text-3xl font-bold text-nba-blue">
                  {typeof player.stats.ppg === 'number' ? player.stats.ppg.toFixed(1) : player.stats.ppg}
                </p>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-md border border-btn-gold border-opacity-20 hover:border-opacity-50 transition-all">
                <h4 className="text-sm text-black font-medium">Rebounds</h4>
                <p className="text-3xl font-bold text-nba-blue">
                  {typeof player.stats.rpg === 'number' ? player.stats.rpg.toFixed(1) : player.stats.rpg}
                </p>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-md border border-btn-gold border-opacity-20 hover:border-opacity-50 transition-all">
                <h4 className="text-sm text-black font-medium">Assists</h4>
                <p className="text-3xl font-bold text-nba-blue">
                  {typeof player.stats.apg === 'number' ? player.stats.apg.toFixed(1) : player.stats.apg}
                </p>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-md border border-btn-gold border-opacity-20 hover:border-opacity-50 transition-all">
                <h4 className="text-sm text-black font-medium">Games</h4>
                <p className="text-3xl font-bold text-nba-blue">{player.stats.gamesPlayed}</p>
              </div>

              <div className="bg-gray-100 p-4 rounded-md border border-btn-gold border-opacity-20 hover:border-opacity-50 transition-all">
                <h4 className="text-sm text-black font-medium">MPG</h4>
                <p className="text-3xl font-bold text-nba-blue">
                  {typeof player.stats.minutesPerGame === 'number' ? player.stats.minutesPerGame.toFixed(1) : player.stats.minutesPerGame}
                </p>
              </div>

              <div className="bg-gray-100 p-4 rounded-md border border-btn-gold border-opacity-20 hover:border-opacity-50 transition-all">
                <h4 className="text-sm text-black font-medium">Efficiency</h4>
                <p className="text-3xl font-bold text-nba-blue">{calculateEfficiency()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats; 