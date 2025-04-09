/**
 * Trade Data Service
 * 
 * Utility functions to analyze and display player trade data
 * and performance changes before/after trades
 */

/**
 * Parse CSV data into usable format
 * @param {string} csvData - Raw CSV data as string
 * @returns {Array} - Array of parsed player season records
 */
export const parseCSVData = (csvData) => {
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, index) => {
      // Convert numeric values
      const value = values[index];
      obj[header] = !isNaN(value) && value !== '' ? parseFloat(value) : value;
      return obj;
    }, {});
  });
};

/**
 * Identify player trades between seasons
 * @param {Array} playerData - Array of player season records
 * @returns {Array} - Array of identified trades with before/after stats
 */
export const identifyPlayerTrades = (playerData) => {
  const trades = [];
  
  // Group data by player ID
  const playerDataByID = playerData.reduce((acc, record) => {
    const id = record.PERSON_ID;
    if (!acc[id]) {
      acc[id] = [];
    }
    acc[id].push(record);
    return acc;
  }, {});

  // For each player, find seasons where team changed
  Object.entries(playerDataByID).forEach(([playerId, seasons]) => {
    // Sort seasons chronologically
    seasons.sort((a, b) => {
      const seasonA = parseInt(a.SEASON_ID.split('-')[0]);
      const seasonB = parseInt(b.SEASON_ID.split('-')[0]);
      return seasonA - seasonB;
    });

    // Check each consecutive season for team changes
    for (let i = 0; i < seasons.length - 1; i++) {
      const currentSeason = seasons[i];
      const nextSeason = seasons[i + 1];

      // Skip "TOT" (total) entries when looking for team changes
      if (currentSeason.TEAM_ABBREVIATION === 'TOT' || nextSeason.TEAM_ABBREVIATION === 'TOT') {
        continue;
      }

      // If team changed between seasons
      if (currentSeason.TEAM_ABBREVIATION !== nextSeason.TEAM_ABBREVIATION) {
        trades.push({
          id: `${playerId}-${currentSeason.SEASON_ID}-${nextSeason.SEASON_ID}`,
          playerId: parseInt(playerId),
          playerName: currentSeason.Player,
          fromSeason: currentSeason.SEASON_ID,
          toSeason: nextSeason.SEASON_ID,
          fromTeam: currentSeason.TEAM_ABBREVIATION,
          toTeam: nextSeason.TEAM_ABBREVIATION,
          statsBefore: {
            ppg: currentSeason.PTS / currentSeason.GP || 0,
            rpg: currentSeason.REB / currentSeason.GP || 0,
            apg: currentSeason.AST / currentSeason.GP || 0,
            fg_pct: currentSeason.FG_PCT || 0,
            mpg: currentSeason.MIN / currentSeason.GP || 0,
            gamesPlayed: currentSeason.GP || 0
          },
          statsAfter: {
            ppg: nextSeason.PTS / nextSeason.GP || 0,
            rpg: nextSeason.REB / nextSeason.GP || 0,
            apg: nextSeason.AST / nextSeason.GP || 0,
            fg_pct: nextSeason.FG_PCT || 0,
            mpg: nextSeason.MIN / nextSeason.GP || 0,
            gamesPlayed: nextSeason.GP || 0
          }
        });
      }
    }
  });

  return trades;
};

/**
 * Get trades for a specific player
 * @param {number} playerId - Player ID to fetch trades for
 * @param {Array} allTrades - Array of all identified trades
 * @returns {Array} - Array of trades for the specified player
 */
export const getPlayerTrades = (playerId, allTrades) => {
  return allTrades.filter(trade => trade.playerId === playerId);
};

/**
 * Calculate performance change metrics
 * @param {Object} trade - Trade object with before/after stats
 * @returns {Object} - Object with performance change analysis
 */
export const analyzePerformanceChange = (trade) => {
  const percentageChange = (before, after) => {
    if (before === 0) return after > 0 ? 100 : 0;
    return ((after - before) / before) * 100;
  };

  // Calculate changes for individual stats
  const changes = {
    ppg: percentageChange(trade.statsBefore.ppg, trade.statsAfter.ppg),
    rpg: percentageChange(trade.statsBefore.rpg, trade.statsAfter.rpg),
    apg: percentageChange(trade.statsBefore.apg, trade.statsAfter.apg),
    fg_pct: percentageChange(trade.statsBefore.fg_pct, trade.statsAfter.fg_pct),
    mpg: percentageChange(trade.statsBefore.mpg, trade.statsAfter.mpg)
  };

  // Calculate overall performance change
  const overallChange = (
    changes.ppg * 0.4 + 
    changes.rpg * 0.2 + 
    changes.apg * 0.2 + 
    changes.fg_pct * 0.1 + 
    changes.mpg * 0.1
  );

  // Determine if performance improved or declined
  const impact = overallChange > 0 ? 'positive' : overallChange < 0 ? 'negative' : 'neutral';
  
  // Generate analysis text
  let analysisText = `${trade.playerName}'s move from ${trade.fromTeam} to ${trade.toTeam} had a ${impact} impact on their performance. `;
  
  // Add details based on the most significant changes
  const significantChanges = Object.entries(changes)
    .filter(([_, value]) => Math.abs(value) > 5)
    .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  
  if (significantChanges.length > 0) {
    const [stat, change] = significantChanges[0];
    const statName = {
      ppg: 'scoring',
      rpg: 'rebounding',
      apg: 'playmaking',
      fg_pct: 'shooting efficiency',
      mpg: 'playing time'
    }[stat];
    
    analysisText += `The most significant change was in ${statName}, which ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change).toFixed(1)}%. `;
  }

  return {
    changes,
    overallChange,
    impact,
    analysisText
  };
};

/**
 * Load trade data from CSV file
 * @returns {Promise} - Promise resolving to parsed trade data
 */
export const loadTradeData = async () => {
  try {
    const response = await fetch('/data/nba_career_stats.csv');
    const csvData = await response.text();
    const parsedData = parseCSVData(csvData);
    const trades = identifyPlayerTrades(parsedData);
    return trades;
  } catch (error) {
    console.error('Error loading trade data:', error);
    return [];
  }
}; 