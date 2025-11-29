
import React from 'react';
import { useLanguage, Page, Article } from '../types';
import SEO from './SEO';

interface HomePageProps {
    setPage: (page: Page) => void;
    articles: Article[];
    onSelectArticle: (article: Article) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage, articles, onSelectArticle }) => {
    const { t, language } = useLanguage();
    
    // Show the 3 most recent articles
    const recentArticles = articles.slice(0, 3);

    const whyChooseUsItems = [
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: t('home.whyUs.item1.title'), desc: t('home.whyUs.item1.desc') }, // Price Guarantee
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, title: t('home.whyUs.item2.title'), desc: t('home.whyUs.item2.desc') }, // Fast Logistics
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>, title: t('home.whyUs.item3.title'), desc: t('home.whyUs.item3.desc') }, // Credit Purchase
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>, title: t('home.whyUs.item4.title'), desc: t('home.whyUs.item4.desc') }  // Quality Guarantee
    ];

    return (
        <div className="animate-fade-in">
            <SEO 
                title={t('home.hero.mainTitle')} 
                description="استیل آنلاین ۲۰، مرجع تخصصی قیمت روز آهن‌آلات، میلگرد، تیرآهن و ورق. خرید نقدی و اعتباری با تضمین بهترین قیمت و کیفیت." 
                image="https://i.sstatic.net/MBH09S1p.png"
            />
            {/* Hero Section */}
            <section className="relative py-32 sm:py-48 text-white overflow-hidden bg-slate-900">
                {/* Optimized LCP Image */}
                {/* Mobile: object-contain to ensure whole image is seen. Desktop: object-cover for full width hero */}
                <img 
                    src="https://i.sstatic.net/MBH09S1p.png" 
                    alt="Industrial Steel Construction Site" 
                    className="absolute inset-0 w-full h-full md:object-cover object-contain object-center z-0 bg-slate-900"
                    width="1920" 
                    height="1080"
                    fetchPriority="high" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#6B0029]/90 to-[#620025]/70 z-10 opacity-90 sm:opacity-100"></div>
                <div className="container mx-auto px-4 relative z-20 text-center">
                    <p className="text-lg sm:text-xl font-light text-slate-200">{t('hero.title')}</p>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mt-4 leading-tight">
                        {t('home.hero.mainTitle')}
                    </h1>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <button onClick={() => setPage('test_recommender')} className="px-8 py-4 bg-corp-teal text-white font-semibold rounded-md hover:bg-corp-teal-dark transition-colors shadow-lg flex items-center gap-2 touch-manipulation">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                           {t('hero.cta')}
                        </button>
                         <button onClick={() => setPage('tools')} className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-md hover:bg-white hover:text-corp-red-dark transition-colors shadow-lg touch-manipulation">
                           {t('home.hero.aboutButton')}
                        </button>
                    </div>
                </div>
            </section>
            
            {/* Info Bar */}
            <section className="bg-white border-b border-slate-200 shadow-sm relative z-20 -mt-6 mx-4 sm:mx-8 lg:mx-16 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100">
                    <div className="p-6 flex items-center gap-4">
                        <div className="text-corp-red text-4xl flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-800">{t('home.infoBar.call.title')}</h2>
                            <p className="text-corp-teal font-mono text-lg font-bold dir-ltr">{t('home.infoBar.call.value')}</p>
                        </div>
                    </div>
                    <div className="p-6 flex items-center gap-4">
                        <div className="text-corp-red text-4xl flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-800">{t('home.infoBar.email.title')}</h2>
                            <p className="text-slate-500 font-mono text-sm">{t('home.infoBar.email.value')}</p>
                        </div>
                    </div>
                     <div className="p-6 flex items-center gap-4">
                        <div className="text-corp-red text-4xl flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-800">{t('home.infoBar.location.title')}</h2>
                            <p className="text-slate-500 text-sm">{t('home.infoBar.location.value')}</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Featured Blocks */}
             <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow group">
                            <div className="w-12 h-12 bg-red-50 text-corp-red rounded-lg flex items-center justify-center mb-4 group-hover:bg-corp-red group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            </div>
                            <h2 className="text-xl font-bold mb-2 text-slate-900">{t('home.featuredBlocks.block1.title')}</h2>
                            <p className="text-sm text-slate-600 mb-6 leading-relaxed">{t('home.featuredBlocks.block1.desc')}</p>
                            <button onClick={() => setPage('content_hub')} className="text-corp-teal font-semibold text-sm hover:underline p-2 -ml-2">{t('home.featuredBlocks.button')} &rarr;</button>
                        </div>
                        <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow group">
                            <div className="w-12 h-12 bg-red-50 text-corp-red rounded-lg flex items-center justify-center mb-4 group-hover:bg-corp-red group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <h2 className="text-xl font-bold mb-2 text-slate-900">{t('home.featuredBlocks.block2.title')}</h2>
                            <p className="text-sm text-slate-600 mb-6 leading-relaxed">{t('home.featuredBlocks.block2.desc')}</p>
                            <button onClick={() => setPage('partnerships')} className="text-corp-teal font-semibold text-sm hover:underline p-2 -ml-2">{t('home.featuredBlocks.button')} &rarr;</button>
                        </div>
                        <div className="bg-corp-red text-white p-8 rounded-xl shadow-lg">
                            <h2 className="text-xl font-bold mb-4">{t('home.featuredBlocks.block3.title')}</h2>
                            <ul className="space-y-3 text-sm">
                               <li className="flex items-center gap-2"><svg className="h-4 w-4 text-corp-teal" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> {t('home.featuredBlocks.block3.line1')}</li>
                               <li className="flex items-center gap-2"><svg className="h-4 w-4 text-corp-teal" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> {t('home.featuredBlocks.block3.line2')}</li>
                               <li className="flex items-center gap-2"><svg className="h-4 w-4 text-corp-teal" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> {t('home.featuredBlocks.block3.line3')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section id="faq" className="py-16 sm:py-24">
                 <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{t('home.whyUs.title')}</h2>
                        <p className="mt-3 text-slate-600">{t('home.whyUs.subtitle')}</p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {whyChooseUsItems.map(item => (
                            <div key={item.title} className="text-center p-6 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-all">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-50 text-corp-red mx-auto mb-4">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                                <p className="text-sm text-slate-500 mt-2">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                 </div>
            </section>
            
            {/* From Our Blog Section */}
            <section className="py-16 sm:py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{t('home.blog.title')}</h2>
                        <p className="mt-3 text-slate-600">{t('home.blog.subtitle')}</p>
                    </div>
                    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recentArticles.map(article => (
                            <div key={article.id} className="group flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden hover:shadow-xl transition-shadow">
                                <button onClick={() => onSelectArticle(article)} className="block overflow-hidden relative">
                                    <img 
                                        src={article.image} 
                                        alt={article.title[language]} 
                                        className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                        width="400"
                                        height="300"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                        <span className="text-xs font-bold text-white bg-corp-red px-2 py-1 rounded">{article.category[language]}</span>
                                    </div>
                                </button>
                                <div className="p-6 flex flex-col flex-grow">
                                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {article.date[language]}
                                    </p>
                                    <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-corp-red transition-colors">
                                        <button onClick={() => onSelectArticle(article)}>{article.title[language]}</button>
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed flex-grow">{article.excerpt[language]}</p>
                                    <div className="mt-4 pt-4 border-t border-slate-100">
                                        <button onClick={() => onSelectArticle(article)} className="text-sm font-semibold text-corp-teal hover:underline flex items-center gap-1 p-2 -ml-2">
                                            {t('blogPage.readMore')} 
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

             {/* Partners/Clients */}
             <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-center text-xl font-bold text-slate-400 mb-8 uppercase tracking-widest">{t('home.partners.title')}</h2>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
                        {[
                            'https://ahanonline.com/resize/?file=https://contents.ahanonline.com/site/2c32ece75597560c3ac09274394f950a.png&format=webp', 
                            'https://ahanonline.com/resize/?file=https://contents.ahanonline.com/site/57f1a453ec9b3c3a147794d1993a3f8c.png&format=webp', 
                            'https://ahanonline.com/resize/?file=https://contents.ahanonline.com/site/f408d553d26e51d1d4da5e898d498f21.png&format=webp', 
                            'https://ahanonline.com/resize/?file=https://contents.ahanonline.com/site/39049d49715f83f5a2eef34e727bdf2c.png&format=webp',
                        ].map((logo, index) => (
                            <img 
                                key={index} 
                                src={logo} 
                                alt={`Partner logo ${index + 1}`} 
                                className="h-16 sm:h-20 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all hover:scale-110"
                                loading="lazy"
                                width="100"
                                height="80"
                            />
                        ))}
                    </div>
                </div>
             </section>

        </div>
    );
};

export default HomePage;
