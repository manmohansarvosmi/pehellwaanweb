import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  CalendarCheck, 
  Briefcase, 
  Wallet, 
  LogOut,
  Target,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  onLogout: () => void;
}

export default function Sidebar({ activeTab, onTabChange, onLogout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Members Directory', icon: Users },
    { id: 'add-member', label: 'Add Member', icon: UserPlus },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'staff', label: 'Staff Hub', icon: Briefcase },
    { id: 'add-staff', label: 'Add Staff', icon: UserPlus },
    { id: 'finance', label: 'Finance Hub', icon: Wallet },
    { id: 'payroll', label: 'Payroll', icon: FileText },
    { id: 'training', label: 'Training Hub', icon: Target },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-72 bg-[#0A0A0A] border-r border-white/5 flex flex-col p-6 z-20">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-10 h-10 bg-[#FBC02D] rounded-xl flex items-center justify-center rotate-12 shadow-[0_0_20px_rgba(251,192,45,0.2)]">
          <Target className="w-6 h-6 text-black" />
        </div>
        <div>
          <h1 className="text-xl font-oswald font-bold tracking-widest text-[#FBC02D] uppercase leading-tight">PEHELLWAAN</h1>
          <p className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">Gym Management</p>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative ${
                isActive 
                  ? 'bg-[#FBC02D]/10 text-[#FBC02D]' 
                  : 'text-gray-500 hover:bg-white/5 hover:text-white'
              }`}
            >
              {isActive && (
                <motion.div 
                  layoutId="sidebar-active"
                  className="absolute left-0 w-1 h-6 bg-[#FBC02D] rounded-full"
                />
              )}
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className={`text-sm font-bold tracking-wide uppercase ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 mb-6">
          <img 
            src="https://randomuser.me/api/portraits/men/32.jpg" 
            alt="Profile" 
            className="w-10 h-10 rounded-full border-2 border-[#FBC02D]/20"
          />
          <div>
            <p className="text-sm font-bold text-white uppercase tracking-tight">Admin Terminal</p>
            <p className="text-[10px] font-bold text-gray-500 tracking-wider">SUPER USER</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold tracking-wide uppercase">Sign Out</span>
        </button>
      </div>
    </div>
  );
}
