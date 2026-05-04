import { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  ChevronLeft,
  IndianRupee,
  Calendar,
  Zap,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAllPackages, createPackage, updatePackage, deletePackage } from '../utils/api';

interface PackagesProps {
  onBack?: () => void;
}

export default function Packages({ onBack }: PackagesProps) {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [formData, setFormData] = useState({
    packageName: '',
    durationInMonths: 1,
    basePrice: 0,
    isActive: true,
    description: ''
  });

  const fetchPackages = async () => {
    setLoading(true);
    const result = await getAllPackages();
    if (result.success) {
      setPackages(result.data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const result = editingPackage 
      ? await updatePackage(editingPackage.id, formData)
      : await createPackage(formData);

    if (result.success) {
      fetchPackages();
      setIsModalOpen(false);
      resetForm();
    } else {
      alert(result.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      const result = await deletePackage(id);
      if (result.success) {
        fetchPackages();
      }
    }
  };

  const handleEdit = (pkg: any) => {
    setEditingPackage(pkg);
    setFormData({
      packageName: pkg.packageName,
      durationInMonths: pkg.durationInMonths,
      basePrice: pkg.basePrice,
      isActive: pkg.isActive,
      description: pkg.description || ''
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setEditingPackage(null);
    setFormData({
      packageName: '',
      durationInMonths: 1,
      basePrice: 0,
      isActive: true,
      description: ''
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 bg-[#121212] rounded-xl border border-white/5 text-gray-400">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-oswald font-bold tracking-wider uppercase text-white">Membership Plans</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Subscription Tiers</p>
          </div>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-[#FBC02D] text-black px-4 py-2.5 rounded-xl flex items-center gap-2 font-black uppercase tracking-wider text-[12px] shadow-lg shadow-gym-yellow/10"
        >
          <Plus className="w-4 h-4" />
          New Plan
        </button>
      </div>

      {loading && packages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-12 h-12 border-4 border-[#FBC02D]/20 border-t-[#FBC02D] rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden group"
            >
              <div className="p-5 flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white tracking-tight">{pkg.packageName}</h3>
                    {!pkg.isActive && (
                      <span className="bg-red-500/10 text-red-500 text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Disabled</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span className="text-[11px] font-bold uppercase">{pkg.durationInMonths} {pkg.durationInMonths === 1 ? 'Month' : 'Months'}</span>
                    </div>
                    <div className="w-1 h-1 bg-white/10 rounded-full" />
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" />
                      <span className="text-[11px] font-bold text-gym-yellow">₹{pkg.basePrice}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(pkg)}
                    className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl transition-all"
                  >
                    <Edit3 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button 
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2.5 bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-500/60" />
                  </button>
                </div>
              </div>
              
              {pkg.description && (
                <div className="px-5 pb-5">
                  <p className="text-[11px] text-gray-600 italic leading-relaxed">{pkg.description}</p>
                </div>
              )}
              
              <div className="h-1 bg-gradient-to-r from-gym-yellow/0 via-gym-yellow/10 to-gym-yellow/0" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#0F0F0F] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h2 className="text-lg font-oswald font-bold text-white uppercase tracking-widest">
                  {editingPackage ? 'Edit Plan' : 'Create New Plan'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-600 tracking-widest uppercase ml-1">Plan Name</label>
                  <div className="relative group bg-black/50 rounded-xl border border-white/5 focus-within:border-gym-yellow/30 transition-all">
                    <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                    <input 
                      type="text" 
                      required
                      value={formData.packageName}
                      onChange={(e) => setFormData({...formData, packageName: e.target.value})}
                      className="w-full bg-transparent text-white py-3.5 pl-12 pr-4 text-[13px] focus:outline-none placeholder:text-gray-800"
                      placeholder="e.g. Gold Membership"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-600 tracking-widest uppercase ml-1">Duration (Months)</label>
                    <div className="relative group bg-black/50 rounded-xl border border-white/5 focus-within:border-gym-yellow/30 transition-all">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                      <input 
                        type="number" 
                        required
                        value={formData.durationInMonths}
                        onChange={(e) => setFormData({...formData, durationInMonths: parseInt(e.target.value)})}
                        className="w-full bg-transparent text-white py-3.5 pl-12 pr-4 text-[13px] focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-600 tracking-widest uppercase ml-1">Base Price</label>
                    <div className="relative group bg-black/50 rounded-xl border border-white/5 focus-within:border-gym-yellow/30 transition-all">
                      <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                      <input 
                        type="number" 
                        required
                        value={formData.basePrice}
                        onChange={(e) => setFormData({...formData, basePrice: parseFloat(e.target.value)})}
                        className="w-full bg-transparent text-white py-3.5 pl-12 pr-4 text-[13px] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-600 tracking-widest uppercase ml-1">Description</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full bg-black/50 border border-white/5 rounded-xl py-3 px-4 text-[13px] focus:outline-none focus:border-gym-yellow/30 text-white placeholder:text-gray-800"
                    placeholder="Describe plan features..."
                  />
                </div>

                <div className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl border border-white/5">
                  <input 
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="w-4 h-4 accent-gym-yellow"
                  />
                  <label htmlFor="isActive" className="text-[11px] font-bold text-gray-400 uppercase tracking-widest cursor-pointer">
                    Active & Available
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#FBC02D] text-black font-black tracking-widest uppercase py-4 rounded-xl shadow-lg shadow-gym-yellow/10 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      {editingPackage ? 'Update Plan' : 'Create Plan'}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
