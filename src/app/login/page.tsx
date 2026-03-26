'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Register form state
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  
  // Generate random hex for username preview
  const [userSuffix] = useState(() => 
    Math.random().toString(16).substring(2, 6).toUpperCase()
  );

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(registerPassword);
  const strengthColor = passwordStrength === 0 ? 'bg-red-500' : 
                        passwordStrength === 1 ? 'bg-yellow-500' : 
                        passwordStrength === 2 ? 'bg-yellow-500' : 'bg-green-500';

  const handleLogin = async () => {
    setLoginLoading(true);
    setLoginError('');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('obsidian_token', data.token);
        localStorage.setItem('obsidian_user', JSON.stringify(data.user));
        router.push('/chat');
      } else {
        setLoginError(data.error || 'Login failed');
      }
    } catch (error) {
      setLoginError('Network error. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async () => {
    if (registerPassword !== confirmPassword) {
      setRegisterError('Passwords do not match');
      return;
    }
    
    setRegisterLoading(true);
    setRegisterError('');
    setRegisterSuccess('');
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: registerEmail,
          password: registerPassword,
          username: registerUsername,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setRegisterSuccess('Account created. Please login.');
        setActiveTab('login');
        // Clear register form
        setRegisterUsername('');
        setRegisterEmail('');
        setRegisterPassword('');
        setConfirmPassword('');
      } else {
        setRegisterError(data.error || 'Registration failed');
      }
    } catch (error) {
      setRegisterError('Network error. Please try again.');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row">
      {/* LEFT SIDE */}
      <div className="w-full lg:w-[55%] relative flex flex-col justify-center items-center p-12 lg:p-20">
        {/* Green radial glow orb */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-gradient-radial from-[#00ff41]/20 to-transparent blur-[120px]"></div>
        </div>
        
        {/* Top-left branding */}
        <div className="absolute top-8 left-8 lg:top-12 lg:left-12">
          <span className="text-white font-bold text-xl">Obsidian Flux</span>
        </div>
        
        {/* Center content */}
        <div className="relative z-10 text-center max-w-lg">
          <h1 className="font-black text-5xl lg:text-6xl text-white leading-tight mb-2">
            Your Financial
          </h1>
          <h2 className="font-black text-5xl lg:text-6xl text-white leading-tight mb-2">
            Intelligence
          </h2>
          <h3 className="font-black text-5xl lg:text-6xl text-[#00ff41] leading-tight mb-6">
            Awaits.
          </h3>
          <p className="text-gray-400 text-sm mt-4">
            Secure access to your personalized ET ecosystem.
          </p>
          
          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            <span className="border border-[#00ff41]/20 text-[#00ff41]/60 text-xs px-3 py-1 rounded-full">
              ✦ Persistent History
            </span>
            <span className="border border-[#00ff41]/20 text-[#00ff41]/60 text-xs px-3 py-1 rounded-full">
              ✦ Personal Dashboard
            </span>
            <span className="border border-[#00ff41]/20 text-[#00ff41]/60 text-xs px-3 py-1 rounded-full">
              ✦ ET Insights
            </span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-[45%] bg-[#0a0a0a] flex items-center justify-center p-12 relative">
        {/* Back link */}
        <a 
          href="/" 
          className="absolute top-6 right-6 text-gray-600 text-xs hover:text-[#00ff41] transition-colors"
        >
          ← Back
        </a>
        
        <div className="w-full max-w-md">
          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab('login')}
              className={`pb-1 text-xs font-mono uppercase tracking-widest transition-colors ${
                activeTab === 'login' 
                  ? 'text-[#00ff41] border-b-2 border-[#00ff41]' 
                  : 'text-gray-500 cursor-pointer hover:text-gray-300'
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`pb-1 text-xs font-mono uppercase tracking-widest transition-colors ${
                activeTab === 'register' 
                  ? 'text-[#00ff41] border-b-2 border-[#00ff41]' 
                  : 'text-gray-500 cursor-pointer hover:text-gray-300'
              }`}
            >
              REGISTER
            </button>
          </div>

          {/* Success banner */}
          {registerSuccess && (
            <div className="bg-[#00ff41]/10 border border-[#00ff41]/30 text-[#00ff41] text-xs p-3 rounded font-mono mb-4">
              {registerSuccess}
            </div>
          )}

          {/* LOGIN FORM */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 font-mono block">EMAIL</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="bg-black border border-[#00ff41]/20 focus:border-[#00ff41]/60 text-white rounded px-4 py-3 w-full outline-none font-mono text-sm transition-colors duration-200"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-500 mb-1 font-mono block">PASSWORD</label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="bg-black border border-[#00ff41]/20 focus:border-[#00ff41]/60 text-white rounded px-4 py-3 w-full outline-none font-mono text-sm transition-colors duration-200 pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {loginError && (
                <div className="text-red-400 text-xs font-mono mt-2">{loginError}</div>
              )}
              
              <button
                onClick={handleLogin}
                disabled={loginLoading}
                className="bg-[#00ff41] text-black font-bold w-full py-3 rounded hover:bg-[#00ff41]/90 transition-colors font-mono text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginLoading ? 'AUTHENTICATING...' : 'LOGIN →'}
              </button>
              
              <div className="text-center">
                <button
                  onClick={() => setActiveTab('register')}
                  className="text-gray-600 text-xs hover:text-[#00ff41] transition-colors"
                >
                  Don't have an account? Register →
                </button>
              </div>
            </div>
          )}

          {/* REGISTER FORM */}
          {activeTab === 'register' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 font-mono block">USERNAME</label>
                <input
                  type="text"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  className="bg-black border border-[#00ff41]/20 focus:border-[#00ff41]/60 text-white rounded px-4 py-3 w-full outline-none font-mono text-sm transition-colors duration-200"
                  placeholder="username"
                />
                {registerUsername && (
                  <div className="text-[#00ff41]/50 text-xs font-mono mt-1">
                    Your ID: OX-{registerUsername.toUpperCase()}-{userSuffix}
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-xs text-gray-500 mb-1 font-mono block">EMAIL</label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                  className="bg-black border border-[#00ff41]/20 focus:border-[#00ff41]/60 text-white rounded px-4 py-3 w-full outline-none font-mono text-sm transition-colors duration-200"
                  placeholder="your@email.com"
                />
              </div>
              
              <div>
                <label className="text-xs text-gray-500 mb-1 font-mono block">PASSWORD</label>
                <div className="relative">
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="bg-black border border-[#00ff41]/20 focus:border-[#00ff41]/60 text-white rounded px-4 py-3 w-full outline-none font-mono text-sm transition-colors duration-200 pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {registerPassword && (
                  <div className="mt-1">
                    <div className="flex gap-1">
                      <div className={`h-1 flex-1 rounded ${passwordStrength >= 1 ? strengthColor : 'bg-gray-700'}`}></div>
                      <div className={`h-1 flex-1 rounded ${passwordStrength >= 2 ? strengthColor : 'bg-gray-700'}`}></div>
                      <div className={`h-1 flex-1 rounded ${passwordStrength >= 3 ? strengthColor : 'bg-gray-700'}`}></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {passwordStrength === 0 && 'Weak'}
                      {passwordStrength === 1 && 'Weak'}
                      {passwordStrength === 2 && 'Medium'}
                      {passwordStrength === 3 && 'Strong'}
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label className="text-xs text-gray-500 mb-1 font-mono block">CONFIRM PASSWORD</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-black border border-[#00ff41]/20 focus:border-[#00ff41]/60 text-white rounded px-4 py-3 w-full outline-none font-mono text-sm transition-colors duration-200 pr-12"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              {registerError && (
                <div className="text-red-400 text-xs font-mono mt-2">{registerError}</div>
              )}
              
              <button
                onClick={handleRegister}
                disabled={registerLoading}
                className="bg-[#00ff41] text-black font-bold w-full py-3 rounded hover:bg-[#00ff41]/90 transition-colors font-mono text-sm tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registerLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT →'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
