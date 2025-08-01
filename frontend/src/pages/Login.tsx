import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const [view, setView] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Inside Login.tsx

  // Inside Login.tsx

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // --- NEW LOGIC IS HERE ---
    let referralCode = '';
    // If signing up and a name was entered, generate the code
    if (view === 'signup' && fullName) {
      // Convert name to lowercase, remove spaces, and append '2025'
      referralCode = `${fullName.toLowerCase().replace(/\s+/g, '')}2025`;
    }
    // For the login view, referralCode will be an empty string,
    // so the dashboard will fetch the default 'demouser2025'

    setTimeout(() => {
      setIsLoading(false);
      // Pass both the name and the generated referral code to the dashboard
      navigate('/dashboard', { 
        state: { 
          fullName: fullName || 'Demo User', // Fallback for login
          referralCode: referralCode // Pass the generated code
        } 
      });
    }, 1500);
  };

  return (
    <div className="login-container">
      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : (
        <div className="login-box">
          <h1 className="title">Intern Portal</h1>
          <p className="subtitle">Access your internship dashboard</p>

          <div className="tab-group">
            <button
              className={`tab ${view === 'login' ? 'active' : ''}`}
              onClick={() => setView('login')}
            >
              Login
            </button>
            <button
              className={`tab ${view === 'signup' ? 'active' : ''}`}
              onClick={() => setView('signup')}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {view === 'signup' && (
              <div className="input-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            )}

            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="intern@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="input-group password-wrapper">
              <label htmlFor="password">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            <button
              type="submit"
              className={`login-button ${view === 'signup' ? 'signup-btn' : ''}`}
            >
              {view === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Login;