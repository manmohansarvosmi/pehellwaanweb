import { 
  LayoutDashboard, 
  Users, 
  Plus, 
  CalendarCheck, 
  Briefcase 
} from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavBarProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
}

export default function BottomNavBar({ activeTab, onTabChange }: BottomNavBarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'add-member', label: '', icon: Plus, isCenter: true },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'staff', label: 'Staff', icon: Briefcase },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A0A] border-t border-white/5 pointer-events-auto">
      <div className="max-w-md mx-auto flex items-center justify-between px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isCenter) {
            return (
              <div key={tab.id} className="relative -mt-6 flex flex-col items-center">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onTabChange(tab.id)}
                  className="w-12 h-12 bg-gym-yellow rounded-full flex items-center justify-center text-black shadow-lg border-[3px] border-[#0A0A0A]"
                >
                  <Plus className="w-6 h-6" strokeWidth={3} />
                </motion.button>
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 transition-all relative ${
                isActive ? 'text-gym-yellow' : 'text-gray-500 hover:text-white'
              }`}
            >
              <Icon className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-[11px] font-black uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="active-tab-indicator"
                  className="absolute bottom-0 w-10 h-0.5 bg-gym-yellow rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
