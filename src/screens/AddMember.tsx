import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  CreditCard, 
  Scale, 
  Ruler, 
  Calculator,
  Save,
  Loader2,
  CheckCircle2,
  Info,
  Package,
  Wallet,
  Clock,
  History,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { createMember, updateMember, getAllPackages } from '../utils/api';

interface AddMemberProps {
  onBack?: () => void;
  editData?: any;
}

export default function AddMember({ onBack, editData }: AddMemberProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    height: '',
    weight: '',
    phoneNumber: '',
    emailId: '',
    dateOfBirth: '',
    membershipPlan: '',
    emergencyContactNumber: '',
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    joiningDate: new Date().toISOString().split('T')[0],
    initialPaidAmount: '',
    nextInstallmentDate: '',
    gymPackageId: null as number | null,
    planExpiryDate: '',
    discount: ''
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchPackages();
    if (editData) {
      setFormData({
        fullName: editData.fullName || '',
        height: editData.height?.toString() || '',
        weight: editData.weight?.toString() || '',
        phoneNumber: editData.phoneNumber || '',
        emailId: editData.emailId || '',
        dateOfBirth: editData.dateOfBirth || '',
        membershipPlan: editData.membershipPlan || '',
        emergencyContactNumber: editData.emergencyContactNumber || '',
        gender: editData.gender || 'Male',
        joiningDate: editData.joiningDate || new Date().toISOString().split('T')[0],
        initialPaidAmount: editData.initialPaidAmount?.toString() || '',
        nextInstallmentDate: editData.nextInstallmentDate || '',
        gymPackageId: editData.gymPackageId || null,
        planExpiryDate: editData.planExpiryDate || '',
        discount: editData.discount?.toString() || ''
      });
      if (editData.photoUrl) setPhotoPreview(editData.photoUrl);
    }
  }, [editData]);

  const fetchPackages = async () => {
    const result = await getAllPackages();
    if (result.success) setPackages(result.data || []);
  };

  const calculateExpiry = (joiningDateStr: string, months: number, days: number) => {
    const date = new Date(joiningDateStr);
    if (months > 0) date.setMonth(date.getMonth() + months);
    if (days > 0) date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  const handlePackageSelect = (pkgId: string) => {
    const pkg = packages.find(p => p.id === parseInt(pkgId));
    if (!pkg) return;
    setSelectedPackage(pkg);
    const expiry = calculateExpiry(formData.joiningDate, pkg.durationMonths, pkg.durationDays);
    setFormData(prev => ({
      ...prev,
      gymPackageId: pkg.id,
      membershipPlan: pkg.packageName,
      planExpiryDate: expiry
    }));
  };

  const calculateBMI = () => {
    const h = parseFloat(formData.height) / 100;
    const w = parseFloat(formData.weight);
    if (h > 0 && w > 0) return (w / (h * h)).toFixed(1);
    return '0.0';
  };

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
    
    const payload = {
      ...formData,
      height: parseFloat(formData.height) || 0,
      weight: parseFloat(formData.weight) || 0,
      initialPaidAmount: parseFloat(formData.initialPaidAmount) || 0,
      discount: parseFloat(formData.discount) || 0,
      photo: photo,
      organizationId: 1
    };

    const result = editData?.id 
      ? await updateMember(editData.id, payload)
      : await createMember(payload);

    setLoading(false);
    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onBack) onBack();
      }, 2000);
    }
  };

  const bmi = calculateBMI();

  return (
    <div className="w-full min-h-screen bg-black text-white font-sans flex flex-col relative">
      {/* Header - Compact */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md px-4 py-3 flex items-center border-b border-white/5">
        <button onClick={onBack} className="p-1.5 text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-sm font-bold mr-8 uppercase tracking-widest">
          {editData ? 'Edit Profile' : 'New Athlete'}
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-2 md:px-4 pb-32 pt-6 space-y-6">
        {/* Profile Photo Section - Compact */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <div className="w-20 h-20 rounded-xl border border-white/5 bg-[#121212] flex items-center justify-center overflow-hidden">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-gray-800" />
              )}
            </div>
          </div>
          <div className="relative">
            <button type="button" className="px-4 py-1.5 rounded-lg border border-[#FBC02D] text-[#FBC02D] text-[10px] font-bold uppercase tracking-widest">
              Upload
            </button>
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
        </div>

        {/* Basic Info - Compact Inputs */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Full Name</label>
            <div className="relative bg-[#121212] rounded-xl border border-white/5">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700" />
              <input 
                type="text" 
                placeholder="Athlete Name"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full bg-transparent py-3 pl-11 pr-4 text-[12px] focus:outline-none placeholder:text-gray-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Height (cm)</label>
              <div className="relative bg-[#121212] rounded-xl border border-white/5">
                <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700" />
                <input 
                  type="number" 
                  placeholder="175"
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className="w-full bg-transparent py-3 pl-11 pr-4 text-[12px] focus:outline-none placeholder:text-gray-800"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Weight (kg)</label>
              <div className="relative bg-[#121212] rounded-xl border border-white/5">
                <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700" />
                <input 
                  type="number" 
                  placeholder="70"
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="w-full bg-transparent py-3 pl-11 pr-4 text-[12px] focus:outline-none placeholder:text-gray-800"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Phone Number</label>
            <div className="relative bg-[#121212] rounded-xl border border-white/5">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700" />
              <input 
                type="tel" 
                placeholder="+91 00000 00000"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="w-full bg-transparent py-3 pl-11 pr-4 text-[12px] focus:outline-none placeholder:text-gray-800"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Gender</label>
            <div className="flex bg-[#121212] p-1 rounded-xl border border-white/5">
              {['Male', 'Female'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData({...formData, gender: g as any})}
                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                    formData.gender === g ? 'bg-[#FBC02D] text-black' : 'text-gray-600'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Gym Package</label>
              <div className="relative bg-[#121212] rounded-xl border border-white/5">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700" />
                <select 
                  value={formData.gymPackageId || ''}
                  onChange={(e) => handlePackageSelect(e.target.value)}
                  className="w-full bg-transparent py-3 pl-11 pr-8 text-[11px] focus:outline-none appearance-none font-bold text-gray-500"
                >
                  <option value="" disabled>Select Plan</option>
                  {packages.map(p => <option key={p.id} value={p.id}>{p.packageName}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Joining Date</label>
              <div className="relative bg-[#121212] rounded-xl border border-white/5">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700" />
                <input 
                  type="date" 
                  value={formData.joiningDate}
                  onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                  className="w-full bg-transparent py-3 pl-11 pr-2 text-[11px] focus:outline-none [color-scheme:dark]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Initial Paid (₹)</label>
              <div className="relative bg-[#121212] rounded-xl border border-white/5">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700" />
                <input 
                  type="number" 
                  placeholder="0.0"
                  value={formData.initialPaidAmount}
                  onChange={(e) => setFormData({...formData, initialPaidAmount: e.target.value})}
                  className="w-full bg-transparent py-3 pl-11 pr-4 text-[12px] focus:outline-none placeholder:text-gray-800"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">Discount (₹)</label>
              <div className="relative bg-[#121212] rounded-xl border border-white/5">
                <Calculator className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-700" />
                <input 
                  type="number" 
                  placeholder="0.0"
                  value={formData.discount}
                  onChange={(e) => setFormData({...formData, discount: e.target.value})}
                  className="w-full bg-transparent py-3 pl-11 pr-4 text-[12px] focus:outline-none placeholder:text-gray-800"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl space-y-1">
            <p className="text-[8px] font-black text-red-500 uppercase tracking-widest">Plan Expiry Date</p>
            <p className="text-sm font-black text-white">
              {formData.planExpiryDate ? new Date(formData.planExpiryDate).toLocaleDateString() : 'Auto-calculated'}
            </p>
          </div>
        </div>
      </form>

      {/* Floating Save Button - Compact */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent">
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-12 bg-[#FBC02D] text-black font-black tracking-widest uppercase rounded-xl flex items-center justify-center gap-2.5 active:scale-98 transition-all disabled:opacity-70 shadow-lg shadow-[#FBC02D]/10"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              {editData ? 'Update Profile' : 'Save Athlete'}
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-3 shadow-2xl z-50"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-[10px]">Success</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
