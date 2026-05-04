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
  onViewMember?: (id: number | string) => void;
}

export default function Members({ onAddMember, onEditMember, onViewMember }: MembersProps) {
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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center px-1">
        <div>
          <h1 className="text-lg font-oswald font-bold tracking-wider uppercase text-white">Athletes</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Gym Community</p>
        </div>
        <button 
          onClick={onAddMember}
          className="bg-[#FBC02D] text-black px-4 py-2.5 rounded-xl flex items-center gap-2 font-black uppercase tracking-wider text-[12px] hover:scale-105 transition-transform"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </div>

      {/* Filters & Search - Compact */}
      <div className="flex flex-col gap-2">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
          <input 
            type="text" 
            placeholder="Search name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#121212] border border-white/5 rounded-xl py-2.5 pl-11 pr-4 text-[13px] focus:outline-none placeholder:text-gray-800"
          />
        </div>
        
        <div className="flex gap-1 p-1 bg-[#121212] border border-white/5 rounded-xl">
          {(['all', 'active', 'expired'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f ? 'bg-[#FBC02D] text-black' : 'text-gray-600'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Members Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-10 h-10 border-4 border-[#FBC02D]/20 border-t-[#FBC02D] rounded-full animate-spin" />
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="bg-[#171717] border border-dashed border-white/10 rounded-2xl py-24 flex flex-col items-center gap-4">
           <Users className="w-12 h-12 text-white/5" />
           <p className="text-gray-600 font-bold uppercase tracking-widest text-[11px]">No Members Found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMembers.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className="bg-[#121212] border border-white/5 rounded-xl p-3.5 hover:bg-white/[0.04] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <img 
                    src={member.photo ? `data:image/jpeg;base64,${member.photo}` : `https://ui-avatars.com/api/?name=${member.fullName}&background=1e293b&color=FBC02D&bold=true`} 
                    alt={member.fullName}
                    className="w-11 h-11 rounded-lg object-cover border border-white/5"
                  />
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-[2.5px] border-[#121212] ${member.isDeleted ? 'bg-red-500' : 'bg-green-500'}`} />
                </div>
                <div>
                  <h3 className="text-[14px] text-white font-bold tracking-tight">{member.fullName}</h3>
                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{member.membershipPlan || 'General'}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4 px-1">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-gray-600">
                  <span>Phone</span>
                  <span className="text-gray-400">{member.phoneNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest text-gray-600">
                  <span>Expiry</span>
                  <span className="text-[#FBC02D]">{member.planExpiryDate ? new Date(member.planExpiryDate).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => onViewMember?.(member.id)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3 h-3" />
                  Details
                </button>
                <button 
                  onClick={() => onEditMember?.(member)}
                  className="bg-white/5 hover:bg-white/10 text-white p-2 rounded-lg transition-all"
                >
                  <Edit3 className="w-3 h-3 text-gray-600" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
