/**
 * Player Trade Simulation Utility
 * 
 * This utility provides functions to simulate how a player's performance
 * might change after being traded to a new team.
 */

/**
 * Factors that can affect player performance after a trade
 */
export const FACTORS = {
  SYSTEM_FIT: {
    EXCELLENT: 1.1,    // Player fits perfectly in new system
    GOOD: 1.05,        // Good system fit
    NEUTRAL: 1.0,      // Neutral effect
    POOR: 0.95,        // Poor system fit
    BAD: 0.9           // Bad system fit
  },
  ROLE_CHANGE: {
    PRIMARY_OPTION: 1.15,  // Player becomes primary scoring option
    SECONDARY_OPTION: 1.05, // Player becomes secondary scoring option
    SAME_ROLE: 1.0,       // Same role as before
    REDUCED_ROLE: 0.9,    // Role is reduced
    BENCH_ROLE: 0.8       // Player moves to bench
  },
  MINUTES_CHANGE: {
    SIGNIFICANT_INCREASE: 1.2, // Minutes increase significantly
    MODERATE_INCREASE: 1.1,   // Minutes increase moderately
    SAME_MINUTES: 1.0,        // Minutes stay the same
    MODERATE_DECREASE: 0.9,   // Minutes decrease moderately
    SIGNIFICANT_DECREASE: 0.8  // Minutes decrease significantly
  },
  TEAM_QUALITY: {
    CHAMPIONSHIP_CONTENDER: 1.05, // Going to a championship team
    PLAYOFF_TEAM: 1.02,          // Going to a playoff team
    SAME_LEVEL: 1.0,             // Similar team quality
    LOTTERY_TEAM: 0.98,          // Going to a lottery team
    REBUILDING_TEAM: 0.95        // Going to a rebuilding team
  },
  COACHING: {
    ELITE_COACH: 1.08,           // Elite development coach
    GOOD_COACH: 1.04,            // Good coach
    AVERAGE_COACH: 1.0,          // Average coaching
    BELOW_AVERAGE_COACH: 0.96,   // Below average coach
    POOR_COACH: 0.92             // Poor coach
  },
  USAGE_RATE: {
    STAR_USAGE: 1.15,            // Star player usage
    HIGH_USAGE: 1.08,            // High usage
    AVERAGE_USAGE: 1.0,          // Average usage
    LOW_USAGE: 0.92,             // Low usage
    MINIMAL_USAGE: 0.85          // Minimal usage
  }
};

/**
 * Calculate performance change after a trade based on selected factors
 * 
 * @param {Object} player - Player data object
 * @param {Object} tradeFactors - Factors affecting the trade
 * @returns {Object} - New stats and percentage changes
 */
export const simulateTradePerformance = (player, tradeFactors) => {
  // Calculate the overall impact multiplier
  const systemFit = FACTORS.SYSTEM_FIT[tradeFactors.systemFit] || FACTORS.SYSTEM_FIT.NEUTRAL;
  const roleChange = FACTORS.ROLE_CHANGE[tradeFactors.roleChange] || FACTORS.ROLE_CHANGE.SAME_ROLE;
  const minutesChange = FACTORS.MINUTES_CHANGE[tradeFactors.minutesChange] || FACTORS.MINUTES_CHANGE.SAME_MINUTES;
  const teamQuality = FACTORS.TEAM_QUALITY[tradeFactors.teamQuality] || FACTORS.TEAM_QUALITY.SAME_LEVEL;
  const coaching = FACTORS.COACHING[tradeFactors.coaching] || FACTORS.COACHING.AVERAGE_COACH;
  const usageRate = FACTORS.USAGE_RATE[tradeFactors.usageRate] || FACTORS.USAGE_RATE.AVERAGE_USAGE;

  // Overall multiplier with weighted factors
  const overallMultiplier = (
    systemFit * 0.2 +
    roleChange * 0.25 +
    minutesChange * 0.2 +
    teamQuality * 0.1 +
    coaching * 0.1 +
    usageRate * 0.15
  );

  // Calculate specific stat adjustments
  // Different stats are affected differently by trades
  const scoringMultiplier = overallMultiplier * (usageRate * 0.7 + roleChange * 0.3);
  const reboundingMultiplier = overallMultiplier * (minutesChange * 0.6 + systemFit * 0.4);
  const assistMultiplier = overallMultiplier * (systemFit * 0.5 + roleChange * 0.5);
  const efficiencyMultiplier = overallMultiplier * (coaching * 0.4 + teamQuality * 0.4 + systemFit * 0.2);
  
  // Calculate new stats
  const newStats = {
    ppg: Math.max(0, player.stats.ppg * scoringMultiplier),
    rpg: Math.max(0, player.stats.rpg * reboundingMultiplier),
    apg: Math.max(0, player.stats.apg * assistMultiplier),
    fg_pct: Math.min(65, Math.max(30, player.stats.fg_pct * efficiencyMultiplier)),
    minutesPerGame: Math.max(0, player.stats.minutesPerGame * minutesChange),
    gamesPlayed: player.stats.gamesPlayed
  };

  // Calculate percentage changes
  const changes = {
    ppg: calculatePercentageChange(player.stats.ppg, newStats.ppg),
    rpg: calculatePercentageChange(player.stats.rpg, newStats.rpg),
    apg: calculatePercentageChange(player.stats.apg, newStats.apg),
    fg_pct: calculatePercentageChange(player.stats.fg_pct, newStats.fg_pct),
    minutesPerGame: calculatePercentageChange(player.stats.minutesPerGame, newStats.minutesPerGame),
    overall: calculatePercentageChange(
      (player.stats.ppg + player.stats.rpg + player.stats.apg) / 3,
      (newStats.ppg + newStats.rpg + newStats.apg) / 3
    )
  };

  // Calculate development needs
  const developmentNeeds = calculateDevelopmentNeeds(changes);

  return {
    newStats,
    changes,
    developmentNeeds,
    overallMultiplier
  };
};

/**
 * Calculate percentage change between two values
 * 
 * @param {number} oldValue - Original value
 * @param {number} newValue - New value
 * @returns {number} - Percentage change
 */
const calculatePercentageChange = (oldValue, newValue) => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Calculate development needs based on performance changes
 * 
 * @param {Object} changes - Percentage changes in stats
 * @returns {Object} - Development needs assessment
 */
const calculateDevelopmentNeeds = (changes) => {
  const needs = [];
  const overallChange = changes.overall;

  // Assess development needs based on changes
  if (changes.ppg < -5) {
    needs.push({
      area: "Scoring",
      severity: changes.ppg < -15 ? "critical" : "moderate",
      recommendation: "Work with shooting coach to develop scoring options"
    });
  }

  if (changes.rpg < -8) {
    needs.push({
      area: "Rebounding",
      severity: changes.rpg < -20 ? "critical" : "moderate",
      recommendation: "Focus on positioning and boxing out techniques"
    });
  }

  if (changes.apg < -10) {
    needs.push({
      area: "Playmaking",
      severity: changes.apg < -25 ? "critical" : "moderate",
      recommendation: "Develop court vision and passing skills in new offense"
    });
  }

  if (changes.fg_pct < -5) {
    needs.push({
      area: "Efficiency",
      severity: changes.fg_pct < -10 ? "critical" : "moderate",
      recommendation: "Work on shot selection and finishing"
    });
  }

  // Overall assessment
  let overallAssessment;
  if (overallChange > 10) {
    overallAssessment = "Player is projected to thrive in the new environment";
  } else if (overallChange > 0) {
    overallAssessment = "Player is projected to see modest improvement";
  } else if (overallChange > -10) {
    overallAssessment = "Player may need time to adjust to new role";
  } else {
    overallAssessment = "Player may require significant support to maintain performance";
  }

  return {
    needsSupport: overallChange < -5,
    needs,
    overallAssessment
  };
};

/**
 * Get recommended trade destinations for a player
 * 
 * @param {Object} player - Player data
 * @returns {Array} - Array of recommended destinations
 */
export const getRecommendedDestinations = (player) => {
  // Example logic for recommended destinations
  // In a real app, this would be more sophisticated
  const recommendations = [];
  
  // For scoring-focused players (20+ ppg)
  if (player.stats.ppg >= 20) {
    recommendations.push({
      team: "New York Knicks",
      fit: "Excellent",
      reason: "High-profile market for a scoring talent",
      projectedChange: "+7%"
    });
  }
  
  // For efficient scorers (50%+ FG)
  if (player.stats.fg_pct >= 50) {
    recommendations.push({
      team: "Boston Celtics",
      fit: "Good",
      reason: "System emphasizes efficient scoring",
      projectedChange: "+5%"
    });
  }
  
  // For playmakers (7+ assists)
  if (player.stats.apg >= 7) {
    recommendations.push({
      team: "Denver Nuggets",
      fit: "Excellent",
      reason: "Offense built around skilled passers",
      projectedChange: "+8%"
    });
  }
  
  // Add a default recommendation if none match
  if (recommendations.length === 0) {
    recommendations.push({
      team: "San Antonio Spurs",
      fit: "Good",
      reason: "Development-focused organization",
      projectedChange: "+3%"
    });
  }
  
  return recommendations;
};

export default {
  simulateTradePerformance,
  getRecommendedDestinations,
  FACTORS
}; 