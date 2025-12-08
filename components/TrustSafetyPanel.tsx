
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useLanguage } from '../types';

interface NotaryOffice {
  id: string;
  name: string;
  address: string;
  phone: string;
  lat: number;
  lon: number;
  workingHours: string;
}

interface Lawyer {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  email: string;
  experience: number;
  rating: number;
}

interface TrustSafetyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sellerName?: string;
  transactionAmount?: string;
}

const TrustSafetyPanel: React.FC<TrustSafetyPanelProps> = ({ isOpen, onClose, sellerName, transactionAmount }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'overview' | 'lawyers' | 'notary' | 'escrow'>('overview');

  const notaryOffices: NotaryOffice[] = [
    { id: '1', name: language === 'fa' ? 'دفتر اسناد رسمی ۱۵ تهران' : 'Tehran Notary Office 15', address: language === 'fa' ? 'خیابان ولیعصر، تهران' : 'Valiasr St, Tehran', phone: '021-88123456', lat: 35.7219, lon: 51.4078, workingHours: '8:00 - 14:00' },
    { id: '2', name: language === 'fa' ? 'دفتر اسناد رسمی ۲۳ تهران' : 'Tehran Notary Office 23', address: language === 'fa' ? 'خیابان شریعتی، تهران' : 'Shariati St, Tehran', phone: '021-77123456', lat: 35.7448, lon: 51.4343, workingHours: '8:00 - 14:00' },
    { id: '3', name: language === 'fa' ? 'دفتر اسناد رسمی ۴۲ شادآباد' : 'Shadabad Notary Office 42', address: language === 'fa' ? 'شادآباد، تهران' : 'Shadabad, Tehran', phone: '021-66123456', lat: 35.6327, lon: 51.3088, workingHours: '8:00 - 14:00' },
  ];

  const lawyers: Lawyer[] = [
    { id: '1', name: language === 'fa' ? 'دکتر محمدی' : 'Dr. Mohammadi', specialty: language === 'fa' ? 'حقوق تجاری و قراردادها' : 'Commercial & Contract Law', phone: '021-88654321', email: 'mohammadi@law.ir', experience: 15, rating: 4.9 },
    { id: '2', name: language === 'fa' ? 'خانم احمدی' : 'Ms. Ahmadi', specialty: language === 'fa' ? 'حقوق مالی و بانکی' : 'Financial & Banking Law', phone: '021-77654321', email: 'ahmadi@law.ir', experience: 12, rating: 4.7 },
    { id: '3', name: language === 'fa' ? 'آقای رضایی' : 'Mr. Rezaei', specialty: language === 'fa' ? 'حقوق صنعتی و فولاد' : 'Industrial & Steel Law', phone: '021-66654321', email: 'rezaei@law.ir', experience: 20, rating: 4.8 },
  ];

  const notaryIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                {language === 'fa' ? 'مرکز اعتماد و امنیت' : 'Trust & Safety Center'}
              </h2>
              <p className="text-emerald-100 mt-1">
                {language === 'fa' ? 'خدمات حقوقی و محضری برای معاملات امن' : 'Legal & notary services for secure transactions'}
              </p>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {sellerName && (
            <div className="mt-4 bg-white/10 rounded-xl p-4">
              <p className="text-sm text-emerald-100">{language === 'fa' ? 'معامله با:' : 'Transaction with:'}</p>
              <p className="font-bold text-lg">{sellerName}</p>
              {transactionAmount && <p className="text-emerald-100">{transactionAmount}</p>}
            </div>
          )}
        </div>

        <div className="border-b border-slate-200">
          <div className="flex overflow-x-auto">
            {[
              { key: 'overview', label: language === 'fa' ? 'راهنما' : 'Overview', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
              { key: 'lawyers', label: language === 'fa' ? 'مشاوره حقوقی' : 'Legal Advice', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg> },
              { key: 'notary', label: language === 'fa' ? 'دفاتر اسناد رسمی' : 'Notary Offices', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg> },
              { key: 'escrow', label: language === 'fa' ? 'پرداخت امن' : 'Secure Payment', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg> },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all border-b-2 whitespace-nowrap ${
                  activeTab === tab.key 
                    ? 'border-emerald-500 text-emerald-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  <div>
                    <h3 className="font-bold text-yellow-800">{language === 'fa' ? 'نکات مهم قبل از معامله' : 'Important Notes Before Trading'}</h3>
                    <ul className="mt-2 text-sm text-yellow-700 space-y-1 list-disc list-inside">
                      <li>{language === 'fa' ? 'همیشه فاکتور رسمی دریافت کنید' : 'Always get an official invoice'}</li>
                      <li>{language === 'fa' ? 'از اعتبار فروشنده مطمئن شوید' : 'Verify seller credibility'}</li>
                      <li>{language === 'fa' ? 'برای معاملات بالای ۵۰۰ میلیون، مشاوره حقوقی بگیرید' : 'Get legal advice for transactions over 500M'}</li>
                      <li>{language === 'fa' ? 'قرارداد کتبی تنظیم کنید' : 'Draft a written contract'}</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button onClick={() => setActiveTab('lawyers')} className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all text-right group">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>
                  </div>
                  <h3 className="font-bold text-slate-800">{language === 'fa' ? 'مشاوره حقوقی' : 'Legal Consultation'}</h3>
                  <p className="text-sm text-slate-500 mt-1">{language === 'fa' ? 'تماس با وکلای متخصص قراردادهای تجاری' : 'Contact commercial contract lawyers'}</p>
                </button>

                <button onClick={() => setActiveTab('notary')} className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all text-right group">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <h3 className="font-bold text-slate-800">{language === 'fa' ? 'دفاتر اسناد رسمی' : 'Notary Offices'}</h3>
                  <p className="text-sm text-slate-500 mt-1">{language === 'fa' ? 'ثبت رسمی قرارداد و اسناد معامله' : 'Official contract & document registration'}</p>
                </button>

                <button onClick={() => setActiveTab('escrow')} className="p-6 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all text-right group">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <h3 className="font-bold text-slate-800">{language === 'fa' ? 'پرداخت امن' : 'Secure Payment'}</h3>
                  <p className="text-sm text-slate-500 mt-1">{language === 'fa' ? 'راهنمای پرداخت اسکرو و چکی' : 'Escrow & check payment guide'}</p>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'lawyers' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-700">
                  <strong>{language === 'fa' ? 'توجه:' : 'Note:'}</strong> {language === 'fa' ? 'این وکلا توسط استیل آنلاین ۲۰ تأیید شده‌اند و تجربه کار با معاملات فولاد را دارند.' : 'These lawyers are verified by Steel Online 20 and have experience with steel transactions.'}
                </p>
              </div>

              {lawyers.map(lawyer => (
                <div key={lawyer.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold">
                        {lawyer.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-lg">{lawyer.name}</h3>
                        <p className="text-slate-500">{lawyer.specialty}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                          <span className="flex items-center gap-1 text-yellow-500">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            <span className="font-bold text-slate-700">{lawyer.rating}</span>
                          </span>
                          <span className="text-slate-500">{lawyer.experience} {language === 'fa' ? 'سال سابقه' : 'years exp.'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <a href={`tel:${lawyer.phone}`} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        {language === 'fa' ? 'تماس' : 'Call'}
                      </a>
                      <a href={`mailto:${lawyer.email}`} className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        {language === 'fa' ? 'ایمیل' : 'Email'}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notary' && (
            <div className="space-y-4 animate-fade-in">
              <div className="h-64 rounded-xl overflow-hidden border border-slate-200">
                <MapContainer center={[35.6892, 51.3890]} zoom={11} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {notaryOffices.map(office => (
                    <Marker key={office.id} position={[office.lat, office.lon]} icon={notaryIcon}>
                      <Popup>
                        <div className="text-center">
                          <strong>{office.name}</strong>
                          <p className="text-sm text-slate-600">{office.address}</p>
                          <p className="text-sm text-slate-500">{office.workingHours}</p>
                          <a href={`tel:${office.phone}`} className="text-blue-600 text-sm">{office.phone}</a>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notaryOffices.map(office => (
                  <div key={office.id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-800">{office.name}</h3>
                        <p className="text-sm text-slate-500">{office.address}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">{office.workingHours}</span>
                      <a href={`tel:${office.phone}`} className="text-blue-600 hover:underline">{office.phone}</a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'escrow' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-green-50 border border-green-200 rounded-xl p-5">
                <h3 className="font-bold text-green-800 text-lg mb-3 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                  {language === 'fa' ? 'روش‌های پرداخت امن' : 'Secure Payment Methods'}
                </h3>
                <ul className="space-y-3 text-green-700">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    <div>
                      <strong>{language === 'fa' ? 'چک صیادی:' : 'Sayadi Check:'}</strong>
                      <span className="block text-sm">{language === 'fa' ? 'قابل پیگیری در سامانه صیاد بانک مرکزی' : 'Trackable in Central Bank Sayad system'}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    <div>
                      <strong>{language === 'fa' ? 'اعتبار اسنادی (LC):' : 'Letter of Credit (LC):'}</strong>
                      <span className="block text-sm">{language === 'fa' ? 'تضمین بانکی برای معاملات بزرگ' : 'Bank guarantee for large transactions'}</span>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    <div>
                      <strong>{language === 'fa' ? 'پرداخت نقدی در محل:' : 'Cash on Delivery:'}</strong>
                      <span className="block text-sm">{language === 'fa' ? 'پرداخت هنگام تحویل با حضور شاهد' : 'Payment upon delivery with witness'}</span>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                <h3 className="font-bold text-red-800 text-lg mb-3 flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  {language === 'fa' ? 'هشدارهای کلاهبرداری' : 'Fraud Warnings'}
                </h3>
                <ul className="space-y-2 text-red-700 text-sm">
                  <li>• {language === 'fa' ? 'هرگز پیش پرداخت کامل به حساب شخصی نکنید' : 'Never make full advance payment to personal accounts'}</li>
                  <li>• {language === 'fa' ? 'فروشنده‌ای که پافشاری بر پرداخت فوری دارد مشکوک است' : 'Sellers insisting on immediate payment are suspicious'}</li>
                  <li>• {language === 'fa' ? 'همیشه از دفتر فروش بازدید حضوری کنید' : 'Always visit the sales office in person'}</li>
                  <li>• {language === 'fa' ? 'قیمت‌های خیلی پایین‌تر از بازار نشانه کلاهبرداری است' : 'Prices much lower than market are fraud indicators'}</li>
                </ul>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="font-bold text-blue-800 mb-2">{language === 'fa' ? 'خط گزارش تخلف' : 'Fraud Reporting Hotline'}</h3>
                <p className="text-blue-700 text-sm mb-3">
                  {language === 'fa' ? 'اگر مورد مشکوکی مشاهده کردید، گزارش دهید:' : 'Report suspicious activity:'}
                </p>
                <a href="tel:021-22041655" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  021-22041655
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrustSafetyPanel;
