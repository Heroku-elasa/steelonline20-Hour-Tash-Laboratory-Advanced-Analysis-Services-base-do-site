
import React, { useState, useEffect } from 'react';
import { useLanguage, User } from '../types';
import { supabase } from '../services/supabaseClient';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

type AuthMode = 'login' | 'signup' | 'admin' | 'phone';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const { t, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '', phone: '' });

  useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setFullName('');
      setPhone('');
      setVerificationCode('');
      setErrorMessage('');
      setLoading(false);
      setCodeSent(false);
      setAuthMode('login');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors = { email: '', password: '', phone: '' };
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (authMode === 'phone') {
      if (!phone || phone.length < 10) {
        newErrors.phone = language === 'fa' ? 'شماره تلفن معتبر نیست' : 'Invalid phone number';
        isValid = false;
      }
    } else if (authMode !== 'admin') {
      if (!email) {
        newErrors.email = t('validation.required');
        isValid = false;
      } else if (!emailRegex.test(email)) {
        newErrors.email = t('validation.email');
        isValid = false;
      }

      if (!password) {
        newErrors.password = t('validation.required');
        isValid = false;
      } else if (password.length < 6) {
        newErrors.password = t('validation.passwordLength');
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    // SECURITY WARNING: These credentials are hardcoded for development/demo purposes only.
    // For production, use environment variables or a secure authentication system.
    // TODO: Replace with secure authentication before deploying to production.
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin';

    if (email === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        name: 'Administrator',
        email: 'admin@steelonline20.com',
        role: 'admin',
        picture: undefined
      };
      onLogin(adminUser);
    } else {
      setErrorMessage(language === 'fa' ? 'نام کاربری یا رمز عبور اشتباه است' : 'Invalid admin credentials');
    }
    setLoading(false);
  };

  const handleSupabaseAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      if (authMode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: 'user',
            },
          },
        });
        if (error) throw error;
        if (data.user) {
          if (data.session) {
            const user: User = {
              name: data.user.user_metadata.full_name || email.split('@')[0],
              email: data.user.email || email,
              role: 'user',
            };
            onLogin(user);
          } else {
            setErrorMessage(language === 'fa' ? 'لطفاً ایمیل خود را برای تأیید بررسی کنید.' : 'Please check your email to confirm your registration.');
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.user && data.session) {
          const user: User = {
            name: data.user.user_metadata.full_name || email.split('@')[0],
            email: data.user.email || email,
            picture: data.user.user_metadata.avatar_url,
            role: data.user.user_metadata.role || 'user',
          };
          onLogin(user);
        }
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      if (error) throw error;
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMessage('');

    try {
      if (!codeSent) {
        const { error } = await supabase.auth.signInWithOtp({
          phone: phone.startsWith('+') ? phone : `+98${phone.replace(/^0/, '')}`,
        });
        if (error) throw error;
        setCodeSent(true);
        setErrorMessage('');
      } else {
        const { data, error } = await supabase.auth.verifyOtp({
          phone: phone.startsWith('+') ? phone : `+98${phone.replace(/^0/, '')}`,
          token: verificationCode,
          type: 'sms',
        });
        if (error) throw error;
        if (data.user && data.session) {
          const user: User = {
            name: data.user.phone || phone,
            email: data.user.email || '',
            phone: data.user.phone,
            role: 'user',
          };
          onLogin(user);
        }
      }
    } catch (error: any) {
      setErrorMessage(error.message || (language === 'fa' ? 'خطا در احراز هویت' : 'Authentication failed'));
    } finally {
      setLoading(false);
    }
  };

  const SocialButton: React.FC<{ icon: React.ReactNode; text: string; onClick: () => void; className?: string }> = ({ icon, text, onClick, className }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg text-sm font-medium transition-all shadow-sm ${className}`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );

  const AuthModeButton: React.FC<{ mode: AuthMode; label: string; icon: React.ReactNode }> = ({ mode, label, icon }) => (
    <button
      type="button"
      onClick={() => { setAuthMode(mode); setErrorMessage(''); setCodeSent(false); }}
      className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
        authMode === mode 
          ? 'bg-corp-red text-white shadow-lg' 
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="bg-white text-slate-800 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <header className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">
                {authMode === 'admin' 
                  ? (language === 'fa' ? 'ورود مدیر' : 'Admin Login')
                  : authMode === 'signup' 
                    ? (language === 'fa' ? 'ثبت نام' : 'Create Account')
                    : authMode === 'phone'
                      ? (language === 'fa' ? 'ورود با موبایل' : 'Phone Login')
                      : (language === 'fa' ? 'ورود' : 'Sign In')
                }
              </h2>
              <p className="text-slate-300 text-sm mt-1">Steel Online 20</p>
            </div>
            <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition-colors" aria-label="Close">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </header>

        <main className="p-6 space-y-5">
          <div className="flex gap-2">
            <AuthModeButton 
              mode="login" 
              label={language === 'fa' ? 'ورود' : 'Login'}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>}
            />
            <AuthModeButton 
              mode="signup" 
              label={language === 'fa' ? 'ثبت نام' : 'Sign Up'}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>}
            />
            <AuthModeButton 
              mode="admin" 
              label={language === 'fa' ? 'مدیر' : 'Admin'}
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
            />
          </div>

          {authMode === 'admin' ? (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <span>{language === 'fa' ? 'دسترسی مخصوص مدیران سایت' : 'Admin access only'}</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {language === 'fa' ? 'نام کاربری' : 'Username'}
                </label>
                <input 
                  type="text" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'fa' ? 'نام کاربری مدیر' : 'Admin username'}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-corp-red"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {language === 'fa' ? 'رمز عبور' : 'Password'}
                </label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-corp-red"
                  required 
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                  {errorMessage}
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-all disabled:opacity-70 flex justify-center items-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    {language === 'fa' ? 'ورود به پنل مدیریت' : 'Enter Admin Panel'}
                  </>
                )}
              </button>
            </form>
          ) : authMode === 'phone' ? (
            <form onSubmit={handlePhoneAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {language === 'fa' ? 'شماره موبایل' : 'Phone Number'}
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-slate-100 border border-e-0 border-slate-300 rounded-s-lg text-slate-500 text-sm">
                    +98
                  </span>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9121234567"
                    className="flex-1 bg-slate-50 border border-slate-300 rounded-e-lg p-3 focus:outline-none focus:ring-2 focus:ring-corp-red"
                    disabled={codeSent}
                    required 
                  />
                </div>
                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
              </div>

              {codeSent && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {language === 'fa' ? 'کد تأیید' : 'Verification Code'}
                  </label>
                  <input 
                    type="text" 
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    maxLength={6}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-corp-red text-center text-2xl tracking-widest"
                    required 
                  />
                </div>
              )}

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                  {errorMessage}
                </div>
              )}

              <button type="submit" disabled={loading} className="w-full py-3 bg-corp-red text-white font-bold rounded-lg hover:bg-red-700 transition-all disabled:opacity-70 flex justify-center items-center gap-2">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : codeSent ? (
                  language === 'fa' ? 'تأیید کد' : 'Verify Code'
                ) : (
                  language === 'fa' ? 'ارسال کد' : 'Send Code'
                )}
              </button>

              <button type="button" onClick={() => setAuthMode('login')} className="w-full text-sm text-slate-500 hover:text-corp-red">
                {language === 'fa' ? 'ورود با ایمیل' : 'Login with Email'}
              </button>
            </form>
          ) : (
            <>
              <div className="space-y-3">
                <SocialButton
                  onClick={handleGoogleLogin}
                  icon={
                    <svg className="w-5 h-5" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path>
                      <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path>
                      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.618-3.354-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"></path>
                      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.011 35.636 44 30.138 44 24c0-1.341-.138-2.65-.389-3.917z"></path>
                    </svg>
                  }
                  text={authMode === 'signup' 
                    ? (language === 'fa' ? 'ثبت نام با گوگل' : 'Sign up with Google')
                    : (language === 'fa' ? 'ورود با گوگل' : 'Sign in with Google')
                  }
                  className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:shadow-md"
                />

                <SocialButton
                  onClick={() => setAuthMode('phone')}
                  icon={
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  }
                  text={language === 'fa' ? 'ورود با شماره موبایل' : 'Sign in with Phone'}
                  className="bg-slate-100 text-slate-700 hover:bg-slate-200"
                />
              </div>

              <div className="flex items-center text-xs text-slate-400">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-4">{t('loginModal.or')}</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>
              
              <form onSubmit={handleSupabaseAuth} className="space-y-4">
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {language === 'fa' ? 'نام کامل' : 'Full Name'}
                    </label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={language === 'fa' ? 'نام و نام خانوادگی' : 'Your full name'}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-corp-red"
                      required 
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {language === 'fa' ? 'ایمیل' : 'Email'}
                  </label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors(p => ({ ...p, email: '' }));
                    }}
                    placeholder={t('loginModal.emailPlaceholder')} 
                    className={`w-full bg-slate-50 rounded-lg p-3 focus:outline-none transition-all ${errors.email ? 'border-2 border-red-500 ring-2 ring-red-500/20' : 'border border-slate-300 focus:ring-2 focus:ring-corp-red'}`}
                    required 
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {language === 'fa' ? 'رمز عبور' : 'Password'}
                  </label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors(p => ({ ...p, password: '' }));
                    }}
                    placeholder="••••••••" 
                    className={`w-full bg-slate-50 rounded-lg p-3 focus:outline-none transition-all ${errors.password ? 'border-2 border-red-500 ring-2 ring-red-500/20' : 'border border-slate-300 focus:ring-2 focus:ring-corp-red'}`}
                    required 
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                </div>
                
                {errorMessage && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                    {errorMessage}
                  </div>
                )}

                <button type="submit" disabled={loading} className="w-full py-3 bg-corp-red text-white font-bold rounded-lg hover:bg-red-700 transition-all disabled:opacity-70 flex justify-center items-center">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    authMode === 'signup' 
                      ? (language === 'fa' ? 'ثبت نام' : 'Sign Up')
                      : (language === 'fa' ? 'ورود' : 'Sign In')
                  )}
                </button>
              </form>
            </>
          )}
        </main>

        <footer className="px-6 pb-6 text-center text-xs text-slate-500">
          <p>
            {language === 'fa' 
              ? 'با ورود به سایت، شرایط و قوانین را می‌پذیرید.' 
              : 'By signing in, you agree to our Terms of Service.'
            }
          </p>
        </footer>
      </div>
    </div>
  );
};

export default LoginModal;
