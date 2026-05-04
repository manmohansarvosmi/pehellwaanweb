import { useState, useEffect, FormEvent } from 'react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Settings, 
  Shield,
  Loader2,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { login } from './utils/api';
import logo from './assets/logo.jpeg';

// Components
import BottomNavBar from './components/BottomNavBar';

// Screens
import Dashboard from './screens/Dashboard';
import Members from './screens/Members';
import AddMember from './screens/AddMember';
import MemberView from './screens/MemberView';
import Attendance from './screens/Attendance';
import StaffHub from './screens/StaffHub';
import AddStaff from './screens/AddStaff';
import FinanceHub from './screens/FinanceHub';
import Payroll from './screens/Payroll';
import TrainingHub from './screens/TrainingHub';
import Packages from './screens/Packages';

type View = 'dashboard' | 'members' | 'add-member' | 'member-view' | 'attendance' | 'staff' | 'add-staff' | 'finance' | 'payroll' | 'training' | 'packages';

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setError('');
    setIsLoading(true);
    const result = await login(username, password);
    setIsLoading(false);

    if (result.success) {
      setIsLoggedIn(true);
    } else {
      setError(result.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setCurrentView('dashboard');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onNavigate={(view: View) => {
        if (view !== 'add-member' && view !== 'member-view') setSelectedMember(null);
        setCurrentView(view);
      }} />;
      case 'members': return <Members 
        onAddMember={() => {
          setSelectedMember(null);
          setCurrentView('add-member');
        }} 
        onEditMember={(member) => {
          setSelectedMember(member);
          setCurrentView('add-member');
        }}
        onViewMember={(id) => {
          setSelectedMember({ id });
          setCurrentView('member-view');
        }}
      />;
      case 'add-member': return <AddMember 
        onBack={() => {
          setSelectedMember(null);
          setCurrentView('members');
        }} 
        editData={selectedMember}
      />;
      case 'member-view': return <MemberView 
        memberId={selectedMember?.id}
        onBack={() => {
          setSelectedMember(null);
          setCurrentView('members');
        }}
      />;
      case 'attendance': return <Attendance />;
      case 'staff': return <StaffHub onBack={() => setCurrentView('dashboard')} />;
      case 'add-staff': return <AddStaff onBack={() => setCurrentView('dashboard')} />;
      case 'finance': return <FinanceHub />;
      case 'payroll': return <Payroll />;
      case 'training': return <TrainingHub />;
      case 'packages': return <Packages onBack={() => setCurrentView('dashboard')} />;
      default: return <Dashboard />;
    }
  };

  if (isLoggedIn) {
    return (
      <div className="bg-black min-h-screen selection:bg-gym-yellow selection:text-black font-sans">
        <div className="mobile-frame">
          {/* Top Navigation - Compact Mobile Version - ONLY on Dashboard */}
          {currentView === 'dashboard' && (
            <header className="sticky top-0 z-50 bg-bg-black/95 backdrop-blur-md border-b border-white/5 px-4 py-2.5 flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-gym-yellow rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src={logo} 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-oswald font-bold text-sm tracking-widest text-white leading-tight">PEHELLWAAN</span>
                  <span className="text-[9px] font-bold text-gray-600 tracking-wider uppercase">MANAGEMENT</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {deferredPrompt && (
                  <button 
                    onClick={handleInstallClick}
                    className="bg-gym-yellow text-black text-[9px] font-black px-2.5 py-1.5 rounded-lg shadow-lg mr-2"
                  >
                    INSTALL
                  </button>
                )}
                <div className="relative p-1">
                  <Bell className="w-5 h-5 text-gray-400" />
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <Shield className="w-5 h-5" />
                </button>
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-white/10"
                />
              </div>
            </header>
          )}

          {/* Main Content Area - Full Bottom Fit */}
          <main className="flex-1 overflow-y-auto pb-20">
            <div className="p-3">
              {renderView()}
            </div>
          </main>

          <BottomNavBar 
            activeTab={currentView} 
            onTabChange={setCurrentView} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-6 bg-black font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[380px]"
      >
        {/* Logo Section */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-40 h-40 mx-auto mb-2 flex items-center justify-center"
          >
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </motion.div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-500 text-[11px] py-2.5 px-4 rounded-xl text-center uppercase tracking-widest font-bold mb-2"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-600 tracking-widest uppercase ml-1">
              USERNAME
            </label>
            <div className="relative group bg-[#121212] rounded-xl border border-white/5 focus-within:border-[#FBC02D]/30 transition-all">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-4 w-4 text-gray-700 group-focus-within:text-[#FBC02D]" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-transparent text-white py-4 pl-11 pr-4 text-[14px] focus:outline-none placeholder:text-gray-800"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-black text-gray-600 tracking-widest uppercase">
                PASSWORD
              </label>
            </div>
            <div className="relative group bg-[#121212] rounded-xl border border-white/5 focus-within:border-[#FBC02D]/30 transition-all">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-gray-700 group-focus-within:text-[#FBC02D]" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-white py-4 pl-11 pr-12 text-[14px] focus:outline-none placeholder:text-gray-800"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-700"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            disabled={isLoading}
            type="submit"
            className="w-full h-14 bg-[#FBC02D] text-black font-black tracking-widest uppercase rounded-xl shadow-lg shadow-[#FBC02D]/10 active:scale-95 transition-all flex items-center justify-center gap-2 mt-6"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "LOG IN"
            )}
          </button>

          <div className="flex items-center gap-6 py-6 opacity-40">
            <div className="h-[1px] flex-1 bg-white/10" />
            <span className="text-[11px] font-black text-gray-500 tracking-[0.3em] uppercase">OR</span>
            <div className="h-[1px] flex-1 bg-white/10" />
          </div>
        </form>
      </motion.div>

      {/* Footer info icons */}
      <div className="fixed bottom-10 flex gap-10 text-gray-700 pointer-events-none">
        <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] font-black uppercase">
          <Shield className="h-4 w-4" />
          Secure Access
        </div>
        <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] font-black uppercase">
          <Settings className="h-4 w-4" />
          Terminal v2.0
        </div>
      </div>
    </div>
  );
}

