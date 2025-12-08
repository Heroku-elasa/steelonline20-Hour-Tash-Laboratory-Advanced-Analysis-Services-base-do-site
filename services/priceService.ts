import { supabase } from './supabaseClient';

export interface SteelProduct {
  id: number;
  name_fa: string;
  name_en: string | null;
  category: string;
  unit: string;
  brand: string | null;
}

export interface SteelPrice {
  id: number;
  product_id: number;
  price: number;
  change_percent: number;
  price_date: string;
  source: string | null;
  product?: SteelProduct;
}

export interface WarehouseLocation {
  id: number;
  name_fa: string;
  name_en: string | null;
  city_fa: string | null;
  city_en: string | null;
  address_fa: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
}

const API_BASE = '';

export async function fetchLatestPrices(): Promise<SteelPrice[]> {
  try {
    const response = await fetch(`${API_BASE}/api/prices`);
    if (!response.ok) {
      throw new Error('Failed to fetch prices');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching prices:', error);
    return getMockPrices();
  }
}

export async function fetchProducts(): Promise<SteelProduct[]> {
  try {
    const response = await fetch(`${API_BASE}/api/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return getMockProducts();
  }
}

export async function fetchWarehouses(): Promise<WarehouseLocation[]> {
  try {
    const response = await fetch(`${API_BASE}/api/warehouses`);
    if (!response.ok) {
      throw new Error('Failed to fetch warehouses');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching warehouses:', error);
    return getMockWarehouses();
  }
}

function getMockProducts(): SteelProduct[] {
  return [
    { id: 1, name_fa: 'میلگرد ۱۴', name_en: 'Rebar 14', category: 'rebar', unit: 'kg', brand: 'ذوب آهن اصفهان' },
    { id: 2, name_fa: 'میلگرد ۱۶', name_en: 'Rebar 16', category: 'rebar', unit: 'kg', brand: 'ذوب آهن اصفهان' },
    { id: 3, name_fa: 'میلگرد ۱۸', name_en: 'Rebar 18', category: 'rebar', unit: 'kg', brand: 'فولاد خوزستان' },
    { id: 4, name_fa: 'میلگرد ۲۰', name_en: 'Rebar 20', category: 'rebar', unit: 'kg', brand: 'فولاد خوزستان' },
    { id: 5, name_fa: 'میلگرد ۲۲', name_en: 'Rebar 22', category: 'rebar', unit: 'kg', brand: 'ذوب آهن اصفهان' },
    { id: 6, name_fa: 'تیرآهن IPE 14', name_en: 'IPE Beam 14', category: 'beam', unit: 'شاخه', brand: 'ذوب آهن اصفهان' },
    { id: 7, name_fa: 'تیرآهن IPE 16', name_en: 'IPE Beam 16', category: 'beam', unit: 'شاخه', brand: 'ذوب آهن اصفهان' },
    { id: 8, name_fa: 'تیرآهن IPE 18', name_en: 'IPE Beam 18', category: 'beam', unit: 'شاخه', brand: 'ذوب آهن اصفهان' },
    { id: 9, name_fa: 'تیرآهن IPE 20', name_en: 'IPE Beam 20', category: 'beam', unit: 'شاخه', brand: 'فولاد البرز' },
    { id: 10, name_fa: 'ورق سیاه ۲ میل', name_en: 'Black Sheet 2mm', category: 'sheet', unit: 'kg', brand: 'فولاد مبارکه' },
    { id: 11, name_fa: 'ورق سیاه ۳ میل', name_en: 'Black Sheet 3mm', category: 'sheet', unit: 'kg', brand: 'فولاد مبارکه' },
    { id: 12, name_fa: 'ورق سیاه ۴ میل', name_en: 'Black Sheet 4mm', category: 'sheet', unit: 'kg', brand: 'فولاد اکسین' },
    { id: 13, name_fa: 'ورق گالوانیزه ۰.۵ میل', name_en: 'Galvanized Sheet 0.5mm', category: 'sheet', unit: 'kg', brand: 'فولاد مبارکه' },
    { id: 14, name_fa: 'نبشی ۴', name_en: 'Angle Iron 4', category: 'profile', unit: 'kg', brand: 'شاهین بناب' },
    { id: 15, name_fa: 'ناودانی ۸', name_en: 'Channel 8', category: 'profile', unit: 'kg', brand: 'ناب تبریز' },
    { id: 16, name_fa: 'لوله ۱ اینچ', name_en: 'Pipe 1 inch', category: 'pipe', unit: 'شاخه', brand: 'صنایع لوله' },
    { id: 17, name_fa: 'لوله ۲ اینچ', name_en: 'Pipe 2 inch', category: 'pipe', unit: 'شاخه', brand: 'صنایع لوله' },
  ];
}

function getMockPrices(): SteelPrice[] {
  const products = getMockProducts();
  const prices = [28500, 28700, 29100, 29400, 29800, 4950000, 5850000, 7150000, 8950000, 38500, 37800, 36200, 42500, 28200, 28900, 35200, 36800];
  const changes = [1.2, 0.8, -0.5, 1.5, 0.3, 2.1, 1.8, -0.2, 0.5, 0.9, -0.3, 0.4, 1.1, 0.6, -0.2, 0.7, 0.4];
  
  return products.map((product, index) => ({
    id: index + 1,
    product_id: product.id,
    price: prices[index],
    change_percent: changes[index],
    price_date: new Date().toISOString().split('T')[0],
    source: 'بازار آهن',
    product: product,
  }));
}

function getMockWarehouses(): WarehouseLocation[] {
  return [
    { id: 1, name_fa: 'انبار مرکزی شادآباد', name_en: 'Shadabad Central Warehouse', city_fa: 'تهران', city_en: 'Tehran', address_fa: 'خیابان آهن، پلاک ۱۲', phone: '021-55123456', latitude: 35.6532, longitude: 51.3265, is_active: true },
    { id: 2, name_fa: 'انبار اصفهان', name_en: 'Isfahan Warehouse', city_fa: 'اصفهان', city_en: 'Isfahan', address_fa: 'شهرک صنعتی جی', phone: '031-36123456', latitude: 32.6546, longitude: 51.6680, is_active: true },
    { id: 3, name_fa: 'انبار تبریز', name_en: 'Tabriz Warehouse', city_fa: 'تبریز', city_en: 'Tabriz', address_fa: 'جاده ارس، منطقه صنعتی', phone: '041-33123456', latitude: 38.0962, longitude: 46.2738, is_active: true },
    { id: 4, name_fa: 'انبار مشهد', name_en: 'Mashhad Warehouse', city_fa: 'مشهد', city_en: 'Mashhad', address_fa: 'بلوار صنعت', phone: '051-32123456', latitude: 36.2605, longitude: 59.6168, is_active: true },
    { id: 5, name_fa: 'انبار شیراز', name_en: 'Shiraz Warehouse', city_fa: 'شیراز', city_en: 'Shiraz', address_fa: 'منطقه صنعتی شیراز', phone: '071-32123456', latitude: 29.5918, longitude: 52.5836, is_active: true },
  ];
}

export function formatPrice(price: number): string {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M تومان`;
  }
  return price.toLocaleString('fa-IR') + ' تومان';
}

export function getPriceChangeClass(change: number): string {
  if (change > 0) return 'text-green-600';
  if (change < 0) return 'text-red-600';
  return 'text-slate-500';
}

export function getPriceChangeIcon(change: number): string {
  if (change > 0) return '▲';
  if (change < 0) return '▼';
  return '●';
}
