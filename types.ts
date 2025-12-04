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

// SEO Types
export interface SEOAnalysisResult {
    score: number;
    metrics: {
        titleLength: { status: 'pass' | 'fail' | 'warn'; value: number; message: string };
        descriptionLength: { status: 'pass' | 'fail' | 'warn'; value: number; message: string };
        h1Count: { status: 'pass' | 'fail' | 'warn'; value: number; message: string };
        imageAlt: { status: 'pass' | 'fail' | 'warn'; value: number; message: string };
        schema: { status: 'pass' | 'fail'; message: string };
        canonical: { status: 'pass' | 'fail'; message: string };
    };
    aiRecommendations: {
        strategy: string[];
        directories: string[];
        keywords: string[];
    };
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

// Dashboard Types
export interface DashboardStats {
    totalChecksAmount: number;
    totalChecksCount: number;
    checksDueThisWeekAmount: number;
    checksDueThisWeekCount: number;
    bouncedChecksAmount: number;
    cashBalance: number;
    documentsReviewed: number;
    discrepanciesFound: number;
    fraudCases: number;
    internalControlScore: number;
    // Legacy fields for Audit Components compatibility
    dueThisWeekCount: number;
    dueThisWeekAmount: number;
    bouncedAmount: number;
    controlScore: number;
    docsReviewed: number;
}

// Compatibility Aliases for Legacy/Zombie Files
export type AuditStats = DashboardStats;

export interface AuditAlert {
    id: number;
    title?: string;
    message?: string;
    type: 'check_due' | 'fraud_detected' | 'credit_limit' | 'discrepancy' | 'system' | 'critical' | 'warning' | 'error' | 'info' | string;
    severity: 'critical' | 'warning' | 'info' | 'error';
    date: string;
    isRead: boolean;
}

export interface CheckItem {
    id: number;
    number: string;
    amount: number;
    dueDate: string;
    status: 'pending' | 'cleared' | 'bounced' | 'deposited';
    drawer: string;
    bank: string;
    // Legacy support
    checkNumber: string;
    riskScore: number;
}
export type FinancialCheck = CheckItem; // Alias

export interface AuditDocument {
    id: string;
    type: string;
    title: string;
    amount: number;
    status: 'approved' | 'pending' | 'rejected' | 'flagged';
    riskScore: number;
    date: string;
}

export interface FraudCase {
    id: number;
    title: string;
    status: string;
    amount: number;
    date?: string;
    detectedDate?: string;
    description?: string;
    // Legacy support
    riskLevel: number;
    type: string;
    detectedAt: number;
}

export interface CustomerCredit {
    id: number;
    name: string;
    type: 'company' | 'individual';
    creditScore: number;
    creditLimit: number;
    usedCredit: number;
    riskLevel: 'low' | 'medium' | 'high';
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

export const ARTICLES: Article[] = [
    {
        id: 1,
        title: {
            en: "Steel Market Volatility in late 2023",
            fa: "نوسانات بازار فولاد در اواخر سال ۱۴۰۲",
            ar: "تقلبات سوق الصلب في أواخر عام 2023"
        },
        excerpt: {
            en: "Analyzing the factors contributing to the recent price instability in the domestic rebar market.",
            fa: "تحلیل عواملی که به بی‌ثباتی اخیر قیمت در بازار داخلی میلگرد دامن زده‌اند.",
            ar: "تحليل العوامل التي تساهم في عدم استقرار الأسعار الأخير في السوق المحلي لحديد التسليح."
        },
        content: {
            en: "The recent weeks have seen significant fluctuations in the price of steel products...",
            fa: "هفته‌های اخیر شاهد نوسانات قابل توجهی در قیمت محصولات فولادی بوده‌ایم...",
            ar: "شهدت الأسابيع الأخيرة تقلبات كبيرة في أسعار منتجات الصلب..."
        },
        image: "https://images.unsplash.com/photo-1535921827488-874fa7069796?auto=format&fit=crop&w=800&q=80",
        date: { en: "Nov 15, 2023", fa: "۲۴ آبان ۱۴۰۲", ar: "15 نوفمبر 2023" },
        author: "Mohammad Rezaei",
        category: { en: "Market Analysis", fa: "تحلیل بازار", ar: "تحليل السوق" },
        tags: [{ en: "Rebar", fa: "میلگرد", ar: "حديد التسليح" }, { en: "Prices", fa: "قیمت‌ها", ar: "أسعار" }]
    },
    {
        id: 2,
        title: {
            en: "Guide to Checking Steel Authenticity",
            fa: "راهنمای تشخیص اصالت آهن‌آلات",
            ar: "دليل التحقق من صحة الصلب"
        },
        excerpt: {
            en: "How to distinguish between authentic factory products and counterfeit steel.",
            fa: "چگونه محصولات کارخانه اصل را از فولاد تقلبی تشخیص دهیم.",
            ar: "كيفية التمييز بين منتجات المصنع الأصلية والصلب المقلد."
        },
        content: {
            en: "Counterfeit steel poses a significant risk to construction safety...",
            fa: "فولاد تقلبی خطر قابل توجهی برای ایمنی ساخت و ساز ایجاد می‌کند...",
            ar: "يشكل الصلب المقلد خطراً كبيراً على سلامة البناء..."
        },
        image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80",
        date: { en: "Dec 02, 2023", fa: "۱۱ آذر ۱۴۰۲", ar: "02 ديسمبر 2023" },
        author: "Eng. Sara Kamali",
        category: { en: "Technical Guide", fa: "راهنمای فنی", ar: "دليل تقني" },
        tags: [{ en: "Quality Control", fa: "کنترل کیفیت", ar: "مراقبة الجودة" }]
    },
    {
        id: 3,
        title: {
            en: "The Rise of Alloy Steels in Construction",
            fa: "افزایش استفاده از فولادهای آلیاژی در ساخت و ساز",
            ar: "ارتفاع استخدام سبائك الصلب في البناء"
        },
        excerpt: {
            en: "Why builders are switching to ST52 and other high-strength alloys.",
            fa: "چرا سازندگان به سمت ST52 و سایر آلیاژهای با استحکام بالا می‌روند.",
            ar: "لماذا يتحول البناؤون إلى ST52 وسبائك أخرى عالية القوة."
        },
        content: {
            en: "High-strength low-alloy (HSLA) steels are gaining popularity...",
            fa: "فولادهای کم آلیاژ با استحکام بالا (HSLA) در حال محبوب شدن هستند...",
            ar: "تكتسب الفولاذ عالي القوة منخفض السبائك (HSLA) شعبية..."
        },
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
        date: { en: "Jan 10, 2024", fa: "۲۰ دی ۱۴۰۲", ar: "10 يناير 2024" },
        author: "Dr. A. Kiani",
        category: { en: "Technology", fa: "تکنولوژی", ar: "تكنولوجيا" },
        tags: [{ en: "Alloy Steel", fa: "فولاد آلیاژی", ar: "سبائك الصلب" }]
    }
];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => any;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: any = {
  en: {
    header: { home: 'Home', ironSnapp: 'IronSnapp', recommendationEngine: 'Smart Advisor', distributorFinder: 'Find Suppliers', tools: 'Tools', contentHub: 'Content Hub', blog: 'Blog', ourTeam: 'Our Team', partnerships: 'Partnerships', dashboard: 'Dashboard', logout: 'Logout', login: 'Login' },
    ourTeam: {
      title: 'Our Expert Team',
      subtitle: 'Meet the professionals behind Steel Online 20',
      doctors: [
        { name: 'Dr. Ali Alavi', specialty: 'Metallurgist', bio: 'Expert in steel alloys with 15 years experience.', licenseNumber: 'MT-4022' },
        { name: 'Eng. Reza Karimi', specialty: 'Structural Engineer', bio: 'Specialist in large-scale steel structures.', licenseNumber: 'SE-1099' },
        { name: 'Ms. Sara Omid', specialty: 'Supply Chain Manager', bio: 'Ensures timely delivery of all steel products.', licenseNumber: 'SC-3321' }
      ],
      tableHeaders: { license: 'License' }
    },
    products: {
      food_feed: { title: 'Construction Steel', description: 'Rebar, Beams, Mesh' },
      microbiology: { title: 'Industrial Steel', description: 'Sheets, Profiles' },
      environmental: { title: 'Alloy Steel', description: 'Specialty alloys for industry' }
    },
    quotaErrorModal: { title: 'Quota Exceeded', body: 'You have exceeded your API quota.', cta: 'Upgrade', close: 'Close' },
    searchModal: { placeholder: 'Search...', suggestionsTitle: 'Suggestions', suggestionQueries: ['Rebar Price', 'IPE 180', 'Shipping Calculator'], resultsTitle: 'Results', noResults: 'No results found.' },
    loginModal: { title: 'Login', or: 'OR', emailPlaceholder: 'Email', passwordPlaceholder: 'Password', loginButton: 'Login' },
    home: {
      hero: { mainTitle: 'Iran\'s Leading Steel Marketplace', aboutButton: 'About Us' },
      newsletter: { title: 'Newsletter', subtitle: 'Stay updated', placeholder: 'Your email', button: 'Subscribe' },
      footer: { col1: { title: 'Contact' }, col2: { title: 'Products' }, col3: { title: 'Services' }, col4: { title: 'Message', email: 'Email', message: 'Message', button: 'Send' } },
      infoBar: { call: { title: 'Call Us', value: '021-22041655' }, email: { title: 'Email', value: 'sales@steelonline20.com' }, location: { title: 'Location', value: 'Tehran, Iran' } },
      whyUs: { title: 'Why Us?', subtitle: 'We are the best', item1: { title: 'Best Price', desc: 'Guaranteed' }, item2: { title: 'Fast Delivery', desc: 'Nationwide' }, item3: { title: 'Quality', desc: 'Certified' }, item4: { title: 'Support', desc: '24/7' } },
      featuredBlocks: { block1: { title: 'Market Insights', desc: 'Daily news', button: 'View' }, block2: { title: 'Partnerships', desc: 'Join us', button: 'Join' }, block3: { title: 'Alerts', line1: 'Price up', line2: 'Supply down', line3: 'New regulations' } },
      blog: { title: 'Blog', subtitle: 'Latest news' },
      partners: { title: 'Our Partners' }
    },
    footer: { contactInfo: 'Jordan St, Tehran', workingHours: 'Sat-Wed 8:30-17:00', copyright: '© 2024 Steel Online 20' },
    blogPage: { title: 'Blog', subtitle: 'Industry News', readMore: 'Read More' },
    articlePage: { backToBlog: 'Back to Blog' },
    partnerships: { title: 'Partnerships', subtitle: 'Work with us', name: 'Name', company: 'Company', email: 'Email', message: 'Message', submit: 'Submit' },
    distributorFinder: { title: 'Find Suppliers', subtitle: 'Locate warehouses near you', suggestionsTitle: 'Suggestions', suggestionQueries: ['Tehran', 'Isfahan'], searchTypeLabel: 'Type', distributor: 'Warehouse', veterinarian: 'Dealer', searchPlaceholder: 'Search location...', searchButton: 'Search', findNearMe: 'Find Near Me', searching: 'Searching...', resultsTitle: 'Results', noResults: 'No suppliers found.' },
    aiChat: { title: 'AI Consultant', subtitle: 'Ask about prices & specs', suggestions: ['Rebar Price?', 'IPE 14 Weight?'], placeholder: 'Type your question...' },
    recommendationEngine: {
       title: 'Smart Advisor', subtitle: 'Get product recommendations', generating: 'Analyzing...', resultTitle: 'Recommendation', primaryAssessmentTitle: 'Assessment', potentialConditionsTitle: 'Considerations', recommendedProductsTitle: 'Recommended Products', managementAdviceTitle: 'Advice', nextStepsTitle: 'Next Steps', findDropoffLocation: 'Find Suppliers', gettingPlan: 'Getting Prices...', detailedPlanTitle: 'Price Estimation', purpose: 'Application', methodology: 'Standard', turnaroundTime: 'Availability', estimatedCost: 'Est. Price', disclaimerTitle: 'Disclaimer', savePdf: 'Save PDF', startNewAnalysis: 'New Analysis',
       uploadImageTitle: 'Upload Plan (Optional)', removeImage: 'Remove', uploadButton: 'Upload Image', cameraButton: 'Camera',
       formTitle: 'Project Details', symptomsLabel: 'Project Description', symptomsPlaceholder: 'Describe your project...', symptomsSuggestions: ['Residential Building', 'Industrial Shed'], suggestionPromptsTitle: 'Quick Prompts', suggestionPrompts: ['5-story building in humid area', 'Warehouse structure 500sqm'],
       detailsTitle: 'Details', autoFillCheckboxLabel: 'Auto-fill', sampleTypeLabel: 'Category', sampleTypePlaceholder: 'e.g. Rebar', batchSizeOriginLabel: 'Tonnage / Origin', batchSizeOriginPlaceholder: 'e.g. 20 Tons / Esfahan', specificConditions: 'Structural Details', controlSampleInfo: 'Preferred Brands', sampleAge: 'Delivery Time', sampleAgePlaceholder: 'e.g. Immediate', previousTests: 'Budget', additives: 'Services', buttonText: 'Get Recommendation',
       animalTypeSuggestions: ['Rebar', 'Beam', 'Sheet', 'Profile']
    },
    contentHub: {
        title: 'Content Hub', subtitle: 'Generate marketing content', platformSelectorTitle: 'Platform', topicTitle: 'Topic', trendsTab: 'Trends', textTab: 'Custom', searchTab: 'Search', fetchingTrends: 'Loading trends...', selectSearchTopic: 'Select topic', customTextPlaceholder: 'Enter topic...',
        resultsTitle: 'Generated Content', placeholder: 'Select options to generate', generatingPost: 'Generating...', generateButton: 'Generate', copySuccess: 'Copied!', copyButton: 'Copy', connectAccountToPublish: 'Connect account to publish', publishToPlatformButton: 'Publish to {platform}', adaptingForWebsite: 'Adapting...', adaptForWebsiteButton: 'Adapt for Blog', websitePreviewTitle: 'Blog Preview', publishedSuccess: 'Published!', publishToWebsiteButton: 'Publish',
        fetchingStrategy: 'Loading...', getStrategyButton: 'Get Strategy', strategyTitle: 'Strategy', bestTime: 'Best Time', nextPost: 'Next Post', generatingVideo: 'Generating...', generateVideoButton: 'Video Script', findingTools: 'Searching...', findVideoTools: 'Find Tools', toolName: 'Tool', toolCost: 'Cost', toolFarsi: 'Farsi', toolFeatures: 'Features', toolQuality: 'Quality', timecode: 'Time', visual: 'Visual', voiceover: 'Audio', emotion: 'Emotion',
        userSearchSuggestions: ['Steel Price Trends', 'Construction Tips', 'Market Forecast']
    },
    validation: { required: 'Required', email: 'Invalid email', passwordLength: 'Min 6 chars', fillRequiredFields: 'Please fill required fields' },
    toolsPage: { title: 'Steel Tools', subtitle: 'Calculators & Info', weightCalc: { title: 'Weight Calculator', label: 'Product Name', button: 'Calculate' }, shippingCalc: { title: 'Shipping Estimator', label: 'Route', button: 'Estimate' }, creditInfo: { title: 'Credit Info', desc: 'Payment options' } },
    ironSnapp: { subtitle: 'Buy steel directly', form: { title: 'Request Quote', productLabel: 'Product', productPlaceholder: 'e.g. Rebar', qtyLabel: 'Qty (Tons)', locationLabel: 'Location', paymentLabel: 'Payment', paymentCash: 'Cash', paymentCheck: 'Check', paymentCredit: 'Credit', monthsLabel: 'Months', submit: 'Request' }, credit: { checking: 'Checking credit...', approved: 'Credit Approved', rejected: 'Credit Rejected', score: 'Score', reason: 'Reason' }, results: { title: 'Offers', score: 'Match', price: 'Price', delivery: 'Delivery', buy: 'Buy' } },
    dashboard: {
        menu: { overview: 'Overview', financial: 'Financial', audit: 'Audit', customers: 'Customers', reports: 'Reports', system: 'System' },
        stats: { totalChecks: 'Total Checks', dueThisWeek: 'Due This Week', cashBalance: 'Cash Balance', controlScore: 'Control Score', documentsReviewed: 'Docs Reviewed', discrepancies: 'Discrepancies', fraudCases: 'Fraud Cases' },
        labels: { checks: 'Checks', urgent: 'Urgent', accounts: 'Accts', good: 'Good', adequate: 'Adequate', strong: 'Strong', risk: 'Risk', monitoring: 'Monitoring', activities: 'Activities', basedOn: 'Based on analysis', cleared: 'Cleared', bounced: 'Bounced', pending: 'Pending', total: 'Total', view: 'View', score: 'Score' },
        charts: { cashFlow: 'Cash Flow', checkStatus: 'Check Status', internalControl: 'Internal Control' },
        audit: { urgentAlerts: 'Urgent Alerts', auditLogs: 'Audit Logs' },
        financial: { title: 'Financial Checks', registerBtn: 'Register Check' },
        customers: { title: 'Customer Credit' },
        tables: { headers: { checkNumber: 'Check #', dueDate: 'Due Date', amount: 'Amount', drawer: 'Drawer', bank: 'Bank', status: 'Status', document: 'Document', type: 'Type', date: 'Date', aiRisk: 'AI Risk', customer: 'Customer', creditLimit: 'Limit', used: 'Used', risk: 'Risk' } }
    },
    seoChecker: { pass: 'Pass', fail: 'Fail', warn: 'Warn', buttonLabel: 'SEO Check', title: 'SEO Analysis', analyzing: 'Analyzing...', score: 'SEO Score', metricsTitle: 'Metrics', recommendationsTitle: 'Recommendations', registerSites: 'Directories', strategies: 'Strategy', keywords: 'Keywords' }
  },
  fa: {
    header: { home: 'خانه', ironSnapp: 'آهن‌اسنپ', recommendationEngine: 'مشاور هوشمند', distributorFinder: 'یابنده تامین‌کننده', tools: 'ابزارها', contentHub: 'تولید محتوا', blog: 'وبلاگ', ourTeam: 'تیم ما', partnerships: 'همکاری', dashboard: 'داشبورد', logout: 'خروج', login: 'ورود' },
    ourTeam: {
      title: 'تیم متخصص ما',
      subtitle: 'با حرفه‌ای‌های استیل آنلاین ۲۰ آشنا شوید',
      doctors: [
        { name: 'دکتر علی علوی', specialty: 'متالورژیست', bio: 'متخصص آلیاژهای فولادی با ۱۵ سال تجربه.', licenseNumber: 'MT-4022' },
        { name: 'مهندس رضا کریمی', specialty: 'مهندس سازه', bio: 'متخصص سازه‌های فولادی بزرگ.', licenseNumber: 'SE-1099' },
        { name: 'خانم سارا امید', specialty: 'مدیر زنجیره تامین', bio: 'تضمین تحویل به موقع تمام محصولات فولادی.', licenseNumber: 'SC-3321' }
      ],
      tableHeaders: { license: 'شماره نظام' }
    },
    products: {
      food_feed: { title: 'فولاد ساختمانی', description: 'میلگرد، تیرآهن، توری' },
      microbiology: { title: 'فولاد صنعتی', description: 'ورق، پروفیل' },
      environmental: { title: 'فولاد آلیاژی', description: 'آلیاژهای خاص صنعتی' }
    },
    quotaErrorModal: { title: 'پایان سهمیه', body: 'سهمیه API شما تمام شده است.', cta: 'ارتقا', close: 'بستن' },
    searchModal: { placeholder: 'جستجو...', suggestionsTitle: 'پیشنهادات', suggestionQueries: ['قیمت میلگرد', 'تیرآهن ۱۸', 'محاسبه هزینه حمل'], resultsTitle: 'نتایج', noResults: 'نتیجه‌ای یافت نشد.' },
    loginModal: { title: 'ورود', or: 'یا', emailPlaceholder: 'ایمیل', passwordPlaceholder: 'رمز عبور', loginButton: 'ورود' },
    home: {
      hero: { mainTitle: 'بزرگترین بازار آنلاین آهن ایران', aboutButton: 'درباره ما' },
      newsletter: { title: 'خبرنامه', subtitle: 'به‌روز باشید', placeholder: 'ایمیل شما', button: 'عضویت' },
      footer: { col1: { title: 'تماس' }, col2: { title: 'محصولات' }, col3: { title: 'خدمات' }, col4: { title: 'پیام', email: 'ایمیل', message: 'پیام', button: 'ارسال' } },
      infoBar: { call: { title: 'تماس با ما', value: '۰۲۱-۲۲۰۴۱۶۵۵' }, email: { title: 'ایمیل', value: 'sales@steelonline20.com' }, location: { title: 'آدرس', value: 'تهران، جردن' } },
      whyUs: { title: 'چرا ما؟', subtitle: 'بهترین انتخاب شما', item1: { title: 'بهترین قیمت', desc: 'تضمین شده' }, item2: { title: 'تحویل سریع', desc: 'سراسر کشور' }, item3: { title: 'کیفیت', desc: 'استاندارد' }, item4: { title: 'پشتیبانی', desc: '۲۴/۷' } },
      featuredBlocks: { block1: { title: 'تحلیل بازار', desc: 'اخبار روزانه', button: 'مشاهده' }, block2: { title: 'همکاری', desc: 'به ما بپیوندید', button: 'عضویت' }, block3: { title: 'هشدارها', line1: 'افزایش قیمت', line2: 'کاهش عرضه', line3: 'مقررات جدید' } },
      blog: { title: 'وبلاگ', subtitle: 'آخرین اخبار صنعت' },
      partners: { title: 'همکاران ما' }
    },
    footer: { contactInfo: 'تهران، جردن، خیابان طاهری', workingHours: 'شنبه تا چهارشنبه ۸:۳۰ تا ۱۷:۰۰', copyright: '© ۱۴۰۳ استیل آنلاین ۲۰' },
    blogPage: { title: 'وبلاگ', subtitle: 'اخبار صنعت فولاد', readMore: 'بیشتر بخوانید' },
    articlePage: { backToBlog: 'بازگشت به وبلاگ' },
    partnerships: { title: 'همکاری', subtitle: 'با ما همکاری کنید', name: 'نام', company: 'شرکت', email: 'ایمیل', message: 'پیام', submit: 'ارسال' },
    distributorFinder: { title: 'یابنده تامین‌کننده', subtitle: 'پیدا کردن نزدیک‌ترین انبار', suggestionsTitle: 'پیشنهادات', suggestionQueries: ['تهران', 'اصفهان', 'شادآباد'], searchTypeLabel: 'نوع', distributor: 'انبار', veterinarian: 'نمایندگی رسمی', searchPlaceholder: 'جستجوی موقعیت...', searchButton: 'جستجو', findNearMe: 'نزدیک من', searching: 'در حال جستجو...', resultsTitle: 'نتایج', noResults: 'تامین‌کننده‌ای یافت نشد.' },
    aiChat: { title: 'مشاور هوشمند', subtitle: 'سوالات خود را بپرسید', suggestions: ['قیمت میلگرد؟', 'وزن تیرآهن ۱۴؟'], placeholder: 'سوال خود را بنویسید...' },
    recommendationEngine: {
       title: 'مشاور هوشمند خرید', subtitle: 'دریافت پیشنهادات محصول', generating: 'در حال تحلیل...', resultTitle: 'پیشنهاد خرید', primaryAssessmentTitle: 'ارزیابی اولیه', potentialConditionsTitle: 'ملاحظات فنی', recommendedProductsTitle: 'محصولات پیشنهادی', managementAdviceTitle: 'توصیه‌های خرید', nextStepsTitle: 'مراحل بعدی', findDropoffLocation: 'یافتن تامین‌کننده', gettingPlan: 'استعلام قیمت...', detailedPlanTitle: 'برآورد قیمت و مشخصات', purpose: 'کاربرد', methodology: 'استاندارد', turnaroundTime: 'موجودی', estimatedCost: 'قیمت تقریبی', disclaimerTitle: 'سلب مسئولیت', savePdf: 'دانلود PDF', startNewAnalysis: 'تحلیل جدید',
       uploadImageTitle: 'آپلود نقشه (اختیاری)', removeImage: 'حذف', uploadButton: 'آپلود تصویر', cameraButton: 'دوربین',
       formTitle: 'مشخصات پروژه', symptomsLabel: 'شرح پروژه', symptomsPlaceholder: 'پروژه خود را شرح دهید...', symptomsSuggestions: ['ساختمان مسکونی', 'سوله صنعتی'], suggestionPromptsTitle: 'نمونه‌ها', suggestionPrompts: ['ساختمان ۵ طبقه در شمال', 'سوله ۵۰۰ متری'],
       detailsTitle: 'جزئیات', autoFillCheckboxLabel: 'پر کردن خودکار', sampleTypeLabel: 'دسته‌بندی', sampleTypePlaceholder: 'مثلا میلگرد', batchSizeOriginLabel: 'تناژ / مبدا', batchSizeOriginPlaceholder: 'مثلا ۲۰ تن / اصفهان', specificConditions: 'جزئیات سازه', controlSampleInfo: 'برند ترجیحی', sampleAge: 'زمان تحویل', sampleAgePlaceholder: 'مثلا فوری', previousTests: 'بودجه', additives: 'خدمات جانبی', buttonText: 'دریافت مشاوره',
       animalTypeSuggestions: ['میلگرد', 'تیرآهن', 'ورق', 'پروفیل']
    },
    contentHub: {
        title: 'تولید محتوا', subtitle: 'تولید محتوای بازاریابی با هوش مصنوعی', platformSelectorTitle: 'پلتفرم', topicTitle: 'موضوع', trendsTab: 'روندها', textTab: 'متن دلخواه', searchTab: 'جستجو', fetchingTrends: 'در حال دریافت روندها...', selectSearchTopic: 'انتخاب موضوع', customTextPlaceholder: 'موضوع را وارد کنید...',
        resultsTitle: 'محتوای تولید شده', placeholder: 'گزینه‌ها را برای تولید انتخاب کنید', generatingPost: 'در حال تولید...', generateButton: 'تولید محتوا', copySuccess: 'کپی شد!', copyButton: 'کپی', connectAccountToPublish: 'اتصال حساب برای انتشار', publishToPlatformButton: 'انتشار در {platform}', adaptingForWebsite: 'در حال تبدیل...', adaptForWebsiteButton: 'تبدیل به مقاله وبلاگ', websitePreviewTitle: 'پیش‌نمایش وبلاگ', publishedSuccess: 'منتشر شد!', publishToWebsiteButton: 'انتشار',
        fetchingStrategy: 'در حال دریافت...', getStrategyButton: 'دریافت استراتژی', strategyTitle: 'استراتژی انتشار', bestTime: 'بهترین زمان', nextPost: 'پست بعدی', generatingVideo: 'در حال تولید...', generateVideoButton: 'سناریو ویدیو', findingTools: 'جستجو...', findVideoTools: 'یافتن ابزارها', toolName: 'ابزار', toolCost: 'هزینه', toolFarsi: 'فارسی', toolFeatures: 'امکانات', toolQuality: 'کیفیت', timecode: 'زمان', visual: 'تصویر', voiceover: 'صدا', emotion: 'لحن',
        userSearchSuggestions: ['روند قیمت فولاد', 'نکات ساخت و ساز', 'پیش‌بینی بازار']
    },
    validation: { required: 'الزامی', email: 'ایمیل نامعتبر', passwordLength: 'حداقل ۶ کاراکتر', fillRequiredFields: 'لطفا فیلدهای الزامی را پر کنید' },
    toolsPage: { title: 'ابزارهای فولادی', subtitle: 'ماشین‌حساب و اطلاعات', weightCalc: { title: 'محاسبه وزن', label: 'نام محصول', button: 'محاسبه' }, shippingCalc: { title: 'تخمین هزینه حمل', label: 'مسیر', button: 'تخمین' }, creditInfo: { title: 'اطلاعات اعتباری', desc: 'روش‌های پرداخت' } },
    ironSnapp: { subtitle: 'خرید مستقیم فولاد', form: { title: 'استعلام قیمت', productLabel: 'محصول', productPlaceholder: 'مثلا میلگرد', qtyLabel: 'مقدار (تن)', locationLabel: 'محل تحویل', paymentLabel: 'نحوه پرداخت', paymentCash: 'نقدی', paymentCheck: 'چک', paymentCredit: 'اعتباری', monthsLabel: 'مدت (ماه)', submit: 'استعلام' }, credit: { checking: 'بررسی اعتبار...', approved: 'تایید اعتبار', rejected: 'رد اعتبار', score: 'امتیاز', reason: 'دلیل' }, results: { title: 'پیشنهادات', score: 'تطابق', price: 'قیمت', delivery: 'تحویل', buy: 'خرید' } },
    dashboard: {
        menu: { overview: 'نمای کلی', financial: 'مالی', audit: 'حسابرسی', customers: 'مشتریان', reports: 'گزارش‌ها', system: 'سیستم' },
        stats: { totalChecks: 'مجموع چک‌ها', dueThisWeek: 'سررسید هفته', cashBalance: 'موجود نقد', controlScore: 'امتیاز کنترل', documentsReviewed: 'اسناد بررسی شده', discrepancies: 'مغایرت‌ها', fraudCases: 'موارد تقلب' },
        labels: { checks: 'چک', urgent: 'فوری', accounts: 'حساب', good: 'خوب', adequate: 'متوسط', strong: 'قوی', risk: 'ریسک', monitoring: 'نظارت', activities: 'فعالیت‌ها', basedOn: 'بر اساس تحلیل', cleared: 'پاس شده', bounced: 'برگشتی', pending: 'در جریان', total: 'کل', view: 'مشاهده', score: 'امتیاز' },
        charts: { cashFlow: 'جریان نقد', checkStatus: 'وضعیت چک‌ها', internalControl: 'کنترل داخلی' },
        audit: { urgentAlerts: 'هشدارهای فوری', auditLogs: 'لاگ حسابرسی' },
        financial: { title: 'چک‌های مالی', registerBtn: 'ثبت چک' },
        customers: { title: 'اعتبار مشتریان' },
        tables: { headers: { checkNumber: 'شماره چک', dueDate: 'سررسید', amount: 'مبلغ', drawer: 'صادرکننده', bank: 'بانک', status: 'وضعیت', document: 'سند', type: 'نوع', date: 'تاریخ', aiRisk: 'ریسک هوش مصنوعی', customer: 'مشتری', creditLimit: 'سقف اعتبار', used: 'استفاده شده', risk: 'ریسک' } }
    },
    seoChecker: { pass: 'تایید', fail: 'رد', warn: 'هشدار', buttonLabel: 'بررسی سئو', title: 'تحلیل سئو', analyzing: 'در حال تحلیل...', score: 'امتیاز سئو', metricsTitle: 'متریک‌ها', recommendationsTitle: 'پیشنهادات', registerSites: 'دایرکتوری‌ها', strategies: 'استراتژی', keywords: 'کلمات کلیدی' }
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('fa');

  const t = useCallback((key: string) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
        if (value && value[k]) {
            value = value[k];
        } else {
            // Fallback to English if missing in current language
            let enValue = translations['en'];
            for (const enK of keys) {
                if (enValue && enValue[enK]) {
                   enValue = enValue[enK];
                } else {
                   return key; // Return key if not found in EN either
                }
            }
            return enValue || key;
        }
    }
    return value;
  }, [language]);

  const dir = language === 'fa' || language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [dir, language]);

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