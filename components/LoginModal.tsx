
import React, { useState, useEffect } from 'react';
import { useLanguage, User } from '../types';
import { supabase } from '../services/supabaseClient';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
        setEmail('');
        setPassword('');
        setFullName('');
        setErrorMessage('');
        setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors = { email: '', password: '' };
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    setErrors(newErrors);
    return isValid;
  };

  const handleSupabaseAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrorMessage('');

    try {
        if (isSignUp) {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });
            if (error) throw error;
            if (data.user) {
                // For Supabase, auto-login might not happen if email confirmation is on. 
                // But typically it returns a session if configured or prompts to check email.
                // If session exists, we log them in.
                if (data.session) {
                     const user: User = {
                        name: data.user.user_metadata.full_name || email.split('@')[0],
                        email: data.user.email || email,
                    };
                    onLogin(user);
                } else {
                    setErrorMessage('Please check your email to confirm your registration.');
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
                    picture: data.user.user_metadata.avatar_url
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

  const SocialButton: React.FC<{ icon: React.ReactNode; text: string; onClick: () => void; className?: string }> = ({ icon, text, onClick, className }) => (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-md text-sm font-medium transition-colors shadow-sm ${className}`}
    >
      {icon}
      <span>{text}</span>
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="login-modal-title">
      <div
        className="bg-white text-slate-800 rounded-lg shadow-xl w-full max-w-sm mx-4 border border-slate-200"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-5 border-b border-slate-200 flex justify-between items-center">
          <h2 id="login-modal-title" className="text-xl font-bold">{isSignUp ? 'Create Account' : t('loginModal.title')}</h2>
          <button type="button" onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <main className="p-8 space-y-6">
           <div className="space-y-4">
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
                text={isSignUp ? "Sign up with Google" : "Sign in with Google"}
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
              />
          </div>
          <div className="flex items-center text-xs text-slate-400">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4">{t('loginModal.or')}</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>
          
          <form onSubmit={handleSupabaseAuth} className="space-y-4">
            {isSignUp && (
                <div>
                    <label htmlFor="fullName" className="sr-only">Full Name</label>
                    <input 
                        type="text" 
                        id="fullName" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name" 
                        className="w-full bg-slate-100 rounded-md p-3 focus:outline-none transition-colors border border-slate-300 focus:ring-2 focus:ring-corp-blue-dark"
                        required 
                    />
                </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">{t('loginModal.emailPlaceholder')}</label>
              <input 
                type="email" 
                id="email" 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(p => ({ ...p, email: '' }));
                }}
                placeholder={t('loginModal.emailPlaceholder')} 
                className={`w-full bg-slate-100 rounded-md p-3 focus:outline-none transition-colors ${errors.email ? 'border border-red-500 ring-2 ring-red-500/50' : 'border border-slate-300 focus:ring-2 focus:ring-corp-blue-dark'}`}
                required 
              />
              {errors.email && <p className="mt-2 text-sm text-red-500 animate-fade-in">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">{t('loginModal.passwordPlaceholder')}</label>
              <input 
                type="password" 
                id="password" 
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(p => ({ ...p, password: '' }));
                }}
                placeholder={t('loginModal.passwordPlaceholder')} 
                className={`w-full bg-slate-100 rounded-md p-3 focus:outline-none transition-colors ${errors.password ? 'border border-red-500 ring-2 ring-red-500/50' : 'border border-slate-300 focus:ring-2 focus:ring-corp-blue-dark'}`}
                required 
              />
              {errors.password && <p className="mt-2 text-sm text-red-500 animate-fade-in">{errors.password}</p>}
            </div>
            
            {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md">
                    {errorMessage}
                </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-3 bg-corp-blue-dark text-white font-semibold rounded-md hover:bg-corp-blue-dark/90 transition-colors disabled:opacity-70 flex justify-center items-center">
              {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                  isSignUp ? 'Sign Up' : t('loginModal.loginButton')
              )}
            </button>
          </form>

          <div className="text-center text-sm text-slate-600">
              <p>
                  {isSignUp ? "Already have an account?" : "Don't have an account?"}
                  <button onClick={() => setIsSignUp(!isSignUp)} className="ml-1 text-corp-blue-dark font-bold hover:underline focus:outline-none">
                      {isSignUp ? 'Login' : 'Sign Up'}
                  </button>
              </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default LoginModal;
