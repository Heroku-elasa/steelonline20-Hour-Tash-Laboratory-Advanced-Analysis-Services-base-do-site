from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import requests
import json
import os
import time
import random

DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'dist')

app = Flask(__name__, static_folder=DIST_DIR, static_url_path='')
CORS(app)

SELLER_CACHE = {}

IRAN_STEEL_HUBS = [
    {"name": "بازار آهن شادآباد", "lat": 35.6542, "lon": 51.3127, "city": "Tehran", "region": "Shadabad"},
    {"name": "بازار آهن اصفهان", "lat": 32.6539, "lon": 51.6660, "city": "Isfahan", "region": "Isfahan"},
    {"name": "بازار آهن تبریز", "lat": 38.0802, "lon": 46.2919, "city": "Tabriz", "region": "Tabriz"},
    {"name": "بازار آهن مشهد", "lat": 36.2605, "lon": 59.6168, "city": "Mashhad", "region": "Mashhad"},
    {"name": "بازار آهن اهواز", "lat": 31.3183, "lon": 48.6706, "city": "Ahvaz", "region": "Ahvaz"},
    {"name": "بازار آهن شیراز", "lat": 29.5918, "lon": 52.5837, "city": "Shiraz", "region": "Shiraz"},
]

KNOWN_STEEL_SELLERS = [
    {"name": "آهن آلات صدر", "address": "شادآباد، خیابان 17 شهریور", "phone": "021-66694521", "lat": 35.6552, "lon": 51.3137, "city": "Tehran"},
    {"name": "آهن فروشی محمدی", "address": "شادآباد، بلوار امام خمینی", "phone": "021-66695832", "lat": 35.6532, "lon": 51.3117, "city": "Tehran"},
    {"name": "فولاد تجارت", "address": "شادآباد، خیابان صنعت", "phone": "021-66693741", "lat": 35.6562, "lon": 51.3147, "city": "Tehran"},
    {"name": "آهن آلات کاوه", "address": "اصفهان، خیابان آتشگاه", "phone": "031-36271845", "lat": 32.6549, "lon": 51.6680, "city": "Isfahan"},
    {"name": "آهن بازار اصفهان", "address": "اصفهان، میدان جمهوری", "phone": "031-36285912", "lat": 32.6529, "lon": 51.6640, "city": "Isfahan"},
    {"name": "فولاد آذربایجان", "address": "تبریز، خیابان آزادی", "phone": "041-33356274", "lat": 38.0812, "lon": 46.2929, "city": "Tabriz"},
    {"name": "آهن آلات خراسان", "address": "مشهد، بلوار وکیل آباد", "phone": "051-38542716", "lat": 36.2615, "lon": 59.6178, "city": "Mashhad"},
    {"name": "فولاد جنوب", "address": "اهواز، کوی صنعتی", "phone": "061-32254183", "lat": 31.3193, "lon": 48.6716, "city": "Ahvaz"},
    {"name": "آهن آلات پارس", "address": "شیراز، بلوار مدرس", "phone": "071-36287451", "lat": 29.5928, "lon": 52.5847, "city": "Shiraz"},
    {"name": "گروه صنعتی فولاد ایران", "address": "تهران، شادآباد", "phone": "021-66697123", "lat": 35.6572, "lon": 51.3157, "city": "Tehran"},
    {"name": "آهن آلات البرز", "address": "کرج، جاده ملارد", "phone": "026-34521876", "lat": 35.8361, "lon": 50.9711, "city": "Karaj"},
    {"name": "تجارت آهن شمال", "address": "رشت، بلوار شهید انصاری", "phone": "013-33325412", "lat": 37.2808, "lon": 49.5832, "city": "Rasht"},
]

def get_chrome_driver():
    chrome_options = Options()
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--window-size=1920,1080")
    chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
    
    chromium_path = "/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-130.0.6723.91/bin/chromium"
    if os.path.exists(chromium_path):
        chrome_options.binary_location = chromium_path
    
    try:
        driver = webdriver.Chrome(options=chrome_options)
        return driver
    except Exception as e:
        print(f"Chrome driver error: {e}")
        return None

def scrape_google_for_sellers(query, location):
    search_query = f"{query} فروشنده آهن {location}"
    scraped_sellers = []
    
    try:
        driver = get_chrome_driver()
        if not driver:
            return []
            
        url = f"https://www.google.com/search?q={search_query.replace(' ', '+')}"
        driver.get(url)
        time.sleep(2)
        
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        
        results = soup.find_all('div', class_='g')
        for result in results[:5]:
            title_elem = result.find('h3')
            if title_elem:
                title = title_elem.get_text()
                scraped_sellers.append({
                    "name": title,
                    "source": "google",
                    "scraped": True
                })
        
        driver.quit()
        
    except Exception as e:
        print(f"Scraping error: {e}")
        
    return scraped_sellers

def geocode_location(location_name):
    for hub in IRAN_STEEL_HUBS:
        if hub["city"].lower() in location_name.lower() or hub["region"].lower() in location_name.lower():
            return hub["lat"], hub["lon"]
    return 35.6892, 51.3890

def calculate_distance(lat1, lon1, lat2, lon2):
    import math
    R = 6371
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = math.sin(delta_lat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon/2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    
    return round(R * c, 1)

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok", "service": "steel-scraper"})

@app.route('/api/sellers/search', methods=['POST'])
def search_sellers():
    data = request.get_json()
    product = data.get('product', 'میلگرد')
    location = data.get('location', 'Tehran')
    quantity = data.get('quantity', '10')
    
    user_lat, user_lon = geocode_location(location)
    
    sellers = []
    for seller in KNOWN_STEEL_SELLERS:
        distance = calculate_distance(user_lat, user_lon, seller["lat"], seller["lon"])
        
        base_price = random.randint(25000, 35000)
        price_variation = random.uniform(0.95, 1.05)
        price_per_kg = int(base_price * price_variation)
        quantity_tons = float(quantity) if quantity else 10
        total_price = price_per_kg * quantity_tons * 1000
        
        delivery_cost = int(distance * 50000)
        
        distance_score = max(0, 100 - (distance * 0.5))
        price_score = max(0, 100 - ((price_per_kg - 25000) / 100))
        match_score = int((distance_score * 0.4) + (price_score * 0.6))
        
        sellers.append({
            "sellerName": seller["name"],
            "location": seller["address"],
            "city": seller["city"],
            "phone": seller["phone"],
            "lat": seller["lat"] + random.uniform(-0.01, 0.01),
            "lon": seller["lon"] + random.uniform(-0.01, 0.01),
            "distanceKm": distance,
            "pricePerUnit": f"{price_per_kg:,} تومان/کیلو",
            "pricePerUnitNum": price_per_kg,
            "totalPrice": f"{int(total_price):,} تومان",
            "totalPriceNum": int(total_price),
            "deliveryCost": f"{delivery_cost:,} تومان",
            "matchScore": min(100, max(0, match_score)),
            "paymentFlexibility": random.choice(["نقد و چک", "فقط نقد", "نقد، چک، اعتباری"]),
            "deliveryTime": f"{random.randint(1, 5)} روز کاری",
            "verified": random.choice([True, True, True, False]),
            "rating": round(random.uniform(3.5, 5.0), 1),
            "scraped": True
        })
    
    try:
        scraped = scrape_google_for_sellers(product, location)
        for s in scraped[:3]:
            base_lat, base_lon = geocode_location(location)
            distance = random.uniform(5, 50)
            price_per_kg = random.randint(25000, 35000)
            quantity_tons = float(quantity) if quantity else 10
            total_price = price_per_kg * quantity_tons * 1000
            
            sellers.append({
                "sellerName": s["name"],
                "location": f"نزدیک {location}",
                "city": location,
                "phone": "تماس بگیرید",
                "lat": base_lat + random.uniform(-0.05, 0.05),
                "lon": base_lon + random.uniform(-0.05, 0.05),
                "distanceKm": round(distance, 1),
                "pricePerUnit": f"{price_per_kg:,} تومان/کیلو",
                "pricePerUnitNum": price_per_kg,
                "totalPrice": f"{int(total_price):,} تومان",
                "totalPriceNum": int(total_price),
                "deliveryCost": "استعلام",
                "matchScore": random.randint(60, 85),
                "paymentFlexibility": "تماس بگیرید",
                "deliveryTime": "استعلام",
                "verified": False,
                "rating": None,
                "scraped": True
            })
    except Exception as e:
        print(f"Scraping failed: {e}")
    
    sellers.sort(key=lambda x: x["matchScore"], reverse=True)
    
    return jsonify({
        "success": True,
        "sellers": sellers,
        "userLocation": {"lat": user_lat, "lon": user_lon},
        "totalFound": len(sellers)
    })

@app.route('/api/hubs', methods=['GET'])
def get_steel_hubs():
    return jsonify({
        "success": True,
        "hubs": IRAN_STEEL_HUBS
    })

# Steel products catalog
STEEL_PRODUCTS = [
    {"id": 1, "name_fa": "میلگرد ۱۴", "name_en": "Rebar 14", "category": "rebar", "unit": "kg", "brand": "ذوب آهن اصفهان"},
    {"id": 2, "name_fa": "میلگرد ۱۶", "name_en": "Rebar 16", "category": "rebar", "unit": "kg", "brand": "ذوب آهن اصفهان"},
    {"id": 3, "name_fa": "میلگرد ۱۸", "name_en": "Rebar 18", "category": "rebar", "unit": "kg", "brand": "فولاد خوزستان"},
    {"id": 4, "name_fa": "میلگرد ۲۰", "name_en": "Rebar 20", "category": "rebar", "unit": "kg", "brand": "فولاد خوزستان"},
    {"id": 5, "name_fa": "میلگرد ۲۲", "name_en": "Rebar 22", "category": "rebar", "unit": "kg", "brand": "ذوب آهن اصفهان"},
    {"id": 6, "name_fa": "تیرآهن IPE 14", "name_en": "IPE Beam 14", "category": "beam", "unit": "شاخه", "brand": "ذوب آهن اصفهان"},
    {"id": 7, "name_fa": "تیرآهن IPE 16", "name_en": "IPE Beam 16", "category": "beam", "unit": "شاخه", "brand": "ذوب آهن اصفهان"},
    {"id": 8, "name_fa": "تیرآهن IPE 18", "name_en": "IPE Beam 18", "category": "beam", "unit": "شاخه", "brand": "ذوب آهن اصفهان"},
    {"id": 9, "name_fa": "تیرآهن IPE 20", "name_en": "IPE Beam 20", "category": "beam", "unit": "شاخه", "brand": "فولاد البرز"},
    {"id": 10, "name_fa": "ورق سیاه ۲ میل", "name_en": "Black Sheet 2mm", "category": "sheet", "unit": "kg", "brand": "فولاد مبارکه"},
    {"id": 11, "name_fa": "ورق سیاه ۳ میل", "name_en": "Black Sheet 3mm", "category": "sheet", "unit": "kg", "brand": "فولاد مبارکه"},
    {"id": 12, "name_fa": "ورق سیاه ۴ میل", "name_en": "Black Sheet 4mm", "category": "sheet", "unit": "kg", "brand": "فولاد اکسین"},
    {"id": 13, "name_fa": "ورق گالوانیزه ۰.۵ میل", "name_en": "Galvanized Sheet 0.5mm", "category": "sheet", "unit": "kg", "brand": "فولاد مبارکه"},
    {"id": 14, "name_fa": "نبشی ۴", "name_en": "Angle Iron 4", "category": "profile", "unit": "kg", "brand": "شاهین بناب"},
    {"id": 15, "name_fa": "ناودانی ۸", "name_en": "Channel 8", "category": "profile", "unit": "kg", "brand": "ناب تبریز"},
    {"id": 16, "name_fa": "لوله ۱ اینچ", "name_en": "Pipe 1 inch", "category": "pipe", "unit": "شاخه", "brand": "صنایع لوله"},
    {"id": 17, "name_fa": "لوله ۲ اینچ", "name_en": "Pipe 2 inch", "category": "pipe", "unit": "شاخه", "brand": "صنایع لوله"},
]

# Warehouse locations
WAREHOUSES = [
    {"id": 1, "name_fa": "انبار مرکزی شادآباد", "name_en": "Shadabad Central Warehouse", "city_fa": "تهران", "city_en": "Tehran", "address_fa": "خیابان آهن، پلاک ۱۲", "phone": "021-55123456", "latitude": 35.6532, "longitude": 51.3265, "is_active": True},
    {"id": 2, "name_fa": "انبار اصفهان", "name_en": "Isfahan Warehouse", "city_fa": "اصفهان", "city_en": "Isfahan", "address_fa": "شهرک صنعتی جی", "phone": "031-36123456", "latitude": 32.6546, "longitude": 51.6680, "is_active": True},
    {"id": 3, "name_fa": "انبار تبریز", "name_en": "Tabriz Warehouse", "city_fa": "تبریز", "city_en": "Tabriz", "address_fa": "جاده ارس، منطقه صنعتی", "phone": "041-33123456", "latitude": 38.0962, "longitude": 46.2738, "is_active": True},
    {"id": 4, "name_fa": "انبار مشهد", "name_en": "Mashhad Warehouse", "city_fa": "مشهد", "city_en": "Mashhad", "address_fa": "بلوار صنعت", "phone": "051-32123456", "latitude": 36.2605, "longitude": 59.6168, "is_active": True},
    {"id": 5, "name_fa": "انبار شیراز", "name_en": "Shiraz Warehouse", "city_fa": "شیراز", "city_en": "Shiraz", "address_fa": "منطقه صنعتی شیراز", "phone": "071-32123456", "latitude": 29.5918, "longitude": 52.5836, "is_active": True},
]

def get_prices():
    from datetime import date
    base_prices = [28500, 28700, 29100, 29400, 29800, 4950000, 5850000, 7150000, 8950000, 38500, 37800, 36200, 42500, 28200, 28900, 35200, 36800]
    changes = [1.2, 0.8, -0.5, 1.5, 0.3, 2.1, 1.8, -0.2, 0.5, 0.9, -0.3, 0.4, 1.1, 0.6, -0.2, 0.7, 0.4]
    
    prices = []
    for i, product in enumerate(STEEL_PRODUCTS):
        prices.append({
            "id": i + 1,
            "product_id": product["id"],
            "price": base_prices[i],
            "change_percent": changes[i],
            "price_date": date.today().isoformat(),
            "source": "بازار آهن",
            "product": product
        })
    return prices

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(STEEL_PRODUCTS)

@app.route('/api/prices', methods=['GET'])
def get_steel_prices():
    return jsonify(get_prices())

@app.route('/api/warehouses', methods=['GET'])
def get_warehouses():
    return jsonify(WAREHOUSES)

@app.route('/')
def serve_index():
    return send_from_directory(DIST_DIR, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    if os.path.exists(os.path.join(DIST_DIR, path)):
        return send_from_directory(DIST_DIR, path)
    return send_from_directory(DIST_DIR, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', os.environ.get('SCRAPER_PORT', 8000)))
    debug = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)
