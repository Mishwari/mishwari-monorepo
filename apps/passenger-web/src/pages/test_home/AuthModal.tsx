import React, { useState } from 'react';
import { XMarkIcon, EnvelopeIcon, LockClosedIcon, ArrowRightOnRectangleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (userData: { email: string; name: string }) => void;
}

export default function AuthModal({ isOpen, onClose, onLogin }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }
    
    if (!password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const name = email.split('@')[0];
      onLogin({ email, name });
      setIsLoading(false);
      setEmail('');
      setPassword('');
      setErrors({});
      onClose();
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({ email: `user@${provider}.com`, name: 'مستخدم' });
      setIsLoading(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative shadow-2xl" style={{ zIndex: 10000 }}>
        <button onClick={onClose} className="absolute top-4 left-4 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors" disabled={isLoading}>
          <XMarkIcon className="w-5 h-5 text-slate-500" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
            <ArrowRightOnRectangleIcon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">مرحباً بعودتك</h2>
          <p className="text-slate-500 text-sm">سجل الدخول لإدارة حجوزاتك</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase mr-1">البريد الإلكتروني</label>
            <div className={`flex items-center gap-3 p-3 bg-slate-50 rounded-xl border transition-all ${errors.email ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'}`}>
              <EnvelopeIcon className="w-5 h-5 text-slate-400" />
              <input 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })); }}
                className="bg-transparent w-full text-sm font-medium outline-none text-slate-900"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <div className="flex items-center gap-1 text-xs text-red-600 mr-1">
                <ExclamationCircleIcon className="w-3 h-3" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase mr-1">كلمة المرور</label>
            <div className={`flex items-center gap-3 p-3 bg-slate-50 rounded-xl border transition-all ${errors.password ? 'border-red-500 ring-2 ring-red-100' : 'border-slate-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100'}`}>
              <LockClosedIcon className="w-5 h-5 text-slate-400" />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })); }}
                className="bg-transparent w-full text-sm font-medium outline-none text-slate-900"
                disabled={isLoading}
              />
            </div>
            {errors.password && (
              <div className="flex items-center gap-1 text-xs text-red-600 mr-1">
                <ExclamationCircleIcon className="w-3 h-3" />
                <span>{errors.password}</span>
              </div>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'جاري التسجيل...' : 'تسجيل الدخول'}
          </button>
          
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400 font-bold">أو تابع مع</span></div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button 
              type="button"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm text-slate-600 transition-colors disabled:opacity-50"
            >
              جوجل
            </button>
            <button 
              type="button"
              onClick={() => handleSocialLogin('facebook')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 font-bold text-sm text-slate-600 transition-colors disabled:opacity-50"
            >
              فيسبوك
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
