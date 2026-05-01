import { useState, useEffect } from 'react';
import { 
  UserPlus, 
  Search, 
  ChevronRight, 
  Phone, 
  Users, 
  UserCheck, 
  UserX,
  ArrowLeft,
  X
} from 'lucide-react';
import { motion } from 'motion/react';
import { getAllStaff } from '../utils/api';

interface StaffHubProps {
  onBack: () => void;
}

export default function StaffHub({ onBack }: StaffHubProps) {
  const [search, setSearch] = useState('');
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStaff = async () => {
    setLoading(true);
    const result = await getAllStaff();
    if (result.success) {
      setStaffList(result.data || []);
    } else {
      setError(result.message || 'Failed to fetch staff');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const filteredStaff = staffList.filter(
    s =>
      (s.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.role || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121210] text-[#FFF] font-sans pb-20">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-[#121210]/95 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-wider uppercase">Staff Hub</h1>
              <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Pehellwaan Gym</p>
            </div>
          </div>
          <button className="bg-[#FBC02D] text-black px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-transform hover:scale-105 active:scale-95">
            <UserPlus className="w-4 h-4" />
            ADD STAFF
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-500 group-focus-within:text-[#FBC02D] transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search staff by name or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-3 pl-12 pr-12 text-sm focus:outline-none focus:border-[#FBC02D]/50 focus:ring-1 focus:ring-[#FBC02D]/50 transition-all placeholder:text-gray-600"
          />
          {search.length > 0 && (
            <button 
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <X className="w-4 h-4 text-gray-500 hover:text-white" />
            </button>
          )}
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-8">
        {/* Stats Container */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/[0.02] border border-white/[0.03] rounded-2xl p-4 flex flex-col items-center">
            <span className="text-2xl font-bold">{staffList.length}</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Total Staff</span>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.03] rounded-2xl p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-green-400">9</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Present</span>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.03] rounded-2xl p-4 flex flex-col items-center">
            <span className="text-2xl font-bold text-red-500">2</span>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-1">Absent</span>
          </div>
        </div>

        <div>
          <h2 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">Staff Directory</h2>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-10 h-10 border-4 border-[#FBC02D]/20 border-t-[#FBC02D] rounded-full animate-spin" />
              <p className="text-gray-500 text-sm font-medium">Fetching staff directory...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center">
              <p className="text-red-400 text-sm">{error}</p>
              <button 
                onClick={fetchStaff}
                className="mt-4 text-[#FBC02D] text-xs font-bold underline"
              >
                Try Again
              </button>
            </div>
          ) : filteredStaff.length === 0 ? (
            <div className="border border-dashed border-white/5 rounded-3xl p-20 flex flex-col items-center gap-4 bg-white/[0.01]">
              <div className="p-4 bg-white/[0.02] rounded-full">
                <Users className="w-10 h-10 text-gray-800" />
              </div>
              <p className="text-gray-500 text-sm font-medium">No staff members found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredStaff.map((staff, index) => (
                <motion.div
                  key={staff.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/[0.03] border border-white/5 rounded-[24px] p-4 flex justify-between items-center group hover:bg-white/[0.05] hover:border-white/10 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={staff.photo ? `data:image/jpeg;base64,${staff.photo}` : 'https://randomuser.me/api/portraits/men/1.jpg'} 
                      alt={staff.fullName}
                      className="w-14 h-14 rounded-full border-2 border-[#FBC02D]/10 object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-white group-hover:text-[#FBC02D] transition-colors">{staff.fullName}</h3>
                      <p className="text-xs text-gray-500 font-medium">{staff.role}</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        <div className="w-1.5 h-1.5 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]" />
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Active</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <div className="bg-white/[0.03] px-3 py-1.5 rounded-lg flex items-center gap-2 border border-white/5">
                      <Phone className="w-3 h-3 text-gray-500" />
                      <span className="text-[10px] text-gray-400 font-bold">{staff.mobileNumber}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
