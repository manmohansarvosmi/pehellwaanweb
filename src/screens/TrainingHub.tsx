import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  History, 
  Plus, 
  Activity, 
  Heart, 
  Dumbbell, 
  Scale, 
  Ruler, 
  TrendingUp,
  ChevronRight,
  TrendingDown
} from 'lucide-react';
import { motion } from 'motion/react';
import { getMemberById } from '../utils/api';

export default function TrainingHub() {
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMember = async () => {
    setLoading(true);
    // Simulation: Fetching a default member for demo
    const result = await getMemberById(1);
    if (result.success) {
      setMember(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMember();
  }, []);

  const bmiHistory = [
    { month: 'Jan', value: 24.2, trend: 'up' },
    { month: 'Feb', value: 24.5, trend: 'up' },
    { month: 'Mar', value: 24.8, trend: 'up' },
    { month: 'Apr', value: 25.1, trend: 'up' },
    { month: 'May', value: 24.9, trend: 'down' },
    { month: 'Jun', value: 25.3, trend: 'up' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-oswald font-bold tracking-wider uppercase text-white">Bio Metrics</h1>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Performance Intelligence</p>
        </div>
        <button className="bg-white/5 border border-white/5 p-2 rounded-xl hover:bg-white/10 transition-colors">
          <History className="w-5 h-5 text-[#FBC02D]" />
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="w-12 h-12 border-4 border-[#FBC02D]/20 border-t-[#FBC02D] rounded-full animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Analyzing Bio-metrics...</p>
        </div>
      ) : (
        <>
          {/* Athlete Header - Compact */}
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 flex flex-col items-center gap-6 group">
            <div className="relative">
              <img 
                src={member?.photoUrl || 'https://randomuser.me/api/portraits/men/1.jpg'} 
                alt="" 
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white/5 group-hover:border-[#FBC02D]/50 transition-all"
              />
              <div className="absolute -bottom-1 -right-1 bg-[#FBC02D] p-1.5 rounded-lg text-black shadow-lg">
                 <Activity className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="flex-1 text-center">
              <h2 className="text-xl font-bold text-white tracking-tight">{member?.fullName || 'Athlete Name'}</h2>
              <div className="flex items-center justify-center gap-3 mt-1.5">
                 <p className="text-[9px] font-black text-[#FBC02D] uppercase tracking-wider bg-[#FBC02D]/10 px-2.5 py-1 rounded-full border border-[#FBC02D]/20">Active Plan</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-3 w-full">
              <div className="bg-white/[0.03] border border-white/5 rounded-xl py-3 flex flex-col items-center">
                 <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mb-0.5">Weight</p>
                 <p className="text-lg font-oswald font-bold text-white">{member?.weight || '82'}<span className="text-[9px] text-gray-600 ml-0.5">kg</span></p>
              </div>
              <div className="bg-white/[0.03] border border-white/5 rounded-xl py-3 flex flex-col items-center">
                 <p className="text-[8px] font-bold text-gray-600 uppercase tracking-widest mb-0.5">Height</p>
                 <p className="text-lg font-oswald font-bold text-white">{member?.height || '178'}<span className="text-[9px] text-gray-600 ml-0.5">cm</span></p>
              </div>
              <div className="bg-[#1a1a1a] border border-[#FBC02D]/20 rounded-xl py-3 flex flex-col items-center">
                 <p className="text-[8px] font-bold text-[#FBC02D] uppercase tracking-widest mb-0.5">BMI</p>
                 <p className="text-lg font-oswald font-bold text-[#FBC02D]">{member?.bmi || '25.3'}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* BMI Trend Chart Simulation */}
            <div className="bg-[#171717] border border-white/5 rounded-[40px] p-10 h-full">
               <div className="flex justify-between items-center mb-10">
                 <h3 className="text-white font-oswald text-xl font-bold uppercase tracking-widest flex items-center gap-2">
                   <TrendingUp className="w-5 h-5 text-[#FBC02D]" />
                   Bio-Metric Trends
                 </h3>
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Last 6 Months</span>
               </div>
               
               <div className="flex items-end justify-between gap-4 h-64 px-4">
                 {bmiHistory.map((h, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center gap-6 group">
                     <div className="w-full relative flex items-end justify-center">
                        <div className="w-2 h-full absolute left-1/2 -translate-x-1/2 bg-white/[0.02] rounded-full" />
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${(h.value / 30) * 100}%` }}
                          transition={{ delay: i * 0.1, duration: 1 }}
                          className={`w-3 rounded-full relative z-10 ${h.trend === 'up' ? 'bg-[#FBC02D]' : 'bg-gray-700'}`}
                        />
                        <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                           <span className="text-[10px] font-black text-white bg-black px-2 py-1 rounded-md border border-white/10">{h.value}</span>
                        </div>
                     </div>
                     <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{h.month}</span>
                   </div>
                 ))}
               </div>
            </div>

            {/* Monthly Logs Feed */}
            <div className="bg-[#171717] border border-white/5 rounded-[40px] p-10">
               <div className="flex justify-between items-center mb-8">
                 <h3 className="text-white font-oswald text-xl font-bold uppercase tracking-widest">Bio Logs</h3>
                 <button className="flex items-center gap-2 bg-[#FBC02D] text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-transform">
                   <Plus className="w-4 h-4" />
                   New Entry
                 </button>
               </div>

               <div className="space-y-4">
                 {[
                   { date: '15 June 2024', type: 'Standard Check', weight: '82.0 kg', bmi: '25.3', status: 'up' },
                   { date: '12 May 2024', type: 'Bio Assessment', weight: '83.2 kg', bmi: '25.8', status: 'down' },
                   { date: '10 April 2024', type: 'Recovery Cycle', weight: '84.5 kg', bmi: '26.1', status: 'up' },
                 ].map((log, i) => (
                   <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:bg-white/[0.05] transition-all cursor-pointer">
                      <div className="flex items-center gap-5">
                         <div className="p-3 bg-white/[0.03] rounded-2xl group-hover:bg-[#FBC02D]/10 transition-colors">
                            <Activity className="w-5 h-5 text-gray-500 group-hover:text-[#FBC02D]" />
                         </div>
                         <div>
                            <p className="text-white font-bold tracking-tight">{log.date}</p>
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-1">{log.type}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-8">
                         <div className="text-right">
                            <p className="text-white font-bold">{log.weight}</p>
                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Weight</p>
                         </div>
                         <div className="text-right">
                            <p className={`font-bold ${log.status === 'up' ? 'text-[#FBC02D]' : 'text-gray-500'}`}>{log.bmi}</p>
                            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">BMI</p>
                         </div>
                         <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-white/30" />
                      </div>
                   </div>
                 ))}
               </div>
               
               <button className="w-full py-4 mt-8 bg-white/[0.02] border border-white/5 rounded-2xl text-[10px] font-black text-gray-600 uppercase tracking-[0.2em] hover:text-white hover:bg-white/[0.05] transition-all">
                  Deep Analysis Report
               </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
