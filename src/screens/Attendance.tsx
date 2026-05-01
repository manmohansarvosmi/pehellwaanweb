import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  UserCheck, 
  UserX, 
  Clock,
  Filter,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { motion } from 'motion/react';
import { getAttendance, markAttendance } from '../utils/api';

export default function Attendance() {
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());
  const [search, setSearch] = useState('');
  const [attendeesList, setAttendeesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  
  const fetchAttendance = async () => {
    setLoading(true);
    const res = await getAttendance();
    if (res.success) setAttendeesList(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleAttendanceAction = async (memberId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'IN' ? 'OUT' : 'IN';
    const res = await markAttendance(memberId, nextStatus);
    if (res.success) {
      fetchAttendance(); // Refresh list
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-oswald font-bold tracking-wider uppercase text-white">Roll Call</h1>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Athlete Check-ins</p>
        </div>
        <div className="flex items-center gap-4 bg-[#171717] px-6 py-3 rounded-2xl border border-white/5">
          <Clock className="w-5 h-5 text-[#FBC02D]" />
          <span className="text-white font-bold tracking-tight">{today.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      {/* Stats Mini Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#171717] border border-white/5 rounded-2xl p-4 relative overflow-hidden">
          <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Present</p>
          <h3 className="text-xl font-oswald font-black text-[#FBC02D]">42</h3>
          <div className="absolute top-0 right-0 w-12 h-full bg-green-500/5 blur-xl" />
        </div>
        <div className="bg-[#171717] border border-white/5 rounded-2xl p-4">
          <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Absent</p>
          <h3 className="text-xl font-oswald font-black text-gray-400">86</h3>
        </div>
        <div className="bg-[#171717] border border-white/5 rounded-2xl p-4">
          <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Avg Time</p>
          <h3 className="text-xl font-oswald font-black text-white">52m</h3>
        </div>
        <div className="bg-[#171717] border border-white/5 rounded-2xl p-4">
          <p className="text-[8px] font-bold text-gray-500 uppercase tracking-widest mb-0.5">Check-ins</p>
          <h3 className="text-xl font-oswald font-black text-white">12</h3>
        </div>
      </div>

      {/* Calendar Strip - Compact */}
      <div className="bg-[#171717] border border-white/5 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button className="p-1.5 hover:bg-white/5 rounded-full transition-colors text-gray-400">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-white font-oswald text-base font-bold uppercase tracking-wider">
              {today.toLocaleDateString('default', { month: 'short', year: 'numeric' })}
            </h2>
            <button className="p-1.5 hover:bg-white/5 rounded-full transition-colors text-gray-400">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button className="text-[8px] font-black text-[#FBC02D] uppercase tracking-widest hover:underline">History</button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDate(d)}
              className={`min-w-[70px] h-24 flex flex-col items-center justify-center rounded-3xl transition-all border ${
                selectedDate === d 
                  ? 'bg-[#FBC02D] border-[#FBC02D] text-black shadow-lg shadow-[#FBC02D]/20 -translate-y-1' 
                  : 'bg-white/[0.02] border-white/5 text-gray-500 hover:border-white/20'
              }`}
            >
              <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${selectedDate === d ? 'text-black/60' : 'text-gray-600'}`}>
                {new Date(today.getFullYear(), today.getMonth(), d).toLocaleDateString('default', { weekday: 'short' })}
              </span>
              <span className="text-2xl font-oswald font-bold">{d}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Attendees List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-[#171717] border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-oswald text-base font-bold uppercase tracking-wider">Roll Call</h3>
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-black/50 border border-white/5 rounded-lg py-1.5 pl-8 pr-3 text-[10px] focus:outline-none focus:border-[#FBC02D]/50 w-32"
              />
            </div>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 text-gym-yellow animate-spin" />
                <p className="text-xs font-bold text-gray-600 uppercase tracking-widest">Loading Roll Call...</p>
              </div>
            ) : attendeesList.length > 0 ? (
              attendeesList.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/[0.02] border border-white/5 rounded-3xl p-5 flex items-center justify-between group hover:bg-white/[0.05] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img 
                        src={a.photo ? `data:image/jpeg;base64,${a.photo}` : `https://ui-avatars.com/api/?name=${a.fullName}&background=1e293b&color=FBC02D&bold=true`} 
                        alt="" 
                        className="w-14 h-14 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all border border-white/5" 
                      />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-[#171717] ${a.status === 'IN' ? 'bg-[#FBC02D]' : 'bg-gray-700'}`} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold tracking-tight">{a.fullName || a.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                         <p className={`text-[10px] font-black uppercase tracking-widest ${a.status === 'IN' ? 'text-[#FBC02D]' : 'text-gray-600'}`}>
                           {a.status === 'IN' ? `CHECKED IN • ${a.checkInTime || a.time}` : 'PENDING CHECK-IN'}
                         </p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleAttendanceAction(a.id, a.status)}
                    className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    a.status === 'IN' 
                      ? 'border border-[#FBC02D]/20 text-[#FBC02D] hover:bg-[#FBC02D]/10' 
                      : 'bg-[#FBC02D] text-black shadow-lg shadow-[#FBC02D]/10 hover:scale-105 active:scale-95'
                  }`}>
                    {a.status === 'IN' ? 'Punch Out' : 'Punch In'}
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center">
                <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">No athletes found for today</p>
              </div>
            )}
          </div>
        </div>

        {/* Attendance Activity / History Mini */}
        <div className="bg-[#171717] border border-white/5 rounded-[40px] p-8">
           <h3 className="text-white font-oswald text-xl font-bold uppercase tracking-widest mb-8">Peak Hours</h3>
           <div className="h-64 flex items-end gap-3 px-4">
             {[30, 45, 80, 100, 70, 40, 20].map((h, i) => (
               <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                 <div className="w-full bg-white/[0.03] rounded-t-xl relative overflow-hidden flex items-end" style={{ height: `${h}%` }}>
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: '100%' }}
                      transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                      className="w-full bg-[#FBC02D]/20 border-t-2 border-[#FBC02D] transition-all group-hover:bg-[#FBC02D]/40"
                    />
                 </div>
                 <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">{6 + i} AM</span>
               </div>
             ))}
           </div>
           
           <div className="mt-12 p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Morning Session</p>
                <p className="text-white font-bold">High Density Expected</p>
              </div>
              <ArrowRight className="w-5 h-5 text-[#FBC02D]" />
           </div>
        </div>
      </div>
    </div>
  );
}
