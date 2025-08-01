import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiUsers, FiDollarSign, FiTrendingUp, FiTarget, FiCopy, FiLogOut, FiAward, FiStar, FiCheckCircle } from 'react-icons/fi';
import './Dashboard.css';

// --- Define the shape of our new API data ---
interface ApiData {
  user: { name: string; referralCode: string; };
  stats: {
    totalDonations: number;
    donationChange: string;
    referrals: number;
    referralChange: string;
    monthlyGoal: { current: number; target: number; };
    growthRate: { percentage: number; period: string; };
  };
  recentActivity: { type: string; person?: string; amount?: number; goal?: string; time: string; }[];
  rewards: {
    nextReward: { title: string; current: number; target: number; };
    unlocked: { id: number; title: string; goal: number; }[];
    locked: { id: number; title: string; goal: number; }[];
  };
}

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // --- THIS IS THE KEY LOGIC FOR THE NAME AND REFERRAL CODE ---
  const userName = location.state?.fullName || 'Demo User';
  const userReferralCode = location.state?.referralCode || data?.user.referralCode || '';

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/data`)
      .then((res) => res.json())
      .then((apiData) => {
        setData(apiData);
        setLoading(false);
      });
  }, []);

  const handleCopy = () => {
    if (userReferralCode) {
      navigator.clipboard.writeText(userReferralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading || !data) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  const { stats, recentActivity, rewards } = data;
  const goalProgress = (stats.monthlyGoal.current / stats.monthlyGoal.target) * 100;
  const nextRewardProgress = (rewards.nextReward.current / rewards.nextReward.target) * 100;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-title">
          <h1>Intern Portal</h1>
          <p>Welcome back, {userName}!</p>
        </div>
        <nav className="header-nav">
          <Link to="/leaderboard" className="nav-link">
            <FiAward /> Leaderboard
          </Link>
          <button onClick={() => navigate('/')} className="nav-link logout">
            <FiLogOut /> Logout
          </button>
        </nav>
      </header>

      <main className="dashboard-grid">
        <div className="stat-card color-green">
          <FiDollarSign className="stat-icon" />
          <h2>Total Donations</h2>
          <p className="stat-value">${stats.totalDonations.toLocaleString()}</p>
          <p className="stat-change">{stats.donationChange}</p>
        </div>
        <div className="stat-card color-purple">
          <FiUsers className="stat-icon" />
          <h2>Referrals</h2>
          <p className="stat-value">{stats.referrals}</p>
          <p className="stat-change">{stats.referralChange}</p>
        </div>
        <div className="stat-card color-yellow">
          <FiTarget className="stat-icon" />
          <h2>Monthly Goal</h2>
          <p className="stat-value">{goalProgress.toFixed(0)}%</p>
          <p className="stat-change">${stats.monthlyGoal.current.toLocaleString()} / ${stats.monthlyGoal.target.toLocaleString()}</p>
        </div>
        <div className="stat-card color-blue">
          <FiTrendingUp className="stat-icon" />
          <h2>Growth Rate</h2>
          <p className="stat-value">+{stats.growthRate.percentage}%</p>
          <p className="stat-change">{stats.growthRate.period}</p>
        </div>
        
        <div className="card referral-card">
          <h2><FiStar className="card-title-icon" /> Your Referral Code</h2>
          <p>Share this code to track your referrals and earn rewards.</p>
          <div className="referral-box">
            <span>{userReferralCode}</span>
            <button onClick={handleCopy} className="copy-btn">
              <FiCopy /> {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        
        <div className="card recent-card">
          <h2>Recent Activity</h2>
          <ul>
            {recentActivity.map((activity, index) => (
              <li key={index} className="activity-item">
                <div className="activity-info">
                  <strong>{activity.type}</strong>
                  <span className="activity-time">{activity.time}</span>
                </div>
                <div className="activity-details">
                    {activity.person || activity.goal}
                    {activity.amount && <span className="activity-amount">${activity.amount}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card rewards-card">
          <h2><FiAward className="card-title-icon" /> Rewards & Achievements</h2>
          <div className="next-reward-progress">
            <div className="progress-text">
                <strong>Next Reward</strong>
                <span>${rewards.nextReward.current.toLocaleString()} / ${rewards.nextReward.target.toLocaleString()}</span>
            </div>
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${nextRewardProgress}%` }}></div>
            </div>
            <p>Top Performer - Reach ${rewards.nextReward.target.toLocaleString()} in donations</p>
          </div>
          <ul>
            {rewards.unlocked.map((reward) => (
              <li key={reward.id} className="reward-item unlocked">
                <div className="reward-icon"><FiCheckCircle /></div>
                <div className="reward-details">
                  <strong>{reward.title}</strong>
                  <span>Unlock your first milestone</span>
                </div>
                <span className="reward-goal">${reward.goal}</span>
              </li>
            ))}
             {rewards.locked.map((reward) => (
              <li key={reward.id} className="reward-item locked">
                <div className="reward-icon">🔒</div>
                <div className="reward-details">
                  <strong>{reward.title}</strong>
                  <span>Reach ${reward.goal.toLocaleString()} in donations</span>
                </div>
                <span className="reward-goal">${reward.goal.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;