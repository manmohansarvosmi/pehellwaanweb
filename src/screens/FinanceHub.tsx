import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  Receipt, 
  Plus, 
  Download,
  Share2,
  Calendar,
  CreditCard,
  Building,
  Users,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { getFinanceTransactions, getFinanceSummary } from '../utils/api';

export default function FinanceHub() {
  const [activeTab, setActiveTab] = useState<'income' | 'expenses'>('income');
  const [summary, setSummary] = useState<any>(null);
  const [transactionsList, setTransactionsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [summaryRes, transRes] = await Promise.all([
        getFinanceSummary(),
        getFinanceTransactions(activeTab)
      ]);
      
      if (summaryRes.success) setSummary(summaryRes.data);
      if (transRes.success) setTransactionsList(transRes.data);
      setLoading(false);
    };
    fetchData();
  }, [activeTab]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-oswald font-bold tracking-wider uppercase text-white">Finance Terminal</h1>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Monetary Audit</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-[#171717] border border-white/5 rounded-2xl hover:bg-white/10 transition-colors text-white">
            <Download className="w-5 h-5" />
          </button>
          <button className="bg-[#FBC02D] text-black px-6 py-3 rounded-2xl flex items-center gap-2 font-black uppercase tracking-wider text-sm hover:scale-105 transition-transform">
            <Plus className="w-5 h-5" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Financial Overview Card - Compact */}
      <div className="bg-[#171717] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.3em]">Net Balance</p>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-[10px] font-bold">
                 <ArrowUpRight className="w-3 h-3" />
                 18.2% vs last month
              </div>
            </div>
            <h2 className="text-4xl font-oswald font-black text-white mb-6">₹{summary?.netBalance?.toLocaleString() || '0'}</h2>
            <div className="flex gap-12">
               <div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Total Income</p>
                  <p className="text-2xl font-oswald font-bold text-green-400">₹{summary?.totalIncome?.toLocaleString() || '0'}</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Total Expenses</p>
                  <p className="text-2xl font-oswald font-bold text-red-500">₹{summary?.totalExpenses?.toLocaleString() || '0'}</p>
               </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="96" cy="96" r="80" 
                  className="stroke-white/5 fill-none" 
                  strokeWidth="16"
                />
                <circle 
                  cx="96" cy="96" r="80" 
                  className="stroke-[#FBC02D] fill-none" 
                  strokeWidth="16" 
                  strokeDasharray="502"
                  strokeDashoffset="125"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-oswald font-black text-white">75%</p>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Efficiency</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Feed - Compact */}
      <div className="bg-[#171717] border border-white/5 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-8">
           <div className="flex gap-8 border-b border-white/5">
              {(['income', 'expenses'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                    activeTab === tab ? 'text-[#FBC02D]' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {tab === 'income' ? 'Revenue Stream' : 'Expenditure Log'}
                  {activeTab === tab && (
                    <motion.div layoutId="trans-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-[#FBC02D] rounded-full" />
                  )}
                </button>
              ))}
           </div>
           
           <button className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-widest">
             <Calendar className="w-4 h-4" />
             Nov 2024
           </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 text-gym-yellow animate-spin" />
              <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Fetching Ledger...</p>
            </div>
          ) : transactionsList.length > 0 ? (
            transactionsList.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-3xl hover:bg-white/[0.05] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-5">
                   <div className={`p-4 rounded-2xl bg-white/[0.03] group-hover:scale-110 transition-transform ${item.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                      {item.type === 'income' ? <TrendingUp className="w-6 h-6" /> : <ArrowDownRight className="w-6 h-6" />}
                   </div>
                   <div>
                      <h4 className="text-white font-bold tracking-tight text-lg">{item.title || item.name}</h4>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{item.category} • {item.date}</p>
                   </div>
                </div>
                
                <div className="text-right">
                   <p className={`text-xl font-oswald font-bold ${item.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                     {item.type === 'income' ? '+' : '-'}₹{item.amount?.toLocaleString()}
                   </p>
                   <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{item.member_name || item.type}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center">
              <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">No transactions found for this period</p>
            </div>
          )}
        </div>
        
        <button className="w-full py-4 mt-8 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white hover:bg-white/[0.05] transition-all">
          View Detailed Ledger
        </button>
      </div>
    </div>
  );
}
