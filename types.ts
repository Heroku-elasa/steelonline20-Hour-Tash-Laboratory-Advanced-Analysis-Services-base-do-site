

import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';

// Basic Types
export type Language = 'en' | 'fa' | 'ar';
export type Page = 'home' | 'test_recommender' | 'sample_dropoff' | 'ai_consultant' | 'content_hub' | 'our_experts' | 'partnerships' | 'blog' | 'article' | 'tools' | 'iron_snapp' | 'dashboard';

// User info from authentication
export interface User {
    name: string;
    email: string;
    picture?: string;
}

// Message format for chat components
export interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// Distributor Finder Page (Renamed concept to Supplier/Warehouse)
export interface ProviderSearchResult {
    name: string;
    type: 'distributor' | 'veterinarian'; // distributor = Warehouse, veterinarian = Official Dealer
    address: string;
    phone: string;
    website?: string;
    distance?: number;
}

// Search Modal
export interface SearchResultItem {
    title: string;
    description: string;
    targetPage: Page;
    targetId?: number; 
    relevanceScore: number;
}

// Recommendation Engine Page (Smart Steel Selector)
export interface TestSubmissionFormInputs {
    sampleType: string; // Mapped to "Project Type / Material Category"
    suspectedIssue: string; // Mapped to "Requirements / Standards"
    batchSizeOrigin: string; // Mapped to "Tonnage / Destination"
    specificConditions: string; // Mapped to "Structural Details"
    controlSampleInfo: string; // Mapped to "Preferred Brands"
    sampleAge: string; // Mapped to "Delivery Date"
    previousTests: string; // Mapped to "Budget Constraints"
    additives: string; // Mapped to "Additional Services (Cutting, etc.)"
}

export interface PotentialIssue {
    name: string;
    description: string;
    relevance: 'High' | 'Medium' | 'Low';
}

export interface TestRecommendationResult {
    primaryAssessment: string;
    assessmentDescription: string;
    potentialIssues: PotentialIssue[];
    recommendedTests: string[]; // Mapped to Recommended Products (e.g., IPE 180)
    managementAdvice: string[]; // Mapped to Purchase Advice
    nextStepsAndExpertConsultation: string;
    disclaimer: string;
}

export interface TestDetailsItem {
    testName: string; // Product Name
    purpose: string; // Application
    methodology: string; // Technical Specs
    turnaroundTime: string; // Delivery Time
    estimatedCost: string; // Price Estimate
}
export type TestDetailsResult = TestDetailsItem[];

// Content Hub Page
export interface DailyTrend {
    title: string;
    summary: string;
    contentIdea: string;
}

export interface VideoScene {
    timecode: string;
    visual: string;
    voiceover: string;
    audio_cues: string;
    emotion: string;
}

export interface VideoScript {
    title: string;
    hook: string;
    scenes: VideoScene[];
    cta: string;
    caption: string;
    hashtags: string[];
}

export interface PublishingStrategy {
    bestTime: string;
    algorithmTip: string;
    nextPostIdea: string;
    reasoning: string;
}

export interface VideoTool {
    name: string;
    cost: string;
    farsiSupport: string;
    features: string;
    qualityRating: string;
}

export interface GeneratedPost {
    platform: 'linkedin' | 'twitter' | 'instagram' | 'facebook';
    text: string;
    imageUrl: string | null;
    videoScript?: VideoScript;
    strategy?: PublishingStrategy;
}

// Team Page
export interface DoctorProfile {
    name: string;
    specialty: string;
    bio: string;
    licenseNumber: string;
}

// Tools & Calculations
export interface WeightResult {
    product: string;
    weight: string;
    details: string;
}

export interface ShippingEstimate {
    route: string;
    estimatedCost: string;
    vehicleType: string;
}

// IronSnapp Marketplace Types
export interface MarketplaceRequest {
    product: string;
    quantity: string;
    location: string;
    paymentType: 'cash' | 'check' | 'credit';
    checkMonths?: number;
}

export interface MarketplaceOffer {
    sellerName: string;
    location: string;
    distanceKm: number;
    pricePerUnit: string;
    totalPrice: string;
    deliveryCost: string;
    matchScore: number; // 0-100
    paymentFlexibility: string;
    deliveryTime: string;
}

export interface CreditCheckResult {
    allowed: boolean;
    score: number;
    maxAmount: string;
    reason: string;
}

// --- Audit & Financial System Types ---
export interface AuditStats {
    totalChecksAmount: string;
    totalChecksCount: number;
    dueThisWeekAmount: string;
    dueThisWeekCount: number;
    bouncedAmount: string;
    cashBalance: string;
    docsReviewed: number;
    discrepancies: number;
    fraudCases: number;
    controlScore: number;
}

export interface FinancialCheck {
    id: number;
    checkNumber: string;
    amount: string;
    dueDate: string;
    drawer: string;
    bank: string;
    status: 'pending' | 'cleared' | 'bounced' | 'deposited';
    riskScore: number;
}

export interface AuditAlert {
    id: number;
    type: 'warning' | 'error' | 'info' | 'critical';
    message: string;
    date: string;
    isRead: boolean;
}

export interface FraudCase {
    id: number;
    title: string;
    type: string;
    status: 'investigating' | 'confirmed' | 'resolved';
    riskLevel: 'high' | 'medium' | 'low';
    amount: string;
    detectedAt: string;
}

// Blog & Article Pages
interface LocalizedString {
  en: string;
  fa: string;
  ar: string;
}

export interface Article {
    id: number;
    date: LocalizedString;
    excerpt: LocalizedString;
    image: string;
    content: LocalizedString; 
    author: string;
    category: LocalizedString;
    title: LocalizedString;
    tags: LocalizedString[];
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    header: { home: 'Home', recommendationEngine: 'Smart Advisor', distributorFinder: 'Find Suppliers', aiChat: 'AI Consultant', contentHub: 'Market News', blog: 'Blog', ourTeam: 'Sales Team', partnerships: 'Credit Purchase', login: 'Login / Register', logout: 'Logout', tools: 'Tools', ironSnapp: 'IronSnapp', dashboard: 'Dashboard' },
    dashboard: {
        title: 'Admin Dashboard',
        menu: { overview: 'Overview', products: 'Products', pricing: 'Pricing', orders: 'Orders', customers: 'Customers', reports: 'Reports', settings: 'Settings', live: 'Live Monitor', audit: 'Audit Suite' },
        metrics: { orders: "Today's Orders", sales: "Today's Sales", newCustomers: "New Customers", visits: "Site Visits" },
        charts: { salesTitle: 'Monthly Sales', productDist: 'Product Distribution' },
        tables: {
            ordersTitle: 'Recent Orders',
            pricesTitle: 'Live Product Prices',
            headers: { orderId: 'Order ID', customer: 'Customer', product: 'Product', amount: 'Amount', status: 'Status', price: 'Price', change: 'Change', lastUpdate: 'Updated', stock: 'Stock', category: 'Category', actions: 'Actions', phone: 'Phone', company: 'Company', credit: 'Credit' }
        },
        products: { add: 'Add Product', search: 'Search Products...' },
        activity: { title: 'Recent Activity' },
        notifications: { title: 'Notifications' },
        live: {
          title: 'Live Market Monitor',
          subtitle: 'Real-time Steel Market Data & Orders Stream',
          systemStatus: 'System Status',
          kafka: 'Orders Stream',
          risingwave: 'Price Engine',
          grafana: 'Analytics',
          features: 'Live Features',
          logs: 'Live Order Stream',
          activeUsers: 'Active Users',
          trending: 'Trending Products',
        }
    },
    audit: {
        title: 'Teamyar Audit Suite',
        subtitle: 'AI-Powered Financial Auditing & Control',
        tabs: { overview: 'Overview', checks: 'Check Management', ai: 'AI & Fraud', reports: 'Reports' },
        stats: {
            totalChecks: 'Checks in Process',
            dueThisWeek: 'Due This Week',
            bounced: 'Bounced Checks',
            cashBalance: 'Cash Balance',
            docsReviewed: 'Docs Reviewed',
            discrepancies: 'Discrepancies',
            fraud: 'Fraud Cases',
            score: 'Control Score'
        },
        checks: {
            title: 'Check Management',
            table: { number: 'Check No.', drawer: 'Drawer', amount: 'Amount', date: 'Due Date', bank: 'Bank', status: 'Status', risk: 'Risk' }
        },
        ai: {
            title: 'AI Fraud Detection',
            riskAnalysis: 'Risk Analysis',
            anomalies: 'Anomalies Detected',
            recommendations: 'Recommendations'
        },
        alerts: {
            title: 'System Alerts'
        }
    },
    ironSnapp: {
        title: 'IronSnapp Marketplace',
        subtitle: 'Connect directly with sellers. Best prices, check payments, and smart matching.',
        form: {
            title: 'Request Quote',
            productLabel: 'Product Name',
            productPlaceholder: 'e.g., Rebar 16 Esfahan',
            qtyLabel: 'Quantity (Tons)',
            locationLabel: 'Delivery City',
            paymentLabel: 'Payment Method',
            paymentCash: 'Cash',
            paymentCheck: 'Check',
            paymentCredit: 'Credit',
            monthsLabel: 'Check Duration (Months)',
            submit: 'Find Best Offers'
        },
        results: {
            title: 'Best Matches',
            score: 'Match Score',
            distance: 'Distance',
            price: 'Total Price',
            delivery: 'Delivery',
            buy: 'Buy Now',
            creditCheck: 'Credit Check Required'
        },
        credit: {
            checking: 'Analyzing Credit Score...',
            approved: 'Credit Approved',
            rejected: 'Credit Rejected',
            reason: 'Reason',
            score: 'Score'
        }
    },
    products: { food_feed: { title: 'Rebar & Mesh', description: 'High quality ribbed and plain rebar, wire mesh, and thermal rebar.' }, microbiology: { title: 'Beams (Tir-Ahan)', description: 'IPE, IPB, and INP beams from top brands.' }, environmental: { title: 'Sheets & Plate', description: 'Hot rolled (Black), Cold rolled (Oiled), Galvanized, and Color sheets.' } },
    ourTeam: { title: 'Meet Our Experts', subtitle: 'Our specialized sales team is here to guide you.', tableHeaders: { license: 'Ext.' }, doctors: [ { name: 'Eng. Reza Alavi', specialty: 'Rebar Specialist', bio: 'Expert in construction rebar grades.', licenseNumber: '101' }, { name: 'Mrs. Sara Tehrani', specialty: 'Sheet & Plate Manager', bio: 'Specialist in industrial sheets.', licenseNumber: '102' }, { name: 'Eng. Kaveh Rad', specialty: 'Beam & Profile Lead', bio: 'Technical advisor for heavy structures.', licenseNumber: '103' } ] },
    home: {
        hero: { mainTitle: 'Steel Online 20: Daily Prices & Trusted Supply', aboutButton: 'Our Services' },
        infoBar: { call: { title: 'Sales Line', value: '+98 21 2204 1655' }, email: { title: 'Email', value: 'sales@steelonline20.com' }, location: { title: 'HQ', value: 'Jordan, Tehran' } },
        featuredBlocks: { block1: { title: 'Daily Prices', desc: 'Instant market prices.' }, block2: { title: 'Official Invoice', desc: 'Tax-compliant invoices.' }, block3: { title: 'Quality Guarantee', line1: 'Written Guarantee', line2: 'Certified Origin', line3: 'Fast Delivery' }, button: 'Check Prices' },
        whyUs: { title: 'Why Steel Online 20?', subtitle: 'Transparency, Speed, and Reliability.', item1: { title: 'Best Price Guarantee', desc: 'Written guarantee of lowest price.' }, item2: { title: 'Fast Logistics', desc: 'Shipping to all cities.' }, item3: { title: 'Credit Purchase', desc: 'Installments, Checks, LC.' }, item4: { title: 'Quality Assurance', desc: 'QC verified products.' } },
        blog: { title: 'Market Insights', subtitle: 'Latest steel industry news.' },
        partners: { title: 'Top Brands' },
        newsletter: { title: 'Market Watch', subtitle: 'Get daily price alerts.', placeholder: 'Enter your email', button: 'Subscribe' },
        footer: { col1: { title: 'Contact Us' }, col2: { title: 'Products' }, col3: { title: 'Services' }, col4: { title: 'Contact', email: 'Email', message: 'Inquiry', button: 'Send' } }
    },
    footer: { contactInfo: 'No. 18, Taheri St, Jordan, Tehran', workingHours: 'Sat to Wed 8:30 to 17:00', copyright: '© 2024 Steel Online 20. All rights reserved.' },
    hero: { title: 'Steel Online 20', cta: 'Smart Purchase' },
    validation: { required: 'Required', email: 'Invalid email', passwordLength: 'Must be at least 6 characters', fillRequiredFields: 'Please fill all required fields' },
    loginModal: { title: 'Login', emailPlaceholder: 'Email', passwordPlaceholder: 'Password', loginButton: 'Login', or: 'OR' },
    quotaErrorModal: { title: 'System Busy', body: 'Please try again later.', cta: 'Contact Sales', close: 'Close' },
    searchModal: { placeholder: 'Search products...', suggestionsTitle: 'Trending:', suggestionQueries: ['Rebar 14', 'IPE 18', 'Galvanized'], resultsTitle: 'Results', noResults: 'No results.' },
    aiChat: { title: 'Steel Consultant', subtitle: 'Ask about prices & specs.', placeholder: 'e.g., Price of IPE 14?', suggestions: ['Rebar price?', 'ST37 vs ST52?', 'Shipping cost?'] },
    distributorFinder: { title: 'Find Warehouses', subtitle: 'Locate depots.', searchTypeLabel: 'Looking for:', distributor: 'Iron Depot', veterinarian: 'Official Dealer', searchPlaceholder: 'City...', searchButton: 'Find', findNearMe: 'Near Me', searching: 'Locating...', resultsTitle: 'Nearby Suppliers', noResults: 'None found.', suggestionsTitle: 'Hubs', suggestionQueries: ['Tehran', 'Isfahan', 'Mashhad'] },
    recommendationEngine: {
        title: 'Smart Steel Advisor', subtitle: 'Get AI-powered recommendations.', uploadImageTitle: 'Upload Plan', removeImage: 'Remove', uploadButton: 'Upload', cameraButton: 'Camera', formTitle: 'Project Details', symptomsLabel: 'Description', symptomsPlaceholder: 'e.g., 5-story building...', suggestionPromptsTitle: 'Quick Select:', suggestionPrompts: ['Residential', 'Industrial', 'Bridge'], detailsTitle: 'Specs', autoFillCheckboxLabel: 'Auto-fill', sampleTypeLabel: 'Category', sampleTypePlaceholder: 'e.g., Rebar...', batchSizeOriginLabel: 'Tonnage', batchSizeOriginPlaceholder: 'e.g., 25 Tons', specificConditions: 'Structure', controlSampleInfo: 'Brands', sampleAge: 'Delivery', sampleAgePlaceholder: 'e.g., ASAP', previousTests: 'Budget', additives: 'Services', buttonText: 'Get Advice', generating: 'Analyzing...', resultTitle: 'Recommendation', primaryAssessmentTitle: 'Analysis', potentialConditionsTitle: 'Considerations', recommendedProductsTitle: 'Products', managementAdviceTitle: 'Advice', nextStepsTitle: 'Next Steps', findDropoffLocation: 'Find Supplier', getTreatmentPlan: 'Get Quote', gettingPlan: 'Calculating...', detailedPlanTitle: 'Estimate', purpose: 'Usage', methodology: 'Standard', turnaroundTime: 'Availability', estimatedCost: 'Price', disclaimerTitle: 'Disclaimer', startNewAnalysis: 'New', savePdf: 'Download', symptomsSuggestions: ['High Strength', 'Anti-Corrosion'], animalTypeSuggestions: ['Rebar', 'Beam', 'Sheet']
    },
    contentHub: {
        title: 'Market Insights', subtitle: 'Trends & Reports.', platformSelectorTitle: 'Platform', topicTitle: 'Topic', trendsTab: 'Trends', textTab: 'Custom', searchTab: 'Search', fetchingTrends: 'Loading...', customTextPlaceholder: 'Topic...', selectSearchTopic: 'Popular:', userSearchSuggestions: ['Price Forecast', 'Exports'], generatingPost: 'Generating...', generateButton: 'Generate', resultsTitle: 'Result', placeholder: 'Select topic.', copyButton: 'Copy', copySuccess: 'Copied!', connectAccountToPublish: 'Connect', publishToPlatformButton: 'Post', adaptForWebsiteButton: 'Blog Post', adaptingForWebsite: 'Writing...', websitePreviewTitle: 'Preview', publishToWebsiteButton: 'Publish', publishedSuccess: 'Published!',
        getStrategyButton: 'Strategy', fetchingStrategy: 'Analyzing...', strategyTitle: 'Strategy', bestTime: 'Time', nextPost: 'Next',
        generateVideoButton: 'Video Script', generatingVideo: 'Writing...', timecode: 'Time', visual: 'Visual', voiceover: 'Audio', emotion: 'Tone',
        findVideoTools: 'Video Tools', findingTools: 'Searching...', toolName: 'Tool', toolCost: 'Cost', toolFarsi: 'Farsi', toolFeatures: 'Features', toolQuality: 'Rating'
    },
    partnerships: { title: 'Credit Purchase', subtitle: 'Flexible payment options (Check, LC).', name: 'Name', company: 'Company', email: 'Email', message: 'Request', submit: 'Submit' },
    blogPage: { title: 'Blog', subtitle: 'News & Articles.', readMore: 'Read More' },
    articlePage: { backToBlog: 'Back' },
    toolsPage: {
        title: 'Steel Tools', subtitle: 'Calculators & Utilities',
        weightCalc: { title: 'Weight Calculator', label: 'Product Name (e.g., IPE 18)', button: 'Calculate', result: 'Standard Weight' },
        shippingCalc: { title: 'Shipping Estimator', label: 'Route (e.g., Isfahan to Tehran)', button: 'Estimate', result: 'Estimated Cost' },
        creditInfo: { title: 'Credit Purchase', desc: 'Buy now, pay later with Checks or LC.' }
    }
  },
  fa: {
    header: { home: 'خانه', recommendationEngine: 'مشاور خرید', distributorFinder: 'مراکز فروش', aiChat: 'هوش مصنوعی', contentHub: 'تحلیل بازار', blog: 'مجله آهن', ourTeam: 'تیم فروش', partnerships: 'خرید اعتباری', login: 'ورود / ثبت‌نام', logout: 'خروج', tools: 'ابزارها', ironSnapp: 'آهن‌اسنپ', dashboard: 'داشبورد مدیریت' },
    dashboard: {
        title: 'داشبورد مدیریت',
        menu: { overview: 'نمای کلی', products: 'محصولات', pricing: 'قیمت‌گذاری', orders: 'سفارشات', customers: 'مشتریان', reports: 'گزارشات', settings: 'تنظیمات', live: 'مانیتور زنده', audit: 'حسابرس‌یار' },
        metrics: { orders: "سفارشات امروز", sales: "فروش امروز", newCustomers: "مشتریان جدید", visits: "بازدید سایت" },
        charts: { salesTitle: 'نمودار فروش ماهانه', productDist: 'توزیع فروش محصولات' },
        tables: {
            ordersTitle: 'سفارشات اخیر',
            pricesTitle: 'قیمت لحظه‌ای محصولات',
            headers: { orderId: 'شماره', customer: 'مشتری', product: 'محصول', amount: 'مبلغ', status: 'وضعیت', price: 'قیمت', change: 'تغییر', lastUpdate: 'بروزرسانی', stock: 'موجودی', category: 'دسته‌بندی', actions: 'عملیات', phone: 'تلفن', company: 'شرکت', credit: 'اعتبار' }
        },
        products: { add: 'افزودن محصول', search: 'جستجوی محصول...' },
        activity: { title: 'فعالیت‌های اخیر' },
        notifications: { title: 'اعلان‌ها' },
        live: {
          title: 'مانیتور زنده بازار',
          subtitle: 'مانیتورینگ لحظه‌ای داده‌های بازار فولاد و سفارشات',
          systemStatus: 'وضعیت سیستم',
          kafka: 'جریان سفارشات',
          risingwave: 'موتور قیمت',
          grafana: 'تحلیل‌گر',
          features: 'شاخص‌های زنده',
          logs: 'جریان زنده سفارشات',
          activeUsers: 'کاربران آنلاین',
          trending: 'محصولات داغ',
        }
    },
    audit: {
        title: 'حسابرس‌یار',
        subtitle: 'سیستم هوشمند حسابرسی و مدیریت مالی',
        tabs: { overview: 'نمای کلی', checks: 'مدیریت چک‌ها', ai: 'هوش مصنوعی و تقلب', reports: 'گزارشات' },
        stats: {
            totalChecks: 'کل چک‌های در جریان',
            dueThisWeek: 'سررسید این هفته',
            bounced: 'چک‌های برگشتی',
            cashBalance: 'موجودی نقد',
            docsReviewed: 'اسناد بررسی شده',
            discrepancies: 'مغایرت‌های کشف شده',
            fraud: 'موارد تقلب جدید',
            score: 'امتیاز کنترل داخلی'
        },
        checks: {
            title: 'مدیریت چک‌ها',
            table: { number: 'شماره چک', drawer: 'صادرکننده', amount: 'مبلغ (ریال)', date: 'سررسید', bank: 'بانک', status: 'وضعیت', risk: 'ریسک' }
        },
        ai: {
            title: 'پنل تشخیص تقلب هوشمند',
            riskAnalysis: 'تحلیل ریسک',
            anomalies: 'ناهنجاری‌های کشف شده',
            recommendations: 'پیشنهادات سیستمی'
        },
        alerts: {
            title: 'هشدارهای سیستم'
        }
    },
    ironSnapp: {
        title: 'بازار هوشمند آهن‌اسنپ',
        subtitle: 'اتصال مستقیم به فروشندگان. بهترین قیمت، خرید چکی و مچینگ هوشمند.',
        form: {
            title: 'درخواست خرید',
            productLabel: 'نام کالا',
            productPlaceholder: 'مثلا: میلگرد ۱۶ ذوب آهن',
            qtyLabel: 'مقدار (تن)',
            locationLabel: 'شهر مقصد',
            paymentLabel: 'نحوه پرداخت',
            paymentCash: 'نقدی',
            paymentCheck: 'چکی / اعتباری',
            paymentCredit: 'اعتباری (LC)',
            monthsLabel: 'مدت چک (ماه)',
            submit: 'یافتن بهترین پیشنهاد'
        },
        results: {
            title: 'پیشنهادات هوشمند',
            score: 'امتیاز تطابق',
            distance: 'فاصله',
            price: 'قیمت کل',
            delivery: 'تحویل',
            buy: 'خرید نهایی',
            creditCheck: 'نیاز به اعتبارسنجی'
        },
        credit: {
            checking: 'در حال اعتبارسنجی...',
            approved: 'اعتبار تایید شد',
            rejected: 'اعتبار رد شد',
            reason: 'دلیل',
            score: 'امتیاز اعتباری'
        }
    },
    products: { food_feed: { title: 'میلگرد و توری', description: 'انواع میلگرد آجدار و ساده، توری مش و میلگرد حرارتی با بهترین کیفیت.' }, microbiology: { title: 'تیرآهن و هاش', description: 'تیرآهن‌های IPE، IPB و لانه زنبوری از برندهای ذوب آهن و فایکو.' }, environmental: { title: 'انواع ورق', description: 'ورق سیاه (ST37, ST52)، روغنی، گالوانیزه و رنگی در ابعاد مختلف.' } },
    ourTeam: { title: 'کارشناسان فروش', subtitle: 'تیم متخصص ما آماده ارائه مشاوره فنی و راهنمایی در خرید آهن‌آلات است.', tableHeaders: { license: 'داخلی' }, doctors: [ { name: 'مهندس رضا علوی', specialty: 'کارشناس میلگرد', bio: 'متخصص در آنالیز قیمت و استانداردهای میلگرد ساختمانی.', licenseNumber: '۱۰۱' }, { name: 'خانم سارا تهرانی', specialty: 'مدیر بخش ورق', bio: 'مشاور تخصصی در زمینه ورق‌های آلیاژی و صنعتی.', licenseNumber: '۱۰۲' }, { name: 'مهندس کاوه راد', specialty: 'سرپرست تیرآهن', bio: 'مشاور فنی پروژه‌های اسکلت فلزی و سازه‌های سنگین.', licenseNumber: '۱۰۳' } ] },
    home: {
        hero: { mainTitle: 'استیل آنلاین ۲۰: مرجع قیمت و خرید مطمئن', aboutButton: 'خدمات ما' },
        infoBar: { call: { title: 'تلفن فروش', value: '۰۲۱-۲۲۰۴۱۶۵۵' }, email: { title: 'ایمیل', value: 'sales@steelonline20.com' }, location: { title: 'دفتر مرکزی', value: 'تهران، جردن' } },
        featuredBlocks: { block1: { title: 'قیمت لحظه‌ای', desc: 'دسترسی آنی به قیمت روز تمامی مقاطع فولادی.' }, block2: { title: 'فاکتور رسمی', desc: 'ارائه فاکتور رسمی برای شرکت‌ها و پیمانکاران.' }, block3: { title: 'تضمین کیفیت و قیمت', line1: 'ضمانت کتبی قیمت', line2: 'تضمین کیفیت کالا', line3: 'ارسال سریع بار' }, button: 'مشاهده قیمت‌ها' },
        whyUs: { title: 'چرا استیل آنلاین ۲۰؟', subtitle: 'شفافیت، سرعت و اطمینان در خرید.', item1: { title: 'تضمین قیمت', desc: 'ارائه ضمانت‌نامه کتبی برای کمترین قیمت بازار.' }, item2: { title: 'هزینه حمل بار', desc: 'محاسبه و ارسال بار به سراسر کشور با کمترین نرخ.' }, item3: { title: 'خرید اعتباری', desc: 'امکان خرید قسطی، چکی و ال سی.' }, item4: { title: 'تضمین کیفیت', desc: 'تضمین کتبی کیفیت در تمامی پیش‌فاکتورها.' } },
        blog: { title: 'اخبار و مقالات', subtitle: 'تحلیل‌های روزانه بازار آهن و فولاد.' },
        partners: { title: 'برندهای همکار' },
        newsletter: { title: 'لیست علاقمندی‌ها', subtitle: 'رصد نوسانات قیمت محصولات محبوب شما.', placeholder: 'ایمیل خود را وارد کنید', button: 'عضویت' },
        footer: { col1: { title: 'تماس با ما' }, col2: { title: 'محصولات' }, col3: { title: 'خدمات' }, col4: { title: 'تماس', email: 'ایمیل', message: 'پیام', button: 'ارسال' } }
    },
    footer: { contactInfo: 'تهران، جردن، خیابان طاهری، پلاک ۱۸', workingHours: 'شنبه تا چهارشنبه ۸:۳۰ تا ۱۷:۰۰', copyright: '© ۱۴۰۳ استیل آنلاین ۲۰. تمامی حقوق محفوظ است.' },
    hero: { title: 'استیل آنلاین ۲۰', cta: 'مشاوره خرید هوشمند' },
    validation: { required: 'الزامی', email: 'ایمیل نامعتبر', passwordLength: 'حداقل ۶ کاراکتر', fillRequiredFields: 'لطفا موارد الزامی را پر کنید' },
    loginModal: { title: 'ورود به حساب', emailPlaceholder: 'ایمیل / موبایل', passwordPlaceholder: 'رمز عبور', loginButton: 'ورود', or: 'یا' },
    quotaErrorModal: { title: 'ترافیک بالا', body: 'سیستم در حال حاضر شلوغ است. لطفا دقایقی دیگر تلاش کنید.', cta: 'تماس با پشتیبانی', close: 'بستن' },
    searchModal: { placeholder: 'جستجوی محصول (مثلا: تیرآهن ۱۴، میلگرد ۱۶)...', suggestionsTitle: 'جستجوهای پرطرفدار:', suggestionQueries: ['میلگرد ۱۴ اصفهان', 'تیرآهن ۱۸ ذوب', 'ورق گالوانیزه', 'پروفیل ساختمانی'], resultsTitle: 'محصولات یافت شده', noResults: 'محصولی یافت نشد.' },
    aiChat: { title: 'دستیار هوشمند آهن', subtitle: 'سوالات خود را درباره قیمت، استانداردها و هزینه حمل بپرسید.', placeholder: 'مثلا: قیمت تیرآهن ۱۴ امروز چند است؟', suggestions: ['قیمت میلگرد ۱۶؟', 'تفاوت ورق ST37 و ST52؟', 'هزینه حمل تا مشهد؟'] },
    distributorFinder: { title: 'مراکز بارگیری', subtitle: 'یافتن نزدیک‌ترین بنگاه‌ها و مبادی بارگیری آهن‌آلات.', searchTypeLabel: 'جستجو برای:', distributor: 'بنگاه آهن', veterinarian: 'نمایندگی رسمی', searchPlaceholder: 'نام شهر یا منطقه...', searchButton: 'جستجو', findNearMe: 'اطراف من', searching: 'در حال جستجو...', resultsTitle: 'تامین‌کنندگان نزدیک', noResults: 'تامین‌کننده‌ای یافت نشد.', suggestionsTitle: 'مبادی اصلی', suggestionQueries: ['تهران (شادآباد)', 'اصفهان', 'مشهد', 'اهواز'] },
    recommendationEngine: {
        title: 'مشاور هوشمند خرید', subtitle: 'مشخصات پروژه را وارد کنید تا بهترین مقاطع فولادی را پیشنهاد دهیم.', uploadImageTitle: 'آپلود نقشه/عکس (اختیاری)', removeImage: 'حذف', uploadButton: 'آپلود نقشه', cameraButton: 'عکس از محل', formTitle: 'مشخصات پروژه', symptomsLabel: 'شرح پروژه / نیاز اصلی', symptomsPlaceholder: 'مثلا: ساخت ساختمان ۵ طبقه مسکونی در شمال کشور...', suggestionPromptsTitle: 'انتخاب سریع:', suggestionPrompts: ['ساختمان مسکونی', 'سوله صنعتی', 'پل سازی', 'حصارکشی'], detailsTitle: 'جزئیات فنی', autoFillCheckboxLabel: 'تکمیل خودکار با هوش مصنوعی', sampleTypeLabel: 'دسته محصول', sampleTypePlaceholder: 'مثلا: میلگرد، تیرآهن، ورق...', batchSizeOriginLabel: 'تناژ / مقصد', batchSizeOriginPlaceholder: 'مثلا: ۲۵ تن، تبریز', specificConditions: 'جزئیات سازه', controlSampleInfo: 'برندهای ترجیحی', sampleAge: 'زمان تحویل', sampleAgePlaceholder: 'مثلا: هفته آینده', previousTests: 'بودجه/محدودیت', additives: 'خدمات (برشکاری و...)', buttonText: 'دریافت پیشنهاد', generating: 'در حال تحلیل پروژه...', resultTitle: 'پیشنهاد خرید', primaryAssessmentTitle: 'تحلیل پروژه', potentialConditionsTitle: 'ملاحظات فنی', recommendedProductsTitle: 'محصولات پیشنهادی', managementAdviceTitle: 'نکات خرید و لجستیک', nextStepsTitle: 'قدم‌های بعدی', findDropoffLocation: 'یافتن تامین‌کننده', getTreatmentPlan: 'استعلام قیمت دقیق', gettingPlan: 'محاسبه...', detailedPlanTitle: 'پیش‌فاکتور تخمینی', purpose: 'کاربرد', methodology: 'استاندارد', turnaroundTime: 'موجود', estimatedCost: 'قیمت تقریبی واحد', disclaimerTitle: 'سلب مسئولیت', startNewAnalysis: 'استعلام جدید', savePdf: 'دانلود پیش‌فاکتور', symptomsSuggestions: ['مقاومت کششی بالا', 'ضد زنگ', 'مقاوم در زلزله', 'اقتصادی'], animalTypeSuggestions: ['میلگرد', 'تیرآهن', 'ورق', 'پروفیل', 'لوله', 'نبشی', 'ناودانی']
    },
    contentHub: {
        title: 'تحلیل بازار', subtitle: 'بررسی روندها و تولید محتوای تحلیلی.', platformSelectorTitle: '۱. پلتفرم', topicTitle: '۲. موضوع', trendsTab: 'روندهای بازار', textTab: 'موضوع دلخواه', searchTab: 'جستجو', fetchingTrends: 'در حال دریافت قیمت‌ها...', customTextPlaceholder: 'موضوع تحلیل (مثلا: "تاثیر دلار بر قیمت آهن")...', selectSearchTopic: 'موضوعات داغ:', userSearchSuggestions: ['پیش‌بینی قیمت آهن', 'تعرفه صادرات', 'فصل ساخت و ساز', 'قیمت مواد اولیه'], generatingPost: 'در حال تولید...', generateButton: 'تولید تحلیل', resultsTitle: 'محتوای تولید شده', placeholder: 'یک موضوع برای تحلیل انتخاب کنید.', copyButton: 'کپی', copySuccess: 'کپی شد!', connectAccountToPublish: 'اتصال حساب', publishToPlatformButton: 'انتشار در {platform}', adaptForWebsiteButton: 'تبدیل به مقاله', adaptingForWebsite: 'در حال نگارش...', websitePreviewTitle: 'پیش‌نمایش مقاله', publishToWebsiteButton: 'انتشار در سایت', publishedSuccess: 'منتشر شد!',
        getStrategyButton: 'استراتژی محتوا', fetchingStrategy: 'تحلیل...', strategyTitle: 'استراتژی انتشار', bestTime: 'بهترین زمان', nextPost: 'موضوع بعدی',
        generateVideoButton: 'سناریو ویدیو', generatingVideo: 'نوشتن سناریو...', timecode: 'زمان', visual: 'تصویر', voiceover: 'صدا', emotion: 'لحن',
        findVideoTools: 'ابزارهای ویدیو', findingTools: 'جستجو...', toolName: 'ابزار', toolCost: 'هزینه', toolFarsi: 'فارسی', toolFeatures: 'امکانات', toolQuality: 'امتیاز'
    },
    partnerships: { title: 'خرید اعتباری', subtitle: 'امکان خرید اقساطی، چکی و LC برای مشتریان.', name: 'نام کامل', company: 'نام شرکت', email: 'ایمیل', message: 'جزئیات درخواست', submit: 'ثبت درخواست اعتبار' },
    blogPage: { title: 'مجله تخصصی آهن', subtitle: 'اخبار، تحلیل‌ها و مقالات آموزشی صنعت فولاد.', readMore: 'ادامه مطلب' },
    articlePage: { backToBlog: 'بازگشت به اخبار' },
    toolsPage: {
        title: 'ابزارهای کاربردی', subtitle: 'محاسبات فنی و لجستیکی آهن‌آلات',
        weightCalc: { title: 'جدول وزن آهن‌آلات', label: 'نام محصول (مثلا: تیرآهن ۱۸)', button: 'محاسبه وزن', result: 'وزن استاندارد' },
        shippingCalc: { title: 'هزینه حمل بار', label: 'مسیر (مثلا: اصفهان به تهران)', button: 'استعلام هزینه', result: 'هزینه تقریبی' },
        creditInfo: { title: 'شرایط اعتباری', desc: 'خرید مدت‌دار با چک صیادی و ضمانت‌نامه بانکی.' }
    }
  },
  ar: {
    header: { home: 'الرئيسية', recommendationEngine: 'المستشار الذكي', distributorFinder: 'الموردين', aiChat: 'استشارة ذكية', contentHub: 'تحليل السوق', blog: 'المدونة', ourTeam: 'فريق المبيعات', partnerships: 'شراء بالائتمان', login: 'دخول / تسجيل', logout: 'خروج', tools: 'أدوات', ironSnapp: 'آيرون سناب', dashboard: 'لوحة التحكم' },
    dashboard: {
        title: 'لوحة التحكم',
        menu: { overview: 'نظرة عامة', products: 'المنتجات', pricing: 'التسعير', orders: 'الطلبات', customers: 'العملاء', reports: 'التقارير', settings: 'الإعدادات', live: 'مراقبة حية', audit: 'التدقيق' },
        metrics: { orders: "طلبات اليوم", sales: "مبيعات اليوم", newCustomers: "عملاء جدد", visits: "زيارات الموقع" },
        charts: { salesTitle: 'المبيعات الشهرية', productDist: 'توزيع المنتجات' },
        tables: {
            ordersTitle: 'أحدث الطلبات',
            pricesTitle: 'أسعار المنتجات المباشرة',
            headers: { orderId: 'الرقم', customer: 'العميل', product: 'المنتج', amount: 'المبلغ', status: 'الحالة', price: 'السعر', change: 'التغيير', lastUpdate: 'التحديث', stock: 'المخزون', category: 'الفئة', actions: 'الإجراءات', phone: 'الهاتف', company: 'الشركة', credit: 'الائتمان' }
        },
        products: { add: 'إضافة منتج', search: 'بحث عن منتجات...' },
        activity: { title: 'النشاط الأخير' },
        notifications: { title: 'الإشعارات' },
        live: {
          title: 'مراقبة السوق الحية',
          subtitle: 'بيانات سوق الصلب في الوقت الفعلي وتدفق الطلبات',
          systemStatus: 'حالة النظام',
          kafka: 'تدفق الطلبات',
          risingwave: 'محرك الأسعار',
          grafana: 'التحليلات',
          features: 'الميزات الحية',
          logs: 'تدفق الطلبات المباشر',
          activeUsers: 'المستخدمون النشطون',
          trending: 'المنتجات الرائجة',
        }
    },
    audit: {
        title: 'نظام التدقيق',
        subtitle: 'التدقيق المالي المدعوم بالذكاء الاصطناعي',
        tabs: { overview: 'نظرة عامة', checks: 'إدارة الشيكات', ai: 'الذكاء الاصطناعي والاحتيال', reports: 'التقارير' },
        stats: {
            totalChecks: 'الشيكات قيد المعالجة',
            dueThisWeek: 'المستحقة هذا الأسبوع',
            bounced: 'الشيكات المرتجعة',
            cashBalance: 'الرصيد النقدي',
            docsReviewed: 'المستندات التي تمت مراجعتها',
            discrepancies: 'التناقضات',
            fraud: 'حالات الاحتيال',
            score: 'درجة التحكم'
        },
        checks: {
            title: 'إدارة الشيكات',
            table: { number: 'رقم الشيك', drawer: 'الساحب', amount: 'المبلغ', date: 'تاريخ الاستحقاق', bank: 'البنك', status: 'الحالة', risk: 'المخاطرة' }
        },
        ai: {
            title: 'كشف الاحتيال',
            riskAnalysis: 'تحليل المخاطر',
            anomalies: 'الحالات الشاذة',
            recommendations: 'التوصيات'
        },
        alerts: {
            title: 'تنبيهات النظام'
        }
    },
    ironSnapp: {
        title: 'سوق آيرون سناب',
        subtitle: 'تواصل مباشرة مع البائعين. أفضل الأسعار، الدفع بالشيكات، والمطابقة الذكية.',
        form: {
            title: 'طلب عرض سعر',
            productLabel: 'اسم المنتج',
            productPlaceholder: 'مثلاً: حديد تسليح 16 أصفهان',
            qtyLabel: 'الكمية (طن)',
            locationLabel: 'مدينة التسليم',
            paymentLabel: 'طريقة الدفع',
            paymentCash: 'نقدي',
            paymentCheck: 'شيك / ائتمان',
            paymentCredit: 'ائتمان (LC)',
            monthsLabel: 'مدة الشيك (أشهر)',
            submit: 'ابحث عن أفضل العروض'
        },
        results: {
            title: 'أفضل المطابقات',
            score: 'درجة التطابق',
            distance: 'المسافة',
            price: 'السعر الإجمالي',
            delivery: 'التوصيل',
            buy: 'شراء الآن',
            creditCheck: 'مطلوب فحص الائتمان'
        },
        credit: {
            checking: 'جارٍ تحليل الائتمان...',
            approved: 'تمت الموافقة',
            rejected: 'مرفوض',
            reason: 'السبب',
            score: 'النقاط'
        }
    },
    products: { food_feed: { title: 'حديد التسليح', description: 'قضبان التسليح المضلعة والملساء وشبكات الصلب.' }, microbiology: { title: 'الجسور والكمرات', description: 'جسور IPE و IPB من أفضل المصانع.' }, environmental: { title: 'الصفائح والألواح', description: 'صفائح ساخنة (سوداء)، باردة (زيتية)، مجلفنة وملونة.' } },
    ourTeam: { title: 'فريق المبيعات', subtitle: 'فريقنا المتخصص جاهز لتقديم الاستشارات الفنية.', tableHeaders: { license: 'تحويلة' }, doctors: [ { name: 'م. رضا علوی', specialty: 'أخصائي حديد التسليح', bio: 'خبير في تحليل الأسعار ومعايير البناء.', licenseNumber: '101' }, { name: 'السيدة سارة طهراني', specialty: 'مديرة قسم الصفائح', bio: 'متخصص في الصفائح الصناعية والمجلفنة.', licenseNumber: '102' }, { name: 'م. كاوة راد', specialty: 'مشرف الجسور', bio: 'مستشار فني للمشاريع الهيكلية الثقيلة.', licenseNumber: '103' } ] },
    home: {
        hero: { mainTitle: 'ستيل أونلاين 20: المصدر الموثوق للحديد', aboutButton: 'خدماتنا' },
        infoBar: { call: { title: 'المبيعات', value: '+98 21 2204 1655' }, email: { title: 'البريد', value: 'sales@steelonline20.com' }, location: { title: 'المقر', value: 'طهران، جوردان' } },
        featuredBlocks: { block1: { title: 'أسعار يومية', desc: 'وصول فوري لأسعار السوق.' }, block2: { title: 'فواتير رسمية', desc: 'فواتير معتمدة للشركات.' }, block3: { title: 'ضمان الجودة', line1: 'ضمان السعر', line2: 'شهادة الجودة', line3: 'توصيل سريع' }, button: 'تحقق من الأسعار' },
        whyUs: { title: 'لماذا ستيل أونلاين 20؟', subtitle: 'الشفافية، السرعة، والموثوقية.', item1: { title: 'ضمان السعر', desc: 'ضمان كتابي لأقل سعر.' }, item2: { title: 'تكلفة الشحن', desc: 'حساب تكاليف النقل بدقة.' }, item3: { title: 'شراء بالائتمان', desc: 'الدفع بالشيكات والاعتمادات.' }, item4: { title: 'ضمان الجودة', desc: 'فحص الجودة قبل الشحن.' } },
        blog: { title: 'تحليلات السوق', subtitle: 'أحدث أخبار صناعة الصلب.' },
        partners: { title: 'شركاؤنا' },
        newsletter: { title: 'قائمة الرغبات', subtitle: 'تابع أسعار منتجاتك المفضلة.', placeholder: 'أدخل بريدك الإلكتروني', button: 'اشترك' },
        footer: { col1: { title: 'اتصل بنا' }, col2: { title: 'المنتجات' }, col3: { title: 'الخدمات' }, col4: { title: 'اتصل بنا', email: 'البريد', message: 'الرسالة', button: 'إرسال' } }
    },
    footer: { contactInfo: 'رقم 18، شارع طاهري، جوردان، أمانية، طهران، إيران', workingHours: 'السبت إلى الأربعاء 8:30 إلى 17:00', copyright: '© 2024 ستيل أونلاين 20. جميع الحقوق محفوظة.' },
    hero: { title: 'ستيل أونلاين 20', cta: 'شراء ذكي' },
    validation: { required: 'مطلوب', email: 'بريد غير صالح', passwordLength: '6 أحرف على الأقل', fillRequiredFields: 'يرجى ملء الحقول المطلوبة' },
    loginModal: { title: 'تسجيل الدخول', emailPlaceholder: 'البريد / الهاتف', passwordPlaceholder: 'كلمة المرور', loginButton: 'دخول', or: 'أو' },
    quotaErrorModal: { title: 'النظام مشغول', body: 'نواجه ضغطًا عاليًا حاليًا. يرجى المحاولة لاحقًا.', cta: 'اتصل بالمبيعات', close: 'إغلاق' },
    searchModal: { placeholder: 'بحث عن منتجات (مثلاً: حديد 16)...', suggestionsTitle: 'الأكثر بحثًا:', suggestionQueries: ['حديد 14 أصفهان', 'جسور IPE 18', 'صاج مجلفن', 'بروفيل'], resultsTitle: 'المنتجات', noResults: 'لا توجد نتائج.' },
    aiChat: { title: 'مستشار الحديد', subtitle: 'اسأل عن الأسعار، المعايير الفنية، أو تكاليف الشحن.', placeholder: 'مثلاً: كم سعر طن الحديد اليوم؟', suggestions: ['سعر حديد 16؟', 'الفرق بين ST37 و ST52؟', 'تكلفة الشحن لمشهد؟'] },
    distributorFinder: { title: 'البحث عن المستودعات', subtitle: 'حدد موقع أقرب مستودعات الحديد ونقاط التحميل.', searchTypeLabel: 'أبحث عن:', distributor: 'مستودع حديد', veterinarian: 'وكيل رسمي', searchPlaceholder: 'المدينة أو المنطقة...', searchButton: 'بحث', findNearMe: 'بالقرب مني', searching: 'جارٍ البحث...', resultsTitle: 'الموردون القريبون', noResults: 'لا يوجد موردين.', suggestionsTitle: 'المراكز الرئيسية', suggestionQueries: ['طهران', 'أصفهان', 'مشهد', 'الأهواز'] },
    recommendationEngine: {
        title: 'مستشار الشراء الذكي', subtitle: 'أخبرنا عن مشروعك للحصول على أفضل التوصيات.', uploadImageTitle: 'تحميل مخطط/صورة', removeImage: 'إزالة', uploadButton: 'تحميل', cameraButton: 'تصوير', formTitle: 'تفاصيل المشروع', symptomsLabel: 'وصف المشروع', symptomsPlaceholder: 'مثلاً: بناء مبنى سكني 5 طوابق...', suggestionPromptsTitle: 'تحديد سريع:', suggestionPrompts: ['مبنى سكني', 'هنجر صناعي', 'جسر', 'سياج'], detailsTitle: 'المواصفات الفنية', autoFillCheckboxLabel: 'تعبئة تلقائية', sampleTypeLabel: 'فئة المنتج', sampleTypePlaceholder: 'مثلاً: حديد، جسور، صاج...', batchSizeOriginLabel: 'الكمية / الوجهة', batchSizeOriginPlaceholder: 'مثلاً: 25 طن، تبريز', specificConditions: 'التفاصيل الإنشائية', controlSampleInfo: 'الماركات المفضلة', sampleAge: 'موعد التسليم', sampleAgePlaceholder: 'مثلاً: الأسبوع القادم', previousTests: 'الميزانية', additives: 'خدمات إضافية', buttonText: 'احصل على توصية', generating: 'جارٍ التحليل...', resultTitle: 'توصية المواد', primaryAssessmentTitle: 'تحلیل المشروع', potentialConditionsTitle: 'اعتبارات فنية', recommendedProductsTitle: 'المنتجات المقترحة', managementAdviceTitle: 'نصائح الشراء', nextStepsTitle: 'الخطوات التالية', findDropoffLocation: 'عثور على مورد', getTreatmentPlan: 'تقدير السعر', gettingPlan: 'جارٍ الحساب...', detailedPlanTitle: 'عرض سعر تقديري', purpose: 'الاستخدام', methodology: 'المعيار', turnaroundTime: 'التوفر', estimatedCost: 'السعر التقديري', disclaimerTitle: 'تنويه', startNewAnalysis: 'طلب جديد', savePdf: 'تحميل العرض', symptomsSuggestions: ['مقاومة شد عالية', 'مقاومة صدأ', 'مقاوم للزلازل', 'اقتصادی'], animalTypeSuggestions: ['حديد تسليح', 'جسور', 'صاج', 'بروفيل', 'أنابيب', 'زوايا', 'قنوات']
    },
    contentHub: {
        title: 'تحليلات السوق', subtitle: 'تحليل الاتجاهات وإنشاء تقارير.', platformSelectorTitle: '1. المنصة', topicTitle: '2. الموضوع', trendsTab: 'اتجاهات السوق', textTab: 'موضوع مخصص', searchTab: 'بحث', fetchingTrends: 'جلب البيانات...', customTextPlaceholder: 'موضوع التحليل (مثلاً: "تأثير الدولار على الحديد")...', selectSearchTopic: 'مواضيع شائعة:', userSearchSuggestions: ['توقعات أسعار الحديد', 'تعريفات التصدير', 'موسم البناء', 'تكاليف المواد الخام'], generatingPost: 'جارٍ الإنشاء...', generateButton: 'إنشاء تحليل', resultsTitle: 'المحتوى', placeholder: 'اختر موضوعًا.', copyButton: 'نسخ', copySuccess: 'تم النسخ!', connectAccountToPublish: 'ربط الحساب', publishToPlatformButton: 'نشر على {platform}', adaptForWebsiteButton: 'تحويل لمقال', adaptingForWebsite: 'جارٍ الكتابة...', websitePreviewTitle: 'معاينة المقال', publishToWebsiteButton: 'نشر', publishedSuccess: 'تم النشر!',
        getStrategyButton: 'استراتژی محتوا', fetchingStrategy: 'تحلیل...', strategyTitle: 'استراتژی انتشار', bestTime: 'أفضل وقت', nextPost: 'الموضوع التالي',
        generateVideoButton: 'سيناريو فيديو', generatingVideo: 'كتابة...', timecode: 'وقت', visual: 'بصري', voiceover: 'صوت', emotion: 'نبرة',
        findVideoTools: 'أدوات الفيديو', findingTools: 'بحث...', toolName: 'أداة', toolCost: 'تكلفة', toolFarsi: 'فارسي', toolFeatures: 'ميزات', toolQuality: 'تقييم'
    },
    partnerships: { title: 'شراء بالائتمان', subtitle: 'خيارات دفع مرنة (شيك، اعتماد).', name: 'الاسم الكامل', company: 'اسم الشركة', email: 'البريد', message: 'التفاصيل', submit: 'طلب' },
    blogPage: { title: 'مجله الصلب', subtitle: 'أخبار، تحليلات، ومقالات تعليمية.', readMore: 'اقرأ المزيد' },
    articlePage: { backToBlog: 'عودة للأخبار' },
    toolsPage: {
        title: 'أدوات الحديد', subtitle: 'حاسبات وأدوات مساعدة',
        weightCalc: { title: 'حاسبة الوزن', label: 'اسم المنتج (مثلاً: جسر 18)', button: 'حساب', result: 'الوزن القياسي' },
        shippingCalc: { title: 'حاسبة الشحن', label: 'المسار (مثلاً: أصفهان إلى طهران)', button: 'تقدير', result: 'التكلفة التقديرية' },
        creditInfo: { title: 'شروط الائتمان', desc: 'شراء مؤجل بشيكات أو ضمان بنكي.' }
    }
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fa');

  const t = useCallback((key: string) => {
    const keys = key.split('.');
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
      if (!value) return key;
    }
    return value;
  }, [language]);

  const dir = language === 'fa' || language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t, dir } },
    children
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Articles Data - Updated for Steel Industry
export const ARTICLES: Article[] = [
    {
        id: 1,
        title: { en: 'Rebar Price Forecast for Q3 2024', fa: 'پیش‌بینی قیمت میلگرد در تابستان ۱۴۰۳', ar: 'توقعات أسعار حديد التسليح للربع الثالث 2024' },
        excerpt: { en: 'Analysis of global steel scrap prices and their impact on the domestic rebar market.', fa: 'تحلیل قیمت جهانی قراضه و تاثیر آن بر بازار داخلی میلگرد.', ar: 'تحليل أسعار الخردة العالمية وتأثيرها على سوق حديد التسليح المحلي.' },
        date: { en: 'June 15, 2024', fa: '۲۵ خرداد ۱۴۰۳', ar: '١٥ يونيو ٢٠٢٤' },
        image: 'https://ahanonline.com/resize/?file=https://contents.ahanonline.com/website/4b09d5c892666a11f9500f587d446aac.jpg&format=webp', // Using image from HTML
        author: 'Eng. Reza Alavi',
        category: { en: 'Market Analysis', fa: 'تحلیل بازار', ar: 'تحليل السوق' },
        tags: [{en: 'Rebar', fa: 'میلگرد', ar: 'حديد تسليح'}, {en: 'Price', fa: 'قیمت', ar: 'سعر'}],
        content: {
            en: `
### Market Overview
The steel market is currently experiencing volatility due to fluctuations in energy costs and raw material supply chain disruptions.

**Key Factors:**
*   **Global Scrap Prices:** Rising costs in Turkey and CIS regions are pushing local prices up.
*   **Demand:** Summer construction season is increasing demand for sizes 14 and 16.

### Forecast
We expect a mild increase in rebar prices over the next month, followed by stabilization.
            `,
            fa: `
### بررسی بازار
بازار فولاد در حال حاضر به دلیل نوسانات هزینه انرژی و اختلالات زنجیره تامین مواد اولیه، نوساناتی را تجربه می‌کند.

**عوامل کلیدی:**
*   **قیمت جهانی قراضه:** افزایش هزینه‌ها در ترکیه و منطقه CIS باعث افزایش قیمت‌های داخلی شده است.
*   **تقاضا:** فصل ساخت و ساز تابستانی تقاضا برای سایزهای ۱۴ و ۱۶ را افزایش داده است.

### پیش‌بینی
ما انتظار افزایش ملایم قیمت میلگرد در ماه آینده و سپس ثبات را داریم.
            `,
            ar: `
### نظرة عامة على السوق
يشهد سوق الصلب حاليًا تقلبات بسبب تقلبات تكاليف الطاقة واضطرابات سلسلة توريد المواد الخام.

**العوامل الرئيسية:**
*   **أسعار الخردة العالمية:** ارتفاع التكاليف في تركيا ومنطقة رابطة الدول المستقلة يدفع الأسعار المحلية للارتفاع.
*   **الطلب:** موسم البناء الصيفي يزيد الطلب على الأحجام 14 و 16.

### التوقعات
نتوقع زيادة طفيفة في أسعار حديد التسليح خلال الشهر المقبل، يليها استقرار.
            `
        }
    },
    {
        id: 2,
        title: { en: 'IPE vs IPB Beams: Choosing the Right One', fa: 'تفاوت تیرآهن IPE و IPB: انتخاب درست', ar: 'الفرق بين جسور IPE و IPB: الاختيار الصحيح' },
        excerpt: { en: 'A technical guide on the differences between I-beams and H-beams for structural engineers.', fa: 'راهنمای فنی در مورد تفاوت‌های تیرآهن‌های I شکل و H شکل برای مهندسین سازه.', ar: 'دليل فني حول الاختلافات بين الجسور على شكل I و H للمهندسين الإنشائيين.' },
        date: { en: 'June 10, 2024', fa: '۲۰ خرداد ۱۴۰۳', ar: '١٠ يونيو ٢٠٢٤' },
        image: 'https://ahanonline.com/resize/?file=https://contents.ahanonline.com/site/57f1a453ec9b3c3a147794d1993a3f8c.png&format=webp', // Using image from HTML
        author: 'Eng. Kaveh Rad',
        category: { en: 'Technical', fa: 'فنی مهندسی', ar: 'فني' },
        tags: [{en: 'Beam', fa: 'تیرآهن', ar: 'جسور'}, {en: 'Construction', fa: 'ساختمان', ar: 'بناء'}],
        content: {
            en: 'IPE beams are standard European beams with parallel flanges, while IPB (HEB) beams are wide-flange beams capable of bearing heavier loads.',
            fa: 'تیرآهن‌های IPE تیرهای استاندارد اروپایی با بال‌های موازی هستند، در حالی که تیرآهن‌های IPB (HEB) تیرهای بال پهن هستند که قادر به تحمل بارهای سنگین‌تر می‌باشند.',
            ar: 'جسور IPE هي جسور أوروبية قياسية ذات أجنحة متوازية، بينما جسور IPB (HEB) هي جسور ذات أجنحة عريضة قادرة على تحمل أحمال أثقل.'
        }
    }
];