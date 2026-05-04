import { 
  Users, 
  Dumbbell, 
  CalendarOff, 
  Clock, 
  Wallet, 
  Banknote, 
  Package, 
  FilePlus, 
  Receipt,
  TrendingUp,
  ChevronDown
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { getUpcomingExpirations, getPendingPayments, getDashboardSummary } from '../utils/api';

interface DashboardProps {
  onNavigate?: (view: any) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const [summary, setSummary] = useState<any>(null);
  const [expiringSoon, setExpiringSoon] = useState<any[]>([]);
  const [pendingPayments, setPendingPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sumRes, expRes, penRes] = await Promise.all([
          getDashboardSummary(),
          getUpcomingExpirations(),
          getPendingPayments()
        ]);
        if (sumRes.success) setSummary(sumRes.data);
        if (expRes.success) setExpiringSoon(expRes.data);
        if (penRes.success) setPendingPayments(penRes.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Card - Compact */}
      <div className="bg-gym-yellow rounded-xl p-4 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-black/60 uppercase tracking-[0.1em]">ACTIVE ATHLETES</span>
            <Users className="w-4 h-4 text-black/40" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <h2 className="text-4xl font-black text-black leading-none">{summary?.activeMembers || '0'}</h2>
            <div className="bg-black/10 px-2 py-0.5 rounded flex items-center gap-1">
              <span className="text-[10px] font-black text-black">/ {summary?.totalMembers || '0'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex -space-x-1.5">
              {[1, 2, 3].map((i) => (
                <img 
                  key={i}
                  src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 10}.jpg`} 
                  className="w-6 h-6 rounded-full border border-gym-yellow"
                  alt="Avatar"
                />
              ))}
            </div>
            <span className="text-[9px] font-bold text-black/60 uppercase tracking-widest">Active now</span>
          </div>
        </div>
        <Dumbbell className="absolute -right-2 -bottom-2 w-20 h-20 text-black/5 rotate-[15deg]" />
      </div>

      {/* Alert Cards Row */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gym-yellow/5 border border-gym-yellow/20 rounded-xl p-3 flex flex-col justify-between h-[85px]">
          <div className="flex justify-between items-start">
            <CalendarOff className="w-3.5 h-3.5 text-gym-yellow" />
            <span className="text-base font-black text-gym-yellow">{expiringSoon.length}</span>
          </div>
          <div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">EXPIRING</h3>
            <p className="text-[8px] font-bold text-gray-600 uppercase mt-1">7 Days</p>
          </div>
        </div>

        <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-3 flex flex-col justify-between h-[85px]">
          <div className="flex justify-between items-start">
            <Clock className="w-3.5 h-3.5 text-orange-500" />
            <span className="text-base font-black text-orange-500">{pendingPayments.length}</span>
          </div>
          <div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">DUE</h3>
            <p className="text-[8px] font-bold text-gray-600 uppercase mt-1">Pending</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { id: 'members', label: 'Members', icon: Users, color: 'bg-blue-500/10 text-blue-400' },
          { id: 'finance', label: 'Finance', icon: Banknote, color: 'bg-emerald-500/10 text-emerald-400' },
          { id: 'packages', label: 'Plans', icon: Package, color: 'bg-gym-yellow/10 text-gym-yellow' },
          { id: 'add-member', label: 'Add', icon: FilePlus, color: 'bg-red-500/10 text-red-400' },
        ].map((action) => (
          <button 
            key={action.id}
            onClick={() => onNavigate?.(action.id)}
            className="bg-[#121212] border border-white/5 rounded-xl p-3 flex flex-col items-center gap-2 active:scale-95 transition-transform"
          >
            <div className={`p-2 rounded-lg ${action.color}`}>
              <action.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Financial Terminal - High Impact */}
      <div className="bg-[#121212] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/5 bg-gradient-to-r from-[#121212] to-black">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em]">Financial Terminal</h3>
              <p className="text-[8px] font-bold text-gray-700 uppercase mt-0.5">Real-time Cash Flow</p>
            </div>
            <div className="flex gap-1">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-emerald-500 uppercase">Live</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-500">
                <TrendingUp className="w-3 h-3" />
                <span className="text-[10px] font-black uppercase tracking-widest">Revenue</span>
              </div>
              <h2 className="text-2xl font-black text-white tabular-nums">₹{summary?.monthlyIncome?.toLocaleString() || '0'}</h2>
            </div>
            <div className="space-y-1 text-right">
              <div className="flex items-center gap-2 text-orange-500 justify-end">
                <span className="text-[10px] font-black uppercase tracking-widest">Burn Rate</span>
                <TrendingUp className="w-3 h-3 rotate-90" />
              </div>
              <h2 className="text-2xl font-black text-white tabular-nums">₹{summary?.monthlyExpenses?.toLocaleString() || '0'}</h2>
            </div>
          </div>
        </div>

        {/* Unified Chart */}
        <div className="p-5 bg-black/40">
          <div className="h-28 flex items-end justify-between gap-2.5 px-1">
            {summary?.monthlyTrends?.map((trend: any, i: number) => {
              const maxVal = Math.max(...summary.monthlyTrends.map((t: any) => Math.max(t.income, t.expense))) || 1;
              const isCurrent = i === (summary.monthlyTrends?.length || 0) - 1;
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-3 group h-full">
                  <div className="relative flex-1 w-full flex items-end justify-center gap-1">
                    <div className="absolute inset-0 bg-white/[0.02] rounded-full" />
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(trend.income / maxVal) * 100}%` }}
                      className={`w-1.5 rounded-t-full transition-all duration-500 ${isCurrent ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-emerald-500/20'}`}
                    />
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${(trend.expense / maxVal) * 100}%` }}
                      className={`w-1.5 rounded-t-full transition-all duration-500 ${isCurrent ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-orange-500/20'}`}
                    />
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isCurrent ? 'text-white' : 'text-gray-700'}`}>
                    {trend.month.substring(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mini Trend Chart */}
      <div className="bg-[#171717] border border-white/5 rounded-xl p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Growth Analytics</h3>
          <TrendingUp className="w-3.5 h-3.5 text-gym-yellow" />
        </div>
        <div className="h-[80px] flex items-end justify-between gap-1 px-1">
          {summary?.monthlyTrends?.map((trend: any) => {
            const maxVal = Math.max(...summary.monthlyTrends.map((t: any) => Math.max(t.income, t.expense))) || 1;
            return (
              <div key={trend.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="relative h-full w-full flex items-end justify-center gap-0.5">
                  <div className="w-[3px] rounded-t-full bg-gym-yellow" style={{ height: `${(trend.income / maxVal) * 100}%` }} />
                  <div className="w-[3px] rounded-t-full bg-orange-500" style={{ height: `${(trend.expense / maxVal) * 100}%` }} />
                </div>
                <span className="text-[8px] font-bold text-gray-700 uppercase">{trend.month.substring(0, 3)}</span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
