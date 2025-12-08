
import React from 'react';
import { useLanguage, Page } from '../types';

interface SiteFooterProps {
    setPage: (page: Page) => void;
}

const SiteFooter: React.FC<SiteFooterProps> = ({ setPage }) => {
    const { t } = useLanguage();

    const quickLinks = {
        'Products': [
            { label: t('products.food_feed.title'), page: 'home' },
            { label: t('products.microbiology.title'), page: 'home' },
            { label: t('products.environmental.title'), page: 'home' },
        ],
        'Services': [
            { label: t('header.recommendationEngine'), page: 'test_recommender' },
            { label: t('header.tools'), page: 'tools' },
            { label: t('header.distributorFinder'), page: 'sample_dropoff' },
            { label: t('header.partnerships'), page: 'partnerships' },
        ],
    };

    return (
        <footer id="footer" className="bg-slate-900 text-slate-300">
            {/* Newsletter Section - Red for Action */}
            <div className="bg-corp-red">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">{t('home.newsletter.title')}</h2>
                        <p className="text-sm text-red-100 mt-1 font-medium">{t('home.newsletter.subtitle')}</p>
                    </div>
                    <form className="flex items-center gap-3">
                        <input 
                            type="email" 
                            placeholder={t('home.newsletter.placeholder')} 
                            className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:outline-none focus:bg-white/20 transition-all text-sm"
                            aria-label="Email for newsletter"
                        />
                        <button type="submit" className="px-6 py-3 bg-white text-corp-red font-bold rounded-lg hover:bg-red-50 transition-colors shadow-lg">
                            {t('home.newsletter.button')}
                        </button>
                    </form>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        <h3 className="font-bold text-white text-lg border-b border-slate-800 pb-3 inline-block">{t('home.footer.col1.title')}</h3>
                        
                        <div className="space-y-4 text-sm leading-relaxed text-slate-400">
                             {/* Address */}
                             <div className="flex items-start gap-3 group">
                                <div className="mt-1 p-1 bg-slate-800 rounded text-corp-red group-hover:text-white group-hover:bg-corp-red transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                </div>
                                <p className="group-hover:text-slate-200 transition-colors">{t('footer.contactInfo')}</p>
                             </div>

                             {/* Phone */}
                             <div className="flex items-center gap-3 group">
                                <div className="p-1 bg-slate-800 rounded text-corp-red group-hover:text-white group-hover:bg-corp-red transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" /></svg>
                                </div>
                                <a href="tel:+982122041655" className="hover:text-white dir-ltr font-mono font-bold text-lg tracking-wide group-hover:text-white transition-colors">{t('home.infoBar.call.value')}</a>
                             </div>

                             {/* Email */}
                             <div className="flex items-center gap-3 group">
                                <div className="p-1 bg-slate-800 rounded text-corp-red group-hover:text-white group-hover:bg-corp-red transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                                </div>
                                <a href="mailto:sales@steelonline20.com" className="hover:text-white font-mono group-hover:text-white transition-colors">sales@steelonline20.com</a>
                             </div>

                             {/* Working Hours */}
                             <div className="flex items-center gap-3 group">
                                <div className="p-1 bg-slate-800 rounded text-corp-red group-hover:text-white group-hover:bg-corp-red transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                                </div>
                                <p className="group-hover:text-slate-200 transition-colors">{t('footer.workingHours')}</p>
                             </div>
                        </div>

                         {/* Map Links */}
                         <div className="pt-4 border-t border-slate-800 mt-2">
                            <h4 className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">Find us on:</h4>
                            <div className="flex gap-2 flex-wrap">
                                <a href="https://www.google.com/maps/search/?api=1&query=35.78193,51.42218" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 group">
                                   <img src="https://www.google.com/images/branding/product/ico/maps15_bnuw3a_32dp.ico" alt="" className="w-3 h-3 grayscale group-hover:grayscale-0 transition-all" width="12" height="12"/> 
                                   <span className="group-hover:text-white">Google</span>
                                </a>
                                <a href="https://neshan.org/maps/municipal/836ca735770943cdb97e6566686dac0d" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 group">
                                    <img src="https://neshan.org/favicon.ico" alt="" className="w-3 h-3 grayscale group-hover:grayscale-0 transition-all" width="12" height="12"/> 
                                    <span className="group-hover:text-white">Neshan</span>
                                </a>
                                <a href="https://balad.ir/maps/tehran/amaniyeh#14.43/35.78193/51.42218" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2 group">
                                    <img src="https://balad.ir/favicon.ico" alt="" className="w-3 h-3 grayscale group-hover:grayscale-0 transition-all" width="12" height="12"/> 
                                    <span className="group-hover:text-white">Balad</span>
                                </a>
                            </div>
                         </div>
                    </div>

                    {/* Products */}
                     <div>
                        <h3 className="font-bold text-white text-lg border-b border-slate-800 pb-3 inline-block">{t('home.footer.col2.title')}</h3>
                        <ul className="space-y-3 mt-6 text-sm">
                            {quickLinks['Products'].map((link, idx) => (
                                <li key={idx}>
                                    <button onClick={() => setPage(link.page as Page)} className="hover:text-corp-blue-light transition-colors text-left rtl:text-right w-full flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-corp-blue-light transition-colors"></span>
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Services */}
                    <div>
                        <h3 className="font-bold text-white text-lg border-b border-slate-800 pb-3 inline-block">{t('home.footer.col3.title')}</h3>
                         <ul className="space-y-3 mt-6 text-sm">
                            {quickLinks['Services'].map((link, idx) => (
                                <li key={idx}>
                                    <button onClick={() => setPage(link.page as Page)} className="hover:text-corp-blue-light transition-colors text-left w-full rtl:text-right flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 bg-slate-600 rounded-full group-hover:bg-corp-blue-light transition-colors"></span>
                                        {link.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                    
                    {/* Contact Form */}
                    <div>
                        <h3 className="font-bold text-white text-lg border-b border-slate-800 pb-3 inline-block">{t('home.footer.col4.title')}</h3>
                        <form className="space-y-3 mt-6">
                            <input type="email" placeholder={t('home.footer.col4.email')} className="w-full bg-slate-800 border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 text-sm focus:ring-1 focus:ring-corp-blue focus:border-corp-blue focus:outline-none transition-all" aria-label="Your email"/>
                            <textarea placeholder={t('home.footer.col4.message')} rows={3} className="w-full bg-slate-800 border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-500 text-sm focus:ring-1 focus:ring-corp-blue focus:border-corp-blue focus:outline-none transition-all" aria-label="Your message"></textarea>
                            <button type="submit" className="w-full px-4 py-2.5 bg-slate-700 text-white font-semibold rounded-lg hover:bg-corp-blue transition-colors text-sm border border-slate-600 hover:border-corp-blue">
                                {t('home.footer.col4.button')}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            
            <div className="bg-slate-950 border-t border-slate-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p className="font-medium">{t('footer.copyright')}</p>
                    <div className="flex gap-4 items-center">
                         <span className="opacity-50 hover:opacity-100 transition-opacity">Privacy Policy</span>
                         <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                         <span className="opacity-50 hover:opacity-100 transition-opacity">Terms of Service</span>
                         <div className="w-px h-4 bg-slate-700 mx-2"></div>
                         <img src="https://trustseal.enamad.ir/logo.aspx?id=155864&Code=ar6IDMFRdHkoKTNAXlsv" alt="Enamad Trust Seal" className="h-8 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" width="32" height="32" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default SiteFooter;
