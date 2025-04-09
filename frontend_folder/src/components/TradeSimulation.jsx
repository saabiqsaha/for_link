import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { loadTradeData, getPlayerTrades, analyzePerformanceChange } from '../utils/tradeDataService';

// Register Chart.js components
Chart.register(...registerables);

const TradeAnalysis = ({ player }) => {
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [allTrades, setAllTrades] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  // Load all trade data on component mount
  useEffect(() => {
    const fetchTradeData = async () => {
      try {
        const trades = await loadTradeData();
        setAllTrades(trades);
      } catch (error) {
        console.error("Error loading trade data:", error);
      }
    };

    fetchTradeData();
  }, []);

  // Get player-specific trades when player or allTrades changes
  useEffect(() => {
    if (player && player.id && allTrades.length > 0) {
      setIsLoading(true);
      
      // Get trades for this specific player
      const playerTradeHistory = getPlayerTrades(player.id, allTrades);
      setTradeHistory(playerTradeHistory);
      
      // Set the most recent trade as selected by default if available
      if (playerTradeHistory.length > 0) {
        const mostRecentTrade = playerTradeHistory[0];
        setSelectedTrade(mostRecentTrade);
        setAnalysis(analyzePerformanceChange(mostRecentTrade));
      } else {
        setSelectedTrade(null);
        setAnalysis(null);
      }
      
      setIsLoading(false);
    }
  }, [player, allTrades]);

  // Update analysis when selected trade changes
  useEffect(() => {
    if (selectedTrade) {
      setAnalysis(analyzePerformanceChange(selectedTrade));
    }
  }, [selectedTrade]);

  // Calculate percentage change between before and after stats
  const calculateChange = (before, after) => {
    if (before === 0) return after > 0 ? 100 : 0;
    return ((after - before) / before) * 100;
  };

  // Get color based on change value
  const getChangeColor = (change) => {
    if (change > 5) return 'text-green-600';
    if (change < -5) return 'text-red-600';
    return 'text-gray-600';
  };

  // Format stat value (1 decimal place)
  const formatStat = (value, isPercentage = false) => {
    const formatted = value.toFixed(1);
    return isPercentage ? `${formatted}%` : formatted;
  };

  // Format change value with sign and 1 decimal place
  const formatChange = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Prepare chart data for the selected trade
  const getChartData = (trade) => {
    if (!trade) return null;
    
    const labels = ['PPG', 'RPG', 'APG', 'FG%', 'MPG'];
    
    return {
      labels,
      datasets: [
        {
          label: `${trade.fromTeam} (${trade.fromSeason})`,
          data: [
            trade.statsBefore.ppg,
            trade.statsBefore.rpg,
            trade.statsBefore.apg,
            trade.statsBefore.fg_pct * 100, // Convert to percentage for display
            trade.statsBefore.mpg
          ],
          backgroundColor: 'rgba(23, 64, 139, 0.6)',
          borderColor: '#17408B',
          borderWidth: 1,
        },
        {
          label: `${trade.toTeam} (${trade.toSeason})`,
          data: [
            trade.statsAfter.ppg,
            trade.statsAfter.rpg,
            trade.statsAfter.apg,
            trade.statsAfter.fg_pct * 100, // Convert to percentage for display
            trade.statsAfter.mpg
          ],
          backgroundColor: 'rgba(42, 93, 176, 0.6)',
          borderColor: '#2A5DB0',
          borderWidth: 1,
        },
      ],
    };
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw.toFixed(1);
            const metric = context.chart.data.labels[context.dataIndex];
            return `${label}: ${value}${metric === 'FG%' ? '%' : ''}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // If no real trade data is available, use mock data for demonstration
  const useMockData = () => {
    if (player && player.stats && (!tradeHistory || tradeHistory.length === 0)) {
      return [
        {
          id: 1,
          playerId: player.id,
          playerName: player.name,
          fromSeason: "2017-18",
          toSeason: "2018-19",
          fromTeam: "CLE",
          toTeam: "BOS",
          statsBefore: {
            ppg: player.stats.ppg * 0.9,
            rpg: player.stats.rpg * 1.1,
            apg: player.stats.apg * 0.95,
            fg_pct: player.stats.fg_pct * 0.97,
            mpg: player.stats.minutesPerGame * 1.05,
            gamesPlayed: 45
          },
          statsAfter: {
            ppg: player.stats.ppg * 1.15,
            rpg: player.stats.rpg * 0.9,
            apg: player.stats.apg * 1.2,
            fg_pct: player.stats.fg_pct * 1.03,
            mpg: player.stats.minutesPerGame * 0.95,
            gamesPlayed: 37
          }
        }
      ];
    }
    return [];
  };

  // Determine which trade history to display
  const displayHistory = tradeHistory.length > 0 ? tradeHistory : useMockData();
  const isUsingMockData = tradeHistory.length === 0 && displayHistory.length > 0;

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6 gold-box-shadow">
      <h2 className="text-2xl font-bold text-black mb-4">Trade Impact Analysis</h2>
      
      {!player || !player.stats ? (
        <div className="text-center py-4">
          <p className="text-gray-500">Select a player to view trade history</p>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nba-blue"></div>
          <p className="ml-2 text-nba-blue">Loading trade history...</p>
        </div>
      ) : displayHistory.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500">No trade history available for {player.name}</p>
        </div>
      ) : (
        <div>
          {isUsingMockData && (
            <div className="mb-4 p-2 bg-yellow-50 border border-nba-blue rounded-md">
              <p className="text-sm text-black">
                <span className="font-semibold">Note:</span> Using sample data for demonstration. This player either has no trade history or their ID doesn't match our database.
              </p>
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-2">
              Select Trade
            </label>
            <select
              value={selectedTrade ? selectedTrade.id : ''}
              onChange={(e) => {
                const tradeId = e.target.value;
                const trade = displayHistory.find(t => t.id == tradeId);
                setSelectedTrade(trade);
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:border-btn-gold focus:ring focus:ring-btn-gold focus:ring-opacity-50"
            >
              {displayHistory.map(trade => (
                <option key={trade.id} value={trade.id}>
                  {trade.fromSeason} to {trade.toSeason}: {trade.fromTeam} → {trade.toTeam}
                </option>
              ))}
            </select>
          </div>
          
          {selectedTrade && (
            <>
              {/* Trade Details */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-nba-blue border-opacity-30">
                <h3 className="text-lg font-semibold text-black mb-2">
                  {selectedTrade.playerName || player.name}'s Trade
                </h3>
                <div className="flex justify-between items-center">
                  <div className="text-center">
                    <span className="block text-sm text-gray-700">From</span>
                    <span className="text-xl font-bold text-nba-blue">{selectedTrade.fromTeam}</span>
                    <span className="block text-xs text-gray-700">{selectedTrade.fromSeason}</span>
                  </div>
                  <div className="text-2xl text-nba-blue">→</div>
                  <div className="text-center">
                    <span className="block text-sm text-gray-700">To</span>
                    <span className="text-xl font-bold text-nba-blue">{selectedTrade.toTeam}</span>
                    <span className="block text-xs text-gray-700">{selectedTrade.toSeason}</span>
                  </div>
                </div>
              </div>
              
              {/* Stat Comparison Table */}
              <div className="mb-6 overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-nba-blue bg-opacity-10">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-nba-blue uppercase tracking-wider">
                        Statistic
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-nba-blue uppercase tracking-wider">
                        Before Trade<br/><span className="text-xs normal-case">({selectedTrade.fromTeam})</span>
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-nba-blue uppercase tracking-wider">
                        After Trade<br/><span className="text-xs normal-case">({selectedTrade.toTeam})</span>
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-nba-blue uppercase tracking-wider">
                        Change
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {/* Points Per Game */}
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap font-medium">Points Per Game</td>
                      <td className="px-4 py-2 whitespace-nowrap text-center">{formatStat(selectedTrade.statsBefore.ppg)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-center">{formatStat(selectedTrade.statsAfter.ppg)}</td>
                      <td className={`px-4 py-2 whitespace-nowrap text-center ${getChangeColor(calculateChange(selectedTrade.statsBefore.ppg, selectedTrade.statsAfter.ppg))}`}>
                        {formatChange(calculateChange(selectedTrade.statsBefore.ppg, selectedTrade.statsAfter.ppg))}
                      </td>
                    </tr>
                    
                    {/* Rebounds Per Game */}
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap font-medium">Rebounds Per Game</td>
                      <td className="px-4 py-2 whitespace-nowrap text-center">{formatStat(selectedTrade.statsBefore.rpg)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-center">{formatStat(selectedTrade.statsAfter.rpg)}</td>
                      <td className={`px-4 py-2 whitespace-nowrap text-center ${getChangeColor(calculateChange(selectedTrade.statsBefore.rpg, selectedTrade.statsAfter.rpg))}`}>
                        {formatChange(calculateChange(selectedTrade.statsBefore.rpg, selectedTrade.statsAfter.rpg))}
                      </td>
                    </tr>
                    
                    {/* Assists Per Game */}
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap font-medium">Assists Per Game</td>
                      <td className="px-4 py-2 whitespace-nowrap text-center">{formatStat(selectedTrade.statsBefore.apg)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-center">{formatStat(selectedTrade.statsAfter.apg)}</td>
                      <td className={`px-4 py-2 whitespace-nowrap text-center ${getChangeColor(calculateChange(selectedTrade.statsBefore.apg, selectedTrade.statsAfter.apg))}`}>
                        {formatChange(calculateChange(selectedTrade.statsBefore.apg, selectedTrade.statsAfter.apg))}
                      </td>
                    </tr>
                    
                    {/* Field Goal Percentage */}
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap font-medium">Field Goal Percentage</td>
                      <td className="px-4 py-2 whitespace-nowrap text-center">{formatStat(selectedTrade.statsBefore.fg_pct * 100, true)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-center">{formatStat(selectedTrade.statsAfter.fg_pct * 100, true)}</td>
                      <td className={`px-4 py-2 whitespace-nowrap text-center ${getChangeColor(calculateChange(selectedTrade.statsBefore.fg_pct, selectedTrade.statsAfter.fg_pct))}`}>
                        {formatChange(calculateChange(selectedTrade.statsBefore.fg_pct, selectedTrade.statsAfter.fg_pct))}
                      </td>
                    </tr>
                    
                    {/* Minutes Per Game */}
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap font-medium">Minutes Per Game</td>
                      <td className="px-4 py-2 whitespace-nowrap text-center">{formatStat(selectedTrade.statsBefore.mpg)}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-center">{formatStat(selectedTrade.statsAfter.mpg)}</td>
                      <td className={`px-4 py-2 whitespace-nowrap text-center ${getChangeColor(calculateChange(selectedTrade.statsBefore.mpg, selectedTrade.statsAfter.mpg))}`}>
                        {formatChange(calculateChange(selectedTrade.statsBefore.mpg, selectedTrade.statsAfter.mpg))}
                      </td>
                    </tr>
                    
                    {/* Games Played */}
                    <tr>
                      <td className="px-4 py-2 whitespace-nowrap font-medium">Games Played</td>
                      <td className="px-4 py-2 whitespace-nowrap text-center">{selectedTrade.statsBefore.gamesPlayed}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-center">{selectedTrade.statsAfter.gamesPlayed}</td>
                      <td className={`px-4 py-2 whitespace-nowrap text-center ${getChangeColor(calculateChange(selectedTrade.statsBefore.gamesPlayed, selectedTrade.statsAfter.gamesPlayed))}`}>
                        {formatChange(calculateChange(selectedTrade.statsBefore.gamesPlayed, selectedTrade.statsAfter.gamesPlayed))}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Chart Visualization */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-black mb-4">Performance Comparison</h3>
                <div className="h-64 border border-nba-blue border-opacity-20 rounded-lg p-2">
                  <Bar data={getChartData(selectedTrade)} options={chartOptions} />
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default TradeAnalysis; 