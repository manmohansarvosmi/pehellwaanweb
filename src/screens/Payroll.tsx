import { useState } from 'react';
import { 
  ArrowRight, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter,
  DollarSign,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';

export default function Payroll() {
  const [selectedStaff, setSelectedStaff] = useState<number[]>([1, 2]);

  const staffPayroll = [
    { id: 1, name: 'Vikram Singh', role: 'Head Trainer', salary: '₹45,000', bonus: '₹5,000', net: '₹50,000', status: 'READY', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { id: 2, name: 'Arjun Kapur', role: 'Gym Manager', salary: '₹39,000', bonus: '₹3,500', net: '₹42,500', status: 'READY', avatar: 'https://randomuser.me/api/portraits/men/44.jpg' },
    { id: 3, name: 'Rahul Mehta', role: 'Physiotherapist', salary: '₹60,000', bonus: '₹0', net: '₹60,000', status: 'PENDING', avatar: 'https://randomuser.me/api/portraits/men/66.jpg' },
  ];

  const toggleStaff = (id: number) => {
    setSelectedStaff(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const totalPayout = staffPayroll
    .filter(s => selectedStaff.includes(s.id))
    .reduce((acc, curr) => acc + parseInt(curr.net.replace('₹', '').replace(',', '')), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-oswald font-bold tracking-wider uppercase text-white">Monthly Payroll</h1>
          <p className="text-gray-500 font-medium font-sans">Manage staff disbursements and bonuses.</p>
        </div>
        <button className="bg-[#FBC02D] text-black px-6 py-3 rounded-2xl flex items-center gap-2 font-black uppercase tracking-wider text-sm hover:scale-105 transition-transform shadow-lg shadow-[#FBC02D]/10">
          <Zap className="w-5 h-5" />
          Process All
        </button>
      </div>

      {/* Summary Card */}
      <div className="bg-[#171717] border border-white/5 rounded-[40px] p-10 relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
            <div className="p-6 bg-[#FBC02D]/10 rounded-[32px] border border-[#FBC02D]/20">
               <Wallet className="w-10 h-10 text-[#FBC02D]" />
            </div>
            <div>
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-1">Total Disbursed</p>
               <h2 className="text-5xl font-oswald font-black text-white">₹4,85,200</h2>
               <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">Cycle: Nov 2024 • 24 Staff Members</p>
            </div>
          </div>
          <div className="h-20 w-[1px] bg-white/5 hidden md:block" />
          <div className="text-center md:text-right">
             <p className="text-xs font-bold text-green-400 uppercase tracking-widest mb-1">Payment Status</p>
             <p className="text-white font-bold text-lg">92% COMPLETED</p>
             <div className="w-48 h-2 bg-white/5 rounded-full mt-3 overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} className="h-full bg-green-400" />
             </div>
          </div>
        </div>
      </div>

      {/* Staff List */}
      <div className="bg-[#171717] border border-white/5 rounded-[40px] p-8">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-white font-oswald text-xl font-bold uppercase tracking-widest">Payable Directory</h3>
          <div className="flex gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" placeholder="Search staff..." className="bg-black/50 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-[#FBC02D]/50" />
             </div>
          </div>
        </div>

        <div className="space-y-6">
          {staffPayroll.map((staff, i) => (
            <motion.div
              key={staff.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white/[0.02] border rounded-[32px] overflow-hidden transition-all ${
                selectedStaff.includes(staff.id) ? 'border-[#FBC02D]/30' : 'border-white/5'
              }`}
            >
              <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <button 
                    onClick={() => toggleStaff(staff.id)}
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      selectedStaff.includes(staff.id) ? 'bg-[#FBC02D] border-[#FBC02D]' : 'bg-transparent border-white/10 hover:border-white/20'
                    }`}
                  >
                    {selectedStaff.includes(staff.id) && <CheckCircle2 className="w-4 h-4 text-black" />}
                  </button>
                  <img src={staff.avatar} alt="" className="w-14 h-14 rounded-2xl border border-white/5" />
                  <div>
                    <h4 className="text-white font-bold tracking-tight text-lg">{staff.name}</h4>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">{staff.role}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 flex-[2] w-full md:w-auto">
                   <div>
                      <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Base Salary</p>
                      <p className="text-white font-bold">{staff.salary}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Bonus</p>
                      <p className="text-white font-bold">{staff.bonus}</p>
                   </div>
                   <div>
                      <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Status</p>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${staff.status === 'READY' ? 'text-green-400' : 'text-gray-500'}`}>
                        {staff.status}
                      </p>
                   </div>
                   <div className="text-right">
                      <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mb-1">Net Payable</p>
                      <p className="text-lg font-oswald font-bold text-[#FBC02D]">{staff.net}</p>
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Action Bar */}
      <div className="fixed bottom-8 left-[calc(288px+2rem)] right-8 z-30">
         <motion.div 
           initial={{ y: 100 }}
           animate={{ y: 0 }}
           className="max-w-4xl mx-auto bg-[#1a1a1a]/80 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-2xl flex justify-between items-center"
         >
           <div>
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-1">Selected Payout ({selectedStaff.length})</p>
             <h3 className="text-2xl font-oswald font-black text-white">₹{totalPayout.toLocaleString()}</h3>
           </div>
           <button className="bg-[#FBC02D] text-black px-10 py-4 rounded-2xl flex items-center gap-3 font-black uppercase tracking-wider text-sm hover:scale-105 active:scale-95 transition-transform shadow-xl shadow-[#FBC02D]/20">
             Confirm and Pay
             <ArrowRight className="w-5 h-5" />
           </button>
         </motion.div>
      </div>
    </div>
  );
}
