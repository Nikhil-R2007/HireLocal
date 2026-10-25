import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Sparkles, Briefcase, Phone, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '../lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'customer' | 'worker'>('customer');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  // Form States
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { setViewMode, user: currentUser, loading: appLoading } = useApp();

  // Redirect if already logged in
  React.useEffect(() => {
    if (currentUser && !appLoading) {
      navigate('/dashboard');
    }
  }, [currentUser, appLoading, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Email is always required
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    // Password is always required
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Additional fields only for Sign Up
    if (!isLogin) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
      }

      if (formData.phone.trim() && !/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
        newErrors.phone = 'Invalid phone number';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setSuccess('');

    const email = formData.email.trim();
    const password = formData.password.trim();

    try {
      if (isLogin) {
        // Sign In
        console.log('Attempting sign in for:', email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Sign in successful:', userCredential.user.uid);
        navigate('/dashboard');
      } else {
        // Sign Up
        console.log('Attempting sign up for:', email);
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User created in Auth:', user.uid);

        // Update Auth Profile
        try {
          await updateProfile(user, {
            displayName: formData.fullName.trim()
          });
          console.log('Auth profile updated');
        } catch (profileErr: any) {
          console.error('Error updating auth profile:', profileErr);
          // Non-critical, continue
        }

        // Save to Firestore
        try {
          console.log('Saving user to Firestore...');
          const userDocRef = doc(db, 'users', user.uid);
          const userData = {
            uid: user.uid,
            name: formData.fullName.trim(),
            email: email,
            phoneNumber: formData.phone.trim(),
            role: role,
            photoURL: '',
            createdAt: Date.now()
          };
          
          await setDoc(userDocRef, userData);
          console.log('User saved to Firestore');

          // If worker, create worker profile
          if (role === 'worker') {
            console.log('Creating worker profile...');
            const workerDocRef = doc(db, 'workers', user.uid);
            await setDoc(workerDocRef, {
              uid: user.uid,
              name: formData.fullName.trim(),
              skills: [],
              rating: 5.0,
              reviewCount: 0,
              bio: '',
              isOnline: true,
              hourlyRate: 0,
              experience: 'New Pro',
              totalEarnings: 0,
              totalJobs: 0,
              createdAt: Date.now()
            });
            console.log('Worker profile created');
            setViewMode('worker');
          } else {
            setViewMode('customer');
          }
        } catch (fsErr: any) {
          console.error('Firestore saving error:', fsErr);
          let fsMessage = fsErr.message;
          if (fsErr.code === 'permission-denied') {
            fsMessage = 'Permission denied. Please check Firestore security rules.';
          } else if (fsErr.code === 'not-found') {
            fsMessage = 'Firestore database or collection not found.';
          }
          
          // Since account is created but profile failed, we inform the user
          setErrors({ form: `Account created but profile failed: ${fsMessage}. You may need to refresh or contact support.` });
          setLoading(false);
          return;
        }

        setSuccess('Account created successfully! Redirecting...');
        setTimeout(() => navigate(role === 'customer' ? '/dashboard' : '/worker/dashboard'), 1500);
      }
    } catch (err: any) {
      console.error('Full Authentication Error Object:', err);
      console.error('Auth Error Code:', err.code);
      console.error('Auth Error Message:', err.message);
      let message = 'An unexpected error occurred';
      
      if (err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            message = 'This email is already registered. Please sign in instead.';
            break;
          case 'auth/invalid-credential':
          case 'auth/wrong-password':
          case 'auth/user-not-found':
            message = 'Invalid email or password. Please try again.';
            break;
          case 'auth/weak-password':
            message = 'Password is too weak. Please use at least 6 characters.';
            break;
          case 'auth/invalid-email':
            message = 'The email address is invalid.';
            break;
          case 'auth/operation-not-allowed':
            message = 'Email/Password authentication is not enabled in Firebase. Please enable it in the console.';
            break;
          case 'auth/network-request-failed':
            message = 'Network error. Please check your internet connection.';
            break;
          case 'auth/too-many-requests':
            message = 'Too many failed attempts. Please try again later.';
            break;
          default:
            message = err.message || 'Authentication failed.';
        }
      } else if (err.message) {
        message = err.message;
      }
      
      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrors({});
    console.log('Attempting Google Sign In...');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log('Google Sign In successful:', result.user.uid);
      
      // For Google login, check if user exists in Firestore, if not create basic profile
      // This helps with session persistence and showing correct data
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      let message = 'Google sign-in failed';
      if (err.code === 'auth/popup-closed-by-user') {
        message = 'Sign-in cancelled';
      } else if (err.code === 'auth/popup-blocked') {
        message = 'Pop-up blocked by browser. Please allow pop-ups for this site.';
      } else {
        message = err.message || 'An unexpected error occurred during Google sign-in';
      }
      setErrors({ form: message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when typing
    if (errors[e.target.name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[e.target.name];
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 py-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-100 rounded-full blur-3xl -mr-48 -mt-48 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl -ml-48 -mb-48 opacity-50"></div>

      <div className="w-full max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 p-6 sm:p-10"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl shadow-indigo-100 rotate-3">
               <Sparkles size={40} />
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900">{isLogin ? 'Welcome Back' : 'Join HireLocal'}</h1>
            <p className="text-gray-500 text-sm mt-3 font-medium">
              {isLogin ? 'Sign in to access your dashboard' : 'Create an account to start hiring or working'}
            </p>
          </div>

          {errors.form && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-2xl flex items-center gap-3"
            >
              <AlertCircle size={18} />
              {errors.form}
            </motion.div>
          )}

          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm rounded-2xl flex items-center gap-3"
            >
              <CheckCircle2 size={18} />
              {success}
            </motion.div>
          )}

          {!isLogin && (
            <div className="flex p-1.5 bg-gray-50 rounded-2xl mb-8 border border-gray-100">
              <button 
                onClick={() => setRole('customer')}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${role === 'customer' ? 'bg-white shadow-lg text-indigo-600' : 'text-gray-400'}`}
              >
                Customer
              </button>
              <button 
                onClick={() => setRole('worker')}
                className={`flex-1 py-3 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${role === 'worker' ? 'bg-white shadow-lg text-indigo-600' : 'text-gray-400'}`}
              >
                Worker
              </button>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleAuth}>
            {!isLogin && (
              <div className="space-y-1">
                <div className="relative">
                  <User className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.fullName ? 'text-red-400' : 'text-gray-400'}`} size={18} />
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name" 
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 border ${errors.fullName ? 'border-red-200 bg-red-50/30' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-indigo-300 outline-none transition-all placeholder:text-gray-400 font-medium`}
                  />
                </div>
                {errors.fullName && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.fullName}</p>}
              </div>
            )}

            <div className="space-y-1">
              <div className="relative">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} size={18} />
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address" 
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border ${errors.email ? 'border-red-200 bg-red-50/30' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-indigo-300 outline-none transition-all placeholder:text-gray-400 font-medium`}
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.email}</p>}
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <div className="relative">
                  <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.phone ? 'text-red-400' : 'text-gray-400'}`} size={18} />
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone Number" 
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 border ${errors.phone ? 'border-red-200 bg-red-50/30' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-indigo-300 outline-none transition-all placeholder:text-gray-400 font-medium`}
                  />
                </div>
                {errors.phone && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.phone}</p>}
              </div>
            )}

            <div className="space-y-1">
              <div className="relative">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} size={18} />
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password" 
                  className={`w-full pl-12 pr-4 py-4 bg-gray-50 border ${errors.password ? 'border-red-200 bg-red-50/30' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-indigo-300 outline-none transition-all placeholder:text-gray-400 font-medium`}
                />
              </div>
              {errors.password && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 ${errors.confirmPassword ? 'text-red-400' : 'text-gray-400'}`} size={18} />
                  <input 
                    type="password" 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password" 
                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 border ${errors.confirmPassword ? 'border-red-200 bg-red-50/30' : 'border-transparent'} rounded-2xl focus:bg-white focus:border-indigo-300 outline-none transition-all placeholder:text-gray-400 font-medium`}
                  />
                </div>
                {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold ml-4 uppercase tracking-tighter">{errors.confirmPassword}</p>}
              </div>
            )}
            
            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-xs font-bold text-indigo-600 hover:underline uppercase tracking-widest">Forgot password?</button>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait group mt-4"
            >
              {loading ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-8">
              <div className="flex-1 border-t border-gray-100"></div>
              <span className="px-6 text-[10px] font-black text-gray-400 bg-white uppercase tracking-[0.2em]">Or continue with</span>
              <div className="flex-1 border-t border-gray-100"></div>
            </div>

            <button 
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-4 py-4 border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-indigo-200 transition-all font-bold text-sm disabled:opacity-50 group"
            >
              <div className="w-6 h-6 bg-red-50 group-hover:bg-red-100 rounded-full flex items-center justify-center transition-colors">
                <span className="text-[10px] text-red-600 font-black">G</span>
              </div>
              Continue with Google
            </button>
          </div>
          
          <div className="mt-10 text-center text-sm text-gray-500 font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
                setSuccess('');
              }}
              className="font-black text-indigo-600 hover:underline ml-1 uppercase tracking-tighter"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

