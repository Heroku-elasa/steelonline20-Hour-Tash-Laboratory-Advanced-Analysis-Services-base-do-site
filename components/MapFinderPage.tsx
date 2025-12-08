import React, { useState, useEffect } from 'react';
import { useLanguage, Page } from '../types';
import { fetchWarehouses, WarehouseLocation } from '../services/priceService';
import SEO from './SEO';

interface MapFinderPageProps {
  setPage: (page: Page) => void;
}

const MapFinderPage: React.FC<MapFinderPageProps> = ({ setPage }) => {
  const { language } = useLanguage();
  const [warehouses, setWarehouses] = useState<WarehouseLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseLocation | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    setIsLoading(true);
    try {
      const data = await fetchWarehouses();
      setWarehouses(data);
    } catch (error) {
      console.error('Error loading warehouses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('خطا در دریافت موقعیت مکانی. لطفا دسترسی به موقعیت مکانی را فعال کنید.');
        }
      );
    } else {
      alert('مرورگر شما از موقعیت‌یابی پشتیبانی نمی‌کند.');
    }
  };

  const cities = ['all', ...new Set(warehouses.map(w => w.city_fa).filter(Boolean))];
  
  const filteredWarehouses = selectedCity === 'all'
    ? warehouses
    : warehouses.filter(w => w.city_fa === selectedCity);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const sortedWarehouses = userLocation 
    ? [...filteredWarehouses].sort((a, b) => {
        const distA = a.latitude && a.longitude 
          ? calculateDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude)
          : Infinity;
        const distB = b.latitude && b.longitude
          ? calculateDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude)
          : Infinity;
        return distA - distB;
      })
    : filteredWarehouses;

  return (
    <div className="animate-fade-in">
      <SEO 
        title="یافتن انبار آهن - نقشه انبارها"
        description="یافتن نزدیک‌ترین انبار آهن و فولاد به موقعیت شما. لیست انبارهای معتبر در سراسر ایران."
        keywords="انبار آهن, بازار آهن, شادآباد, انبار میلگرد, انبار تیرآهن"
      />
      
      <section className="bg-gradient-to-br from-corp-blue-dark to-corp-blue text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold mb-4 flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              یافتن انبار آهن
            </h1>
            <p className="text-lg text-blue-100">
              نزدیک‌ترین انبار آهن و فولاد را به موقعیت خود پیدا کنید. لیست انبارهای معتبر در سراسر ایران.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-4">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      فیلتر بر اساس شهر
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-corp-blue focus:border-transparent text-right"
                    >
                      <option value="all">همه شهرها</option>
                      {cities.filter(c => c !== 'all').map(city => (
                        <option key={city} value={city!}>{city}</option>
                      ))}
                    </select>
                  </div>
                  
                  <button
                    onClick={handleGetLocation}
                    className="w-full px-4 py-3 bg-corp-blue text-white font-bold rounded-lg hover:bg-corp-blue-dark transition-colors flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    یافتن نزدیک‌ترین انبار
                  </button>
                  
                  {userLocation && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        موقعیت شما دریافت شد
                      </p>
                    </div>
                  )}

                  <div className="border-t border-slate-200 pt-4">
                    <p className="text-sm text-slate-600">
                      <span className="font-bold">{sortedWarehouses.length}</span> انبار یافت شد
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2">
              <div className="bg-slate-200 rounded-xl overflow-hidden mb-6" style={{ height: '400px' }}>
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6478.5!2d51.35!3d35.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${selectedWarehouse ? `${selectedWarehouse.latitude},${selectedWarehouse.longitude}` : '35.65,51.35'}!5e0!3m2!1sen!2s!4v1653842628435!5m2!1sen!2s`}
                  className="w-full h-full border-0"
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="نقشه انبارها"
                ></iframe>
              </div>
              
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-slate-200 border-t-corp-blue rounded-full animate-spin"></div>
                  <span className="mr-3 text-slate-600">در حال بارگذاری...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedWarehouses.map((warehouse) => {
                    const distance = userLocation && warehouse.latitude && warehouse.longitude
                      ? calculateDistance(userLocation.lat, userLocation.lng, warehouse.latitude, warehouse.longitude)
                      : null;
                    
                    return (
                      <div 
                        key={warehouse.id}
                        className={`bg-white rounded-xl shadow-sm border-2 p-6 cursor-pointer transition-all hover:shadow-lg ${
                          selectedWarehouse?.id === warehouse.id 
                            ? 'border-corp-blue' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => setSelectedWarehouse(warehouse)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-corp-blue/10 text-corp-blue flex items-center justify-center flex-shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-slate-900">{warehouse.name_fa}</h3>
                              <p className="text-sm text-slate-500 mt-1">{warehouse.city_fa}</p>
                              <p className="text-sm text-slate-600 mt-2">{warehouse.address_fa}</p>
                              {warehouse.phone && (
                                <a 
                                  href={`tel:${warehouse.phone}`}
                                  className="inline-flex items-center gap-1 text-corp-blue font-medium text-sm mt-2 hover:underline"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                  </svg>
                                  {warehouse.phone}
                                </a>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-left">
                            {distance !== null && (
                              <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium">
                                {distance.toFixed(1)} کیلومتر
                              </div>
                            )}
                            {warehouse.latitude && warehouse.longitude && (
                              <a
                                href={`https://www.google.com/maps/dir/?api=1&destination=${warehouse.latitude},${warehouse.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-corp-blue text-sm font-medium mt-2 hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                مسیریابی
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MapFinderPage;
