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
import { motion, AnimatePresence } from 'motion/react';
import { getFinanceTransactions, getFinanceSummary, addExpense } from '../utils/api';

export default function FinanceHub() {
  const [activeTab, setActiveTab] = useState<'income' | 'expenses'>('income');
  const [summary, setSummary] = useState<any>(null);
  const [transactionsList, setTransactionsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'General', paymentMode: 'CASH', date: new Date().toISOString().split('T')[0] });
  const [actionInProgress, setActionInProgress] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [summaryRes, transRes] = await Promise.all([
      getFinanceSummary(),
      getFinanceTransactions()
    ]);
    
    if (summaryRes.success) setSummary(summaryRes.data);
    if (transRes.success) {
      const data = transRes.data;
      const list = Array.isArray(data) ? data : (data?.content || data?.transactions || data?.data || []);
      setTransactionsList(list);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddExpense = async () => {
    if (!newExpense.title || !newExpense.amount) return;
    setActionInProgress(true);
    const result = await addExpense({
      ...newExpense,
      amount: parseFloat(newExpense.amount)
    });
    if (result.success) {
      setShowAddModal(false);
      setNewExpense({ title: '', amount: '', category: 'General', paymentMode: 'CASH', date: new Date().toISOString().split('T')[0] });
      fetchData();
    } else {
      alert(result.message || 'Failed to add expense');
    }
    setActionInProgress(false);
  };

  const filteredTransactions = transactionsList.filter(t => {
    const typeStr = (t.type || t.transactionType || '').toUpperCase();
    return activeTab === 'income' ? typeStr === 'INCOME' : typeStr === 'EXPENSE';
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-lg font-oswald font-bold tracking-wider uppercase text-white">Finance Terminal</h1>
          <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Monetary Audit</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2.5 bg-[#171717] border border-white/5 rounded-xl hover:bg-white/10 transition-colors text-white">
            <Download className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#FBC02D] text-black px-4 py-2.5 rounded-xl flex items-center gap-2 font-black uppercase tracking-wider text-[11px] hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Financial Overview Card - More Compact */}
      <div className="bg-[#171717] border border-white/5 rounded-xl p-5 relative overflow-hidden group">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Net Balance</p>
              <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/10 text-green-400 rounded-full text-[9px] font-bold">
                 <ArrowUpRight className="w-2.5 h-2.5" />
                 18.2%
              </div>
            </div>
            <h2 className="text-3xl font-oswald font-black text-white mb-4">₹{summary?.netBalance?.toLocaleString() || '0'}</h2>
            <div className="flex gap-8">
               <div>
                  <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Income</p>
                  <p className="text-xl font-oswald font-bold text-green-400">₹{summary?.totalIncome?.toLocaleString() || '0'}</p>
               </div>
               <div>
                  <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Expenses</p>
                  <p className="text-xl font-oswald font-bold text-red-500">₹{summary?.totalExpenses?.toLocaleString() || '0'}</p>
               </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="64" cy="64" r="56" 
                  className="stroke-white/5 fill-none" 
                  strokeWidth="10"
                />
                <circle 
                  cx="64" cy="64" r="56" 
                  className="stroke-[#FBC02D] fill-none" 
                  strokeWidth="10" 
                  strokeDasharray="351.8"
                  strokeDashoffset="88"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-xl font-oswald font-black text-white">75%</p>
                <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Efficiency</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Feed - More Compact */}
      <div className="bg-[#171717] border border-white/5 rounded-xl p-5">
        <div className="flex justify-between items-center mb-6">
           <div className="flex gap-6 border-b border-white/5">
              {(['income', 'expenses'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative ${
                    activeTab === tab ? 'text-[#FBC02D]' : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {tab === 'income' ? 'Income' : 'Expenses'}
                  {activeTab === tab && (
                    <motion.div layoutId="trans-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FBC02D] rounded-full" />
                  )}
                </button>
              ))}
           </div>
           
           <button className="flex items-center gap-2 text-gray-600 hover:text-white transition-colors text-[9px] font-bold uppercase tracking-widest">
             <Calendar className="w-3.5 h-3.5" />
             {new Date().toLocaleString('default', { month: 'short', year: 'numeric' })}
           </button>
        </div>
        
        <div className="space-y-2">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-6 h-6 text-[#FBC02D] animate-spin" />
              <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Fetching Ledger...</p>
            </div>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="group flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.05] transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                   <div className={`p-2.5 rounded-lg bg-white/[0.03] group-hover:scale-105 transition-transform ${(item.type || item.transactionType || '').toUpperCase() === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                      {(item.type || item.transactionType || '').toUpperCase() === 'INCOME' ? <TrendingUp className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                   </div>
                   <div>
                      <h4 className="text-white font-bold tracking-tight text-[13px]">{item.title}</h4>
                      <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{item.category} • {new Date(item.date).toLocaleDateString()}</p>
                   </div>
                </div>
                
                <div className="text-right">
                   <p className={`text-[15px] font-oswald font-bold ${(item.type || item.transactionType || '').toUpperCase() === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                     {(item.type || item.transactionType || '').toUpperCase() === 'INCOME' ? '+' : '-'}₹{item.amount?.toLocaleString()}
                   </p>
                   <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">{item.paymentMode}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-16 text-center">
              <p className="text-gray-600 font-bold uppercase tracking-widest text-[10px]">No {activeTab} logged</p>
            </div>
          )}
        </div>
        
        <button className="w-full py-3 mt-6 bg-white/[0.02] border border-white/5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-gray-600 hover:text-white hover:bg-white/[0.05] transition-all">
          View Detailed Ledger
        </button>
      </div>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-[#121212] border border-white/5 rounded-[32px] p-6 overflow-hidden"
            >
              <div className="mb-6">
                <h3 className="text-lg font-oswald font-bold text-white uppercase tracking-wider">New Expenditure</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Log a new gym expense</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="space-y-1.5">
                   <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">Title / Description</label>
                   <input 
                      type="text" 
                      placeholder="e.g. Electricity Bill"
                      value={newExpense.title}
                      onChange={(e) => setNewExpense({...newExpense, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-4 text-sm focus:outline-none focus:border-[#FBC02D]/50"
                   />
                </div>
                <div className="space-y-1.5">
                   <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">Amount (₹)</label>
                   <input 
                      type="number" 
                      placeholder="0.00"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-4 text-sm focus:outline-none focus:border-[#FBC02D]/50"
                   />
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">Category</label>
                      <select 
                        value={newExpense.category}
                        onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-4 text-sm focus:outline-none appearance-none"
                      >
                         <option value="General">General</option>
                         <option value="Rent">Rent</option>
                         <option value="Bills">Bills</option>
                         <option value="Staff">Staff</option>
                         <option value="Equipment">Equipment</option>
                      </select>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1">Mode</label>
                      <select 
                        value={newExpense.paymentMode}
                        onChange={(e) => setNewExpense({...newExpense, paymentMode: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-4 px-4 text-sm focus:outline-none appearance-none"
                      >
                         <option value="CASH">CASH</option>
                         <option value="UPI">UPI</option>
                         <option value="CARD">CARD</option>
                      </select>
                   </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-4 bg-white/5 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddExpense}
                  disabled={actionInProgress || !newExpense.title || !newExpense.amount}
                  className="flex-[2] py-4 bg-[#FBC02D] text-black rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                >
                  {actionInProgress ? 'Saving...' : 'Add Expense'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
