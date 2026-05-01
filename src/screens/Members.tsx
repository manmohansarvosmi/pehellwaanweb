import { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronRight, 
  Eye, 
  Edit3, 
  UserPlus,
  Filter,
  Users
} from 'lucide-react';
import { motion } from 'motion/react';
import { getAllMembers } from '../utils/api';

interface MembersProps {
  onAddMember?: () => void;
  onEditMember?: (member: any) => void;
}

export default function Members({ onAddMember, onEditMember }: MembersProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    setLoading(true);
    const result = await getAllMembers();
    if (result.success) {
      setMembers(result.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(m => {
    const matchesSearch = (m.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
                         (m.phoneNumber || '').includes(search);
    const matchesFilter = filter === 'all' || (filter === 'active' ? !m.isDeleted : m.isDeleted);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-oswald font-bold tracking-wider uppercase text-white">Athletes</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Gym Community</p>
        </div>
        <button 
          onClick={onAddMember}
          className="bg-[#FBC02D] text-black px-4 py-2.5 rounded-xl flex items-center gap-2 font-black uppercase tracking-wider text-[11px] hover:scale-105 transition-transform shadow-lg shadow-[#FBC02D]/10"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Filters & Search - Compact */}
      <div className="flex flex-col gap-3">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-[#FBC02D] transition-colors" />
          <input 
            type="text" 
            placeholder="Search name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121212] border border-white/5 rounded-xl py-3 pl-11 pr-4 text-[13px] focus:outline-none focus:border-[#FBC02D]/50 transition-all placeholder:text-gray-700"
          />
        </div>
        
        <div className="flex gap-1.5 p-1 bg-[#121212] border border-white/5 rounded-xl">
          {(['all', 'active', 'expired'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-[#FBC02D] text-black' : 'text-gray-600 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Members Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="w-12 h-12 border-4 border-[#FBC02D]/20 border-t-[#FBC02D] rounded-full animate-spin" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Loading Database...</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-[#171717] border border-dashed border-white/10 rounded-[40px] py-32 flex flex-col items-center gap-4">
           <Users className="w-16 h-16 text-white/5" />
           <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-xs">No Members Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMembers.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="bg-[#121212] border border-white/5 rounded-2xl p-4 hover:bg-white/[0.04] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <img 
                    src={member.photo ? `data:image/jpeg;base64,${member.photo}` : `https://ui-avatars.com/api/?name=${member.fullName}&background=1e293b&color=FBC02D&bold=true`} 
                    alt={member.fullName}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-white/5"
                  />
                  <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[3px] border-[#121212] ${member.isDeleted ? 'bg-red-500' : 'bg-green-500'}`} />
                </div>
                <div>
                  <h3 className="text-[14px] text-white font-bold tracking-tight group-hover:text-[#FBC02D] transition-colors">{member.fullName}</h3>
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{member.membershipPlan || 'General'}</p>
                </div>
              </div>

              <div className="space-y-2.5 mb-5">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-gray-500">
                  <span>Phone</span>
                  <span className="text-gray-300">{member.phoneNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-gray-500">
                  <span>Joined</span>
                  <span className="text-gray-300">{member.joineeDate || 'N/A'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  Details
                </button>
                <button 
                  onClick={() => onEditMember?.(member)}
                  className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-lg transition-all"
                >
                  <Edit3 className="w-3.5 h-3.5 text-gray-600 hover:text-[#FBC02D]" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
