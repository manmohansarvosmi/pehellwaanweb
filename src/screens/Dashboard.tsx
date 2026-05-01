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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Hero Card - Compact */}
      <div className="bg-gym-yellow rounded-[20px] p-4 relative overflow-hidden shadow-lg">
        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-black text-black/60 uppercase tracking-[0.15em]">ACTIVE MEMBERS</span>
            <Users className="w-5 h-5 text-black/40" />
          </div>
          <div className="flex items-baseline gap-2 mt-1.5">
            <h2 className="text-5xl font-black text-black leading-none">{summary?.activeMembers || '0'}</h2>
            <div className="bg-black/10 px-2 py-1 rounded-md flex items-center gap-1">
              <Users className="w-3 h-3 text-black" />
              <span className="text-[10px] font-black text-black">/ {summary?.totalMembers || '0'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 mt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <img 
                  key={i}
                  src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${i + 10}.jpg`} 
                  className="w-7 h-7 rounded-full border-2 border-gym-yellow"
                  alt="Avatar"
                />
              ))}
              <div className="w-7 h-7 rounded-full bg-black border-2 border-gym-yellow flex items-center justify-center">
                <span className="text-[8px] font-bold text-white">+{summary?.totalMembers > 3 ? summary.totalMembers - 3 : 0}</span>
              </div>
            </div>
            <span className="text-[9px] font-bold text-black/60 uppercase tracking-wider">Active right now</span>
          </div>
        </div>
        <Dumbbell className="absolute -right-3 -bottom-3 w-24 h-24 text-black/5 rotate-[15deg]" />
      </div>

      {/* Alert Cards Row */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-gym-yellow/5 border border-gym-yellow/20 rounded-[18px] p-3.5 flex flex-col justify-between h-[100px]">
          <div className="flex justify-between items-start">
            <div className="p-1.5 bg-gym-yellow/10 rounded-lg">
              <CalendarOff className="w-4 h-4 text-gym-yellow" />
            </div>
            <span className="text-lg font-black text-gym-yellow">{expiringSoon.length}</span>
          </div>
          <div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">EXPIRING PLANS</h3>
            <p className="text-[8px] font-bold text-gray-500 uppercase mt-1">Next 7 Days</p>
          </div>
        </div>

        <div className="bg-red-500/5 border border-red-500/20 rounded-[18px] p-3.5 flex flex-col justify-between h-[100px]">
          <div className="flex justify-between items-start">
            <div className="p-1.5 bg-red-500/10 rounded-lg">
              <Clock className="w-4 h-4 text-red-500" />
            </div>
            <span className="text-lg font-black text-red-500">{pendingPayments.length}</span>
          </div>
          <div>
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest leading-none">DUE PAYMENTS</h3>
            <p className="text-[8px] font-bold text-gray-500 uppercase mt-1">Next 5 Days</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="space-y-3">
        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.15em] opacity-50">QUICK ACTIONS</h3>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { id: 'payroll', label: 'Payroll', icon: Wallet, color: 'bg-gym-yellow/15 text-gym-yellow' },
            { id: 'finance', label: 'Finance', icon: Banknote, color: 'bg-emerald-500/15 text-emerald-500' },
            { id: 'packages', label: 'Packages', icon: Package, color: 'bg-blue-500/15 text-blue-500' },
            { id: 'add-expense', label: 'Add Expense', icon: FilePlus, color: 'bg-red-500/15 text-red-500' },
          ].map((action) => (
            <button 
              key={action.id}
              onClick={() => onNavigate?.(action.id)}
              className="bg-[#121212] border border-white/5 rounded-2xl p-5 flex flex-col items-center gap-3 active:scale-95 transition-transform"
            >
              <div className={`p-3 rounded-full ${action.color}`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-[14px] font-bold text-gray-200">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Financial Stats Row */}
      <div className="space-y-4">
      {/* Financial Stats Row */}
      <div className="space-y-3">
        {/* Total Income Card */}
        <div className="bg-[#171717] border border-white/5 rounded-[20px] p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                <Wallet className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="text-[13px] font-bold text-white">Total Income</span>
            </div>
            <div className="bg-white/5 px-2 py-0.5 rounded-md flex items-center gap-1">
              <span className="text-[9px] font-bold text-gray-400">Monthly</span>
              <ChevronDown className="w-2.5 h-2.5 text-gray-400" />
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h4 className="text-xl font-black text-emerald-500">₹{summary?.monthlyIncome?.toLocaleString('en-IN') || '0'}</h4>
              <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">THIS MONTH'S INCOME</p>
            </div>
            <div className="flex items-end gap-1 h-10">
              {summary?.monthlyTrends?.map((t: any, i: number) => (
                <div 
                  key={i} 
                  className={`w-1.5 rounded-t-[1px] transition-all duration-500 ${i === 5 ? 'bg-emerald-500' : 'bg-emerald-500/20'}`}
                  style={{ height: `${(t.income / (summary.monthlyIncome || 1)) * 100}%`, minHeight: '3px' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="bg-[#171717] border border-white/5 rounded-[20px] p-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-red-500/10 rounded-lg">
                <Receipt className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-[13px] font-bold text-white">Total Expenses</span>
            </div>
            <div className="bg-white/5 px-2 py-0.5 rounded-md flex items-center gap-1">
              <span className="text-[9px] font-bold text-gray-400">Monthly</span>
              <ChevronDown className="w-2.5 h-2.5 text-gray-400" />
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <h4 className="text-xl font-black text-red-500">₹{summary?.monthlyExpenses?.toLocaleString('en-IN') || '0'}</h4>
              <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">THIS MONTH'S EXPENSES</p>
            </div>
            <div className="flex items-end gap-1 h-10">
              {summary?.monthlyTrends?.map((t: any, i: number) => (
                <div 
                  key={i} 
                  className={`w-1.5 rounded-t-[1px] transition-all duration-500 ${i === 5 ? 'bg-red-500' : 'bg-red-500/20'}`}
                  style={{ height: `${(t.expense / (summary.monthlyExpenses || 1)) * 100}%`, minHeight: '3px' }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Financial Trends Lollipop Chart */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-[11px] font-black text-white uppercase tracking-[0.2em] opacity-60">FINANCIAL TRENDS</h3>
          <button className="text-[10px] font-black text-gym-yellow uppercase tracking-widest">FULL REPORT</button>
        </div>
        <div className="bg-[#171717] border border-white/5 rounded-[24px] p-6">
          <div className="h-[160px] flex items-end justify-between px-2">
            {summary?.monthlyTrends?.map((trend: any) => {
              const maxVal = Math.max(...summary.monthlyTrends.map((t: any) => Math.max(t.income, t.expense))) || 1;
              return (
                <div key={trend.month} className="flex flex-col items-center gap-3 flex-1">
                  <div className="relative h-full w-full flex items-end justify-center gap-2">
                    {/* Income Lollipop */}
                    <div className="relative group w-[3px] rounded-t-full bg-gym-yellow/30" style={{ height: `${(trend.income / maxVal) * 100}%` }}>
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gym-yellow border-2 border-[#171717]" />
                    </div>
                    {/* Expense Lollipop */}
                    <div className="relative group w-[3px] rounded-t-full bg-red-500/30" style={{ height: `${(trend.expense / maxVal) * 100}%` }}>
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-red-500 border-2 border-[#171717]" />
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-gray-500 uppercase">{trend.month}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-center gap-6 mt-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-gym-yellow" />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">INCOME</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-red-500" />
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">EXPENSE</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
