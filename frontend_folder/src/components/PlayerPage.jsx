import { useState, useEffect } from 'react';
import PlayerStats from './PlayerStats';
import TradeAnalysis from './TradeSimulation';

const PlayerPage = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: 'all',
    gamesPlayed: 'all',
    position: 'all'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tradeCount, setTradeCount] = useState(0);
  const [tradeAdjustments, setTradeAdjustments] = useState({
    scoring: 0,
    rebounding: 0,
    assists: 0,
  });
  const [tradedStats, setTradedStats] = useState(null);
  const [performanceChanges, setPerformanceChanges] = useState(null);
  const [showSupportButton, setShowSupportButton] = useState(false);
  const [isPlayerSupported, setIsPlayerSupported] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Sample player data - updated with historical and current NBA greats
  const samplePlayers = [
    {
      id: 201942,
      name: "DeMar DeRozan",
      team: "Chicago Bulls",
      location: "East",
      position: "SF",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/201942.png",
      stats: {
        ppg: 21.9,
        rpg: 4.4,
        apg: 3.9,
        gamesPlayed: 1064,
        minutesPerGame: 34.4,
        fg_pct: 46.8,
        fg3_pct: 28.9,
        ft_pct: 84.2,
        spg: 1.0,
        bpg: 0.3
      }
    },
    {
      id: 202681,
      name: "Kyrie Irving",
      team: "Dallas Mavericks",
      location: "West",
      position: "PG",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/202681.png",
      stats: {
        ppg: 23.4,
        rpg: 3.9,
        apg: 5.7,
        gamesPlayed: 708,
        minutesPerGame: 34.5,
        fg_pct: 47.6,
        fg3_pct: 39.5,
        ft_pct: 88.6,
        spg: 1.3,
        bpg: 0.4
      }
    },
    {
      id: 203954,
      name: "Joel Embiid",
      team: "Philadelphia 76ers",
      location: "East",
      position: "C",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/203954.png",
      stats: {
        ppg: 27.1,
        rpg: 11.2,
        apg: 3.6,
        gamesPlayed: 433,
        minutesPerGame: 31.3,
        fg_pct: 49.4,
        fg3_pct: 33.0,
        ft_pct: 81.2,
        spg: 0.9,
        bpg: 1.7
      }
    },
    {
      id: 1629029,
      name: "Luka Doncic",
      team: "Dallas Mavericks",
      location: "West",
      position: "PG",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png",
      stats: {
        ppg: 28.4,
        rpg: 8.7,
        apg: 8.0,
        gamesPlayed: 381,
        minutesPerGame: 35.0,
        fg_pct: 45.9,
        fg3_pct: 34.0,
        ft_pct: 73.7,
        spg: 1.1,
        bpg: 0.4
      }
    },
    {
      id: 893,
      name: "Michael Jordan",
      team: "Chicago Bulls",
      location: "East",
      position: "SG",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/893.png",
      stats: {
        ppg: 29.4,
        rpg: 6.1,
        apg: 5.3,
        gamesPlayed: 1072,
        minutesPerGame: 37.6,
        fg_pct: 48.8,
        fg3_pct: 32.7,
        ft_pct: 83.5,
        spg: 2.3,
        bpg: 0.8
      }
    },
    {
      id: 76375,
      name: "Wilt Chamberlain",
      team: "Philadelphia/LA Lakers",
      location: "West",
      position: "C",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/76375.png",
      stats: {
        ppg: 30.6,
        rpg: 22.9,
        apg: 4.4,
        gamesPlayed: 1045,
        minutesPerGame: 45.5,
        fg_pct: 56.0,
        fg3_pct: 0.0,
        ft_pct: 51.1,
        spg: 0.0,
        bpg: 0.0
      }
    },
    {
      id: 1629027,
      name: "Trae Young",
      team: "Atlanta Hawks",
      location: "East",
      position: "PG",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629027.png",
      stats: {
        ppg: 25.5,
        rpg: 3.9,
        apg: 9.5,
        gamesPlayed: 386,
        minutesPerGame: 34.5,
        fg_pct: 43.2,
        fg3_pct: 35.6,
        ft_pct: 86.5,
        spg: 0.9,
        bpg: 0.2
      }
    },
    {
      id: 203081,
      name: "Damian Lillard",
      team: "Milwaukee Bucks",
      location: "East",
      position: "PG",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/203081.png",
      stats: {
        ppg: 25.4,
        rpg: 4.2,
        apg: 6.7,
        gamesPlayed: 769,
        minutesPerGame: 36.2,
        fg_pct: 43.7,
        fg3_pct: 37.2,
        ft_pct: 89.6,
        spg: 1.0,
        bpg: 0.3
      }
    },
    {
      id: 1628378,
      name: "Donovan Mitchell",
      team: "Cleveland Cavaliers",
      location: "East",
      position: "SG",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628378.png",
      stats: {
        ppg: 24.9,
        rpg: 4.4,
        apg: 4.5,
        gamesPlayed: 475,
        minutesPerGame: 33.9,
        fg_pct: 44.9,
        fg3_pct: 36.4,
        ft_pct: 83.4,
        spg: 1.4,
        bpg: 0.3
      }
    },
    {
      id: 203507,
      name: "Giannis Antetokounmpo",
      team: "Milwaukee Bucks",
      location: "East",
      position: "PF",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png",
      stats: {
        ppg: 24.4,
        rpg: 10.2,
        apg: 5.1,
        gamesPlayed: 771,
        minutesPerGame: 32.8,
        fg_pct: 54.0,
        fg3_pct: 28.7,
        ft_pct: 69.1,
        spg: 1.1,
        bpg: 1.3
      }
    },
    {
      id: 1626164,
      name: "Devin Booker",
      team: "Phoenix Suns",
      location: "West",
      position: "SG",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626164.png",
      stats: {
        ppg: 24.7,
        rpg: 4.3,
        apg: 4.9,
        gamesPlayed: 584,
        minutesPerGame: 34.4,
        fg_pct: 46.3,
        fg3_pct: 35.7,
        ft_pct: 86.6,
        spg: 0.9,
        bpg: 0.3
      }
    },
    {
      id: 1628983,
      name: "Shai Gilgeous-Alexander",
      team: "Oklahoma City Thunder",
      location: "West",
      position: "SG",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628983.png",
      stats: {
        ppg: 24.6,
        rpg: 5.3,
        apg: 5.2,
        gamesPlayed: 394,
        minutesPerGame: 33.3,
        fg_pct: 49.6,
        fg3_pct: 34.2,
        ft_pct: 84.5,
        spg: 1.3,
        bpg: 0.8
      }
    },
    {
      id: 1629627,
      name: "Zion Williamson",
      team: "New Orleans Pelicans",
      location: "West",
      position: "PF",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629627.png",
      stats: {
        ppg: 24.6,
        rpg: 6.9,
        apg: 3.5,
        gamesPlayed: 178,
        minutesPerGame: 30.8,
        fg_pct: 58.8,
        fg3_pct: 34.3,
        ft_pct: 68.4,
        spg: 1.1,
        bpg: 0.6
      }
    },
    {
      id: 76003,
      name: "Kareem Abdul-Jabbar",
      team: "Los Angeles Lakers",
      location: "West",
      position: "C",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/76003.png",
      stats: {
        ppg: 24.6,
        rpg: 11.2,
        apg: 3.6,
        gamesPlayed: 1560,
        minutesPerGame: 36.8,
        fg_pct: 55.9,
        fg3_pct: 5.6,
        ft_pct: 72.1,
        spg: 0.9,
        bpg: 2.6
      }
    },
    {
      id: 78497,
      name: "Jerry West",
      team: "Los Angeles Lakers",
      location: "West",
      position: "PG",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/78497.png",
      stats: {
        ppg: 26.7,
        rpg: 5.8,
        apg: 6.7,
        gamesPlayed: 932,
        minutesPerGame: 38.9,
        fg_pct: 47.3,
        fg3_pct: 0.0,
        ft_pct: 81.4,
        spg: 0.0,
        bpg: 0.0
      }
    },
    {
      id: 76804,
      name: "George Gervin",
      team: "San Antonio Spurs",
      location: "West",
      position: "SG",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/76804.png",
      stats: {
        ppg: 26.2,
        rpg: 5.0,
        apg: 2.8,
        gamesPlayed: 791,
        minutesPerGame: 33.5,
        fg_pct: 51.0,
        fg3_pct: 27.0,
        ft_pct: 84.0,
        spg: 1.2,
        bpg: 1.0
      }
    },
    {
      id: 77847,
      name: "Bob Pettit",
      team: "St. Louis Hawks",
      location: "West",
      position: "PF",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/77847.png",
      stats: {
        ppg: 26.2,
        rpg: 16.2,
        apg: 3.0,
        gamesPlayed: 792,
        minutesPerGame: 38.6,
        fg_pct: 43.4,
        fg3_pct: 0.0,
        ft_pct: 76.1,
        spg: 0.0,
        bpg: 0.0
      }
    },
    {
      id: 600015,
      name: "Oscar Robertson",
      team: "Cincinnati Royals",
      location: "East",
      position: "PG",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/600015.png",
      stats: {
        ppg: 25.5,
        rpg: 7.5,
        apg: 9.5,
        gamesPlayed: 1040,
        minutesPerGame: 42.1,
        fg_pct: 48.3,
        fg3_pct: 0.0,
        ft_pct: 83.8,
        spg: 0.0,
        bpg: 0.0
      }
    },
    {
      id: 76127,
      name: "Elgin Baylor",
      team: "Los Angeles Lakers",
      location: "West",
      position: "SF",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/76127.png",
      stats: {
        ppg: 25.3,
        rpg: 13.5,
        apg: 4.3,
        gamesPlayed: 846,
        minutesPerGame: 38.4,
        fg_pct: 43.1,
        fg3_pct: 0.0,
        ft_pct: 78.0,
        spg: 0.0,
        bpg: 0.0
      }
    },
    {
      id: 252,
      name: "Karl Malone",
      team: "Utah Jazz",
      location: "West",
      position: "PF",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/252.png",
      stats: {
        ppg: 24.7,
        rpg: 10.5,
        apg: 3.6,
        gamesPlayed: 1476,
        minutesPerGame: 37.1,
        fg_pct: 51.3,
        fg3_pct: 27.4,
        ft_pct: 74.2,
        spg: 1.4,
        bpg: 0.8
      }
    },
    {
      id: 2544,
      name: "LeBron James",
      team: "Los Angeles Lakers",
      location: "West",
      position: "F",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png",
      stats: {
        ppg: 27.2,
        rpg: 7.5,
        apg: 7.3,
        gamesPlayed: 1421,
        minutesPerGame: 38.0,
        fg_pct: 50.6,
        fg3_pct: 34.6,
        ft_pct: 73.5,
        spg: 1.5,
        bpg: 0.8
      }
    },
    {
      id: 201142,
      name: "Kevin Durant",
      team: "Phoenix Suns",
      location: "West",
      position: "F",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png",
      stats: {
        ppg: 27.3,
        rpg: 7.1,
        apg: 4.3,
        gamesPlayed: 1000,
        minutesPerGame: 37.2,
        fg_pct: 49.9,
        fg3_pct: 38.6,
        ft_pct: 88.3,
        spg: 1.1,
        bpg: 1.1
      }
    },
    {
      id: 201935,
      name: "James Harden",
      team: "Los Angeles Clippers",
      location: "West",
      position: "G",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/201935.png",
      stats: {
        ppg: 24.7,
        rpg: 5.6,
        apg: 7.0,
        gamesPlayed: 1035,
        minutesPerGame: 34.9,
        fg_pct: 44.2,
        fg3_pct: 36.3,
        ft_pct: 86.0,
        spg: 1.5,
        bpg: 0.5
      }
    },
    {
      id: 101108,
      name: "Chris Paul",
      team: "Golden State Warriors",
      location: "West",
      position: "PG",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/101108.png",
      stats: {
        ppg: 17.6,
        rpg: 4.5,
        apg: 9.5,
        gamesPlayed: 1250,
        minutesPerGame: 34.3,
        fg_pct: 47.2,
        fg3_pct: 37.0,
        ft_pct: 87.0,
        spg: 2.1,
        bpg: 0.2
      }
    },
    {
      id: 201566,
      name: "Russell Westbrook",
      team: "Denver Nuggets",
      location: "West",
      position: "PG",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/201566.png",
      stats: {
        ppg: 21.7,
        rpg: 7.1,
        apg: 8.2,
        gamesPlayed: 1127,
        minutesPerGame: 34.7,
        fg_pct: 43.5,
        fg3_pct: 30.5,
        ft_pct: 78.5,
        spg: 1.7,
        bpg: 0.3
      }
    },
    {
      id: 2730,
      name: "Dwight Howard",
      team: "Free Agent",
      location: "N/A",
      position: "C",
      image: "https://cdn.nba.com/headshots/nba/latest/1040x760/2730.png",
      stats: {
        ppg: 15.7,
        rpg: 11.8,
        apg: 1.3,
        gamesPlayed: 1242,
        minutesPerGame: 33.1,
        fg_pct: 59.1,
        fg3_pct: 14.7,
        ft_pct: 56.7,
        spg: 0.9,
        bpg: 1.8
      }
    }
  ];

  // API URL - would typically come from environment variable
  const API_URL = 'http://localhost:8000/api/players';

  // Initial data load
  useEffect(() => {
    // Load sample data immediately for initial display
    setPlayers(samplePlayers);
    setFilteredPlayers(samplePlayers);
    setIsLoading(false);
  }, []);

  // Search for players locally (without API)
  const searchPlayers = (query) => {
    if (!query || query.length < 2) {
      // If search term is empty or too short, show all sample players
      setFilteredPlayers(samplePlayers);
      return;
    }
    
    setIsSearching(true);
    
    // Normalize the query for better matching
    const normalizedQuery = query.toLowerCase().trim();
    
    // Filter sample data locally
    const filtered = samplePlayers.filter(player => 
      player.name.toLowerCase().includes(normalizedQuery) ||
      player.team.toLowerCase().includes(normalizedQuery) ||
      player.position.toLowerCase().includes(normalizedQuery)
    );
    
    // Update state with filtered players
    setFilteredPlayers(filtered);
    setIsSearching(false);
  };

  // Debounce search to improve responsiveness
  useEffect(() => {
    // Clear previous timeout
    if (window.searchTimeout) {
      clearTimeout(window.searchTimeout);
    }
    
    // Set a new timeout for search
    window.searchTimeout = setTimeout(() => {
      // Use local search instead of API
      searchPlayers(searchTerm);
    }, 300); // Reduce delay to 300ms for better responsiveness
    
    // Cleanup function
    return () => {
      if (window.searchTimeout) {
        clearTimeout(window.searchTimeout);
      }
    };
  }, [searchTerm]);

  // Handle search and filters
  useEffect(() => {
    // Skip this effect during initial load or searching
    if (isLoading || isSearching) return;
    
    let result = searchTerm.trim().length >= 2 ? filteredPlayers : samplePlayers;
    
    // Apply filters
    if (filters.location !== 'all') {
      result = result.filter(player => player.location === filters.location);
    }
    
    if (filters.position !== 'all') {
      result = result.filter(player => player.position === filters.position);
    }
    
    if (filters.gamesPlayed !== 'all') {
      if (filters.gamesPlayed === 'below50') {
        result = result.filter(player => player.stats.gamesPlayed < 50);
      } else if (filters.gamesPlayed === '50to70') {
        result = result.filter(player => player.stats.gamesPlayed >= 50 && player.stats.gamesPlayed <= 70);
      } else if (filters.gamesPlayed === 'above70') {
        result = result.filter(player => player.stats.gamesPlayed > 70);
      }
    }
    
    setFilteredPlayers(result);
  }, [filters, isLoading, isSearching, searchTerm]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const openPlayerDetail = (player) => {
    setSelectedPlayer(player);
    setTradeCount(0);
    setTradeAdjustments({
      scoring: 0,
      rebounding: 0,
      assists: 0,
    });
    setTradedStats(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedPlayer(null);
  };

  const handleAdjustmentChange = (e) => {
    const { name, value } = e.target;
    setTradeAdjustments(prev => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  const simulateTrade = () => {
    // Calculate trade impact based on adjustments
    const overallImpact = tradeAdjustments.scoring * 0.5;
    
    // Calculate new stats
    const newStats = {
      ppg: Math.max(0, (selectedPlayer.stats.ppg + overallImpact).toFixed(1)),
      rpg: Math.max(0, (selectedPlayer.stats.rpg + overallImpact * 0.6).toFixed(1)),
      apg: Math.max(0, (selectedPlayer.stats.apg + overallImpact * 0.4).toFixed(1)),
      gamesPlayed: selectedPlayer.stats.gamesPlayed,
      minutesPerGame: selectedPlayer.stats.minutesPerGame
    };
    
    // Calculate percentage changes
    const changes = {
      ppg: ((newStats.ppg - selectedPlayer.stats.ppg) / selectedPlayer.stats.ppg * 100).toFixed(1),
      rpg: ((newStats.rpg - selectedPlayer.stats.rpg) / selectedPlayer.stats.rpg * 100).toFixed(1),
      apg: ((newStats.apg - selectedPlayer.stats.apg) / selectedPlayer.stats.apg * 100).toFixed(1),
      overall: (((parseFloat(newStats.ppg) + parseFloat(newStats.rpg) + parseFloat(newStats.apg)) - 
                (parseFloat(selectedPlayer.stats.ppg) + parseFloat(selectedPlayer.stats.rpg) + parseFloat(selectedPlayer.stats.apg))) / 
                (parseFloat(selectedPlayer.stats.ppg) + parseFloat(selectedPlayer.stats.rpg) + parseFloat(selectedPlayer.stats.apg)) * 100).toFixed(1)
    };
    
    setTradedStats(newStats);
    setPerformanceChanges(changes);
    setShowSupportButton(true);
  };

  const supportPlayer = () => {
    setIsPlayerSupported(true);
    // In a real app, you would make an API call to record the support
  };

  return (
    <section id="player" className="py-16 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-nba-navy mb-4">NBA PLAYERS</h2>
          <div className="w-16 h-1 bg-nba-red mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Search and filter NBA players to view their stats</p>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 gold-box-shadow">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="mb-4 md:mb-0 md:w-1/3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search players..."
                  className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-nba-gold focus:border-nba-gold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-nba-gold" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Filters */}
            <div className="md:w-1/3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Location Filter */}
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Conference</label>
                  <select
                    id="location"
                    name="location"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-nba-gold focus:border-nba-gold"
                    value={filters.location}
                    onChange={handleFilterChange}
                  >
                    <option value="all">All Conferences</option>
                    <option value="East">Eastern</option>
                    <option value="West">Western</option>
                  </select>
                </div>
                
                {/* Position Filter */}
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                  <select
                    id="position"
                    name="position"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-nba-gold focus:border-nba-gold"
                    value={filters.position}
                    onChange={handleFilterChange}
                  >
                    <option value="all">All Positions</option>
                    <option value="PG">Point Guard (PG)</option>
                    <option value="SG">Shooting Guard (SG)</option>
                    <option value="SF">Small Forward (SF)</option>
                    <option value="PF">Power Forward (PF)</option>
                    <option value="C">Center (C)</option>
                  </select>
                </div>
                
                {/* Games Played Filter */}
                <div>
                  <label htmlFor="gamesPlayed" className="block text-sm font-medium text-gray-700 mb-1">Games Played</label>
                  <select
                    id="gamesPlayed"
                    name="gamesPlayed"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-nba-gold focus:border-nba-gold"
                    value={filters.gamesPlayed}
                    onChange={handleFilterChange}
                  >
                    <option value="all">All</option>
                    <option value="below50">Less than 50</option>
                    <option value="50to70">50 to 70</option>
                    <option value="above70">More than 70</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Player Cards */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin w-12 h-12 border-4 border-nba-gold border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading players...</p>
          </div>
        ) : filteredPlayers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlayers.map(player => (
              <div 
                key={`player-${player.id}`} 
                className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 cursor-pointer gold-box-shadow"
                onClick={() => openPlayerDetail(player)}
              >
                <div className="bg-gradient-to-r from-nba-gold-dark to-nba-gold p-4 flex items-center">
                  <div className="h-20 w-20 rounded-full bg-white p-1 mr-4 flex-shrink-0">
                    <img 
                      src={player.image} 
                      alt={player.name} 
                      className="h-full w-full object-cover rounded-full"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://cdn.nba.com/logos/nba/fallback_1040x760.png';
                      }} 
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-bold text-white truncate">{player.name}</h3>
                    <p className="text-sm text-gray-200 truncate">{player.team} | {player.position}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">PPG</p>
                      <p className="text-lg font-bold text-nba-gold">{typeof player.stats.ppg === 'number' ? player.stats.ppg.toFixed(1) : player.stats.ppg}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">MPG</p>
                      <p className="text-lg font-bold text-nba-gold">{typeof player.stats.minutesPerGame === 'number' ? player.stats.minutesPerGame.toFixed(1) : player.stats.minutesPerGame}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">FGP</p>
                      <p className="text-lg font-bold text-nba-gold">{typeof player.stats.fg_pct === 'number' ? `${player.stats.fg_pct.toFixed(1)}%` : (player.stats.fg_pct || '0.0%')}</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <p>Games: <span className="font-semibold">{player.stats.gamesPlayed}</span></p>
                    <p>REB: <span className="font-semibold">{typeof player.stats.rpg === 'number' ? player.stats.rpg.toFixed(1) : player.stats.rpg}</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-nba-gold-light mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold text-nba-gold mb-1">No players found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
        
        {/* Player Detail Modal */}
        {showModal && selectedPlayer && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto gold-box-shadow">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-nba-gold-dark to-nba-gold p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-24 w-24 rounded-full bg-white p-1 mr-4">
                    <img src={selectedPlayer.image} alt={selectedPlayer.name} className="h-full w-full object-cover rounded-full" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedPlayer.name}</h2>
                    <p className="text-md text-gray-200">{selectedPlayer.team} | {selectedPlayer.position}</p>
                  </div>
                </div>
                <button 
                  onClick={closeModal}
                  className="text-white hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Modal Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 gap-6">
                  {/* Player Stats */}
                  <PlayerStats player={{
                    name: selectedPlayer.name,
                    stats: {
                      ppg: selectedPlayer.stats.ppg,
                      rpg: selectedPlayer.stats.rpg,
                      apg: selectedPlayer.stats.apg,
                      gamesPlayed: selectedPlayer.stats.gamesPlayed,
                      fg_pct: selectedPlayer?.stats?.fg_pct || 45,
                      fg3_pct: selectedPlayer?.stats?.fg3_pct || 35,
                      ft_pct: selectedPlayer?.stats?.ft_pct || 75,
                      spg: selectedPlayer?.stats?.spg || 1.2,
                      bpg: selectedPlayer?.stats?.bpg || 0.8
                    }
                  }} />

                  {/* Trade Simulation */}
                  <TradeAnalysis player={selectedPlayer} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default PlayerPage; 