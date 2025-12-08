import React, { useState, useEffect } from 'react';
import { useLanguage } from '../types';
import { fetchLatestPrices, SteelPrice, formatPrice, getPriceChangeClass, getPriceChangeIcon } from '../services/priceService';

interface PriceDashboardProps {
  compact?: boolean;
  onViewAll?: () => void;
}

const CATEGORY_LABELS: Record<string, { fa: string; en: string }> = {
  rebar: { fa: 'میلگرد', en: 'Rebar' },
  beam: { fa: 'تیرآهن', en: 'Beam' },
  sheet: { fa: 'ورق', en: 'Sheet' },
  profile: { fa: 'پروفیل', en: 'Profile' },
  pipe: { fa: 'لوله', en: 'Pipe' },
};

const PriceDashboard: React.FC<PriceDashboardProps> = ({ compact = false, onViewAll }) => {
  const { language, t } = useLanguage();
  const [prices, setPrices] = useState<SteelPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchLatestPrices();
      setPrices(data);
    } catch (err) {
      setError('خطا در بارگذاری قیمت‌ها');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPrices = selectedCategory === 'all' 
    ? prices 
    : prices.filter(p => p.product?.category === selectedCategory);

  const displayPrices = compact ? filteredPrices.slice(0, 6) : filteredPrices;

  const categories = ['all', ...Object.keys(CATEGORY_LABELS)];

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-corp-red rounded-full animate-spin"></div>
          <span className="mr-3 text-slate-600">در حال بارگذاری قیمت‌ها...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={loadPrices}
            className="mt-4 px-4 py-2 bg-corp-red text-white rounded-lg hover:bg-corp-red-dark transition-colors"
          >
            تلاش مجدد
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-corp-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              قیمت روز آهن‌آلات
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              آخرین بروزرسانی: {new Date().toLocaleDateString('fa-IR')}
            </p>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-corp-red text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' 
                  ? 'همه' 
                  : (language === 'fa' ? CATEGORY_LABELS[cat]?.fa : CATEGORY_LABELS[cat]?.en) || cat
                }
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">محصول</th>
              <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">برند</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">قیمت (تومان)</th>
              <th className="text-center px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">تغییر</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayPrices.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      item.product?.category === 'rebar' ? 'bg-red-100 text-red-600' :
                      item.product?.category === 'beam' ? 'bg-blue-100 text-blue-600' :
                      item.product?.category === 'sheet' ? 'bg-green-100 text-green-600' :
                      item.product?.category === 'profile' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {item.product?.category === 'rebar' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      )}
                      {item.product?.category === 'beam' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                        </svg>
                      )}
                      {item.product?.category === 'sheet' && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                      {(item.product?.category === 'profile' || item.product?.category === 'pipe') && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{item.product?.name_fa}</p>
                      <p className="text-xs text-slate-500">{item.product?.unit}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">
                  {item.product?.brand}
                </td>
                <td className="px-6 py-4 text-left">
                  <span className="font-bold text-slate-900 font-mono text-lg">
                    {item.price.toLocaleString('fa-IR')}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-medium ${
                    item.change_percent > 0 
                      ? 'bg-green-100 text-green-700' 
                      : item.change_percent < 0 
                        ? 'bg-red-100 text-red-700'
                        : 'bg-slate-100 text-slate-600'
                  }`}>
                    {getPriceChangeIcon(item.change_percent)}
                    {Math.abs(item.change_percent).toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {compact && onViewAll && filteredPrices.length > 6 && (
        <div className="p-4 border-t border-slate-100 text-center">
          <button
            onClick={onViewAll}
            className="text-corp-red font-bold hover:underline flex items-center justify-center gap-1 mx-auto"
          >
            مشاهده همه قیمت‌ها
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default PriceDashboard;
