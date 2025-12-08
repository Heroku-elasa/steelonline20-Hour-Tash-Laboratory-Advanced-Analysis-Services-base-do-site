
import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Page, User } from '../types';

interface SiteHeaderProps {
    currentPage: Page;
    setPage: (page: Page) => void;
    isAuthenticated: boolean;
    user: User | null;
    onLoginClick: () => void;
    onLogoutClick: () => void;
    onSearchClick: () => void;
}

const SiteHeader: React.FC<SiteHeaderProps> = ({ currentPage, setPage, isAuthenticated, user, onLoginClick, onLogoutClick, onSearchClick }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handlePageChange = (page: Page) => {
      setPage(page);
      setIsMobileMenuOpen(false);
      window.scrollTo(0, 0);
  }
  
  const navLinks: { key: Page, text: string, action: () => void }[] = [
    { key: 'home', text: t('header.home'), action: () => handlePageChange('home') },
    { key: 'prices', text: 'قیمت آهن', action: () => handlePageChange('prices') },
    { key: 'iron_snapp', text: t('header.ironSnapp'), action: () => handlePageChange('iron_snapp') },
    { key: 'map_finder', text: 'یافتن انبار', action: () => handlePageChange('map_finder') },
    { key: 'tools', text: t('header.tools'), action: () => handlePageChange('tools') },
    { key: 'blog', text: t('header.blog'), action: () => handlePageChange('blog') },
  ];

  const SocialIcon: React.FC<{ href: string; children: React.ReactNode; label: string }> = ({ href, children, label }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-corp-red transition-colors" aria-label={label}>
      {children}
    </a>
  );

  return (
    <header className="bg-white sticky top-0 z-50 shadow-md">
      {/* Top Bar */}
      <div className="bg-slate-100 border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <SocialIcon href="https://t.me/steelonline20" label="Telegram">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22,3.13,1.5,10.61,8.37,13,10.88,20.5,17.2,14.65Z"/></svg>
            </SocialIcon>
            <SocialIcon href="https://www.instagram.com/steelonline20/" label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12,2.163c3.204,0,3.584.012,4.85.07,3.252.148,4.771,1.691,4.919,4.919.058,1.265.069,1.645.069,4.85s-.012,3.584-.07,4.85c-.148,3.225-1.664,4.771-4.919,4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.07,4.85c.148-3.225,1.664-4.771,4.919-4.919C8.416,2.175,8.796,2.163,12,2.163M12,0C8.74,0,8.333.014,7.053.072,2.695.272.273,2.69.073,7.052.014,8.333,0,8.74,0,12s.014,3.667.072,4.947c.2,4.358,2.618,6.78,6.98,6.98C8.333,23.986,8.74,24,12,24s3.667-.014,4.947-.072c4.358-.2,6.78-2.618,6.98-6.98C23.986,15.667,24,15.259,24,12s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98C15.667.014,15.259,0,12,0Zm0,5.838a6.162,6.162,0,1,0,0,12.324A6.162,6.162,0,0,0,12,5.838Zm0,10.162a4,4,0,1,1,0-8,4,4,0,0,1,0,8Zm6.406-11.845a1.44,1.44,0,1,0,0,2.88,1.44,1.44,0,0,0,0-2.88Z"/></svg>
            </SocialIcon>
             <SocialIcon href="https://wa.me/989122041655" label="WhatsApp">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12.04,2A10,10,0,0,0,2,12.04,10,10,0,0,0,12.04,22c5.52,0,10-4.48,10-10A10,10,0,0,0,12.04,2ZM17.46,16a.4.4,0,0,1-.35.19,1,1,0,0,1-.53-.16l-2.43-1.48-1.46.88a4.92,4.92,0,0,1-2.92.1,4.86,4.86,0,0,1-2.48-2.18,4.72,4.72,0,0,1,.13-3.65,4.7,4.7,0,0,1,2.06-2.1,4.78,4.78,0,0,1,3.46-.17L14.9,8.7a.4.4,0,0,1,.14.54l-.45,1.08a.4.4,0,0,1-.54.14L12.5,9.75a1.59,1.59,0,0,0-1.25.12,1.56,1.56,0,0,0-.81,1,1.5,1.5,0,0,0,.14,1.18l.89.89.89.89.37.37a1.53,1.53,0,0,0,1.07.4,1.5,1.5,0,0,0,1-.26l1.58-.95a.4.4,0,0,1,.54.14l.45,1.08A.4.4,0,0,1,17.46,16Z"/></svg>
            </SocialIcon>
          </div>
          <div className="flex items-center gap-6 font-medium">
             <button className="hover:text-corp-red transition-colors" onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth'})}>FAQ</button>
             <a href="tel:+982122041655" className="hover:text-corp-red transition-colors font-mono dir-ltr" aria-label="Call Sales">021-22041655</a>
          </div>
        </div>
      </div>
      
      {/* Main Navigation */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center">
            <button onClick={() => setPage('home')} className="flex-shrink-0 flex items-center gap-2 group" aria-label="Go to Home">
               {!imgError ? (
                   <img 
                       src="https://i.sstatic.net/gwuhcFtI.png" 
                       alt="Steel Online 20" 
                       className="h-10 w-auto" 
                       width="40" 
                       height="40"
                       referrerPolicy="no-referrer"
                       onError={(e) => {
                           e.currentTarget.style.display = 'none';
                           setImgError(true);
                       }}
                   />
               ) : null}
               <span className={`text-xl font-bold text-slate-900 group-hover:text-corp-red transition-colors ${imgError ? 'block' : 'hidden sm:block md:hidden xl:block'}`}>
                   Steel Online 20
               </span>
            </button>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
             {navLinks.map(link => (
                  <button key={link.key} onClick={link.action} className={`text-slate-600 hover:text-corp-red px-3 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap ${currentPage === link.key ? 'text-corp-red bg-red-50' : ''}`}>
                    {link.text}
                  </button>
              ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-3">
             {isAuthenticated && user && (
                <button 
                    onClick={() => setPage(user.role === 'admin' ? 'admin_dashboard' : 'user_dashboard')} 
                    className="hidden sm:block px-3 py-1 bg-slate-800 text-white text-xs rounded hover:bg-slate-700 transition-colors"
                >
                    {t('header.dashboard')}
                </button>
            )}

            <button onClick={onSearchClick} className="p-2 text-slate-500 hover:text-corp-red transition-colors" aria-label="Search">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </button>
            <div className="relative" ref={langMenuRef}>
                <button onClick={() => setIsLangMenuOpen(!isLangMenuOpen)} className="p-2 text-slate-500 hover:text-corp-red transition-colors" aria-label="Change language">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m4 13l4-4M19 9l-4 4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </button>
                {isLangMenuOpen && (
                    <div className="absolute left-0 rtl:right-0 rtl:left-auto mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="p-1">
                            <button onClick={() => { setLanguage('en'); setIsLangMenuOpen(false); }} className={`w-full text-left block px-4 py-2 text-sm rounded-md ${language === 'en' ? 'bg-corp-red text-white' : 'text-slate-700 hover:bg-slate-100'}`}>English</button>
                            <button onClick={() => { setLanguage('fa'); setIsLangMenuOpen(false); }} className={`w-full text-left block px-4 py-2 text-sm rounded-md ${language === 'fa' ? 'bg-corp-red text-white' : 'text-slate-700 hover:bg-slate-100'}`}>فارسی</button>
                            <button onClick={() => { setLanguage('ar'); setIsLangMenuOpen(false); }} className={`w-full text-left block px-4 py-2 text-sm rounded-md ${language === 'ar' ? 'bg-corp-red text-white' : 'text-slate-700 hover:bg-slate-100'}`}>العربية</button>
                        </div>
                    </div>
                )}
            </div>
            
             <div className="hidden sm:block">
                {isAuthenticated && user ? (
                    <div className="flex items-center gap-2">
                        {user.picture && <img src={user.picture} alt={user.name} title={user.name} className="h-8 w-8 rounded-full" width="32" height="32"/>}
                        <button onClick={onLogoutClick} className="px-4 py-2 bg-corp-red text-white font-semibold rounded-md hover:bg-corp-red-dark transition-colors text-sm">
                            {t('header.logout')}
                        </button>
                    </div>
                ) : (
                    <button onClick={onLoginClick} className="px-4 py-2 bg-slate-100 border border-slate-300 text-slate-700 font-semibold rounded-md hover:bg-slate-200 transition-colors text-sm">
                        {t('header.login')}
                    </button>
                )}
            </div>
            
            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-100" aria-label="Open main menu">
                {isMobileMenuOpen ? (
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-fade-in absolute top-full left-0 w-full bg-white shadow-lg border-t border-slate-100 h-screen overflow-y-auto">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {isAuthenticated && user && (
                  <div className="px-3 py-2 flex items-center gap-3 border-b border-slate-200">
                      {user.picture && <img src={user.picture} alt={user.name} className="h-10 w-10 rounded-full" width="40" height="40" />}
                      <span className="font-semibold text-slate-800">{user.name}</span>
                  </div>
              )}
               <button onClick={() => { setPage('dashboard'); setIsMobileMenuOpen(false); }} className={`w-full text-right text-slate-700 hover:bg-red-50 hover:text-corp-red block px-3 py-2 rounded-md text-base font-medium ${currentPage === 'dashboard' ? 'bg-red-50 text-corp-red' : ''}`}>
                    {t('header.dashboard')}
               </button>
              {navLinks.map(link => (
                  <button key={link.key} onClick={link.action} className={`w-full text-right text-slate-700 hover:bg-red-50 hover:text-corp-red block px-3 py-2 rounded-md text-base font-medium ${currentPage === link.key ? 'bg-red-50 text-corp-red' : ''}`}>
                    {link.text}
                  </button>
              ))}
              <div className="pt-4 border-t border-slate-200">
                {isAuthenticated ? (
                     <button onClick={() => { onLogoutClick(); setIsMobileMenuOpen(false); }} className="w-full text-right text-slate-700 hover:bg-red-50 hover:text-corp-red block px-3 py-2 rounded-md text-base font-medium">
                        {t('header.logout')}
                    </button>
                ) : (
                    <button onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }} className="w-full text-right text-slate-700 hover:bg-red-50 hover:text-corp-red block px-3 py-2 rounded-md text-base font-medium">
                        {t('header.login')}
                    </button>
                )}
              </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;
