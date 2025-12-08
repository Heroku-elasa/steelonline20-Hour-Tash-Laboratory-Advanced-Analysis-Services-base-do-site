# Overview

Steel Online 20 is a comprehensive online marketplace and information platform for steel and iron products in Iran. The application serves as a B2B/B2C platform offering real-time pricing, product recommendations, supplier/warehouse location services, and AI-powered customer assistance for the steel industry.

The platform targets construction companies, industrial buyers, and individual customers looking to purchase steel products (rebar, beams, sheets, profiles, pipes) with features including credit purchasing, shipping estimates, weight calculations, and marketplace comparison tools.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework**: React 18 with TypeScript, built using Vite as the build tool.

**Routing Strategy**: Single Page Application (SPA) with client-side page routing managed through a custom `Page` type system. No traditional routing library is used; instead, page navigation is controlled via state management in the main `App.tsx` component.

**Code Splitting**: Implements lazy loading for non-critical pages using `React.lazy()` and `Suspense`. The home page is eagerly loaded to optimize Largest Contentful Paint (LCP), while other pages (Partnerships, AIChatPage, TeamPage, etc.) are lazy-loaded to reduce initial bundle size.

**Styling**: TailwindCSS for utility-first styling with custom color theme (corp-red, corp-teal, corp-blue) representing the steel industry brand. Custom scrollbar styling and fade-in animations are defined in `index.css`.

**UI/UX Patterns**:
- RTL (Right-to-Left) support for Persian language with automatic direction switching
- Multi-language support (English, Farsi, Arabic) via context-based translation system
- Toast notification system for user feedback
- Modal-based interactions (Login, Search, Quota Error)
- Floating chatbot for on-page AI assistance

**Performance Optimizations**:
- Preloading of LCP images
- Font preconnection to Google Fonts
- Lazy loading of components and routes
- SEO optimization with dynamic meta tags and Schema.org markup

## Backend Architecture

**AI Integration**: Google Gemini AI (via `@google/genai` SDK) serves as the core intelligence layer for:
- Natural language chat assistance
- Product recommendations
- Price analysis and market trends
- Credit score checking
- SEO analysis
- Content generation

**Python Scraper Service**: Flask-based backend service (`backend/scraper_service.py`) using Selenium WebDriver to scrape real-time steel prices from external marketplaces. This service provides warehouse locations and seller information across Iranian steel hubs.

**IronSnapp Map-Based Marketplace** (Updated Dec 2025): The IronSnapp page now features a taxi-app style interface with:
- React Leaflet map displaying steel sellers as pins with color-coded match scores
- Real-time seller data from Flask scraper backend (port 8000)
- Distance calculations based on user location (Haversine formula)
- Seller filtering by price tier (Budget/Mid-Range/Premium) and verified status
- Interactive seller cards synced with map markers
- Credit check integration for check/credit payments
- Vite proxy configuration to connect frontend to Flask backend API
- **Buyer-Seller Connection Services**: Professional services modal including notary, legal consultation, contract drafting, insurance, escrow, and quality inspection services
- **Full Internationalization**: All UI strings use the t() translation function with complete English and Farsi translations for samples, toasts, form elements, filters, map labels, seller card content, and connection services

**State Management**: React Context API for:
- Language/translation state (`LanguageProvider`)
- Toast notifications (`ToastProvider`)
- User authentication state
- Global application state in App.tsx

**Data Flow**: The application follows a unidirectional data flow where:
1. User interactions trigger events in components
2. Events call service functions (geminiService, priceService, dashboardService)
3. Services communicate with external APIs or AI models
4. Responses update component state
5. UI re-renders with new data

## Database & Data Storage

**Primary Database**: Supabase (PostgreSQL) hosted at `tejibsqmdxuehluneayl.supabase.co`

**Schema Design**:
- `financial_checks`: Stores check/payment information (number, amount, due date, status, drawer, bank)
- `audit_alerts`: System alerts for financial monitoring (check due dates, fraud detection, credit limits)
- `customer_credits`: Customer credit profiles (name, type, credit score, limit, used credit, risk level)
- `steel_products`: Product catalog (name, category, unit, brand)
- `steel_prices`: Historical and current pricing data
- `warehouse_locations`: Physical warehouse/supplier locations with geolocation
- `seo_reports`: SEO analysis history and recommendations

**Data Seeding**: Mock data is automatically seeded into empty tables via `checkAndSeedDatabase()` function to ensure the application can demonstrate functionality even without live data.

**Caching Strategy**: Price data and warehouse locations are fetched from APIs with client-side caching. The scraper service maintains an in-memory cache (`SELLER_CACHE`) for scraped data.

## Authentication & Authorization

**Authentication Provider**: Supabase Auth with email/password authentication

**User Flow**:
1. Users can browse most features without authentication
2. Login required for advanced features (Dashboard, Credit Check, Marketplace offers)
3. LoginModal component handles sign-up and sign-in with validation
4. User session maintained in App.tsx state
5. Logout clears session and resets state

**Security Considerations**:
- Environment variables for API keys (not committed to repository)
- Supabase Row Level Security (RLS) policies (implementation in database)
- Client-side validation with server-side verification expected

## AI-Powered Features

**Chat Assistant**:
- Floating chatbot available on all pages
- Full-page AI consultation mode
- Context-aware responses about steel products, pricing, and services
- Can navigate users to specific features via special `page:` links
- Streaming responses for improved UX

**Smart Recommendations**:
- Product recommendation engine based on project requirements
- Natural language input processing
- Image analysis capability for project visualization
- Detailed test plans with methodology and cost estimates

**Content Generation**:
- Social media post generation for multiple platforms (LinkedIn, Twitter, Instagram, Facebook)
- Daily trend analysis for content ideas
- Post adaptation for website/blog format
- AI-powered SEO analysis and recommendations

**Marketplace Intelligence**:
- Credit score checking for buyers
- Seller matching based on location, price, and payment terms
- Risk assessment and match scoring
- Integration with external price sources via scraping

## External Integrations

**Map Services**: Leaflet and React-Leaflet for interactive maps showing warehouse locations and delivery zones. Uses OpenStreetMap tiles.

**Markdown Rendering**: `marked` library for rendering blog content and AI responses with rich formatting.

**Web Scraping**: Selenium with headless Chrome for extracting real-time data from competitor websites and steel marketplaces.

**Google Search Integration**: Gemini AI model configured with Google Search grounding for real-time pricing and market data.

# External Dependencies

## Third-Party Services

1. **Google Gemini AI** (`@google/genai`)
   - Purpose: Core AI functionality including chat, recommendations, content generation
   - API Key: Required via `API_KEY` environment variable
   - Models: Gemini 1.5 Flash, Gemini 1.5 Pro (for advanced tasks)

2. **Supabase** (`@supabase/supabase-js`)
   - Purpose: Database (PostgreSQL), Authentication, Real-time subscriptions
   - Configuration: URL and anonymous key in `supabaseClient.ts`
   - Database URL: `https://tejibsqmdxuehluneayl.supabase.co`

3. **OpenStreetMap/Leaflet** (`leaflet`, `react-leaflet`, `@types/leaflet`)
   - Purpose: Interactive maps for warehouse/supplier locations
   - No API key required (OSM is free)
   - Tile server: Standard OSM tiles

4. **Google Fonts**
   - Fonts: Vazirmatn (Persian), Inter (English)
   - Loaded via CDN with preconnect optimization

## External APIs

1. **Steel Price API** (Custom/Internal)
   - Endpoint: `/api/prices` (proxied through Vite dev server)
   - Fallback: Mock data if API unavailable
   - Real-time price updates for steel products

2. **Warehouse API** (Custom/Internal)
   - Endpoint: `/api/warehouses`
   - Returns location data with coordinates for map display

3. **Flask Scraper Service**
   - Runs separately on port 8000
   - Endpoints: `/scrape`, `/warehouse-locations`, `/marketplace-offers`
   - Uses Selenium for dynamic content extraction

## Development Tools

- **Vite**: Build tool and dev server (port 5000)
- **TypeScript**: Type safety with relaxed config (strict: false)
- **TailwindCSS**: Utility-first CSS framework with custom configuration
- **PostCSS & Autoprefixer**: CSS processing

## Environment Configuration

Required environment variables:
- `API_KEY`: Gemini API key (mandatory for AI features)
- `SUPABASE_URL`: Database URL (has default)
- `SUPABASE_ANON_KEY`: Supabase anonymous key (has default)

## Deployment Configuration (Updated Dec 2025)

### Cloudflare Pages (Frontend Only)
- Build command: `npm run build`
- Output directory: `dist`
- Uses mock data when backend not available
- See `CLOUDFLARE_DEPLOYMENT.md` for full instructions
- Files to exclude: `pyproject.toml`, `backend/`, `*.py`

### Replit Deployment (Full-Stack)
- Build: `npm run build`
- Run: `gunicorn --bind=0.0.0.0:5000 --workers=2 backend.scraper_service:app`
- Flask serves both API endpoints and static frontend files
- Deployment type: Autoscale

### Required Environment Variables
- `API_KEY`: Gemini API key (mandatory for AI features)
- `SUPABASE_URL`: Database URL (has default)
- `SUPABASE_ANON_KEY`: Supabase anonymous key (has default)
- `VITE_API_BASE_URL`: Backend URL for Cloudflare deployment (optional)