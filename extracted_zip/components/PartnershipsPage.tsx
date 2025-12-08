

import React from 'react';
import { useLanguage, Page } from '../types';

const PartnershipsPage: React.FC<{ setPage: (page: Page) => void; }> = ({ setPage }) => {
    const { t } = useLanguage();

    return (
        <div className="bg-slate-50 animate-fade-in">
            <section className="py-20 sm:py-28">
                <div className="container mx-auto px-4 max-w-2xl">
                     <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900">{t('partnerships.title')}</h1>
                        <p className="mt-4 text-lg text-slate-600">{t('partnerships.subtitle')}</p>
                     </div>
                     <form className="mt-12 space-y-6 bg-white rounded-lg p-8 shadow-lg border border-slate-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">{t('partnerships.name')}</label>
                                <input type="text" id="name" className="w-full bg-slate-100 border-slate-300 rounded-md p-3 focus:ring-corp-blue-dark focus:border-corp-blue-dark text-slate-800" />
                            </div>
                            <div>
                                <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-2">{t('partnerships.company')}</label>
                                <input type="text" id="company" className="w-full bg-slate-100 border-slate-300 rounded-md p-3 focus:ring-corp-blue-dark focus:border-corp-blue-dark text-slate-800" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">{t('partnerships.email')}</label>
                            <input type="email" id="email" className="w-full bg-slate-100 border-slate-300 rounded-md p-3 focus:ring-corp-blue-dark focus:border-corp-blue-dark text-slate-800" />
                        </div>
                        <div>
                             <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">{t('partnerships.message')}</label>
                             <textarea id="message" rows={5} className="w-full bg-slate-100 border-slate-300 rounded-md p-3 focus:ring-corp-blue-dark focus:border-corp-blue-dark text-slate-800"></textarea>
                        </div>
                        <div className="text-center pt-4">
                            <button type="submit" className="px-10 py-3 bg-corp-blue-dark text-white font-bold rounded-lg hover:bg-corp-blue-dark/90 transition-colors shadow-lg shadow-blue-500/20">
                                {t('partnerships.submit')}
                            </button>
                        </div>
                     </form>
                </div>
            </section>
        </div>
    );
};

export default PartnershipsPage;