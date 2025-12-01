
import React from 'react';
import { useLanguage, Page, Article } from '../types';
import SEO from './SEO';
import SchemaMarkup from './SchemaMarkup';

interface HomePageProps {
    setPage: (page: Page) => void;
    articles: Article[];
    onSelectArticle: (article: Article) => void;
}

const HomePage: React.FC<HomePageProps> = ({ setPage, articles, onSelectArticle }) => {
    const { t, language } = useLanguage();
    
    const recentArticles = articles.slice(0, 3);

    const whyChooseUsItems = [
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, title: t('home.whyUs.item1.title'), desc: t('home.whyUs.item1.desc') },
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, title: t('home.whyUs.item2.title'), desc: t('home.whyUs.item2.desc') },
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>, title: t('home.whyUs.item3.title'), desc: t('home.whyUs.item3.desc') },
        { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>, title: t('home.whyUs.item4.title'), desc: t('home.whyUs.item4.desc') }
    ];

    const localBusinessSchema = {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://steelonline20.com/#localbusiness",
        "name": "استیل آنلاین - دفتر مرکزی",
        "image": "https://i.sstatic.net/iwMPmj8z.png",
        "telephone": "+982122041655",
        "email": "sales@steelonline20.com",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "خیابان طاهری، پلاک ۱۸",
            "addressLocality": "جردن",
            "addressRegion": "تهران",
            "addressCountry": "IR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": "35.7819",
            "longitude": "51.4221"
        },
        "url": "https://steelonline20.com",
        "priceRange": "$$",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"],
                "opens": "08:30",
                "closes": "17:00"
            }
        ]
    };

    return (
        <div className="animate-fade-in w-full overflow-x-hidden">
            <SEO 
                title="خرید آهن و میلگرد - قیمت روز"
                description="مرجع تخصصی خرید و فروش آهن‌آلات. مشاهده قیمت لحظه‌ای میلگرد، تیرآهن و ورق. خرید مستقیم از بورس کالا و انبار."
                keywords="میلگرد, تیرآهن, قیمت آهن, خرید آهن, ورق سیاه, نبشی, ناودانی, استیل آنلاین"
            />
            <SchemaMarkup schema={localBusinessSchema} />

            {/* Hero Section */}
            {/* Reduced vertical padding on mobile to allow more image width visibility relative to height */}
            <section className="relative py-20 sm:py-48 text-white w-full">
                <div className="absolute inset-0 z-0 bg-slate-900">
                    <img 
                        src="https://i.sstatic.net/iwMPmj8z.png" 
                        alt="انبار آهن و میلگرد استیل آنلاین" 
                        className="w-full h-full object-cover object-center"
                        width="1920" 
                        height="1080"
                        fetchPriority="high"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-slate-800/60"></div>
                </div>
                
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <p className="text-lg sm:text-xl font-light text-slate-300 animate-fade-in">{t('hero.title')}</p>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold mt-4 leading-tight tracking-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
                        {t('home.hero.mainTitle')}
                    </h1>
                    <div className="mt-10 flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                        {/* Red CTA for Action */}
                        <button onClick={() => setPage('test_recommender')} className="px-8 py-3 bg-corp-red text-white font-bold rounded-lg hover:bg-corp-red-dark transition-all shadow-lg shadow-red-900/20 flex items-center gap-2 transform hover:-translate-y-0.5" aria-label="مشاوره خرید">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                           {t('hero.cta')}
                        </button>
                         {/* Border Button for Secondary Action */}
                         <button onClick={() => setPage('tools')} className="px-8 py-3 bg-transparent border-2 border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors backdrop-blur-sm" aria-label="خدمات ما">
                           {t('home.hero.aboutButton')}
                        </button>
                    </div>
                </div>
            </section>
            
            {/* Info Bar - Floating */}
            <section className="relative z-20 -mt-10 mx-4 sm:mx-8 lg:mx-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-100">
                        <div className="p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                            <div className="bg-red-50 p-3 rounded-full text-corp-red group-hover:bg-corp-red group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </div>
                            <div>
                                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t('home.infoBar.call.title')}</h2>
                                <a href="tel:+982122041655" className="text-slate-900 font-mono text-xl font-bold dir-ltr block hover:text-corp-red transition-colors">{t('home.infoBar.call.value')}</a>
                            </div>
                        </div>
                        <div className="p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                            <div className="bg-blue-50 p-3 rounded-full text-corp-blue group-hover:bg-corp-blue group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </div>
                            <div>
                                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t('home.infoBar.email.title')}</h2>
                                <a href="mailto:sales@steelonline20.com" className="text-slate-900 font-mono text-sm block hover:text-corp-blue transition-colors">{t('home.infoBar.email.value')}</a>
                            </div>
                        </div>
                         <div className="p-6 flex items-center gap-4 hover:bg-slate-50 transition-colors group">
                            <div className="bg-slate-100 p-3 rounded-full text-slate-600 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <div>
                                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wide">{t('home.infoBar.location.title')}</h2>
                                <p className="text-slate-900 text-sm font-medium">{t('home.infoBar.location.value')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Featured Blocks */}
             <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 bg-blue-50 text-corp-blue rounded-xl flex items-center justify-center mb-6 group-hover:bg-corp-blue group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            </div>
                            <h2 className="text-xl font-bold mb-3 text-slate-900">{t('home.featuredBlocks.block1.title')}</h2>
                            <p className="text-sm text-slate-600 mb-6 leading-relaxed">{t('home.featuredBlocks.block1.desc')}</p>
                            <button onClick={() => setPage('content_hub')} className="text-corp-blue font-bold text-sm hover:underline flex items-center gap-1">{t('home.featuredBlocks.button')} <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
                        </div>
                        <div className="bg-white border border-slate-200 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all group">
                            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                            <h2 className="text-xl font-bold mb-3 text-slate-900">{t('home.featuredBlocks.block2.title')}</h2>
                            <p className="text-sm text-slate-600 mb-6 leading-relaxed">{t('home.featuredBlocks.block2.desc')}</p>
                            <button onClick={() => setPage('partnerships')} className="text-green-600 font-bold text-sm hover:underline flex items-center gap-1">{t('home.featuredBlocks.button')} <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
                        </div>
                        <div className="bg-slate-900 text-white p-8 rounded-xl shadow-lg border-t-4 border-corp-red">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-corp-red" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                {t('home.featuredBlocks.block3.title')}
                            </h2>
                            <ul className="space-y-4 text-sm text-slate-300">
                               <li className="flex items-center gap-3">
                                   <div className="w-2 h-2 rounded-full bg-corp-red"></div>
                                   {t('home.featuredBlocks.block3.line1')}
                                </li>
                               <li className="flex items-center gap-3">
                                   <div className="w-2 h-2 rounded-full bg-corp-red"></div>
                                   {t('home.featuredBlocks.block3.line2')}
                                </li>
                               <li className="flex items-center gap-3">
                                   <div className="w-2 h-2 rounded-full bg-corp-red"></div>
                                   {t('home.featuredBlocks.block3.line3')}
                                </li>
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
                            <div key={item.title} className="text-center p-6 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-slate-50 text-slate-700 mx-auto mb-4 border border-slate-200">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                 </div>
            </section>
            
            {/* From Our Blog Section */}
            <section className="py-16 sm:py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">{t('home.blog.title')}</h2>
                            <p className="mt-3 text-slate-600">{t('home.blog.subtitle')}</p>
                        </div>
                        <button onClick={() => setPage('blog')} className="text-corp-blue font-bold hover:underline flex items-center gap-1">
                            {t('blogPage.readMore')} &rarr;
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recentArticles.map(article => (
                            <div key={article.id} className="group flex flex-col bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-shadow">
                                <button onClick={() => onSelectArticle(article)} className="block overflow-hidden relative">
                                    <img 
                                        src={article.image} 
                                        alt={article.title[language]} 
                                        className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                        width="400"
                                        height="300"
                                    />
                                    <div className="absolute top-4 right-4">
                                        <span className="text-xs font-bold text-white bg-slate-900/80 backdrop-blur-sm px-3 py-1 rounded-full">{article.category[language]}</span>
                                    </div>
                                </button>
                                <div className="p-6 flex flex-col flex-grow">
                                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {article.date[language]}
                                    </p>
                                    <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-corp-blue transition-colors leading-snug">
                                        <button onClick={() => onSelectArticle(article)}>{article.title[language]}</button>
                                    </h3>
                                    <p className="text-sm text-slate-600 leading-relaxed flex-grow line-clamp-3">{article.excerpt[language]}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

             {/* Location & Map Section */}
            <section className="py-16 bg-white border-t border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <h2 className="text-3xl font-extrabold text-slate-900">
                            {t('home.infoBar.location.title')}
                        </h2>
                    </div>
                    <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                        <div className="flex flex-col md:flex-row h-auto md:h-[500px]">
                            {/* Contact Details */}
                            <div className="md:w-1/3 p-8 flex flex-col justify-center bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100">
                                <div className="space-y-8">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-white p-3 rounded-lg shadow-sm text-corp-red border border-slate-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 mb-1 text-lg">Address</h4>
                                            <p className="text-slate-600 leading-relaxed font-medium">{t('footer.contactInfo')}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-start gap-4">
                                         <div className="bg-white p-3 rounded-lg shadow-sm text-corp-red border border-slate-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                         </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 mb-1 text-lg">Phone</h4>
                                            <p className="text-slate-600 dir-ltr text-lg font-mono tracking-tight font-bold">{t('home.infoBar.call.value')}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-white p-3 rounded-lg shadow-sm text-corp-red border border-slate-100">
                                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 mb-1 text-lg">Working Hours</h4>
                                            <p className="text-slate-600">{t('footer.workingHours')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Map */}
                            <div className="md:w-2/3 bg-slate-200 relative min-h-[300px]">
                                <iframe 
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3238.961062002516!2d51.42008587634289!3d35.78191297255502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQ2JzU0LjkiTiA1McKwMjUnMjAuMiJF!5e0!3m2!1sen!2s!4v1653842628435!5m2!1sen!2s"
                                    className="absolute inset-0 w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="موقعیت دفتر مرکزی استیل آنلاین"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

             {/* Partners/Clients */}
             <section className="py-16 bg-slate-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-center text-sm font-bold text-slate-400 mb-8 uppercase tracking-widest">{t('home.partners.title')}</h2>
                    <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
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
                                className="h-12 sm:h-16 object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 hover:scale-105"
                                loading="lazy"
                                width="100"
                                height="64"
                            />
                        ))}
                    </div>
                </div>
             </section>

        </div>
    );
};

export default HomePage;
