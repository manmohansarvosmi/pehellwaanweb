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
    planExpiryDate: ''
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
        planExpiryDate: editData.planExpiryDate || ''
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
    <div className="max-w-[480px] mx-auto min-h-screen bg-black text-white font-sans flex flex-col relative">
      {/* Header - Compact */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md px-4 py-4 flex items-center border-b border-white/5">
        <button onClick={onBack} className="p-1.5 text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-base font-bold mr-8">
          {editData ? 'Edit Member' : 'New Member'}
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 pb-40 pt-8 space-y-8">
        {/* Profile Photo Section - Compact */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-2 border-[#FBC02D]/20 bg-[#1A1A1A] flex items-center justify-center overflow-hidden">
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-gray-700" />
              )}
            </div>
          </div>
          <div className="relative">
            <button type="button" className="px-6 py-2 rounded-full border border-[#FBC02D] text-[#FBC02D] text-xs font-bold hover:bg-[#FBC02D]/10 transition-colors">
              Upload Photo
            </button>
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
          </div>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold">Tap to take a photo</p>
        </div>

        {/* Basic Info - Compact Inputs */}
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name</label>
            <div className="relative group bg-[#1A1A1A] rounded-xl border border-white/5">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="text" 
                placeholder="e.g. John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full bg-transparent py-4 pl-11 pr-4 text-[13px] focus:outline-none placeholder:text-gray-700"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-[#FBC02D] uppercase tracking-widest opacity-60">BODY COMPOSITION (BMI)</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Height (cm)</label>
                <div className="relative bg-[#1A1A1A] rounded-xl border border-white/5">
                  <Ruler className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input 
                    type="number" 
                    placeholder="175"
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className="w-full bg-transparent py-4 pl-11 pr-4 text-[13px] focus:outline-none placeholder:text-gray-700"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Weight (kg)</label>
                <div className="relative bg-[#1A1A1A] rounded-xl border border-white/5">
                  <Scale className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input 
                    type="number" 
                    placeholder="70"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: e.target.value})}
                    className="w-full bg-transparent py-4 pl-11 pr-4 text-[13px] focus:outline-none placeholder:text-gray-700"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Calculated BMI</label>
              <div className="relative bg-[#1A1A1A] rounded-xl border border-white/5 opacity-80">
                <Calculator className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#FBC02D]" />
                <input 
                  type="text" 
                  readOnly 
                  value={bmi}
                  className="w-full bg-transparent py-4 pl-11 pr-4 text-[13px] font-bold text-[#FBC02D]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Phone Number</label>
            <div className="relative bg-[#1A1A1A] rounded-xl border border-white/5">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="tel" 
                placeholder="+91 00000 00000"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                className="w-full bg-transparent py-4 pl-11 pr-4 text-[13px] focus:outline-none placeholder:text-gray-700"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative bg-[#1A1A1A] rounded-xl border border-white/5">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input 
                type="email" 
                placeholder="example@gym.com"
                value={formData.emailId}
                onChange={(e) => setFormData({...formData, emailId: e.target.value})}
                className="w-full bg-transparent py-4 pl-11 pr-4 text-[13px] focus:outline-none placeholder:text-gray-700"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-gray-400 uppercase">GENDER</label>
            <div className="flex bg-[#1A1A1A] p-1 rounded-2xl border border-white/5">
              {['Male', 'Female', 'Other'].map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData({...formData, gender: g as any})}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                    formData.gender === g 
                      ? 'bg-[#FBC02D] text-black shadow-lg shadow-[#FBC02D]/10' 
                      : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Date of Birth</label>
              <div className="relative bg-[#1A1A1A] rounded-2xl border border-white/5">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <input 
                  type="date" 
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  className="w-full bg-transparent py-5 pl-12 pr-2 text-[11px] focus:outline-none [color-scheme:dark]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Gym Package</label>
              <div className="relative bg-[#1A1A1A] rounded-2xl border border-white/5">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                <select 
                  value={formData.gymPackageId || ''}
                  onChange={(e) => handlePackageSelect(e.target.value)}
                  className="w-full bg-transparent py-5 pl-12 pr-8 text-[11px] focus:outline-none appearance-none font-bold text-gray-400"
                >
                  <option value="" disabled>Select Package</option>
                  {packages.map(p => <option key={p.id} value={p.id}>{p.packageName}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-xs font-black text-[#FBC02D] uppercase tracking-wider">MEMBERSHIP & PAYMENTS</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Joining Date</label>
                <div className="relative bg-[#1A1A1A] rounded-2xl border border-white/5">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input 
                    type="date" 
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({...formData, joiningDate: e.target.value})}
                    className="w-full bg-transparent py-5 pl-12 pr-2 text-sm focus:outline-none [color-scheme:dark] font-bold"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase">Initial Paid Amount</label>
                <div className="relative bg-[#1A1A1A] rounded-2xl border border-white/5">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input 
                    type="number" 
                    placeholder="0.0"
                    value={formData.initialPaidAmount}
                    onChange={(e) => setFormData({...formData, initialPaidAmount: e.target.value})}
                    className="w-full bg-transparent py-5 pl-12 pr-4 text-sm focus:outline-none placeholder:text-gray-700 font-bold"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Next Installment Date (Optional)</label>
            <div className="relative bg-[#1A1A1A] rounded-2xl border border-white/5">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input 
                type="date" 
                value={formData.nextInstallmentDate}
                onChange={(e) => setFormData({...formData, nextInstallmentDate: e.target.value})}
                className="w-full bg-transparent py-5 pl-12 pr-4 text-sm focus:outline-none [color-scheme:dark] text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Emergency Contact</label>
            <div className="relative bg-[#1A1A1A] rounded-2xl border border-white/5">
              <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input 
                type="tel" 
                placeholder="Relative's phone number"
                value={formData.emergencyContactNumber}
                onChange={(e) => setFormData({...formData, emergencyContactNumber: e.target.value})}
                className="w-full bg-transparent py-5 pl-12 pr-4 text-sm focus:outline-none placeholder:text-gray-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">Plan Expiry Date (Auto-calculated)</label>
            <div className={`relative rounded-2xl border ${formData.planExpiryDate ? 'bg-red-500/5 border-red-500/20' : 'bg-[#1A1A1A] border-white/5'}`}>
              <History className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
              <input 
                type="text" 
                readOnly
                value={formData.planExpiryDate ? new Date(formData.planExpiryDate).toLocaleDateString() : 'Select package to calculate'}
                className={`w-full bg-transparent py-5 pl-12 pr-4 text-sm font-bold ${formData.planExpiryDate ? 'text-red-500' : 'text-gray-600'}`}
              />
            </div>
          </div>
        </div>
      </form>

      {/* Fixed Footer Branding */}
      <div className="absolute bottom-28 left-0 right-0 text-center pointer-events-none">
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.4em]">PEHELLWAAN GYM MANAGEMENT</p>
      </div>

      {/* Floating Save Button - Compact */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/90 to-transparent">
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-14 bg-[#FBC02D] text-black font-black tracking-[0.15em] uppercase rounded-2xl shadow-xl shadow-[#FBC02D]/10 flex items-center justify-center gap-2.5 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Athlete
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
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-8 py-4 rounded-full flex items-center gap-4 shadow-2xl z-50"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-bold uppercase tracking-widest text-xs">Athlete Saved</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
