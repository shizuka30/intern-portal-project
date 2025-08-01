import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiAward, FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import './Leaderboard.css';

// Define the shape of a single leaderboard entry from our API
interface LeaderboardEntry {
  rank: number;
  name: string;
  amount: number;
  status: string;
  medal?: 'gold' | 'silver' | 'bronze';
  isUser?: boolean;
}

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // <-- ADDED error state

  useEffect(() => {
    setLoading(true);
    // Simulate a network delay for a better loading experience
    setTimeout(() => {
      fetch(`${import.meta.env.VITE_API_URL}/api/data`)
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json();
        })
        .then((data) => {
          setLeaderboard(data.leaderboard);
          setLoading(false);
        })
        .catch((err) => { // <-- ADDED .catch() block for error handling
            setError(err.message);
            setLoading(false);
        });
    }, 1000); // 1-second loading simulation
  }, []);

  // --- THIS IS THE CRITICAL FIX ---
  // These checks run before attempting to render the main content
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p style={{ marginTop: '1rem', color: '#6c757d' }}>Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
        <div className="loading-container">
            <p style={{ color: '#c92a2a' }}>Error: Could not load leaderboard data. Please ensure the backend server is running.</p>
            <Link to="/dashboard" className="back-link" style={{ marginTop: '1rem' }}>
                <FiArrowLeft /> Back to Dashboard
            </Link>
        </div>
    );
  }

  if (!leaderboard || leaderboard.length === 0) {
    return <div className="loading-container"><p>No leaderboard data available.</p></div>
  }

  const podium = leaderboard.slice(0, 3);
  
  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'Moving up') return <FiTrendingUp className="status-up" />;
    if (status === 'Moving down') return <FiTrendingDown className="status-down" />;
    return <FiMinus className="status-no-change" />;
  };
  
  const MedalIcon = ({ medal }: { medal?: string }) => {
    if (medal === 'gold') return <FiAward className="medal-gold" />;
    if (medal === 'silver') return <FiAward className="medal-silver" />;
    if (medal === 'bronze') return <FiAward className="medal-bronze" />;
    return null;
  };

  return (
    <div className="leaderboard-container">
      <header className="leaderboard-header">
        <Link to="/dashboard" className="back-link">
          <FiArrowLeft /> Back to Dashboard
        </Link>
        <div className="leaderboard-title">
          <h1>Leaderboard</h1>
          <p>Top performing interns</p>
        </div>
      </header>

      <section className="podium-section">
        {podium.map((intern) => (
          <div key={intern.rank} className={`podium-card rank-${intern.rank}`}>
            <FiAward className="podium-icon" />
            <h2>{intern.name}</h2>
            <p className="podium-amount">${intern.amount.toLocaleString()}</p>
            <span className="podium-rank">Rank #{intern.rank}</span>
          </div>
        ))}
      </section>

      <section className="full-rankings">
        <h2>Full Rankings</h2>
        <ul>
          {leaderboard.map((intern) => (
            <li key={intern.rank} className={`rank-item ${intern.isUser ? 'user-highlight' : ''}`}>
              <div className="rank-position">
                <MedalIcon medal={intern.medal} /> 
                <span>#{intern.rank}</span>
              </div>
              <div className="rank-name">
                {intern.name} {intern.isUser && <span className="user-tag">You</span>}
              </div>
              <div className="rank-status">
                <StatusIcon status={intern.status} /> {intern.status}
              </div>
              <div className="rank-amount">
                <span>${intern.amount.toLocaleString()}</span>
                <small>Total raised</small>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Leaderboard;