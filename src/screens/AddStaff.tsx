import { useState } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  Briefcase, 
  Phone, 
  Mail, 
  Calendar, 
  IndianRupee, 
  ChevronDown, 
  Save, 
  Loader2, 
  CheckCircle2,
  User,
  Info,
  Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createStaff } from '../utils/api';

interface AddStaffProps {
  onBack?: () => void;
}

export default function AddStaff({ onBack }: AddStaffProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    role: '',
    mobileNumber: '',
    emailId: '',
    gender: 'Male',
    joinDate: new Date().toISOString().split('T')[0],
    fixedSalary: ''
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const roles = ['Trainer', 'Receptionist', 'Security', 'Cleaner', 'Yoga Instructor', 'Sales'];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await createStaff({
      ...formData,
      photo: photo
    });
    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onBack) onBack();
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header - Compact */}
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-white group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        </button>
        <div>
          <h1 className="text-xl font-oswald font-bold tracking-wider uppercase text-white">Staff Induction</h1>
          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">New Pehellwaan Squad Member</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Identity Card - Compact */}
        <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 relative overflow-hidden shadow-xl">
          <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="relative group/photo">
              <div className="w-24 h-24 rounded-2xl bg-white/[0.03] border-2 border-dashed border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover/photo:border-gym-yellow/50 cursor-pointer">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-10 h-10 text-gray-700 group-hover/photo:text-gym-yellow transition-colors" />
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 bg-gym-yellow p-2 rounded-xl text-black shadow-lg">
                 <Camera className="w-4 h-4" />
              </div>
            </div>
            
            <div className="flex-1 space-y-4 w-full text-center">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="Enter Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-transparent border-b-2 border-white/5 py-2 text-xl font-black text-white text-center focus:outline-none focus:border-gym-yellow transition-all placeholder:text-gray-800"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Details Section - Compact */}
        <div className="grid grid-cols-1 gap-4">
          {/* Role Selection */}
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 space-y-5 shadow-lg">
            <h3 className="text-white font-oswald text-sm font-bold uppercase tracking-widest flex items-center gap-2">
               <Briefcase className="w-4 h-4 text-gym-yellow" />
               Assignment
            </h3>
            <div className="relative group">
              <select 
                required
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full bg-black/40 border border-white/5 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-gym-yellow/50 appearance-none transition-all cursor-pointer font-bold"
              >
                <option value="" disabled>Select Role</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
            </div>
          </div>

          {/* Remuneration */}
          <div className="bg-[#121212] border border-white/5 rounded-2xl p-5 space-y-5 shadow-lg">
             <h3 className="text-white font-oswald text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                <IndianRupee className="w-4 h-4 text-gym-yellow" />
                Remuneration
             </h3>
             <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input 
                  type="number" 
                  placeholder="Salary"
                  value={formData.fixedSalary}
                  onChange={(e) => setFormData({...formData, fixedSalary: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-base font-bold text-white focus:outline-none focus:border-gym-yellow/50"
                />
             </div>
          </div>
        </div>

        {/* Contact Data - Compact */}
        <div className="bg-[#121212] border border-white/5 rounded-2xl p-6 grid grid-cols-1 gap-6 shadow-lg">
           <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Mobile Terminal</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input 
                  type="tel" 
                  required
                  placeholder="+91 00000 00000"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({...formData, mobileNumber: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-[13px] text-white focus:outline-none focus:border-gym-yellow/50 transition-all"
                />
              </div>
           </div>

           <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Email Terminal</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input 
                  type="email" 
                  placeholder="email@pahellwaan.com"
                  value={formData.emailId}
                  onChange={(e) => setFormData({...formData, emailId: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-[13px] text-white focus:outline-none focus:border-gym-yellow/50"
                />
              </div>
           </div>

           <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Gender</label>
              <div className="flex gap-2">
                 {['Male', 'Female', 'Other'].map(g => (
                   <button
                     key={g}
                     type="button"
                     onClick={() => setFormData({...formData, gender: g})}
                     className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${
                       formData.gender === g 
                         ? 'bg-gym-yellow border-gym-yellow text-black' 
                         : 'bg-black/40 border-white/5 text-gray-600'
                     }`}
                   >
                     {g}
                   </button>
                 ))}
              </div>
           </div>
        </div>

        {/* Submit Terminal - Compact */}
        <div className="flex gap-3 pt-2">
           <button 
             type="button" 
             onClick={onBack}
             className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
           >
             Cancel
           </button>
           <button 
             type="submit"
             disabled={loading}
             className="flex-1 bg-gym-yellow text-black py-4 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-gym-yellow/10"
           >
             {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
             Induct Staff
           </button>
        </div>
      </form>

      {/* Helper Tip */}
      <div className="mt-12 p-6 bg-white/[0.02] border border-white/5 rounded-[32px] flex items-center gap-4 max-w-2xl mx-auto">
         <div className="p-2 bg-gym-yellow/10 rounded-lg">
            <Info className="w-4 h-4 text-gym-yellow" />
         </div>
         <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
           Staff remuneration and deployment data is encrypted and used for automated payroll processing cycles.
         </p>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-8 py-4 rounded-[40px] flex items-center gap-4 shadow-2xl z-50 border-4 border-emerald-400/50 backdrop-blur-xl"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-black uppercase tracking-widest text-xs">Deployment Successful</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
