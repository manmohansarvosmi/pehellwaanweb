import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Phone, 
  MapPin, 
  Activity, 
  CreditCard, 
  History,
  TrendingUp,
  Scale,
  Ruler,
  Clock,
  ChevronRight,
  Plus,
  Bell,
  Camera,
  Upload,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getMemberHubDetails, sendReminder, renewMembership, getAllPackages, updateMemberPhoto } from '../utils/api';

interface MemberViewProps {
  memberId: number | string;
  onBack: () => void;
}

export default function MemberView({ memberId, onBack }: MemberViewProps) {
  const [member, setMember] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'payments'>('overview');
  const [actionInProgress, setActionInProgress] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [photoLoading, setPhotoLoading] = useState(false);

  const fetchDetails = async () => {
    setLoading(true);
    const result = await getMemberHubDetails(memberId);
    if (result.success) {
      setMember(result.data);
    }
    setLoading(false);
  };

  const fetchPackages = async () => {
    const result = await getAllPackages();
    if (result.success) {
      setPackages(result.data || []);
    }
  };

  useEffect(() => {
    fetchDetails();
    fetchPackages();
  }, [memberId]);

  const handleSendReminder = async () => {
    setActionInProgress(true);
    const result = await sendReminder(memberId);
    if (result.success) {
      alert('Reminder sent successfully!');
    } else {
      alert(result.message || 'Failed to send reminder');
    }
    setActionInProgress(false);
  };

  const handleRenew = async () => {
    if (!selectedPackage) return;
    
    setActionInProgress(true);
    const result = await renewMembership(memberId, {
      gymPackageId: selectedPackage.id,
      amount: selectedPackage.price,
      paymentMethod: 'CASH'
    });
    
    if (result.success) {
      alert('Membership renewed successfully!');
      setShowRenewModal(false);
      fetchDetails(); // Refresh details
    } else {
      alert(result.message || 'Renewal failed');
    }
    setActionInProgress(false);
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoLoading(true);
    const result = await updateMemberPhoto(memberId, file);
    if (result.success) {
      alert('Profile photo updated!');
      fetchDetails(); // Refresh details to show new photo
    } else {
      alert(result.message || 'Failed to update photo');
    }
    setPhotoLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 gap-4">
        <div className="w-12 h-12 border-4 border-[#FBC02D]/20 border-t-[#FBC02D] rounded-full animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Fetching Athlete Profile...</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 font-bold uppercase tracking-widest text-xs">Member not found</p>
        <button onClick={onBack} className="mt-4 text-[#FBC02D] text-xs font-black uppercase tracking-widest">Go Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2.5 bg-[#121212] border border-white/5 rounded-xl text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-oswald font-bold tracking-wider uppercase text-white">Athlete Profile</h1>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Member ID: #{memberId}</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-[#121212] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-5">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="relative overflow-hidden rounded-xl border border-white/10">
                <img 
                  src={member.photo ? `data:image/jpeg;base64,${member.photo}` : `https://ui-avatars.com/api/?name=${member.fullName}&background=1e293b&color=FBC02D&bold=true`} 
                  alt={member.fullName}
                  className="w-16 h-16 object-cover"
                />
                {photoLoading ? (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-gym-yellow animate-spin" />
                  </div>
                ) : (
                  <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handlePhotoChange} 
                    />
                  </label>
                )}
              </div>
              <div className={`absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full border-2 border-[#121212] ${member.isDeleted ? 'bg-red-500' : 'bg-green-500'}`} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white mb-0.5">{member.fullName}</h2>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-[#FBC02D] text-black text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">
                   {member.memberType || 'PREMIUM'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mt-6">
            <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
               <Phone className="w-3.5 h-3.5 text-[#FBC02D] mb-1.5" />
               <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Phone</p>
               <p className="text-white text-xs font-bold">{member.phoneNumber || 'N/A'}</p>
            </div>
            <div className="bg-white/[0.02] border border-white/5 p-3 rounded-xl">
               <Calendar className="w-3.5 h-3.5 text-[#FBC02D] mb-1.5" />
               <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Joined</p>
               <p className="text-white text-xs font-bold">{member.joiningDate ? new Date(member.joiningDate).toLocaleDateString() : 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 bg-[#121212] border border-white/5 rounded-xl">
        {(['overview', 'health', 'payments'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab ? 'bg-[#FBC02D] text-black shadow-lg shadow-[#FBC02D]/10' : 'text-gray-500 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="bg-[#121212] border border-white/5 p-3 rounded-xl text-center">
                  <Scale className="w-4 h-4 text-[#FBC02D] mx-auto mb-1.5" />
                  <p className="text-[7px] text-gray-500 font-black uppercase tracking-widest">Weight</p>
                  <p className="text-white text-sm font-black">{member.weight || '0'} <span className="text-[8px] text-gray-600">KG</span></p>
                </div>
                <div className="bg-[#121212] border border-white/5 p-3 rounded-xl text-center">
                  <Ruler className="w-4 h-4 text-[#FBC02D] mx-auto mb-1.5" />
                  <p className="text-[7px] text-gray-500 font-black uppercase tracking-widest">Height</p>
                  <p className="text-white text-sm font-black">{member.height || '0'} <span className="text-[8px] text-gray-600">CM</span></p>
                </div>
                <div className="bg-[#121212] border border-white/5 p-3 rounded-xl text-center">
                  <Activity className="w-4 h-4 text-[#FBC02D] mx-auto mb-1.5" />
                  <p className="text-[7px] text-gray-500 font-black uppercase tracking-widest">BMI</p>
                  <p className="text-white text-sm font-black">{member.bmi?.toFixed(1) || '0'}</p>
                </div>
              </div>

              <div className="bg-[#121212] border border-white/5 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-3.5 h-3.5 text-gray-500" />
                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Status</h3>
                  </div>
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest ${
                    member.balanceAmount > 0 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                  }`}>
                    {member.balanceAmount > 0 ? 'Due' : 'Active'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Expiry</span>
                    <span className="text-white text-[10px] font-bold">{member.planExpiryDate ? new Date(member.planExpiryDate).toLocaleDateString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Balance</span>
                    <span className="text-[#FBC02D] text-[10px] font-black">₹{member.balanceAmount || '0'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">Trainer</span>
                    <span className="text-white text-[10px] font-bold">{member.personalTrainerName || 'None'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Progress Logs</h3>
                <button className="text-[#FBC02D] text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                  <Plus className="w-3 h-3" />
                  New Log
                </button>
              </div>

              {!member.healthLogs || member.healthLogs.length === 0 ? (
                <div className="bg-[#121212] border border-dashed border-white/10 rounded-xl py-12 flex flex-col items-center gap-3">
                   <TrendingUp className="w-8 h-8 text-white/5" />
                   <p className="text-gray-600 font-bold uppercase tracking-widest text-[9px]">No Logs</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {member.healthLogs.map((log: any, idx: number) => (
                    <div key={idx} className="bg-[#121212] border border-white/5 p-3 rounded-xl flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-white text-xs font-bold">Progress Log</p>
                            <p className="text-gray-500 text-[8px] font-medium">{new Date(log.createdOn).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <div className="text-right">
                         <p className="text-[#FBC02D] text-xs font-black">{log.weight} KG</p>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Transactions</h3>
                <button className="text-[#FBC02D] text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                  <Plus className="w-3 h-3" />
                  Payment
                </button>
              </div>

              {!member.payments || member.payments.length === 0 ? (
                <div className="bg-[#121212] border border-dashed border-white/10 rounded-xl py-12 flex flex-col items-center gap-3">
                   <CreditCard className="w-8 h-8 text-white/5" />
                   <p className="text-gray-600 font-bold uppercase tracking-widest text-[9px]">No Payments</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {member.payments.map((payment: any, idx: number) => (
                    <div key={idx} className="bg-[#121212] border border-white/5 p-3 rounded-xl flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <CreditCard className="w-4 h-4 text-green-500" />
                          <div>
                            <p className="text-white text-xs font-bold">Fee Payment</p>
                            <p className="text-gray-500 text-[8px] font-medium">{new Date(payment.paymentDate).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <div className="text-right">
                         <p className="text-white text-xs font-black">₹{payment.amount}</p>
                       </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="fixed bottom-20 left-4 right-4 grid grid-cols-2 gap-2.5">
        <button 
          onClick={handleSendReminder}
          disabled={actionInProgress}
          className="bg-white/5 hover:bg-white/10 text-white py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
           <Bell className={`w-3.5 h-3.5 text-gray-500 ${actionInProgress ? 'animate-bounce' : ''}`} />
           {actionInProgress ? 'Sending...' : 'Remind'}
        </button>
        <button 
          onClick={() => setShowRenewModal(true)}
          className="bg-[#FBC02D] text-black py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FBC02D]/10"
        >
           <History className="w-3.5 h-3.5" />
           Renew
        </button>
      </div>

      {/* Renew Membership Modal */}
      <AnimatePresence>
        {showRenewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRenewModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-[#121212] border border-white/5 rounded-2xl p-5 overflow-hidden"
            >
              <div className="mb-5">
                <h3 className="text-base font-oswald font-bold text-white uppercase tracking-wider">Renew Membership</h3>
                <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest">Select a new plan</p>
              </div>

              <div className="space-y-2.5 max-h-[250px] overflow-y-auto mb-5 pr-1 custom-scrollbar">
                {packages.map((pkg) => (
                  <button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedPackage?.id === pkg.id 
                        ? 'bg-[#FBC02D]/10 border-[#FBC02D]' 
                        : 'bg-white/5 border-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-0.5">
                      <span className={`text-[10px] font-black uppercase tracking-widest ${selectedPackage?.id === pkg.id ? 'text-[#FBC02D]' : 'text-white'}`}>
                        {pkg.packageName}
                      </span>
                      <span className="text-white text-xs font-black">₹{pkg.price}</span>
                    </div>
                    <p className="text-[8px] text-gray-600 font-medium">{pkg.durationInDays} Days Duration</p>
                  </button>
                ))}
              </div>

              <div className="flex gap-2.5">
                <button 
                  onClick={() => setShowRenewModal(false)}
                  className="flex-1 py-3.5 bg-white/5 text-white rounded-xl text-[9px] font-black uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRenew}
                  disabled={!selectedPackage || actionInProgress}
                  className="flex-[2] py-3.5 bg-[#FBC02D] text-black rounded-xl text-[9px] font-black uppercase tracking-widest disabled:opacity-50"
                >
                  {actionInProgress ? 'Renewing...' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
