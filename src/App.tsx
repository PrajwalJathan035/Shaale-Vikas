/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Home, 
  Heart, 
  Bell, 
  User as UserIcon, 
  Search, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Trophy, 
  Image as ImageIcon,
  History as HistoryIcon,
  Filter,
  Camera,
  LogOut,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Lock,
  Plus,
  Edit,
  ClipboardList,
  ZoomIn,
  ImageOff,
  Landmark,
  List as ListIcon,
  Wallet,
  Users,
  Clock,
  Trash2,
  Eye,
  EyeOff,
  Key,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Screen, User, Need, Donor } from './types';

// Mock Constants from SOP
const ADMIN_EMAIL = "headmaster@shaalevikas.com";
const CATEGORIES = ["🔧 Repair", "🪑 Furniture", "📦 Supplies", "🚽 Sanitation", "💡 Electrical", "🌿 Other"];
const PRIORITIES: ('🔴 Urgent' | '🟡 Moderate' | '🟢 Low')[] = ["🔴 Urgent", "🟡 Moderate", "🟢 Low"];

// Mock Data Builders
const MOCK_ADMIN: User = {
  uid: 'admin1',
  name: 'Admin',
  email: ADMIN_EMAIL,
  role: 'admin',
  createdAt: Date.now()
};

const MOCK_ALUMNI: User = {
  uid: 'alumni1',
  name: 'Sandeep R.',
  email: 'sandeep@shaalevikas.com',
  role: 'alumni',
  profilePhotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
  createdAt: Date.now()
};

const INITIAL_NEEDS: Need[] = [
  {
    id: 'n1',
    title: 'Repair Leaking Roof',
    description: 'The primary building has significant roof damage causing leaks during monsoon. This impacts three classrooms and the computer lab.',
    category: '🔧 Repair',
    costEstimate: 15000,
    amountPledged: 10800,
    priority: '🔴 Urgent',
    status: 'Active',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1635427333045-89f5a01f5c6e?w=800&q=80',
    afterPhotoUrl: '',
    endDate: Date.now() + 86400000 * 30,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'n2',
    title: 'Smart Classroom Setup',
    description: 'Procuring a smart TV and digital teaching aids for high school sections.',
    category: '💡 Electrical',
    costEstimate: 130000,
    amountPledged: 85000,
    priority: '🟡 Moderate',
    status: 'Active',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
    afterPhotoUrl: '',
    endDate: Date.now() + 86400000 * 45,
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 'n3',
    title: 'New Sanitation Block',
    description: 'A completed project to build a new sanitation block for the school.',
    category: '🚽 Sanitation',
    costEstimate: 250000,
    amountPledged: 250000,
    priority: '🟢 Low',
    status: 'Completed',
    beforePhotoUrl: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=800&q=80',
    afterPhotoUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80',
    endDate: Date.now() - 86400000 * 30,
    createdAt: Date.now() - 86400000 * 60,
  }
];

const MOCK_PLEDGES: Donor[] = [
  {
    id: 'p1',
    name: 'Anita Sharma',
    email: 'anita@example.com',
    pledgeAmount: 1250000,
    needId: 'n2',
    needTitle: 'Smart Classroom Setup',
    paymentMethod: 'Wire Transfer',
    transactionId: 'TXN10001',
    pledgedAt: Date.now() - 86400000 * 10
  },
  {
    id: 'p2',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    pledgeAmount: 820000,
    needId: 'n2',
    needTitle: 'Smart Classroom Setup',
    paymentMethod: 'Bank Transfer',
    transactionId: 'TXN10002',
    pledgedAt: Date.now() - 86400000 * 8
  },
  {
    id: 'p3',
    name: 'Siddharth M.',
    email: 'sid@example.com',
    pledgeAmount: 540000,
    needId: 'n1',
    needTitle: 'Repair Leaking Roof',
    paymentMethod: 'Credit Card',
    transactionId: 'TXN10003',
    pledgedAt: Date.now() - 86400000 * 5
  },
  {
    id: 'p4',
    name: 'Ravi Kumar',
    email: 'ravi@example.com',
    pledgeAmount: 50000,
    needId: 'n1',
    needTitle: 'Repair Leaking Roof',
    paymentMethod: 'UPI',
    transactionId: 'TXN10004',
    pledgedAt: Date.now() - 86400000 * 2
  },
  {
    id: 'p5',
    name: 'Meena Sharma',
    email: 'meena@example.com',
    pledgeAmount: 25000,
    needId: 'n1',
    needTitle: 'Repair Leaking Roof',
    paymentMethod: 'UPI',
    transactionId: 'TXN10005',
    pledgedAt: Date.now() - 3600000
  },
  {
    id: 'p6',
    name: 'Priyanka Chopra',
    email: 'pri@example.com',
    pledgeAmount: 150000,
    needId: 'n2',
    needTitle: 'Smart Classroom Setup',
    paymentMethod: 'UPI',
    transactionId: 'TXN10006',
    pledgedAt: Date.now() - 7200000
  }
];

export default function App() {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('sv_users');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.WELCOME);
  const [needs, setNeeds] = useState<Need[]>(INITIAL_NEEDS);
  const [pledges, setPledges] = useState<Donor[]>(MOCK_PLEDGES);
  const [selectedNeed, setSelectedNeed] = useState<Need | null>(null);
  const [selectedPledge, setSelectedPledge] = useState<Donor | null>(null);
  const [selectedDonor, setSelectedDonor] = useState<string | null>(null);
  const [pledgeData, setPledgeData] = useState<{ amount: number; method: string; donorName: string }>({ 
    amount: 0, 
    method: 'UPI', 
    donorName: '' 
  });

  useEffect(() => {
    localStorage.setItem('sv_users', JSON.stringify(users));
  }, [users]);

  const isAdmin = currentUser?.role === 'admin';

  const navigate = (screen: Screen, params?: any) => {
    if (params && 'need' in params) setSelectedNeed(params.need);
    if (params && 'pledge' in params) {
       setSelectedPledge(params.pledge);
       setPledgeData(params.pledge);
    }
    if (params && 'donorEmail' in params) {
       setSelectedDonor(params.donorEmail);
    }
    setCurrentScreen(screen);
    window.scrollTo(0, 0);
  };

  const handleLogin = (email: string, pass: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    // Basic credential check (in a real app, hash password)
    if (user) {
      if (user.password && user.password !== pass) {
        throw new Error("Invalid password.");
      }
      setCurrentUser(user);
      navigate(user.role === 'admin' ? Screen.ADMIN_DASHBOARD : Screen.ALUMNI_DASHBOARD);
    } else if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
       // Automatic fallback for default admin if not in users list yet
       setCurrentUser(MOCK_ADMIN);
       navigate(Screen.ADMIN_DASHBOARD);
    } else {
       throw new Error("User not found. Please register first.");
    }
  };

  const handleRegister = (name: string, email: string, pass: string, role: 'admin' | 'alumni', extra?: Partial<User>) => {
    if (users.find(u => u.email === email)) {
      throw new Error("Email already registered.");
    }
    const newUser: User = {
      uid: 'u' + Date.now(),
      name,
      email,
      password: pass,
      role,
      ...extra,
      createdAt: Date.now()
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    navigate(role === 'admin' ? Screen.ADMIN_DASHBOARD : Screen.ALUMNI_DASHBOARD);
  };

  const handleDeleteNeed = (id: string) => {
    setNeeds(prev => prev.filter(n => n.id !== id));
    setSelectedNeed(null);
    return true;
  };

  const handleUpdateNeed = (updatedNeed: Need) => {
    setNeeds(needs.map(n => n.id === updatedNeed.id ? updatedNeed : n));
    navigate(Screen.ADMIN_DASHBOARD);
  };

  const handleUpdateUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.uid === updatedUser.uid ? updatedUser : u));
  };

  const handleGoogleLogin = () => {
    // Simulate Google Account Picker
    const fakeAccounts = [
      { name: 'Prajwal J.', email: 'prajwaljathan9@gmail.com' },
      { name: 'Sandeep R.', email: 'sandeep@shaalevikas.com' }
    ];
    
    // In a real app, this would be an OAuth popup
    alert("Google Account Picker Simulation:\n" + fakeAccounts.map(a => `${a.name} (${a.email})`).join('\n'));
    
    // Auto-login with first one for demo
    handleLogin(fakeAccounts[0].email, 'password');
  };

  const handleSkip = () => {
    navigate(Screen.CHOOSE_PATH);
  };

  const handleConfirmPledge = () => {
    if (!selectedNeed) return;
    
    const newPledge: Donor = {
      id: 'p' + Date.now(),
      name: pledgeData.donorName,
      email: currentUser?.email || 'guest@example.com',
      pledgeAmount: pledgeData.amount,
      needId: selectedNeed.id,
      needTitle: selectedNeed.title,
      paymentMethod: pledgeData.method,
      transactionId: `TXN${Date.now().toString().slice(-8)}`,
      pledgedAt: Date.now()
    };

    setPledges(prev => [...prev, newPledge]);
    
    const updatedAmt = selectedNeed.amountPledged + pledgeData.amount;
    const isCompleted = updatedAmt >= selectedNeed.costEstimate;

    setNeeds(prev => prev.map(n => n.id === selectedNeed.id 
      ? { ...n, amountPledged: updatedAmt, status: isCompleted ? 'Completed' : n.status } 
      : n
    ));
    setSelectedNeed(prev => prev 
      ? { ...prev, amountPledged: updatedAmt, status: isCompleted ? 'Completed' : prev.status } 
      : null
    );
    
    navigate(Screen.SUCCESS);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.WELCOME:
        return <WelcomeScreen onLogin={() => navigate(Screen.LOGIN)} onRegister={() => navigate(Screen.REGISTER)} onGuest={() => navigate(Screen.CHOOSE_PATH)} />;
      case Screen.CHOOSE_PATH:
        return <ChoosePathScreen onBack={() => navigate(Screen.WELCOME)} onSelect={(role) => {
          setCurrentUser(role === 'admin' ? MOCK_ADMIN : MOCK_ALUMNI);
          navigate(role === 'admin' ? Screen.ADMIN_DASHBOARD : Screen.ALUMNI_DASHBOARD);
        }} />;
      case Screen.LOGIN: 
        return <LoginScreen 
          onLogin={handleLogin} 
          onBack={() => navigate(Screen.WELCOME)} 
          onRegister={() => navigate(Screen.REGISTER)} 
          onSkip={handleSkip} 
          onGoogleLogin={handleGoogleLogin} 
          onForgotPassword={() => navigate(Screen.FORGOT_PASSWORD)}
        />;
      case Screen.REGISTER: 
        return <RegisterScreen onBack={() => navigate(Screen.LOGIN)} onRegister={handleRegister} />;
      case Screen.ADMIN_DASHBOARD: 
        return <AdminDashboard user={currentUser!} needs={needs} pledges={pledges} onNavigate={navigate} onDeleteNeed={handleDeleteNeed} />;
      case Screen.ADMIN_PLEDGE_DETAIL:
        return <AdminPledgeDetailScreen pledge={selectedPledge!} onBack={() => navigate(Screen.ADMIN_DASHBOARD)} />;
      case Screen.ALUMNI_DASHBOARD: 
        return <AlumniDashboard user={currentUser!} needs={needs} pledges={pledges} onNavigate={navigate} />;
      case Screen.HISTORY:
        return <HistoryScreen needs={needs} isAdmin={isAdmin} onBack={() => navigate(isAdmin ? Screen.ADMIN_DASHBOARD : Screen.ALUMNI_DASHBOARD)} onNavigate={navigate} onDeleteNeed={handleDeleteNeed} />;
      case Screen.NEED_DETAIL: 
        return <NeedDetailScreen 
          need={selectedNeed!} 
          isAdmin={isAdmin} 
          onBack={() => navigate(isAdmin ? Screen.ADMIN_DASHBOARD : Screen.ALUMNI_DASHBOARD)} 
          onNavigate={navigate}
          onDeleteNeed={handleDeleteNeed}
          onUpdateNeed={handleUpdateNeed}
        />;
      case Screen.ACTIVE_NEEDS:
        return <ActiveNeedsScreen needs={needs} isAdmin={isAdmin} onBack={() => navigate(isAdmin ? Screen.ADMIN_DASHBOARD : Screen.ALUMNI_DASHBOARD)} onNavigate={navigate} onDeleteNeed={handleDeleteNeed} />;
      case Screen.PLEDGE:
        return <PledgeScreen need={selectedNeed!} user={currentUser!} onBack={() => navigate(Screen.NEED_DETAIL)} onProceed={(pledge) => navigate(Screen.FAKE_PAYMENT, { pledge })} />;
      case Screen.FAKE_PAYMENT:
        return <FakePaymentScreen need={selectedNeed!} pledge={pledgeData} onBack={() => navigate(Screen.PLEDGE)} onNext={(pledge) => navigate(Screen.CONFIRM_PLEDGE, { pledge })} />;
      case Screen.CONFIRM_PLEDGE:
        return <ConfirmPledgeScreen need={selectedNeed!} pledge={pledgeData} onBack={() => navigate(Screen.FAKE_PAYMENT)} onConfirm={handleConfirmPledge} />;
      case Screen.SUCCESS:
        return <SuccessScreen pledge={pledgeData} need={selectedNeed!} onBack={() => navigate(Screen.ALUMNI_DASHBOARD)} />;
      case Screen.FORGOT_PASSWORD:
        return <ForgotPasswordScreen onBack={() => navigate(Screen.LOGIN)} />;
      case Screen.SEARCH:
        return <SearchScreen needs={needs} pledges={pledges} onBack={() => navigate(isAdmin ? Screen.ADMIN_DASHBOARD : Screen.ALUMNI_DASHBOARD)} onNavigate={navigate} />;
      case Screen.PROFILE:
        return <EditProfileScreen user={currentUser!} onBack={() => navigate(isAdmin ? Screen.ADMIN_DASHBOARD : Screen.ALUMNI_DASHBOARD)} onLogout={() => { setCurrentUser(null); navigate(Screen.LOGIN); }} onUpdate={handleUpdateUser} />;
      case Screen.ADMIN_ADD_NEED:
        return <AdminAddEditNeedScreen existingNeed={selectedNeed} onBack={() => navigate(Screen.ADMIN_DASHBOARD)} onSave={(need) => { 
          if (needs.find(n => n.id === need.id)) {
            setNeeds(needs.map(n => n.id === need.id ? need : n));
          } else {
            setNeeds([need, ...needs]); 
          }
          navigate(Screen.ADMIN_DASHBOARD); 
        }} />;
      case Screen.ADMIN_TOTAL_PLEDGED:
        return <AdminTotalPledgedScreen pledges={pledges} onBack={() => navigate(Screen.ADMIN_DASHBOARD)} onNavigate={navigate} />;
      case Screen.ADMIN_DONORS:
        return <AdminDonorsListScreen pledges={pledges} onBack={() => navigate(Screen.ADMIN_DASHBOARD)} onNavigate={navigate} />;
      case Screen.ADMIN_DONOR_DETAIL:
        return <AdminDonorDetailScreen 
          donorEmail={selectedDonor!} 
          pledges={pledges} 
          onBack={() => navigate(isAdmin ? Screen.ADMIN_DONORS : Screen.HALL_OF_FAME)} 
        />;
      case Screen.ADMIN_PLEDGES_LIST:
        return <AdminPledgesListScreen pledges={pledges} onBack={() => navigate(Screen.ADMIN_DASHBOARD)} onNavigate={navigate} />;
      case Screen.ADMIN_CLOSE_NEED:
        return <AdminCloseNeedScreen need={selectedNeed!} onBack={() => navigate(Screen.NEED_DETAIL)} onClose={() => { setNeeds(needs.map(n => n.id === selectedNeed?.id ? {...n, status: 'Closed'} : n)); navigate(Screen.ADMIN_DASHBOARD); }} />;
      case Screen.NOTIFICATIONS:
        return <NotificationsScreen onBack={() => navigate(isAdmin ? Screen.ADMIN_DASHBOARD : Screen.ALUMNI_DASHBOARD)} onNavigate={navigate} />;
      case Screen.HALL_OF_FAME:
        return <HallOfFameScreen pledges={pledges} onBack={() => navigate(isAdmin ? Screen.ADMIN_DASHBOARD : Screen.ALUMNI_DASHBOARD)} onNavigate={navigate} />;
      case Screen.HISTORY:
        return <HistoryScreen needs={needs} isAdmin={isAdmin} onBack={() => navigate(isAdmin ? Screen.ADMIN_DASHBOARD : Screen.ALUMNI_DASHBOARD)} onNavigate={navigate} />;
      case Screen.MY_PLEDGES:
        return <MyPledgesScreen needs={needs} pledges={pledges} user={currentUser!} onBack={() => navigate(Screen.ALUMNI_DASHBOARD)} onNavigate={navigate} />;
      case Screen.IMPACT_GALLERY:
        return <ImpactGalleryScreen onBack={() => navigate(Screen.ALUMNI_DASHBOARD)} />;
      default: 
        return <div className="p-10 text-center">Screen {currentScreen} coming soon...</div>;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-bg-cream flex flex-col font-sans relative overflow-x-hidden">
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {![Screen.WELCOME, Screen.CHOOSE_PATH, Screen.LOGIN, Screen.REGISTER, Screen.SUCCESS, Screen.FAKE_PAYMENT, Screen.CONFIRM_PLEDGE].includes(currentScreen) && (
        <AppBottomNavBar currentScreen={currentScreen} onNavigate={navigate} isAdmin={isAdmin} />
      )}
    </div>
  );
}

// --- COMPONENTS ---

function AppBottomNavBar({ currentScreen, onNavigate, isAdmin }: { currentScreen: Screen, onNavigate: (s: Screen) => void, isAdmin: Boolean }) {
  const tabs = [
    { id: isAdmin ? Screen.ADMIN_DASHBOARD : Screen.ALUMNI_DASHBOARD, icon: Home, label: 'Dashboard' },
    { id: Screen.ACTIVE_NEEDS, icon: ListIcon, label: 'Needs' },
    { id: Screen.HALL_OF_FAME, icon: Trophy, label: 'Fame' },
    { id: Screen.PROFILE, icon: UserIcon, label: 'Profile' }
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-divider-gray flex justify-around items-center px-4 py-2 z-50">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onNavigate(tab.id as Screen)}
          className={`flex flex-col items-center py-1 flex-1 transition-colors ${currentScreen === tab.id ? 'text-school-green' : 'text-text-gray'}`}
        >
          <div className={`p-1.5 rounded-xl ${currentScreen === tab.id ? 'bg-school-green-surface' : 'bg-transparent'}`}>
            <tab.icon size={22} strokeWidth={currentScreen === tab.id ? 2.5 : 2} />
          </div>
          <span className="text-[10px] font-bold mt-0.5 tracking-tight uppercase">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}

function StatCard({ label, value, icon: Icon, bgColor, iconColor, onClick, valueColor = "text-text-dark" }: { label: string, value: string, icon: any, bgColor: string, iconColor: string, onClick?: () => void, valueColor?: string }) {
  return (
    <div onClick={onClick} className={`p-6 rounded-[28px] bg-white border border-black/5 shadow-sm flex flex-col justify-between min-h-[150px] ${onClick ? 'cursor-pointer active:scale-95 transition-transform' : ''}`}>
      <div className={`w-10 h-10 rounded-xl ${bgColor} ${iconColor} flex items-center justify-center`}>
        <Icon size={20} strokeWidth={2.5} />
      </div>
      <div>
        <p className="text-[11px] font-bold text-text-gray uppercase tracking-widest mb-1.5 opacity-60">{label}</p>
        <p className={`text-3xl font-black ${valueColor} tracking-tighter`}>{value}</p>
      </div>
    </div>
  );
}

function NeedCard({ need, isAdmin, onNavigate, onDelete }: { need: Need, isAdmin: boolean, onNavigate: (s: Screen, p?: any) => void, onDelete?: (id: string) => void, key?: React.Key }) {
  const isUrgent = need.priority === '🔴 Urgent';
  const progress = Math.min((need.amountPledged / need.costEstimate) * 100, 100);
  const daysLeft = Math.ceil((need.endDate - Date.now()) / (1000 * 60 * 60 * 24));
  const displayDaysLeft = (daysLeft > 0 && need.status === 'Active') ? `${daysLeft} days left` : 'Expired';
  const addedDate = new Date(need.createdAt).toLocaleDateString();
  
  const formatCurrency = (amt: number) => {
    if (amt >= 100000) return `₹${(amt / 100000).toFixed(1)}L`;
    if (amt >= 1000) return `₹${(amt / 1000).toFixed(1)}K`;
    return `₹${amt}`;
  };

  return (
    <div 
      onClick={() => onNavigate(Screen.NEED_DETAIL, { need })}
      className="bg-white rounded-[32px] overflow-hidden border border-black/5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer mb-6"
    >
      <div className="relative h-48 w-full">
        <img 
          src={need.beforePhotoUrl || "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=800&q=80"} 
          alt={need.title}
          className="w-full h-full object-cover"
        />
        {isUrgent && (
          <div className="absolute top-4 left-4 bg-[#C0392B] text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg">
            Urgent
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 text-text-dark text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg border border-black/5">
          {addedDate}
        </div>
      </div>

      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-black text-text-dark leading-tight mb-1">{need.title}</h3>
          <p className="text-xs font-bold text-text-gray tracking-tight opacity-70">{need.category}</p>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-bold text-text-gray">{Math.round(progress)}% funded</span>
            <span className="text-xs font-black text-blue-700 uppercase tracking-tight">
              {formatCurrency(need.amountPledged)} / {formatCurrency(need.costEstimate)}
            </span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-school-green transition-all duration-1000"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-text-gray opacity-60">
            <Clock size={16} />
            <span className="text-xs font-bold">{displayDaysLeft}</span>
          </div>

          {isAdmin ? (
            <div className="flex gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onNavigate(Screen.ADMIN_ADD_NEED, { need }); }}
                className="text-school-green bg-school-green-surface p-2.5 rounded-xl flex items-center gap-1.5 font-black uppercase text-[10px] tracking-widest"
              >
                <Edit size={14} /> Edit
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete?.(need.id); }}
                className="text-urgent-red bg-urgent-red-surface p-2.5 rounded-xl flex items-center gap-1.5 font-black uppercase text-[10px] tracking-widest"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          ) : (
            need.status === 'Active' && (
              <button 
                onClick={(e) => { e.stopPropagation(); onNavigate(Screen.PLEDGE, { need }); }}
                className="bg-[#A43B0E] text-white px-8 py-3 rounded-2xl font-black text-sm shadow-lg shadow-[#A43B0E]/20 active:scale-95 transition-transform"
              >
                Pledge
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// --- SCREENS ---

function LoginScreen({ onLogin, onBack, onRegister, onSkip, onGoogleLogin, onForgotPassword }: { onLogin: (e: string, p: string) => void, onBack: () => void, onRegister: () => void, onSkip: () => void, onGoogleLogin: () => void, onForgotPassword: () => void }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!email || !pass) throw new Error("Please enter email and password");
      onLogin(email, pass);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-8 pt-12 pb-12 bg-white">
      <button onClick={onBack} className="text-school-green mb-8 flex items-center font-black uppercase text-[10px] tracking-widest gap-2">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-school-green-surface rounded-3xl flex items-center justify-center mx-auto mb-4 text-school-green">
           <Landmark size={40} />
        </div>
        <h1 className="text-4xl font-black text-school-green tracking-tighter underline underline-offset-8 decoration-alumni-orange">Shaale Vikas</h1>
        <p className="text-text-gray text-[10px] font-black uppercase tracking-[4px] mt-4 opacity-70">An Alumni Bridging Platform</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="space-y-1.5">
          <input 
            value={email}
            onChange={e => { setEmail(e.target.value); setError(''); }}
            placeholder="Enter your email" 
            className="w-full px-6 py-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl focus:border-blue-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400" 
          />
        </div>

        <div className="space-y-1.5">
          <div className="relative">
            <input 
              type={showPass ? "text" : "password"}
              value={pass}
              onChange={e => { setPass(e.target.value); setError(''); }}
              placeholder="Enter your password" 
              className="w-full px-6 py-4 bg-[#F8FAFC] border border-slate-200 rounded-2xl focus:border-blue-500 outline-none transition-all font-medium text-slate-900 placeholder:text-slate-400" 
            />
            <button 
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="text-right">
             <button type="button" onClick={onForgotPassword} className="text-xs font-bold text-slate-500 hover:text-blue-600">Forgot Password?</button>
          </div>
        </div>

        {error && <p className="text-urgent-red text-xs font-black text-center bg-urgent-red-surface/30 py-2 rounded-xl border border-urgent-red/10">{error}</p>}

        <button 
          type="submit"
          className="w-full bg-[#1e293b] text-white py-5 rounded-2xl font-black text-lg shadow-xl active:scale-[0.98] transition-all"
        >
          Login
        </button>

        <div className="relative py-4">
           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
           <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-500 font-bold">Or Login with</span></div>
        </div>

        <button 
          type="button"
          onClick={onGoogleLogin}
          className="w-full bg-white border border-slate-200 text-slate-700 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-slate-50 transition-all shadow-sm"
        >
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="Google" />
          Google
        </button>
      </form>

      <div className="mt-auto pt-10 text-center">
        <p className="text-sm font-medium text-slate-500">
          Don't have an account? <button onClick={onRegister} className="text-blue-600 font-black hover:underline ml-1">Register Now</button>
        </p>
      </div>
    </div>
  );
}

function WelcomeScreen({ onLogin, onRegister, onGuest }: { onLogin: () => void, onRegister: () => void, onGuest: () => void }) {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-hidden">
      <div className="flex-1 relative">
        <img 
          src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80" 
          alt="Welcome" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20"></div>
      </div>
      
      <div className="px-8 pb-12 pt-8 flex flex-col gap-4">
        <button 
          onClick={onLogin}
          className="w-full bg-[#1e293b] text-white py-5 rounded-2xl font-black text-lg shadow-xl active:scale-[0.98] transition-all"
        >
          Login
        </button>
        <button 
          onClick={onRegister}
          className="w-full bg-white border-2 border-slate-200 text-[#1e293b] py-5 rounded-2xl font-black text-lg active:scale-[0.98] transition-all"
        >
          Register
        </button>
        
        <button 
          onClick={onGuest}
          className="mt-4 text-center text-[#26A69A] font-black text-sm hover:underline"
        >
          Continue as a guest
        </button>
      </div>
    </div>
  );
}

function ChoosePathScreen({ onSelect, onBack }: { onSelect: (role: 'admin' | 'alumni') => void, onBack: () => void }) {
  return (
    <div className="min-h-screen bg-[#FBF9F4] px-8 py-12 flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-black text-text-dark tracking-tighter mb-2">CHOOSE YOUR PATH</h1>
        <p className="text-text-gray text-sm font-medium opacity-70">How would you like to enter the hub today?</p>
      </div>

      <div className="w-full space-y-6 flex-1 flex flex-col justify-center">
        <button 
          onClick={() => onSelect('alumni')}
          className="w-full bg-white p-8 rounded-[40px] border-2 border-text-dark shadow-sm active:scale-[0.98] transition-all flex flex-col items-center gap-6 group"
        >
          <div className="w-20 h-20 bg-alumni-orange-surface text-alumni-orange rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Heart size={40} strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black text-text-dark mb-1">ENTER AS ALUMNI</h2>
            <p className="text-[10px] font-black text-text-gray uppercase tracking-widest opacity-60">Browse Needs & Support Projects</p>
          </div>
        </button>

        <button 
          onClick={() => onSelect('admin')}
          className="w-full bg-white p-8 rounded-[40px] border-2 border-text-dark shadow-sm active:scale-[0.98] transition-all flex flex-col items-center gap-6 group"
        >
          <div className="w-20 h-20 bg-school-green-surface text-school-green rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <ShieldCheck size={40} strokeWidth={2.5} />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black text-text-dark mb-1">ENTER AS ADMIN</h2>
            <p className="text-[10px] font-black text-text-gray uppercase tracking-widest opacity-60">Manage School Records & Needs</p>
          </div>
        </button>
      </div>

      <button onClick={onBack} className="mt-12 text-sm font-black text-text-gray uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity">
        Back to Login
      </button>
    </div>
  );
}

function ForgotPasswordScreen({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white p-8 flex flex-col justify-center items-center text-center">
        <div className="w-20 h-20 bg-school-green-surface rounded-full flex items-center justify-center text-school-green mb-6">
          <Mail size={40} />
        </div>
        <h2 className="text-2xl font-black text-text-dark mb-2">Check your email</h2>
        <p className="text-text-gray mb-8">We've sent a password reset link to <br/><span className="font-bold text-text-dark">{email}</span></p>
        <button 
          onClick={onBack}
          className="w-full bg-[#1e293b] text-white py-5 rounded-2xl font-black text-lg shadow-xl"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col">
      <button onClick={onBack} className="p-2 -ml-2 mb-8 text-text-dark self-start">
        <ArrowLeft size={24} />
      </button>

      <div className="mb-10 text-center">
        <div className="w-20 h-20 bg-school-green-surface rounded-[28px] flex items-center justify-center text-school-green mx-auto mb-6">
          <Key size={40} />
        </div>
        <h1 className="text-3xl font-black text-text-dark tracking-tight mb-2">Forgot Password?</h1>
        <p className="text-text-gray font-medium">No worries, it happens. Enter your email to reset your password.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 flex-1">
        <div className="space-y-2">
          <label className="text-[10px] font-black text-text-gray uppercase tracking-widest ml-1 opacity-60">Email Address</label>
          <input 
            type="email" 
            required 
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-slate-50 border border-slate-100 p-5 rounded-2xl text-lg font-bold outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            placeholder="Enter your email"
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-[#1e293b] text-white py-5 rounded-2xl font-black text-lg shadow-xl active:scale-[0.98] transition-all"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

function RegisterScreen({ onBack, onRegister }: { onBack: () => void, onRegister: (name: string, email: string, pass: string, role: 'admin' | 'alumni', extra?: Partial<User>) => void }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [batch, setBatch] = useState('');
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [role, setRole] = useState<'alumni' | 'admin'>('alumni');
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!name || !email || !pass || !phone || !orgName) throw new Error("Please fill all fields");
      if (role === 'alumni' && !batch) throw new Error("Please fill your batch year");
      if (pass !== confirmPass) throw new Error("Passwords do not match");
      if (pass.length < 8) throw new Error("Password must be at least 8 characters");
      if (!agreed) throw new Error("You must agree to the Terms & Conditions");
      
      onRegister(name, email, pass, role, { phone, orgName, batch });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen px-8 pt-12 pb-20 flex flex-col bg-[#F8FAFC]">
      <button onClick={onBack} className="text-school-green mb-8 flex items-center font-black uppercase text-[10px] tracking-widest gap-2">
        <ArrowLeft size={16} /> Back to Login
      </button>
      
      <div className="mb-8">
        <h1 className="text-[32px] font-black text-text-dark mb-1 tracking-tight">Create an account</h1>
        <p className="text-slate-500 text-sm font-medium">Alumni network into a Support System.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 flex-1">
        <div className="grid grid-cols-2 gap-3 mb-2">
           <button 
            type="button"
            onClick={() => setRole('alumni')}
            className={`py-4 rounded-2xl text-[10px] font-black tracking-widest border-2 transition-all ${role === 'alumni' ? 'bg-alumni-orange border-alumni-orange text-white shadow-lg shadow-alumni-orange/20' : 'bg-white border-divider-gray text-text-gray'}`}
           >
             Alumni
           </button>
           <button 
            type="button"
            onClick={() => setRole('admin')}
            className={`py-4 rounded-2xl text-[10px] font-black tracking-widest border-2 transition-all ${role === 'admin' ? 'bg-school-green border-school-green text-white shadow-lg shadow-school-green/20' : 'bg-white border-divider-gray text-text-gray'}`}
           >
             Admin
           </button>
        </div>

        <div className="space-y-1.5">
           <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
           <input 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400" 
            placeholder="Full Name" 
           />
        </div>

        <div className="space-y-1.5">
           <label className="text-sm font-bold text-slate-700 ml-1">Mobile Number</label>
           <div className="flex gap-2">
              <input 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                className="flex-1 min-w-0 px-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400 text-sm" 
                placeholder="Enter 10 digit number" 
              />
              <button 
                type="button"
                onClick={() => setOtpSent(true)}
                className="shrink-0 bg-blue-600 text-white px-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-1.5 active:scale-95 transition-transform whitespace-nowrap"
              >
                <Smartphone size={14} /> {otpSent ? 'Resend' : 'Send OTP'}
              </button>
           </div>
           {otpSent && <p className="text-[10px] font-black text-school-green uppercase tracking-widest ml-1 animate-pulse">OTP Sent to your mobile</p>}
        </div>

        <div className="space-y-1.5">
           <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
           <input 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400" 
            placeholder="name@example.com" 
           />
        </div>

        <div className="space-y-1.5">
           <label className="text-sm font-bold text-slate-700 ml-1">School/College/Organisation Name</label>
           <input 
            value={orgName} 
            onChange={e => setOrgName(e.target.value)} 
            className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400" 
            placeholder="Enter Name" 
           />
        </div>

        {role === 'alumni' && (
          <div className="space-y-1.5">
             <label className="text-sm font-bold text-slate-700 ml-1">Batch</label>
             <input 
              value={batch} 
              onChange={e => setBatch(e.target.value)} 
              className="w-full px-5 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400" 
              placeholder="2018" 
             />
          </div>
        )}

        <div className="space-y-1.5">
           <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
           <div className="relative">
              <input 
                type={showPass ? "text" : "password"} 
                value={pass} 
                onChange={e => setPass(e.target.value)} 
                className="w-full pl-5 pr-14 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400" 
                placeholder="Minimum 8 characters" 
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
           </div>
        </div>

        <div className="space-y-1.5">
           <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
           <div className="relative">
              <input 
                type={showConfirmPass ? "text" : "password"} 
                value={confirmPass} 
                onChange={e => setConfirmPass(e.target.value)} 
                className="w-full pl-5 pr-14 py-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-slate-900 placeholder:text-slate-400" 
                placeholder="Confirm your password" 
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
           </div>
        </div>

        <div className="flex items-center gap-3 py-2">
           <button 
            type="button" 
            onClick={() => setAgreed(!agreed)}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${agreed ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}
           >
             {agreed && <CheckCircle2 size={14} className="text-white" />}
           </button>
           <p className="text-sm font-medium text-slate-600">
             I agree to the <span className="text-blue-600 font-bold underline cursor-pointer">Terms & Conditions</span>
           </p>
        </div>
        
        {error && <p className="text-urgent-red text-xs font-black text-center bg-urgent-red-surface/30 py-2 rounded-xl border border-urgent-red/10">{error}</p>}

        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-[#94A3B8] hover:bg-blue-600 active:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg shadow-lg transition-all tracking-widest"
            style={{ backgroundColor: agreed && name && email && pass ? '#2563eb' : '#94A3B8' }}
          >
            Register
          </button>
          
          <button 
            type="button"
            onClick={onBack}
            className="w-full mt-6 text-center text-sm font-medium text-slate-500"
          >
            Already have an account? <span className="text-blue-600 font-bold hover:underline">Login Now</span>
          </button>
        </div>
      </form>
    </div>
  );
}


function AlumniDashboard({ user, needs, pledges, onNavigate }: { user: User, needs: Need[], pledges: Donor[], onNavigate: (s: Screen, p?: any) => void }) {
  const userPledges = pledges.filter(p => p.email === user.email);
  const totalPledgedAmt = userPledges.reduce((acc, p) => acc + p.pledgeAmount, 0);
  const needsSupported = new Set(userPledges.map(p => p.needId)).size;
  const activeCount = needs.filter(n => n.status === 'Active').length;
  const completedCount = needs.filter(n => n.status === 'Closed' || n.status === 'Completed').length;
  
  const formatValue = (amt: number) => {
    if (amt >= 100000) return `₹${(amt / 100000).toFixed(1)}L`;
    if (amt >= 1000) return `₹${(amt / 1000).toFixed(1)}K`;
    return `₹${amt}`;
  };

  const sortedNeeds = [...needs].filter(n => n.status === 'Active').sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-text-gray text-xs font-bold uppercase tracking-widest">Welcome,</p>
          <h1 className="text-2xl font-black text-school-green tracking-tight">{user.name}</h1>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onNavigate(Screen.SEARCH)}
            className="w-12 h-12 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center text-text-gray active:scale-95 transition-transform"
          >
            <Search size={22} />
          </button>
          <button 
            onClick={() => onNavigate(Screen.NOTIFICATIONS)}
            className="w-12 h-12 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center text-school-green active:scale-95 transition-transform"
          >
            <Bell size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <StatCard label="Needs Supported" value={needsSupported.toString()} icon={Home} bgColor="bg-school-green-surface" iconColor="text-school-green" onClick={() => onNavigate(Screen.MY_PLEDGES)} />
        <StatCard label="Total Pledged" value={formatValue(totalPledgedAmt)} icon={Heart} bgColor="bg-alumni-orange-surface" iconColor="text-alumni-orange" onClick={() => onNavigate(Screen.MY_PLEDGES)} />
        <StatCard label="Active Needs" value={activeCount.toString()} icon={ClipboardList} bgColor="bg-blue-50" iconColor="text-progress-blue" onClick={() => onNavigate(Screen.ACTIVE_NEEDS)} />
        <StatCard label="Completed" value={completedCount.toString()} icon={CheckCircle2} bgColor="bg-teal-50" iconColor="text-teal-600" onClick={() => onNavigate(Screen.HISTORY)} />
      </div>

      <div className="space-y-6">
        <div className="flex justify-between items-end">
           <h2 className="text-xl font-black text-text-dark tracking-tight">Active School Needs</h2>
           <button onClick={() => onNavigate(Screen.ACTIVE_NEEDS)} className="text-school-green text-xs font-black uppercase tracking-widest mb-1">View All</button>
        </div>
        
        <div className="space-y-4">
          {sortedNeeds.map(need => (
            <NeedCard key={need.id} need={need} isAdmin={false} onNavigate={onNavigate} />
          ))}
        </div>
      </div>

      <div 
        onClick={() => onNavigate(Screen.HALL_OF_FAME)}
        className="mt-10 p-6 bg-alumni-orange rounded-3xl text-white relative overflow-hidden group border border-white/10 shadow-xl shadow-alumni-orange/10 cursor-pointer active:scale-[0.98] transition-transform"
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
        <h3 className="text-2xl font-black tracking-tight mb-2">Hall of Fame</h3>
        <p className="text-white/80 text-sm font-medium mb-6 leading-relaxed">Join the top contributors and leave your legacy at Shaale Vikas.</p>
        <button className="bg-white text-alumni-orange px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-black/5 flex items-center gap-2">
          View Leaderboard <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

function AdminDashboard({ user, needs, pledges, onNavigate, onDeleteNeed }: { user: User, needs: Need[], pledges: Donor[], onNavigate: (s: Screen, p?: any) => void, onDeleteNeed: (id: string) => any }) {
  const activeCount = needs.filter(n => n.status === 'Active').length;
  const completedCount = needs.filter(n => n.status === 'Closed' || n.status === 'Completed').length;
  
  const totalPledgedAmt = pledges.reduce((acc, p) => acc + p.pledgeAmount, 0);
  const totalDonors = new Set(pledges.map(p => p.email)).size;

  const formatValue = (amt: number) => {
    if (amt >= 100000) return `₹${(amt / 100000).toFixed(1)}L`;
    if (amt >= 1000) return `₹${(amt / 1000).toFixed(1)}K`;
    return `₹${amt}`;
  };

  const activeNeeds = [...needs].filter(n => n.status === 'Active').sort((a, b) => b.createdAt - a.createdAt);
  const latestNeeds = activeNeeds.slice(0, 2);

  return (
    <div className="p-6 pb-24 bg-[#FBF9F4] min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
           <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-md">
              <img src={user.profilePhotoUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&auto=format&fit=crop"} className="w-full h-full object-cover" />
           </div>
           <h2 className="text-xl font-black text-school-green tracking-tight">Shaale Vikas</h2>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onNavigate(Screen.SEARCH)}
            className="w-12 h-12 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center text-text-gray active:scale-95 transition-transform"
          >
            <Search size={22} />
          </button>
          <button 
            onClick={() => onNavigate(Screen.NOTIFICATIONS)}
            className="w-12 h-12 rounded-2xl bg-white border border-black/5 shadow-sm flex items-center justify-center text-school-green active:scale-95 transition-transform"
          >
            <Bell size={24} />
          </button>
        </div>
      </div>

      <div className="mb-8">
        <p className="text-text-gray font-medium text-lg leading-none mb-2">Welcome back, Admin</p>
        <h1 className="text-[34px] font-black text-text-dark tracking-tight leading-tight">Dashboard Overview</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard 
          label="ACTIVE NEEDS" 
          value={activeCount.toString()} 
          icon={ClipboardList} 
          bgColor="bg-school-green/10" 
          iconColor="text-school-green" 
          onClick={() => onNavigate(Screen.ACTIVE_NEEDS)}
        />
        <StatCard 
          label="TOTAL PLEDGED" 
          value={formatValue(totalPledgedAmt)} 
          icon={Wallet} 
          bgColor="bg-[#FFF4ED]" 
          iconColor="text-[#D45D1C]" 
          valueColor="text-[#A24411]"
          onClick={() => onNavigate(Screen.ADMIN_TOTAL_PLEDGED)}
        />
        <StatCard 
          label="COMPLETED" 
          value={completedCount.toString()} 
          icon={CheckCircle2} 
          bgColor="bg-teal-50" 
          iconColor="text-teal-600" 
          onClick={() => onNavigate(Screen.HISTORY)}
        />
        <StatCard 
          label="DONORS" 
          value={totalDonors.toString()} 
          icon={Users} 
          bgColor="bg-purple-50" 
          iconColor="text-purple-600" 
          onClick={() => onNavigate(Screen.ADMIN_DONORS)}
        />
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-black text-text-gray uppercase tracking-widest flex items-center gap-2">
            <Bell size={14} className="text-alumni-orange" /> Recent Pledges
          </h3>
          <button 
            onClick={() => onNavigate(Screen.ADMIN_PLEDGES_LIST)} 
            className="text-school-green text-[10px] font-black uppercase tracking-widest hover:opacity-70 transition-opacity"
          >
            View All
          </button>
        </div>
        <div className="space-y-4">
           {MOCK_PLEDGES.slice(0, 3).map(pledge => (
             <div 
              key={pledge.id} 
              onClick={() => onNavigate(Screen.ADMIN_PLEDGE_DETAIL, { pledge })}
              className="flex items-center gap-4 bg-white p-5 rounded-[28px] border border-black/5 active:scale-[0.98] transition-transform cursor-pointer shadow-sm"
             >
               <div className="w-12 h-12 rounded-2xl bg-alumni-orange-surface text-alumni-orange flex items-center justify-center font-black">
                 {pledge.name.split(' ').map(n => n[0]).join('')}
               </div>
               <div className="flex-1">
                 <p className="text-sm font-bold text-text-dark leading-none mb-1.5">{pledge.name} pledged ₹{pledge.pledgeAmount}</p>
                 <p className="text-[10px] text-text-gray font-bold uppercase tracking-widest">{pledge.needTitle} • 2m ago</p>
               </div>
               <ChevronRight size={18} className="text-text-gray opacity-30" />
             </div>
           ))}
        </div>
      </div>

      <div className="space-y-6 pb-20">
        <div className="flex justify-between items-end">
           <h2 className="text-xl font-black text-text-dark tracking-tight">Latest Active Needs</h2>
           <button onClick={() => onNavigate(Screen.ACTIVE_NEEDS)} className="text-school-green text-xs font-black uppercase tracking-widest mb-1">View All</button>
        </div>
        
        <div className="space-y-4">
          {latestNeeds.map(need => (
             <NeedCard key={need.id} need={need} isAdmin={true} onNavigate={onNavigate} onDelete={onDeleteNeed} />
          ))}
        </div>
      </div>

      <button 
        onClick={() => onNavigate(Screen.ADMIN_ADD_NEED, { need: null })}
        className="fixed bottom-24 right-6 w-16 h-16 bg-alumni-orange text-white rounded-full flex items-center justify-center shadow-2xl shadow-alumni-orange/40 z-50 hover:scale-110 active:scale-95 transition-all focus:outline-none"
      >
        <Plus size={32} />
      </button>
    </div>
  );
}

function NeedDetailScreen({ need, isAdmin, onBack, onNavigate, onDeleteNeed, onUpdateNeed }: { need: Need, isAdmin: boolean, onBack: () => void, onNavigate: (s: Screen, p?: any) => void, onDeleteNeed?: (id: string) => any, onUpdateNeed?: (n: Need) => void }) {
  const afterFileInputRef = useRef<HTMLInputElement>(null);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  const handleAfterPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpdateNeed) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateNeed({
          ...need,
          afterPhotoUrl: reader.result as string,
          status: 'Closed' // Automatically close if after photo is uploaded
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const isUrgent = need.priority?.includes('Urgent');

  return (
    <div className="pb-10 min-h-screen bg-bg-cream">
      <div className="relative h-80">
        {need.beforePhotoUrl ? (
          <img src={need.beforePhotoUrl} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-200 flex items-center justify-center">
            <ImageIcon size={48} className="text-text-gray opacity-20" />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <button onClick={onBack} className="absolute top-8 left-6 p-2 bg-black/20 backdrop-blur-md rounded-2xl text-white focus:scale-95 transition-transform z-20">
          <ArrowLeft size={24} />
        </button>
        <div className="absolute bottom-12 left-6 right-6 z-10 transition-all">
          {isUrgent && (
            <span className="px-3 py-1.5 bg-[#C0392B] text-white text-[10px] font-black rounded-lg uppercase tracking-widest mb-4 inline-block shadow-lg">Urgent</span>
          )}
          <h1 className="text-3xl font-black text-white leading-[1.1] drop-shadow-xl">{need.title}</h1>
        </div>
      </div>

      <div className="p-6 -mt-12 bg-[#FBF9F4] rounded-t-[40px] relative z-20 shadow-2xl pt-10">
        <div className="flex items-center gap-4 mb-8">
           <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-black/5 flex items-center justify-center text-school-green">
             <ClipboardList size={28} />
           </div>
           <div>
             <p className="text-[10px] font-black text-text-gray uppercase tracking-widest opacity-40">Category</p>
             <h4 className="font-black text-text-dark text-xl leading-none">{need.category || 'General Infrastructure'}</h4>
           </div>
        </div>

        <div className="mb-10">
           <p className="text-[10px] font-black text-text-gray uppercase tracking-widest opacity-40 mb-3">About this need</p>
           <p className="text-text-dark/80 text-base font-medium leading-relaxed">
             {need.description}
           </p>
        </div>

        <div className="bg-white p-8 rounded-[36px] border border-black/5 shadow-sm mb-10">
          <div className="flex justify-between items-center mb-6">
             <div className="space-y-1">
                <p className="text-[10px] font-black text-text-gray uppercase tracking-widest opacity-40">Total Target</p>
                <div className="flex items-baseline gap-1">
                   <span className="text-3xl font-black text-text-dark">₹{need.costEstimate.toLocaleString()}</span>
                </div>
             </div>
             <div className="text-right space-y-1">
                <p className="text-[10px] font-black text-text-gray uppercase tracking-widest opacity-40 text-blue-700">Raised Progress</p>
                <span className="text-2xl font-black text-blue-700">₹{need.amountPledged.toLocaleString()}</span>
             </div>
          </div>
          
          <div className="w-full h-4 bg-[#FBF9F4] rounded-full overflow-hidden mb-4 border border-black/5">
             <div className="h-full bg-school-green shadow-[0_0_10px_rgba(45,122,62,0.3)] transition-all duration-1000" style={{ width: `${Math.min((need.amountPledged/need.costEstimate)*100, 100)}%` }}></div>
          </div>
          
          <div className="flex justify-between items-center pt-2 border-t border-black/5">
            <span className="text-[11px] font-black text-text-gray uppercase tracking-widest opacity-60">{Math.round((need.amountPledged/need.costEstimate)*100)}% Funded</span>
            <span className="text-[11px] font-black text-blue-800 uppercase tracking-widest">₹{(need.costEstimate-need.amountPledged).toLocaleString()} Still Needed</span>
          </div>
        </div>

        {isAdmin ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => onNavigate(Screen.ADMIN_ADD_NEED, { need })}
                className="py-5 bg-white border-2 border-black/5 text-text-dark font-black rounded-[24px] uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
              >
                <Edit size={18} /> Edit
              </button>
              <button 
                onClick={() => {
                  if (onDeleteNeed && onDeleteNeed(need.id)) {
                    onBack();
                  }
                }}
                className="py-5 bg-white border-2 border-urgent-red/20 text-urgent-red font-black rounded-[24px] uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-urgent-red/5 active:scale-95 transition-all shadow-sm"
              >
                <Trash2 size={18} /> Delete
              </button>
            </div>
            
            <button 
              onClick={() => {
                if (onUpdateNeed) {
                  onUpdateNeed({ ...need, status: 'Closed' });
                  onBack();
                }
              }}
              className="w-full py-5 bg-white border-2 border-black font-black rounded-[24px] uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-black hover:text-white active:scale-95 transition-all shadow-md"
            >
              <CheckCircle2 size={18} /> Close Need
            </button>

            <input 
              type="file" 
              ref={afterFileInputRef} 
              onChange={handleAfterPhotoUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <button 
              onClick={() => afterFileInputRef.current?.click()}
              className="w-full py-6 bg-[#2D7A3E] text-white font-black rounded-[32px] uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-xl shadow-[#2D7A3E]/30 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Camera size={22} strokeWidth={2.5} /> Upload After Photo
            </button>
          </div>
        ) : (
          need.status === 'Active' && (
            <button 
              onClick={() => onNavigate(Screen.PLEDGE, { need })}
              className="w-full bg-[#E67E22] text-white py-6 rounded-[32px] font-black text-lg flex items-center justify-center gap-3 shadow-2xl shadow-[#E67E22]/30 active:scale-[0.98] transition-all uppercase tracking-widest"
            >
              <Heart size={24} fill="currentColor" />
              Pledge Support
            </button>
          )
        )}

        <div className="mt-14 space-y-6">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-text-dark uppercase tracking-widest opacity-60">Evidence Tracking</h3>
              <div className="h-px flex-1 bg-black/5 ml-4"></div>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                 <div 
                   onClick={() => need.beforePhotoUrl && setZoomImage(need.beforePhotoUrl)}
                   className="aspect-[4/5] bg-white rounded-3xl overflow-hidden relative border border-black/5 shadow-sm group cursor-zoom-in"
                 >
                    {need.beforePhotoUrl ? (
                      <img src={need.beforePhotoUrl} className="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-text-gray/20">
                        <ImageOff size={32} />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black text-white text-[8px] font-black rounded uppercase tracking-widest">Before</div>
                 </div>
                 <p className="text-[10px] font-bold text-text-gray text-center opacity-40">Initial Assessment</p>
              </div>

              <div className="space-y-2">
                 <div 
                   onClick={() => need.afterPhotoUrl && setZoomImage(need.afterPhotoUrl)}
                   className="aspect-[4/5] bg-white rounded-3xl overflow-hidden relative border border-black/5 shadow-sm group cursor-zoom-in"
                 >
                    {need.afterPhotoUrl ? (
                      <img src={need.afterPhotoUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50/50">
                        <div className="p-3 bg-white rounded-full shadow-sm">
                          <ImageIcon size={24} className="text-text-gray/30" />
                        </div>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 px-2 py-1 bg-school-green text-white text-[8px] font-black rounded uppercase tracking-widest">After</div>
                 </div>
                 <p className="text-[10px] font-bold text-text-gray text-center opacity-40">Final Impact</p>
              </div>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {zoomImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomImage(null)}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          >
            <button 
              onClick={() => setZoomImage(null)}
              className="absolute top-10 right-10 text-white p-4"
            >
              <Plus className="rotate-45" size={40} />
            </button>
            <motion.img 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={zoomImage} 
              className="max-w-full max-h-[80vh] rounded-2xl shadow-2xl" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActiveNeedsScreen({ needs, isAdmin, onBack, onNavigate, onDeleteNeed }: { needs: Need[], isAdmin: boolean, onBack: () => void, onNavigate: (s: Screen, p?: any) => void, onDeleteNeed?: (id: string) => any }) {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...CATEGORIES.map(c => c.split(' ').pop() as string)];
  
  const activeNeeds = [...needs]
    .filter(n => n.status === 'Active')
    .filter(n => filter === 'All' || n.category.includes(filter))
    .sort((a, b) => b.createdAt - a.createdAt);
  
  return (
    <div className="p-6 pb-20">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-school-green"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-black text-text-dark tracking-tight uppercase">Active Needs</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-4">
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap border-2 transition-all ${filter === cat ? 'bg-school-green border-school-green text-white' : 'bg-white border-divider-gray text-text-gray'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {activeNeeds.map(need => (
          <NeedCard key={need.id} need={need} isAdmin={isAdmin} onNavigate={onNavigate} onDelete={onDeleteNeed} />
        ))}
      </div>

      {isAdmin && (
        <button 
          onClick={() => onNavigate(Screen.ADMIN_ADD_NEED, { need: null })}
          className="fixed bottom-24 right-6 w-16 h-16 bg-alumni-orange text-white rounded-full flex items-center justify-center shadow-2xl shadow-alumni-orange/40 z-50 hover:scale-110 active:scale-95 transition-all focus:outline-none"
        >
          <Plus size={32} />
        </button>
      )}
    </div>
  );
}

function PledgeScreen({ need, user, onBack, onProceed }: { need: Need, user: User, onBack: () => void, onProceed: (p: any) => void }) {
  const [amount, setAmount] = useState('');
  
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-school-green"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-black text-text-dark tracking-tight uppercase">Make a Pledge</h1>
        <div className="w-6"></div>
      </div>

      <div className="p-4 bg-white rounded-3xl border border-divider-gray mb-8 flex items-center gap-4">
         <div className="w-12 h-12 rounded-2xl bg-school-green-surface text-school-green flex items-center justify-center flex-shrink-0">
           <Heart size={24} />
         </div>
         <div className="min-w-0">
            <h3 className="font-black text-text-dark truncate leading-none mb-1">{need.title}</h3>
            <span className="text-[10px] font-black text-text-gray uppercase tracking-widest">Still Needed: ₹{need.costEstimate - need.amountPledged}</span>
         </div>
      </div>

      <div className="space-y-6">
         <div className="space-y-2">
            <label className="text-xs font-black text-text-gray uppercase tracking-widest ml-1">Pledge Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-black text-school-green">₹</span>
              <input 
                type="number"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full pl-12 pr-6 py-6 bg-white border-2 border-divider-gray rounded-3xl outline-none focus:border-school-green text-3xl font-black transition-all"
              />
            </div>
         </div>

         <div className="grid grid-cols-4 gap-2">
            {[100, 500, 1000, 2000].map(amt => (
               <button 
                key={amt}
                onClick={() => setAmount(amt.toString())}
                className={`py-3 rounded-xl text-sm font-black transition-all ${amount === amt.toString() ? 'bg-school-green text-white' : 'bg-white border-2 border-divider-gray text-text-gray'}`}
               >
                 ₹{amt}
               </button>
            ))}
         </div>

         <div className="p-5 bg-alumni-orange-surface border-2 border-alumni-orange/10 rounded-3xl flex gap-4">
            <AlertCircle className="text-alumni-orange flex-shrink-0 mt-1" size={24} />
            <div>
              <p className="text-[11px] font-medium text-alumni-orange/80 leading-relaxed italic">
                By pledging, you agree to direct fund transfer protocols. 100% of your contribution reaches the school's developmental account.
              </p>
            </div>
         </div>

         <button 
           disabled={!amount || Number(amount) <= 0}
           onClick={() => onProceed({ amount: Number(amount), method: 'UPI', donorName: user.name })}
           className="w-full bg-alumni-orange text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-alumni-orange/20 mt-10 active:scale-95 transition-all disabled:opacity-50"
         >
           Proceed to Pay
         </button>
      </div>
    </div>
  );
}

function FakePaymentScreen({ pledge, need, onBack, onNext }: { pledge: any, need: Need, onBack: () => void, onNext: (p: any) => void }) {
  const [method, setMethod] = useState('UPI');
  
  const methods = [
    { id: 'UPI', icon: Smartphone, label: 'UPI', desc: 'shaalevikas@okaxis' },
    { id: 'Card', icon: CreditCard, label: 'Card', desc: 'Visa • Mastercard • RuPay' },
    { id: 'Bank', icon: Landmark, label: 'NetBanking', desc: 'All Major Indian Banks' }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-school-green"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-black text-text-dark tracking-tight uppercase">Secure Payment</h1>
        <div className="w-6"></div>
      </div>

      <div className="p-6 bg-white rounded-3xl border border-divider-gray shadow-sm mb-10 text-center">
         <p className="text-[10px] font-black text-text-gray uppercase tracking-widest mb-2">Amount to Pay</p>
         <h2 className="text-5xl font-black text-school-green tracking-tight">₹{pledge.amount}</h2>
         <p className="text-[11px] font-bold text-text-gray mt-4 italic">Supporting: {need.title}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-text-gray uppercase tracking-widest ml-1 mb-2">Select Method</h3>
        {methods.map(m => (
          <div 
            key={m.id}
            onClick={() => setMethod(m.id)}
            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex items-center gap-4 ${method === m.id ? 'bg-school-green-surface border-school-green' : 'bg-white border-divider-gray'}`}
          >
            <div className={`p-3 rounded-2xl ${method === m.id ? 'bg-school-green text-white' : 'bg-slate-50 text-text-gray'}`}>
              <m.icon size={24} />
            </div>
            <div className="flex-1">
              <h4 className="font-black text-text-dark leading-none mb-1">{m.label}</h4>
              <p className="text-[11px] font-bold text-text-gray uppercase tracking-widest">{m.desc}</p>
            </div>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === m.id ? 'bg-school-green border-school-green text-white' : 'border-divider-gray'}`}>
              {method === m.id && <CheckCircle2 size={16} />}
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={() => onNext({ ...pledge, method })}
        className="w-full bg-school-green text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-school-green/20 mt-12 active:scale-95 transition-all"
      >
        Pay ₹{pledge.amount} Now
      </button>
      
      <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-black text-text-gray uppercase tracking-widest">
         <ShieldCheck size={14} /> PCI-DSS Secure Encryption
      </div>
    </div>
  );
}

function ConfirmPledgeScreen({ pledge, need, onBack, onConfirm }: { pledge: any, need: Need, onBack: () => void, onConfirm: () => void }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      onConfirm();
    }, 2000);
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-10 gap-6 text-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 border-8 border-school-green-surface border-t-school-green rounded-full"
        />
        <h2 className="text-2xl font-black text-text-dark">Processing Pledge...</h2>
        <p className="text-text-gray font-bold uppercase tracking-widest text-xs">Connecting to Shaale Vikas Core</p>
      </div>
    );
  }

  return (
    <div className="p-6">
       <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-school-green"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-black text-text-dark tracking-tight uppercase">Confirm Review</h1>
        <div className="w-6"></div>
      </div>

      <div className="bg-white rounded-3xl border border-divider-gray overflow-hidden shadow-sm last:border-b-0">
        <div className="p-6 border-b border-divider-gray bg-slate-50">
           <p className="text-[10px] font-black text-text-gray uppercase tracking-widest mb-1">Project Need</p>
           <h2 className="text-xl font-black text-text-dark leading-tight">{need.title}</h2>
        </div>
        
        <div className="divide-y divide-divider-gray">
          {[
            ['Donor Name', pledge.donorName],
            ['Pledge Amount', `₹${pledge.amount}`],
            ['Payment Mode', pledge.method],
            ['Transaction ID', '—PENDING—'],
          ].map(([label, val]) => (
            <div key={label} className="px-6 py-4 flex justify-between items-center">
              <span className="text-[10px] font-black text-text-gray uppercase tracking-widest">{label}</span>
              <span className={`font-black uppercase tracking-wide ${label === 'Pledge Amount' ? 'text-alumni-orange text-xl' : 'text-text-dark text-sm'}`}>{val}</span>
            </div>
          ))}
        </div>
      </div>



       <button 
        onClick={handleConfirm}
        className="w-full bg-school-green text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-school-green/20 mt-10 active:scale-95 transition-all uppercase tracking-widest"
      >
        Confirm Pledge ✓
      </button>
      
      <p className="text-center mt-4 text-[10px] font-bold text-text-gray uppercase tracking-widest">Amount will be credited within 30 days</p>
    </div>
  );
}

function SuccessScreen({ pledge, need, onBack }: { pledge: any, need: Need, onBack: () => void }) {
  const transactionId = `SV${Date.now().toString().slice(-8)}`;

  return (
    <div className="p-6 pt-20 flex flex-col items-center text-center">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 12, stiffness: 200 }}
        className="w-24 h-24 bg-school-green rounded-full flex items-center justify-center text-white mb-8 shadow-2xl shadow-school-green/30"
      >
        <CheckCircle2 size={56} />
      </motion.div>

      <h1 className="text-3xl font-black text-text-dark mb-2 tracking-tight">Pledge Successful! 🎉</h1>
      <p className="text-text-gray font-medium px-8 leading-relaxed mb-10">Thank you, {pledge.donorName}! Your contribution is now bridging the future.</p>

      <div className="w-full bg-white rounded-3xl border border-divider-gray overflow-hidden shadow-lg relative last:border-b-0">
        <div className="p-6 space-y-6">
           <div className="flex items-center gap-4 text-left">
              <div className="p-3 bg-alumni-orange-surface rounded-2xl text-alumni-orange">
                <Heart size={24} fill="currentColor" />
              </div>
              <div className="min-w-0">
                 <p className="text-[10px] font-black text-text-gray uppercase tracking-widest mb-0.5">Pledged For</p>
                 <h3 className="font-black text-text-dark text-base truncate">{need.title}</h3>
              </div>
           </div>

           <div className="flex justify-between items-end border-t border-divider-gray pt-6">
              <div className="text-left">
                 <p className="text-[10px] font-black text-text-gray uppercase tracking-widest mb-1">Amount Paid</p>
                 <span className="text-3xl font-black text-school-green">₹{pledge.amount}</span>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-black text-text-gray uppercase tracking-widest mb-1">Status</p>
                 <span className="px-2 py-1 bg-school-green-surface text-school-green text-[10px] font-black rounded uppercase tracking-widest border border-school-green/10">VERIFIED ✓</span>
              </div>
           </div>

           <div className="flex justify-between items-center text-[10px] font-black text-text-gray uppercase tracking-widest pt-6 border-t border-divider-gray border-dashed relative">
                <div className="absolute top-0 inset-x-0 h-4 border-t border-bg-cream flex -mt-2 -mx-6 overflow-hidden">
                   {[...Array(12)].map((_, i) => <div key={i} className="w-4 h-4 bg-bg-cream rounded-full mx-2 border border-divider-gray"></div>)}
                </div>
                <div className="text-left">
                   <p className="mb-1">Transaction ID</p>
                   <p className="text-text-dark font-black tracking-wider">{transactionId}</p>
                </div>
                <div className="text-right">
                   <p className="mb-1">Date</p>
                   <p className="text-text-dark font-black tracking-wider">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                </div>
           </div>
        </div>
      </div>

      <button 
        onClick={onBack}
        className="w-full bg-school-green text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-school-green/20 mt-10 active:scale-95 transition-all"
      >
        Back to Dashboard
      </button>
    </div>
  );
}

function EditProfileScreen({ user, onBack, onLogout, onUpdate }: { user: User, onBack: () => void, onLogout: () => void, onUpdate: (u: User) => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [email, setEmail] = useState(user.email || '');
  const [orgName, setOrgName] = useState(user.orgName || '');
  const [batch, setBatch] = useState(user.batch || '');
  const [profilePhoto, setProfilePhoto] = useState(user.profilePhotoUrl || '');
  const [password, setPassword] = useState(user.password || '');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => {
    if (!isEditing) return;
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (showPasswordInput) {
      if (password.length < 8) {
        alert("Password must be at least 8 characters long.");
        return;
      }
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
    }

    onUpdate({
      ...user,
      name,
      orgName,
      batch,
      profilePhotoUrl: profilePhoto,
      password: password
    });
    setIsEditing(false);
    setShowPasswordInput(false);
    setConfirmPassword('');
    alert("Profile changes saved successfully!");
  };

  const handleChangePassword = () => {
    setShowPasswordInput(true);
  };

  return (
    <div className="p-6 pb-20 bg-[#F8FAFC] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-school-green border-2 border-school-green-surface p-2 rounded-2xl bg-white"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-black text-text-dark tracking-tight uppercase tracking-widest">Profile</h1>
        <button 
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className={`p-2 rounded-xl transition-all ${isEditing ? 'bg-school-green text-white' : 'text-school-green border-2 border-school-green-surface bg-white'}`}
        >
          {isEditing ? <CheckCircle2 size={24} /> : <Edit size={24} />}
        </button>
      </div>

      <div className="flex flex-col items-center mb-10">
         <div className={`relative group ${isEditing ? 'cursor-pointer' : 'cursor-default'}`} onClick={handlePhotoClick}>
           <div className={`w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-slate-200 transition-all ${isEditing ? 'opacity-80' : 'opacity-100'}`}>
             {profilePhoto ? (
               <img src={profilePhoto} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-text-gray opacity-20">
                 <UserIcon size={48} />
               </div>
             )}
           </div>
           {isEditing && (
             <button className="absolute bottom-1 right-1 p-2.5 bg-school-green text-white rounded-2xl shadow-lg border-2 border-white group-hover:scale-110 transition-transform">
               <Camera size={20} />
             </button>
           )}
           <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            accept="image/*"
           />
         </div>
         <h2 className="mt-6 text-2xl font-black text-text-dark">{name}</h2>
         <p className="text-text-gray font-bold uppercase tracking-widest text-[10px] mt-1 italic tracking-[2px]">{user.role}</p>
      </div>

      <div className="space-y-5 mb-12">
         <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <input 
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={!isEditing}
              className={`w-full px-5 py-4 border rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-slate-900 ${isEditing ? 'bg-white border-blue-200 shadow-sm' : 'bg-slate-50 border-slate-100'}`} 
            />
         </div>

         <div className="space-y-1.5 opacity-60">
            <label className="text-sm font-bold text-slate-700 ml-1">Mobile Number</label>
            <input 
              value={phone}
              disabled
              className="w-full px-5 py-4 bg-slate-100 border border-slate-200 rounded-2xl font-medium text-slate-500 cursor-not-allowed" 
            />
         </div>

         <div className="space-y-1.5 opacity-60">
            <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
            <input 
              value={email}
              disabled
              className="w-full px-5 py-4 bg-slate-100 border border-slate-200 rounded-2xl font-medium text-slate-500 cursor-not-allowed" 
            />
         </div>

         <div className="space-y-1.5">
            <label className="text-sm font-bold text-slate-700 ml-1">School/College/Organisation Name</label>
            <input 
              value={orgName}
              onChange={e => setOrgName(e.target.value)}
              disabled={!isEditing}
              className={`w-full px-5 py-4 border rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-slate-900 ${isEditing ? 'bg-white border-blue-200 shadow-sm' : 'bg-slate-50 border-slate-100'}`} 
            />
         </div>

         {user.role === 'alumni' && (
           <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Batch</label>
              <input 
                value={batch}
                onChange={e => setBatch(e.target.value)}
                disabled={!isEditing}
                className={`w-full px-5 py-4 border rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-slate-900 ${isEditing ? 'bg-white border-blue-200 shadow-sm' : 'bg-slate-50 border-slate-100'}`} 
              />
           </div>
         )}
         
         {showPasswordInput ? (
           <div className="space-y-5 animate-in fade-in slide-in-from-top-2">
             <div className="space-y-1.5">
               <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
               <div className="relative">
                 <input 
                   type="password"
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                   className="w-full px-5 py-4 bg-white border border-blue-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-slate-900 shadow-sm" 
                   placeholder="Enter new password"
                   autoFocus
                 />
                 <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               </div>
             </div>

             <div className="space-y-1.5">
               <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
               <div className="relative">
                 <input 
                   type="password"
                   value={confirmPassword}
                   onChange={e => setConfirmPassword(e.target.value)}
                   className="w-full px-5 py-4 bg-white border border-blue-200 rounded-2xl outline-none focus:border-blue-500 transition-all font-medium text-slate-900 shadow-sm" 
                   placeholder="Confirm your password"
                 />
                 <Lock className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               </div>
             </div>
           </div>
         ) : (
           <div className="pt-4">
              <button 
                onClick={handleChangePassword}
                className="w-full py-5 text-school-green font-black uppercase tracking-widest text-[10px] border-2 border-school-green-surface bg-white rounded-2xl flex items-center justify-center gap-2 hover:bg-school-green-surface/10 transition-colors shadow-sm"
              >
                <Lock size={16} /> Change Password
              </button>
           </div>
         )}
      </div>

      <div className="flex flex-col gap-4">
        {isEditing && (
          <button 
            onClick={handleSave}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[2px] text-lg shadow-xl active:scale-95 transition-transform"
          >
            Save Profile
          </button>
        )}
        <button 
          onClick={onLogout} 
          className="w-full py-5 text-urgent-red font-black uppercase tracking-widest text-[10px] border-2 border-urgent-red-surface rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-transform bg-white shadow-sm"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

// --- ADMIN SCREENS ---

function AdminAddEditNeedScreen({ existingNeed, onBack, onSave }: { existingNeed: Need | null, onBack: () => void, onSave: (n: Need) => void }) {
  const [title, setTitle] = useState(existingNeed?.title || '');
  const [description, setDescription] = useState(existingNeed?.description || '');
  const [cost, setCost] = useState(existingNeed?.costEstimate?.toString() || '');
  const [category, setCategory] = useState(existingNeed?.category || '');
  const [priority, setPriority] = useState<any>(existingNeed?.priority || null);
  const [beforePhotoUrl, setBeforePhotoUrl] = useState(existingNeed?.beforePhotoUrl || '');
  const [endDate, setEndDate] = useState(existingNeed?.endDate ? new Date(existingNeed.endDate).toISOString().split('T')[0] : '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBeforePhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newNeed: Need = {
      id: existingNeed?.id || 'n' + Math.random().toString(36).substr(2, 9),
      title,
      description,
      category: category || 'General',
      costEstimate: parseInt(cost) || 0,
      amountPledged: existingNeed?.amountPledged || 0,
      priority: priority || '🟢 Low',
      status: (existingNeed?.status || 'Active') as any,
      beforePhotoUrl: beforePhotoUrl || 'https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=800&q=80',
      afterPhotoUrl: existingNeed?.afterPhotoUrl || '',
      endDate: endDate ? new Date(endDate).getTime() : Date.now() + 86400000 * 30,
      createdAt: existingNeed?.createdAt || Date.now()
    };
    onSave(newNeed);
  };

  return (
    <div className="p-6 pb-24 bg-[#FBF9F4] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-school-green border-2 border-school-green-surface p-2 rounded-2xl bg-white focus:scale-95 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-text-dark tracking-tight uppercase tracking-widest">{existingNeed ? 'Edit Need' : 'Post New Need'}</h1>
        <div className="w-10"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-7 rounded-[32px] border border-black/10 shadow-sm space-y-2">
           <label className="text-[10px] font-black text-text-gray uppercase tracking-widest ml-1 opacity-60">Need Title</label>
           <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Repair Leaking Roof" className="w-full text-lg font-bold text-text-dark outline-none py-2 border-b-2 border-[#FBF9F4] focus:border-school-green/30 transition-colors" />
        </div>

        <div className="bg-white p-7 rounded-[32px] border border-black/10 shadow-sm space-y-2">
           <label className="text-[10px] font-black text-text-gray uppercase tracking-widest ml-1 opacity-60">Need Description</label>
           <textarea 
             value={description} 
             onChange={e => setDescription(e.target.value)} 
             required 
             placeholder="Provide detailed information about the need..." 
             className="w-full text-sm font-medium text-text-dark outline-none py-2 border-b-2 border-[#FBF9F4] focus:border-school-green/30 transition-colors min-h-[100px] resize-none" 
           />
        </div>

        <div className="bg-white p-7 rounded-[32px] border border-black/10 shadow-sm space-y-2">
           <label className="text-[10px] font-black text-text-gray uppercase tracking-widest ml-1 opacity-60">Cost Estimate (₹)</label>
           <input type="number" value={cost} onChange={e => setCost(e.target.value)} required placeholder="Amount in INR" className="w-full text-2xl font-bold text-text-dark/80 outline-none py-2 border-b-2 border-[#FBF9F4] focus:border-school-green/30 transition-colors" />
        </div>

        <div className="bg-white p-7 rounded-[32px] border border-black/10 shadow-sm space-y-2">
           <label className="text-[10px] font-black text-text-gray uppercase tracking-widest ml-1 opacity-60">Category (Optional)</label>
           <div className="relative">
              <select value={category} onChange={e => setCategory(e.target.value)} className="w-full text-xl font-bold text-text-dark outline-none appearance-none cursor-pointer bg-transparent py-2 pr-10">
                <option value="">Skip / General</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-school-green">
                 <ChevronRight size={20} className="rotate-90" />
              </div>
           </div>
        </div>

        <div className="bg-white p-7 rounded-[32px] border border-black/10 shadow-sm space-y-2">
           <label className="text-[10px] font-black text-text-gray uppercase tracking-widest ml-1 opacity-60">End Date</label>
           <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required className="w-full text-lg font-bold text-text-dark outline-none py-2 border-b-2 border-[#FBF9F4] focus:border-school-green/30 transition-colors" />
        </div>

        <div className="bg-white p-7 rounded-[32px] border border-black/10 shadow-sm space-y-4">
           <label className="text-[10px] font-black text-text-gray uppercase tracking-widest ml-1 opacity-60">Proof of Impact (Before)</label>
           <div className="flex flex-col gap-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
              {beforePhotoUrl ? (
                <div className="relative aspect-video rounded-2xl overflow-hidden border border-black/5">
                   <img src={beforePhotoUrl} className="w-full h-full object-cover" />
                   <button type="button" onClick={() => setBeforePhotoUrl('')} className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-xl text-urgent-red hover:scale-110 transition-transform">
                     <Plus className="rotate-45" size={20} />
                   </button>
                </div>
              ) : (
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()} 
                  className="w-full aspect-video rounded-3xl border-2 border-dashed border-black/10 bg-[#FBF9F4] flex flex-col items-center justify-center gap-2 group hover:border-school-green transition-colors"
                >
                  <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                    <Camera size={28} className="text-text-gray" />
                  </div>
                  <span className="text-[10px] font-black uppercase text-text-gray/40 tracking-widest">Select Evidence Photo</span>
                </button>
              )}
           </div>
        </div>

        <div className="bg-white p-7 rounded-[32px] border border-black/10 shadow-sm space-y-6">
             <label className="text-[10px] font-black text-text-gray uppercase tracking-widest ml-1 opacity-60">Priority Level</label>
             <div className="flex justify-center">
                <button 
                  type="button" 
                  onClick={() => setPriority(priority === '🔴 Urgent' ? null : '🔴 Urgent')} 
                  className={`w-full max-w-[200px] py-4 flex flex-col items-center gap-2 rounded-2xl font-black text-[10px] tracking-widest transition-all border shadow-sm ${priority === '🔴 Urgent' ? 'bg-[#1C1C1C] text-white border-[#1C1C1C] ring-4 ring-black/5 scale-105' : 'bg-white text-text-gray border-black/5 opacity-40 hover:opacity-100'}`}
                >
                  <span className="text-xl">🔴</span>
                  URGENT
                </button>
             </div>
             <p className="text-[9px] font-black text-text-gray text-center uppercase tracking-widest opacity-30 italic">Toggle only if this need requires immediate attention</p>
        </div>

        <button type="submit" className="w-full bg-[#2D7A3E] text-white py-6 rounded-[32px] font-black text-lg shadow-xl shadow-[#2D7A3E]/20 active:scale-[0.98] transition-all uppercase tracking-widest">
           {existingNeed ? 'Update details' : 'Publish verified need'}
        </button>
      </form>
    </div>
  );
}

function AdminCloseNeedScreen({ need, onBack, onClose }: { need: Need, onBack: () => void, onClose: () => void }) {
  return (
    <div className="p-6 bg-bg-cream min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-school-green border-2 border-school-green-surface p-2 rounded-2xl bg-white"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-black text-text-dark tracking-tight uppercase tracking-widest">Settle Project</h1>
        <div className="w-10"></div>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-divider-gray shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-school-green-surface rounded-full -mr-12 -mt-12"></div>
        <p className="text-[10px] font-black text-school-green uppercase tracking-[3px] mb-4">Project Summary</p>
        <h2 className="text-3xl font-black text-text-dark mb-2 tracking-tight leading-tight">{need?.title}</h2>
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-divider-gray/50">
           <div>
              <p className="text-[10px] font-black text-text-gray uppercase">Pledged</p>
              <p className="text-xl font-black text-school-green">₹{need?.amountPledged?.toLocaleString()}</p>
           </div>
           <div className="text-right">
              <p className="text-[10px] font-black text-text-gray uppercase">Goal</p>
              <p className="text-xl font-black text-text-dark">₹{need?.costEstimate?.toLocaleString()}</p>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-divider-gray">
           <label className="block text-[10px] font-black text-text-gray uppercase tracking-widest mb-4">Proof of completion</label>
           <div className="aspect-video bg-bg-cream rounded-2xl border-2 border-dashed border-divider-gray flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white transition-colors group">
              <Camera size={32} className="text-text-gray opacity-30 group-hover:opacity-100 transition-opacity" />
              <span className="text-[10px] font-black text-text-gray opacity-40 uppercase tracking-widest">Upload After Photo</span>
           </div>
        </div>

        <button onClick={onClose} className="w-full bg-text-dark text-white py-5 rounded-[32px] font-black text-lg shadow-xl shadow-black/10 active:scale-95 transition-transform uppercase tracking-widest">
           Close & verify project
        </button>
      </div>
    </div>
  );
}

function AdminPledgeDetailScreen({ pledge, onBack }: { pledge: Donor, onBack: () => void }) {
  return (
    <div className="p-6 bg-bg-cream min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-school-green border-2 border-school-green-surface p-2 rounded-2xl bg-white focus:scale-95 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-text-dark tracking-tight uppercase tracking-widest">Pledge Details</h1>
        <div className="w-10"></div>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-divider-gray shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-alumni-orange-surface rounded-full -mr-12 -mt-12"></div>
        <p className="text-[10px] font-black text-alumni-orange uppercase tracking-[3px] mb-4">Contribution Verified</p>
        <h2 className="text-3xl font-black text-text-dark mb-2 tracking-tight leading-tight">₹{pledge.pledgeAmount.toLocaleString()}</h2>
        <p className="text-lg font-bold text-text-gray mb-6">Pledged by {pledge.name}</p>
        
        <div className="space-y-4 pt-6 border-t border-divider-gray/50">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-text-gray uppercase tracking-widest">Project</span>
              <span className="text-sm font-bold text-text-dark">{pledge.needTitle}</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-text-gray uppercase tracking-widest">Date</span>
              <span className="text-sm font-bold text-text-dark">{new Date(pledge.pledgedAt).toLocaleDateString()}</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-text-gray uppercase tracking-widest">Method</span>
              <span className="text-sm font-bold text-text-dark">{pledge.paymentMethod}</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-text-gray uppercase tracking-widest">Reference ID</span>
              <span className="text-sm font-mono font-bold text-school-green">{pledge.transactionId}</span>
           </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-divider-gray flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-50 text-progress-blue rounded-2xl flex items-center justify-center">
          <ShieldCheck size={24} />
        </div>
        <div>
          <p className="text-[10px] font-black text-text-gray uppercase">Status</p>
          <p className="font-bold text-text-dark">Pledge secured & verified</p>
        </div>
      </div>
      
      <button onClick={onBack} className="w-full mt-10 bg-text-dark text-white py-5 rounded-[32px] font-black text-lg shadow-xl shadow-black/10 active:scale-95 transition-transform uppercase tracking-widest">
         Back to Dashboard
      </button>
    </div>
  );
}

// --- ADDITIONAL SCREENS ---

function AdminTotalPLEDGEDScreen({ pledges, onBack, onNavigate }: { pledges: Donor[], onBack: () => void, onNavigate: (s: Screen, p?: any) => void }) {
  const total = pledges.reduce((acc, p) => acc + p.pledgeAmount, 0);
  return (
    <div className="p-6 bg-[#FBF9F4] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-school-green border-2 border-school-green-surface p-2 rounded-2xl bg-white focus:scale-95 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-text-dark tracking-tight uppercase tracking-widest">Total Pledged</h1>
        <div className="w-10"></div>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-xl mb-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFF4ED] rounded-full -mr-16 -mt-16 opacity-50"></div>
        <p className="text-[10px] font-black text-[#D45D1C] uppercase tracking-[4px] mb-4">Total Accumulated</p>
        <h2 className="text-5xl font-black text-[#A24411] tracking-tighter mb-2">₹{total.toLocaleString()}</h2>
        <p className="text-sm font-bold text-text-gray opacity-60">Verified through financial audits</p>
      </div>

      <h3 className="text-xs font-black text-text-gray uppercase tracking-widest mb-6 px-2 text-school-green">Detailed Breakdown</h3>
      <div className="space-y-4">
        {pledges.map(p => (
          <div 
            key={p.id} 
            onClick={() => onNavigate(Screen.ADMIN_PLEDGE_DETAIL, { pledge: p })}
            className="bg-white p-5 rounded-[28px] border border-black/5 shadow-sm flex justify-between items-center cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div>
              <p className="font-bold text-text-dark">{p.needTitle}</p>
              <p className="text-[10px] text-text-gray font-bold uppercase tracking-widest">{new Date(p.pledgedAt).toLocaleDateString()}</p>
            </div>
            <p className="text-lg font-black text-school-green">₹{p.pledgeAmount.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminDonorsListScreen({ pledges, onBack, onNavigate }: { pledges: Donor[], onBack: () => void, onNavigate: (s: Screen, p?: any) => void }) {
  // Get unique donors by email
  const donorsByEmail = pledges.reduce((acc, p) => {
    if (!acc[p.email]) {
      acc[p.email] = {
        name: p.name,
        email: p.email,
        id: p.id // Use first pledge ID as a key
      };
    }
    return acc;
  }, {} as Record<string, { name: string, email: string, id: string }>);

  const donors = Object.values(donorsByEmail);

  return (
    <div className="p-6 bg-[#FBF9F4] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-school-green border-2 border-school-green-surface p-2 rounded-2xl bg-white focus:scale-95 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-text-dark tracking-tight uppercase tracking-widest">Our Donors</h1>
        <div className="w-10"></div>
      </div>

      <div className="space-y-4">
        {donors.map(d => (
          <div 
            key={d.id} 
            onClick={() => onNavigate(Screen.ADMIN_DONOR_DETAIL, { donorEmail: d.email })}
            className="bg-white p-5 rounded-[28px] border border-black/5 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-black text-xl">
              {d.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <p className="font-black text-text-dark leading-none mb-1 text-lg">{d.name}</p>
              <p className="text-[10px] text-text-gray font-bold uppercase tracking-widest opacity-60">{d.email}</p>
            </div>
            <ChevronRight size={20} className="text-text-gray opacity-30" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPledgesListScreen({ pledges, onBack, onNavigate }: { pledges: Donor[], onBack: () => void, onNavigate: (s: Screen, p?: any) => void }) {
  return (
    <div className="p-6 bg-[#FBF9F4] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-school-green border-2 border-school-green-surface p-2 rounded-2xl bg-white focus:scale-95 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-text-dark tracking-tight uppercase tracking-widest">Recent Pledges</h1>
        <div className="w-10"></div>
      </div>

      <div className="space-y-4 pb-20">
        {pledges.map(pledge => (
          <div 
            key={pledge.id} 
            onClick={() => onNavigate(Screen.ADMIN_PLEDGE_DETAIL, { pledge })}
            className="bg-white p-5 rounded-[28px] border border-black/5 shadow-sm flex items-center gap-4 active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div className="w-12 h-12 rounded-2xl bg-alumni-orange-surface text-alumni-orange flex items-center justify-center font-black">
              {pledge.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-black text-text-dark leading-none mb-1 text-base truncate">
                {pledge.name} pledged ₹{pledge.pledgeAmount}
              </p>
              <p className="text-[10px] text-text-gray font-bold uppercase tracking-widest opacity-60 truncate">
                {pledge.needTitle} • {new Date(pledge.pledgedAt).toLocaleDateString()}
              </p>
            </div>
            <ChevronRight size={18} className="text-text-gray opacity-30" />
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminDonorDetailScreen({ donorEmail, pledges, onBack }: { donorEmail: string, pledges: Donor[], onBack: () => void }) {
  const donorPledges = pledges.filter(p => p.email === donorEmail);
  const donorName = donorPledges[0]?.name || "Donor";
  const totalAmount = donorPledges.reduce((sum, p) => sum + p.pledgeAmount, 0);
  const totalNeeds = donorPledges.length;

  return (
    <div className="p-6 bg-[#FBF9F4] min-h-screen pb-24">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-school-green border-2 border-school-green-surface p-2 rounded-2xl bg-white focus:scale-95 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-lg font-black text-text-dark tracking-tight uppercase tracking-widest">Donor Detail</h1>
        <div className="w-10"></div>
      </div>

      <div className="bg-white p-8 rounded-[40px] border border-black/5 shadow-xl mb-8 flex flex-col items-center">
         <div className="w-24 h-24 rounded-[32px] bg-purple-100 text-purple-600 flex items-center justify-center font-black text-3xl mb-4 shadow-inner">
            {donorName.split(' ').map(n => n[0]).join('')}
         </div>
         <h2 className="text-2xl font-black text-text-dark tracking-tighter mb-1">{donorName}</h2>
         <p className="text-[10px] font-black text-text-gray uppercase tracking-[2px] opacity-60 mb-6">{donorEmail}</p>
         
         <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-black/5">
            <div className="text-center">
               <p className="text-[10px] font-black text-text-gray uppercase tracking-widest opacity-40 mb-1">Total Pledged</p>
               <span className="text-2xl font-black text-school-green">₹{totalAmount.toLocaleString()}</span>
            </div>
            <div className="text-center">
               <p className="text-[10px] font-black text-text-gray uppercase tracking-widest opacity-40 mb-1">Needs Supported</p>
               <span className="text-2xl font-black text-text-dark">{totalNeeds}</span>
            </div>
         </div>
      </div>

      <h3 className="text-xs font-black text-text-gray uppercase tracking-widest mb-6 opacity-40 px-2 italic">Contribution History</h3>

      <div className="space-y-4">
         {donorPledges.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm">
               <div className="flex justify-between items-start mb-3">
                  <div>
                     <p className="text-[10px] font-black text-text-gray uppercase tracking-widest mb-1 opacity-50">Supported Need</p>
                     <h4 className="font-black text-text-dark text-lg leading-tight">{p.needTitle}</h4>
                  </div>
                  <div className="bg-school-green-surface text-school-green px-3 py-1.5 rounded-xl text-xs font-black">
                     ₹{p.pledgeAmount}
                  </div>
               </div>
               <div className="flex items-center justify-between pt-3 border-t border-black/5">
                  <div className="flex items-center gap-1.5 text-text-gray opacity-40">
                     <Clock size={14} />
                     <span className="text-[10px] font-black uppercase">{new Date(p.pledgedAt).toLocaleDateString()}</span>
                  </div>
                  <span className="text-[9px] font-black text-text-gray uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded-lg">{p.paymentMethod}</span>
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}

function AdminTotalPledgedScreen({ pledges, onBack, onNavigate }: { pledges: Donor[], onBack: () => void, onNavigate: (s: Screen, p?: any) => void }) {
    return <AdminTotalPLEDGEDScreen pledges={pledges} onBack={onBack} onNavigate={onNavigate} />;
}

function NotificationsScreen({ onBack, onNavigate }: { onBack: () => void, onNavigate: (s: Screen, p?: any) => void }) {
  const notifications = [
    { id: 1, title: "New Urgent Need", message: "Roof repair needed at Central Primary.", time: "2h ago", priority: true, target: Screen.ACTIVE_NEEDS },
    { id: 2, title: "Goal Reached!", message: "Smart Lab project is now 100% funded.", time: "5h ago", priority: false, target: Screen.HISTORY },
    { id: 3, title: "Pledge Verified", message: "Your contribution of ₹500 was confirmed.", time: "1d ago", priority: false, target: Screen.ALUMNI_DASHBOARD },
  ];

  return (
    <div className="p-6 pb-20 bg-[#FBF9F4] min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-school-green border-2 border-school-green-surface p-2 rounded-2xl bg-white focus:scale-95 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-text-dark tracking-tight uppercase tracking-widest">Inbox</h1>
        <div className="w-10"></div>
      </div>

      <div className="space-y-4">
        {notifications.map(n => (
          <div 
            key={n.id} 
            onClick={() => onNavigate(n.target)}
            className={`p-5 rounded-[28px] border border-black/5 bg-white shadow-sm flex gap-4 cursor-pointer active:scale-[0.98] transition-transform ${n.priority ? 'ring-2 ring-urgent-red/20 border-urgent-red/10' : ''}`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${n.priority ? 'bg-urgent-red/10 text-urgent-red' : 'bg-school-green/10 text-school-green'}`}>
              {n.priority ? <AlertCircle size={20} /> : <Bell size={20} />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-black text-text-dark leading-none">{n.title}</h3>
                <span className="text-[10px] font-bold text-text-gray opacity-60 uppercase">{n.time}</span>
              </div>
              <p className="text-sm text-text-gray font-medium leading-snug">{n.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HallOfFameScreen({ pledges, onBack, onNavigate }: { pledges: Donor[], onBack: () => void, onNavigate: (s: Screen, p?: any) => void }) {
  const rankedDonors = useMemo(() => {
    // Collect totals by email
    const donorStats = pledges.reduce((acc, p) => {
      if (!acc[p.email]) {
        acc[p.email] = {
          name: p.name,
          email: p.email,
          total: 0,
          class: `Class of ${1980 + Math.floor(Math.random() * 40)}` // Mock class year
        };
      }
      acc[p.email].total += p.pledgeAmount;
      return acc;
    }, {} as Record<string, { name: string, email: string, total: number, class: string }>);

    // Convert to array and sort
    return Object.values(donorStats).sort((a, b) => b.total - a.total);
  }, []);

  const formatCurrency = (amt: number) => {
    if (amt >= 100000) return `₹${(amt / 100000).toFixed(1)}L`;
    if (amt >= 1000) return `₹${(amt / 1000).toFixed(1)}K`;
    return `₹${amt}`;
  };

  return (
    <div className="p-6 pb-20 bg-bg-cream min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-school-green border-2 border-school-green-surface p-2 rounded-2xl bg-white focus:scale-95 transition-transform">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-black text-text-dark tracking-tight uppercase">Hall of Fame</h1>
        <div className="w-10"></div>
      </div>

      <div className="bg-text-dark text-white p-8 rounded-[40px] mb-12 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-alumni-orange/20 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="relative z-10">
          <Trophy className="text-alumni-orange mb-4" size={48} />
          <h2 className="text-3xl font-black mb-2 tracking-tight">Community Leaders</h2>
          <p className="text-white/60 text-sm font-medium leading-relaxed">Celebrating the pioneers of school development and alumni legacy.</p>
        </div>
      </div>

      <div className="space-y-6">
        {rankedDonors.map((leader, index) => {
          const rank = index + 1;
          const color = rank === 1 ? "text-alumni-orange" : rank === 2 ? "text-slate-400" : rank === 3 ? "text-orange-900" : "text-text-gray";
          
          return (
            <div 
              key={leader.email} 
              onClick={() => onNavigate(Screen.ADMIN_DONOR_DETAIL, { donorEmail: leader.email })}
              className="bg-white p-6 rounded-3xl border border-divider-gray flex items-center gap-5 shadow-sm active:scale-[0.98] transition-transform cursor-pointer"
            >
              <span className={`text-3xl font-black ${color} opacity-40 w-12 shrink-0`}>#{rank}</span>
              <div className="flex-1 overflow-hidden">
                <h4 className="text-lg font-black text-text-dark leading-none mb-1 truncate">{leader.name}</h4>
                <p className="text-[10px] font-black text-text-gray uppercase tracking-widest">{leader.class}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xl font-black text-school-green leading-none">{formatCurrency(leader.total)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MyPledgesScreen({ needs, pledges, user, onBack, onNavigate }: { needs: Need[], pledges: Donor[], user: User, onBack: () => void, onNavigate: (s: Screen, p?: any) => void }) {
  const userPledges = pledges.filter(p => p.email === user.email).sort((a, b) => b.pledgedAt - a.pledgedAt);
  const userNeedsIds = new Set(userPledges.map(p => p.needId));
  const supportedNeeds = needs.filter(n => userNeedsIds.has(n.id));

  return (
    <div className="p-6 pb-24 bg-bg-cream min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-school-green border-2 border-school-green-surface p-2 rounded-2xl bg-white focus:scale-95 transition-transform"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-black text-text-dark tracking-tight uppercase tracking-widest">My Support</h1>
        <div className="w-10"></div>
      </div>

      <div className="space-y-8">
        {userPledges.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-10">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-text-gray mb-6 opacity-20">
              <Heart size={40} />
            </div>
            <h3 className="text-xl font-black text-text-dark uppercase tracking-tight mb-2">No Pledges Yet</h3>
            <p className="text-text-gray text-sm font-medium italic opacity-60">Your contribution can make a difference. Start by exploring active needs!</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-text-gray uppercase tracking-widest ml-1 opacity-50">Contribution History</h3>
              {userPledges.map(pledge => (
                <div key={pledge.id} className="bg-white p-5 rounded-[24px] border border-divider-gray shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-text-dark leading-tight">{pledge.needTitle}</h4>
                      <p className="text-[10px] font-bold text-text-gray uppercase tracking-widest mt-1">Ref: {pledge.transactionId}</p>
                    </div>
                    <span className="text-school-green font-black text-lg">₹{pledge.pledgeAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-divider-gray/50">
                    <span className="text-[10px] font-bold text-text-gray uppercase">{new Date(pledge.pledgedAt).toLocaleDateString()}</span>
                    <button 
                      onClick={() => {
                        const need = needs.find(n => n.id === pledge.needId);
                        if (need) onNavigate(Screen.NEED_DETAIL, { need });
                      }}
                      className="text-school-green text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
                    >
                      View Project <ArrowLeft size={12} className="rotate-180" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-text-gray uppercase tracking-widest ml-1 opacity-50">Projects Supported</h3>
              <div className="space-y-4">
                {supportedNeeds.map(need => (
                  <NeedCard key={need.id} need={need} isAdmin={false} onNavigate={onNavigate} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function HistoryScreen({ needs, isAdmin, onBack, onNavigate, onDeleteNeed }: { needs: Need[], isAdmin: boolean, onBack: () => void, onNavigate: (s: Screen, p?: any) => void, onDeleteNeed?: (id: string) => void }) {
  const completedNeeds = [...needs].filter(n => n.status === 'Closed' || n.status === 'Completed').sort((a, b) => b.createdAt - a.createdAt);
  
  return (
    <div className="p-6 pb-24 bg-bg-cream min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-school-green border-2 border-school-green-surface p-2 rounded-2xl bg-white focus:scale-95 transition-transform"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-black text-text-dark tracking-tight uppercase tracking-widest">Completed Needs</h1>
        <div className="w-10"></div>
      </div>

      {completedNeeds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center px-10">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-text-gray mb-6 opacity-20">
            <HistoryIcon size={40} />
          </div>
          <h3 className="text-xl font-black text-text-dark uppercase tracking-tight mb-2">No Projects Completed</h3>
          <p className="text-text-gray text-sm font-medium italic opacity-60">Help us finish active projects to see them here!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {completedNeeds.map(need => (
            <NeedCard key={need.id} need={need} isAdmin={isAdmin} onNavigate={onNavigate} onDelete={onDeleteNeed} />
          ))}
        </div>
      )}
    </div>
  );
}

function ImpactGalleryScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="p-6 pb-20 bg-bg-cream min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <button onClick={onBack} className="text-school-green border-2 border-school-green-surface p-2 rounded-2xl bg-white"><ArrowLeft size={24} /></button>
        <h1 className="text-xl font-black text-text-dark tracking-tight uppercase">Impact</h1>
        <div className="w-10"></div>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-black text-text-dark text-lg leading-tight">Classroom Restoration</h3>
          <div className="grid grid-cols-2 gap-4">
             <div className="aspect-square rounded-3xl overflow-hidden border-2 border-divider-gray relative grayscale">
                <img src="https://images.unsplash.com/photo-1541339907198-e08756ebafe3?w=400&q=80" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 bg-urgent-red text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Before</span>
             </div>
             <div className="aspect-square rounded-3xl overflow-hidden border-2 border-school-green relative shadow-lg shadow-school-green/20">
                <img src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&q=80" className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 bg-school-green text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest">After</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SearchScreen({ needs, pledges, onBack, onNavigate }: { 
  needs: Need[], 
  pledges: Donor[], 
  onBack: () => void, 
  onNavigate: (s: Screen, p?: any) => void 
}) {
  const [query, setQuery] = useState('');
  
  const filteredNeeds = needs.filter(n => 
    n.title.toLowerCase().includes(query.toLowerCase()) || 
    n.description.toLowerCase().includes(query.toLowerCase()) ||
    n.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPledges = pledges.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.needTitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FBF9F4] flex flex-col">
       <div className="p-6 bg-white shadow-sm flex items-center gap-4">
          <button onClick={onBack} className="text-text-dark p-2 -ml-2">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-gray" size={20} />
            <input 
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search anything..."
              className="w-full bg-slate-50 border border-slate-100 pl-12 pr-4 py-3 rounded-2xl outline-none focus:ring-4 focus:ring-school-green/5 transition-all text-lg font-bold"
            />
          </div>
       </div>

       <div className="flex-1 overflow-y-auto p-6">
          {query.length === 0 ? (
            <div className="flex flex-col items-center justify-center pt-20 text-text-gray opacity-30">
               <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                 <Search size={48} />
               </div>
               <p className="font-black uppercase tracking-widest text-xs">Type to start searching</p>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
               {filteredNeeds.length > 0 && (
                 <div>
                    <h3 className="text-[10px] font-black text-text-gray uppercase tracking-widest mb-4 opacity-50">Needs ({filteredNeeds.length})</h3>
                    <div className="space-y-3">
                       {filteredNeeds.map(need => (
                         <button 
                           key={need.id}
                           onClick={() => onNavigate(Screen.NEED_DETAIL, { need })}
                           className="w-full bg-white p-4 rounded-[28px] border border-black/5 shadow-sm text-left flex gap-4 items-center active:scale-[0.98] transition-transform"
                         >
                            <div className="w-12 h-12 rounded-2xl bg-school-green-surface flex items-center justify-center text-school-green flex-shrink-0">
                               <Plus size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="font-black text-text-dark truncate">{need.title}</p>
                               <p className="text-[10px] font-bold text-text-gray uppercase tracking-widest">{need.category}</p>
                            </div>
                            <ChevronRight size={18} className="text-text-gray opacity-30" />
                         </button>
                       ))}
                    </div>
                 </div>
               )}

               {filteredPledges.length > 0 && (
                 <div>
                    <h3 className="text-[10px] font-black text-text-gray uppercase tracking-widest mb-4 opacity-50">Donations ({filteredPledges.length})</h3>
                    <div className="space-y-3">
                       {filteredPledges.map(pledge => (
                         <button 
                           key={pledge.id}
                           onClick={() => onNavigate(Screen.ADMIN_PLEDGE_DETAIL, { pledge })}
                           className="w-full bg-white p-4 rounded-[28px] border border-black/5 shadow-sm text-left flex gap-4 items-center active:scale-[0.98] transition-transform"
                         >
                            <div className="w-12 h-12 rounded-2xl bg-alumni-orange-surface flex items-center justify-center text-alumni-orange flex-shrink-0">
                               <Heart size={24} />
                            </div>
                            <div className="flex-1 min-w-0">
                               <p className="font-black text-text-dark truncate">{pledge.name}</p>
                               <p className="text-[10px] font-bold text-text-gray uppercase tracking-widest">₹{pledge.pledgeAmount.toLocaleString()} • {pledge.needTitle}</p>
                            </div>
                            <ChevronRight size={18} className="text-text-gray opacity-30" />
                         </button>
                       ))}
                    </div>
                 </div>
               )}

               {filteredNeeds.length === 0 && filteredPledges.length === 0 && (
                 <div className="flex flex-col items-center justify-center pt-20 text-text-gray opacity-30">
                    <p className="font-black uppercase tracking-widest text-xs">No matches for "{query}"</p>
                 </div>
               )}
            </div>
          )}
       </div>
    </div>
  );
}
