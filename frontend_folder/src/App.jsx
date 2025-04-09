import { useState } from 'react'
import './App.css'
import PlayerPage from './components/PlayerPage'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  // Tools and technologies
  const tools = [
    { name: 'Python', description: 'For data analysis and modeling' },
    { name: 'React', description: 'For frontend development' },
    { name: 'FastAPI', description: 'For backend services' },
    { name: 'Chart.js', description: 'For data visualization' },
    { name: 'Tailwind CSS', description: 'For responsive UI design' },
  ]

  const handleNavClick = (section) => {
    setActiveSection(section)
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-nba-white font-sans">
      {/* Header/Navigation Bar - NBA Style */}
      <nav className="bg-nba-navy text-nba-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img src="/team_logo.png" alt="Team 14 Logo" className="h-12" />
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <button 
                    onClick={() => handleNavClick('home')} 
                    className={`px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'home' ? 'bg-nba-red bg-opacity-75' : 'hover:bg-nba-red hover:bg-opacity-75'}`}
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => handleNavClick('player')} 
                    className={`px-3 py-2 text-sm font-medium rounded-md ${activeSection === 'player' ? 'bg-nba-red bg-opacity-75' : 'hover:bg-nba-red hover:bg-opacity-75'}`}
                  >
                    Player
                  </button>
                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-nba-white hover:text-white hover:bg-nba-red focus:outline-none"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button 
                onClick={() => handleNavClick('home')}
                className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md ${activeSection === 'home' ? 'bg-nba-red bg-opacity-75' : 'hover:bg-nba-red hover:bg-opacity-75'}`}
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('player')}
                className={`block w-full text-left px-3 py-2 text-base font-medium rounded-md ${activeSection === 'player' ? 'bg-nba-red bg-opacity-75' : 'hover:bg-nba-red hover:bg-opacity-75'}`}
              >
                Player
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area - Conditionally render sections based on activeSection */}
      {activeSection === 'home' && (
        <>
          {/* Hero Section */}
          <section id="home" className="relative text-white py-28 md:py-36 overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img 
                src="/two_n.png" 
                alt="NBA Background" 
                className="w-full h-full object-cover object-center opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-nba-navy/90 to-nba-black/80"></div>
            </div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-lg">Team 14</h1>
                <p className="text-xl md:text-2xl mb-8 text-white drop-shadow-md">J.P. Morgan Data for Good Hackathon 2025</p>
                <div className="animate-bounce-slow">  
                  <svg className="mx-auto h-12 w-12 drop-shadow-md" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* Challenge Overview */}
          <section id="challenge" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-nba-navy mb-4">CHALLENGE OVERVIEW</h2>
                <div className="w-16 h-1 bg-nba-red mx-auto"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-nba-navy mb-3">The Problem</h3>
                  <p className="text-gray-700">
                    Predicting NBA rookie performance is a complex challenge that involves analyzing various factors including college statistics, physical attributes, and team dynamics. Our team aims to develop a predictive model that can accurately forecast rookie success in the NBA.
                  </p>
                </div>
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-nba-navy mb-3">Our Approach</h3>
                  <p className="text-gray-700">
                  To tackle the challenge of predicting NBA rookie performance, our team developed a data-driven model that analyzes pre-draft statistics, player attributes, and NBA performance data. We focused on how rookie performance evolves over time, particularly in response to trades and changes in team context. By identifying trends in player development post-trade, we incorporated dynamic variables into our predictive framework. We also created visualizations to illustrate these patterns and enhance interpretability, providing a more comprehensive and context-aware approach to evaluating rookie success.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Data & Tools */}
          <section id="data-tools" className="py-16 bg-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-nba-navy mb-4">DATA & TOOLS</h2>
                <div className="w-16 h-1 bg-nba-red mx-auto"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-nba-navy mb-3">Data Sources</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    <li>Historical NBA rookie performance metrics</li>
                    <li>College basketball statistics</li>
                    <li>NBA Combine physical measurements</li>
                    <li>Draft position and team information</li>
                    <li>Advanced player tracking data</li>
                  </ul>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-nba-navy mb-3">Technologies Used</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {tools.map((tool, index) => (
                      <div key={index} className="p-3 border border-gray-200 rounded-md hover:border-nba-red transition-colors">
                        <h4 className="font-bold text-nba-navy">{tool.name}</h4>
                        <p className="text-sm text-gray-600">{tool.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Player Page */}
      {activeSection === 'player' && <PlayerPage />}

      {/* Footer */}
      <footer className="bg-nba-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0 flex flex-col items-center md:items-start">
              <img src="/team_logo.png" alt="Team 14 Logo" className="h-10 mb-2" />
              <p className="text-sm text-gray-400">J.P. Morgan Data for Good Hackathon 2025</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 text-center">
            <p className="text-sm text-gray-400">&copy; 2025 Team 14. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
