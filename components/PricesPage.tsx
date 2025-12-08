import React from 'react';
import { useLanguage, Page } from '../types';
import PriceDashboard from './PriceDashboard';
import SEO from './SEO';

interface PricesPageProps {
  setPage: (page: Page) => void;
}

const PricesPage: React.FC<PricesPageProps> = ({ setPage }) => {
  const { t, language } = useLanguage();

  return (
    <div className="animate-fade-in">
      <SEO 
        title="قیمت روز آهن آلات - میلگرد، تیرآهن، ورق"
        description="مشاهده قیمت لحظه‌ای آهن‌آلات شامل میلگرد، تیرآهن، ورق سیاه و گالوانیزه. قیمت بروز بازار آهن."
        keywords="قیمت میلگرد, قیمت تیرآهن, قیمت ورق, قیمت روز آهن, بازار آهن"
      />
      
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold mb-4">قیمت روز آهن‌آلات</h1>
            <p className="text-lg text-slate-300">
              مشاهده آخرین قیمت‌های بازار آهن به صورت لحظه‌ای. قیمت‌ها بر اساس آخرین معاملات بازار آهن شادآباد تهران به‌روزرسانی می‌شوند.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500">میلگرد ۱۶</p>
                  <p className="text-xl font-bold text-slate-900">۲۸,۷۰۰ تومان</p>
                  <span className="text-xs text-green-600">▲ ۰.۸%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500">تیرآهن ۱۴</p>
                  <p className="text-xl font-bold text-slate-900">۴,۹۵۰,۰۰۰ تومان</p>
                  <span className="text-xs text-green-600">▲ ۲.۱%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500">ورق سیاه ۲ میل</p>
                  <p className="text-xl font-bold text-slate-900">۳۸,۵۰۰ تومان</p>
                  <span className="text-xs text-green-600">▲ ۰.۹%</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-slate-500">دلار</p>
                  <p className="text-xl font-bold text-slate-900">۵۸,۲۰۰ تومان</p>
                  <span className="text-xs text-red-600">▼ ۰.۳%</span>
                </div>
              </div>
            </div>
          </div>
          
          <PriceDashboard />
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-corp-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                نکات مهم خرید
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-corp-red mt-1">•</span>
                  قیمت‌ها بر اساس تومان و درب کارخانه می‌باشند
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-corp-red mt-1">•</span>
                  هزینه حمل و بارگیری جداگانه محاسبه می‌شود
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-corp-red mt-1">•</span>
                  قیمت‌های نهایی در زمان خرید ممکن است تغییر کنند
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-corp-red mt-1">•</span>
                  برای سفارش‌های بالای ۱۰ تن تخفیف ویژه ارائه می‌شود
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-corp-red to-corp-red-dark text-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                نیاز به مشاوره دارید؟
              </h3>
              <p className="text-white/80 mb-6 text-sm">
                کارشناسان ما آماده پاسخگویی به سوالات شما و ارائه بهترین پیشنهاد قیمت هستند.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setPage('ai_consultant')}
                  className="flex-1 px-4 py-3 bg-white text-corp-red font-bold rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  گفتگو با هوش مصنوعی
                </button>
                <a 
                  href="tel:+982122041655"
                  className="flex-1 px-4 py-3 bg-white/20 text-white font-bold rounded-lg hover:bg-white/30 transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  تماس مستقیم
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricesPage;
