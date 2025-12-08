
import React, { useState } from 'react';
import { useLanguage, Page, User } from '../types';

interface UserDashboardPageProps {
  setPage: (page: Page) => void;
  user: User | null;
  onLogout: () => void;
}

interface Order {
  id: string;
  product: string;
  quantity: string;
  price: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
  seller: string;
}

interface SavedSeller {
  id: string;
  name: string;
  location: string;
  rating: number;
  phone: string;
}

const UserDashboardPage: React.FC<UserDashboardPageProps> = ({ setPage, user, onLogout }) => {
  const { t, language, dir } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'favorites' | 'reviews' | 'settings'>('overview');

  const mockOrders: Order[] = [
    { id: 'ORD-2024-001', product: 'IPE 180 اصفهان', quantity: '25 تن', price: '875,000,000 تومان', status: 'delivered', date: '1402/09/15', seller: 'آهن‌آلات تهران' },
    { id: 'ORD-2024-002', product: 'میلگرد 16 ذوب آهن', quantity: '40 تن', price: '1,200,000,000 تومان', status: 'shipped', date: '1402/09/18', seller: 'فولاد شاداباد' },
    { id: 'ORD-2024-003', product: 'ورق سیاه 3 میل', quantity: '15 تن', price: '420,000,000 تومان', status: 'processing', date: '1402/09/20', seller: 'بازرگانی احمدی' },
  ];

  const mockSavedSellers: SavedSeller[] = [
    { id: '1', name: 'آهن‌آلات تهران', location: 'شادآباد، تهران', rating: 4.8, phone: '021-55123456' },
    { id: '2', name: 'فولاد اصفهان', location: 'اصفهان', rating: 4.6, phone: '031-32123456' },
    { id: '3', name: 'آهن البرز', location: 'کرج', rating: 4.5, phone: '026-32123456' },
  ];

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    const labels = {
      pending: language === 'fa' ? 'در انتظار' : 'Pending',
      processing: language === 'fa' ? 'در حال پردازش' : 'Processing',
      shipped: language === 'fa' ? 'ارسال شده' : 'Shipped',
      delivered: language === 'fa' ? 'تحویل داده شده' : 'Delivered',
    };
    return labels[status];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100" dir={dir}>
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setPage('home')} className="flex items-center gap-2 text-slate-600 hover:text-corp-red transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              <span className="font-medium">{language === 'fa' ? 'بازگشت به سایت' : 'Back to Site'}</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-corp-red to-red-600 flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="hidden sm:block">
                <p className="font-medium text-slate-800">{user?.name || 'User'}</p>
                <p className="text-xs text-slate-500">{user?.email || user?.phone}</p>
              </div>
            </div>
            <button onClick={onLogout} className="text-slate-500 hover:text-red-500 transition-colors p-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            {language === 'fa' ? `سلام، ${user?.name || 'کاربر'}!` : `Hello, ${user?.name || 'User'}!`}
          </h1>
          <p className="text-slate-600 mt-1">
            {language === 'fa' ? 'به پنل کاربری خود خوش آمدید' : 'Welcome to your dashboard'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { key: 'overview', label: language === 'fa' ? 'نمای کلی' : 'Overview', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
            { key: 'orders', label: language === 'fa' ? 'سفارشات' : 'Orders', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
            { key: 'favorites', label: language === 'fa' ? 'علاقه‌مندی‌ها' : 'Favorites', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
            { key: 'reviews', label: language === 'fa' ? 'نظرات من' : 'My Reviews', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg> },
            { key: 'settings', label: language === 'fa' ? 'تنظیمات' : 'Settings', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${
                activeTab === tab.key 
                  ? 'bg-corp-red text-white shadow-lg shadow-red-500/25' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 shadow-sm'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">3</p>
                    <p className="text-sm text-slate-500">{language === 'fa' ? 'سفارش فعال' : 'Active Orders'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">12</p>
                    <p className="text-sm text-slate-500">{language === 'fa' ? 'سفارش تکمیل شده' : 'Completed'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">5</p>
                    <p className="text-sm text-slate-500">{language === 'fa' ? 'نظرات ثبت شده' : 'Reviews Given'}</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{mockSavedSellers.length}</p>
                    <p className="text-sm text-slate-500">{language === 'fa' ? 'فروشنده ذخیره شده' : 'Saved Sellers'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">{language === 'fa' ? 'آخرین سفارشات' : 'Recent Orders'}</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-sm text-corp-red hover:underline">
                    {language === 'fa' ? 'مشاهده همه' : 'View All'}
                  </button>
                </div>
                <div className="space-y-3">
                  {mockOrders.slice(0, 3).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div>
                        <p className="font-medium text-slate-800">{order.product}</p>
                        <p className="text-sm text-slate-500">{order.date}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">{language === 'fa' ? 'فروشندگان محبوب' : 'Favorite Sellers'}</h3>
                  <button onClick={() => setActiveTab('favorites')} className="text-sm text-corp-red hover:underline">
                    {language === 'fa' ? 'مشاهده همه' : 'View All'}
                  </button>
                </div>
                <div className="space-y-3">
                  {mockSavedSellers.map(seller => (
                    <div key={seller.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white font-bold">
                          {seller.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{seller.name}</p>
                          <p className="text-sm text-slate-500">{seller.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        <span className="font-medium text-slate-700">{seller.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <button onClick={() => setPage('iron_snapp')} className="bg-gradient-to-br from-corp-red to-red-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                  </div>
                  <div className="text-right flex-1">
                    <p className="font-bold text-lg">{language === 'fa' ? 'آهن‌اسنپ' : 'IronSnapp'}</p>
                    <p className="text-white/80 text-sm">{language === 'fa' ? 'جستجوی فروشندگان نزدیک' : 'Find nearby sellers'}</p>
                  </div>
                </div>
              </button>

              <button onClick={() => setPage('test_recommender')} className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  </div>
                  <div className="text-right flex-1">
                    <p className="font-bold text-lg">{language === 'fa' ? 'مشاور هوشمند' : 'Smart Advisor'}</p>
                    <p className="text-white/80 text-sm">{language === 'fa' ? 'پیشنهاد محصول با AI' : 'AI product recommendations'}</p>
                  </div>
                </div>
              </button>

              <button onClick={() => setPage('tools')} className="bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /></svg>
                  </div>
                  <div className="text-right flex-1">
                    <p className="font-bold text-lg">{language === 'fa' ? 'ابزارها' : 'Tools'}</p>
                    <p className="text-white/80 text-sm">{language === 'fa' ? 'محاسبه وزن و هزینه' : 'Weight & cost calculator'}</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">{language === 'fa' ? 'سفارشات من' : 'My Orders'}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">{language === 'fa' ? 'شماره سفارش' : 'Order ID'}</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">{language === 'fa' ? 'محصول' : 'Product'}</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">{language === 'fa' ? 'مقدار' : 'Quantity'}</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">{language === 'fa' ? 'قیمت' : 'Price'}</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">{language === 'fa' ? 'فروشنده' : 'Seller'}</th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">{language === 'fa' ? 'وضعیت' : 'Status'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockOrders.map(order => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-slate-600">{order.id}</td>
                      <td className="px-6 py-4 font-medium text-slate-800">{order.product}</td>
                      <td className="px-6 py-4 text-slate-600">{order.quantity}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">{order.price}</td>
                      <td className="px-6 py-4 text-slate-600">{order.seller}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {mockSavedSellers.map(seller => (
              <div key={seller.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white text-xl font-bold">
                    {seller.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{seller.name}</h3>
                    <p className="text-sm text-slate-500">{seller.location}</p>
                  </div>
                  <button className="text-red-500 hover:text-red-600 p-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    <span className="font-bold text-slate-800">{seller.rating}</span>
                  </div>
                  <a href={`tel:${seller.phone}`} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    {language === 'fa' ? 'تماس' : 'Call'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{language === 'fa' ? 'نظرات من' : 'My Reviews'}</h2>
            <div className="text-center py-12 text-slate-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              <p className="text-lg font-medium">{language === 'fa' ? 'هنوز نظری ثبت نکرده‌اید' : 'No reviews yet'}</p>
              <p className="text-sm mt-1">{language === 'fa' ? 'پس از خرید می‌توانید نظر خود را ثبت کنید' : 'You can leave reviews after completing a purchase'}</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 animate-fade-in">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{language === 'fa' ? 'تنظیمات حساب' : 'Account Settings'}</h2>
            <div className="space-y-6 max-w-lg">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{language === 'fa' ? 'نام' : 'Name'}</label>
                <input type="text" defaultValue={user?.name} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-corp-red focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{language === 'fa' ? 'ایمیل' : 'Email'}</label>
                <input type="email" defaultValue={user?.email} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-corp-red focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{language === 'fa' ? 'شماره تلفن' : 'Phone'}</label>
                <input type="tel" defaultValue={user?.phone} className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-corp-red focus:outline-none" />
              </div>
              <button className="px-6 py-3 bg-corp-red text-white font-bold rounded-lg hover:bg-red-700 transition-colors">
                {language === 'fa' ? 'ذخیره تغییرات' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboardPage;
