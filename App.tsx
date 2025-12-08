
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { GoogleGenAI } from "@google/genai";
import SiteHeader from './components/Header';
import HomePage from './components/HomePage'; // Keep Home eager for LCP
import QuotaErrorModal from './components/QuotaErrorModal';
import LoginModal from './components/LoginModal';
import SearchModal from './components/SearchModal';
import FloatingChatbot from './components/FloatingChatbot';
import SiteFooter from './components/Footer';
import SEOChecker from './components/SEOChecker'; // Import Checker
import { Page, ProviderSearchResult, Message, SearchResultItem, useLanguage, TestSubmissionFormInputs, TestRecommendationResult, DailyTrend, GeneratedPost, TestDetailsResult, Article, ARTICLES, User } from './types';
import { useToast } from './components/Toast';
import { performSemanticSearch, findLocalProviders, getAIRecommendation, fetchDailyTrends, generateSocialPost, generatePostImage, getTestDetails, adaptPostForWebsite } from './services/geminiService';
import { supabase } from './services/supabaseClient';

// Lazy load other pages to reduce initial bundle size
const PartnershipsPage = lazy(() => import('./components/PartnershipsPage'));
const AIChatPage = lazy(() => import('./components/AIChatPage'));
const TeamPage = lazy(() => import('./components/TeamPage'));
const DistributorFinderPage = lazy(() => import('./components/DistributorFinderPage'));
const RecommendationEnginePage = lazy(() => import('./components/RecommendationEnginePage'));
const ContentHubPage = lazy(() => import('./components/ContentHubPage'));
const BlogPage = lazy(() => import('./components/BlogPage'));
const ArticlePage = lazy(() => import('./components/ArticlePage'));
const ToolsPage = lazy(() => import('./components/ToolsPage'));
const IronSnappPage = lazy(() => import('./components/IronSnappPage'));
const DashboardPage = lazy(() => import('./components/DashboardPage'));
const UserDashboardPage = lazy(() => import('./components/UserDashboardPage'));
const PricesPage = lazy(() => import('./components/PricesPage'));
const MapFinderPage = lazy(() => import('./components/MapFinderPage'));

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const systemInstruction = `You are a professional, helpful, and knowledgeable AI assistant for "Steel Online 20", a leading online marketplace for steel and iron products in Iran. Your purpose is to assist users (builders, contractors, traders) by providing accurate information about steel prices, product specifications, and purchasing processes.

**Your capabilities:**
*   Answer questions about steel products: Rebar (Milgard), Beams (Tir-Ahan IPE/IPB), Sheets (Varagh Black/Oil/Galvanized), Profiles (Ghotie), Pipes (Looleh), etc.
*   Provide technical information about standards (DIN, ASTM, Gost), grades (ST37, ST52), and weight calculations.
*   Explain our services: Credit purchase (Check/LC), Shipping, and Price Guarantees.
*   Help users find information on the website.

**Search Usage:**
*   You have access to Google Search. ALWAYS use it to provide the most up-to-date prices, news, and technical data. Do not rely on stale internal knowledge for pricing.

**App Features & Navigation:**
You can also guide users to the right tools on our website. When a user's query matches one of the features below, you should recommend they use it and provide a special link.
*   **Smart Steel Advisor**: Use this for users asking for product recommendations for a specific project. Suggest it with the link format: [Smart Steel Advisor](page:test_recommender)
*   **IronSnapp Marketplace**: Use this for users wanting to buy steel directly from sellers, compare prices, or find the nearest warehouse. Especially useful for CHECK payments. Suggest it with the link format: [IronSnapp Marketplace](page:iron_snapp)
*   **Find Suppliers**: Use this for users asking where to buy or find warehouses. Suggest it with the link format: [Find Suppliers](page:sample_dropoff)
*   **Tools (Weight/Shipping)**: Use this for weight calculation or shipping cost queries. Suggest it with the link format: [Steel Tools](page:tools)
*   **Credit Purchase**: Use this for payment inquiries. Suggest it with the link format: [Credit Purchase](page:partnerships)
*   **Sales Team**: Use this when users ask about sales managers. Suggest it with the link format: [Sales Team](page:our_experts)
*   **Market Insights**: Use this for price trends. Suggest it with the link format: [Market Insights](page:content_hub)

Example response: "For a detailed estimate of the shipping cost to Mashhad, please use our [Shipping Calculator](page:tools)."

**Tone and Style:**
*   Maintain a professional, industrial, and helpful tone.
*   Use relevant emojis (like 🏗️, 🔩, 🏭, 📉, 🛠️).

**Crucial Safety Instructions:**
*   **DO NOT PROVIDE STRUCTURAL ENGINEERING PLANS.** You are an AI assistant providing product information. Always advise users to consult with a certified structural engineer for safety calculations.
`;

const LoadingSpinner = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-slate-200 border-t-corp-red rounded-full animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  const [currentPage, setPage] = useState<Page>('home');
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isQuotaExhausted, setIsQuotaExhausted] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // AI Chat State
  const [chatHistory, setChatHistory] = useState<Message[]>([{ role: 'model', parts: [{ text: "سلام! من دستیار هوشمند استیل آنلاین ۲۰ هستم. امروز چطور می‌توانم در خرید آهن‌آلات به شما کمک کنم؟" }] }]);
  const [isStreaming, setIsStreaming] = useState(false);
  
  // Distributor Finder State
  const [providerResults, setProviderResults] = useState<ProviderSearchResult[] | null>(null);
  const [isFindingProviders, setIsFindingProviders] = useState(false);
  
  // Search State
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultItem[] | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  
  // Recommendation Engine State
  const [recommendationResult, setRecommendationResult] = useState<TestRecommendationResult | null>(null);
  const [isGettingRecommendation, setIsGettingRecommendation] = useState(false);
  const [testDetails, setTestDetails] = useState<TestDetailsResult | null>(null);
  const [isFetchingTestDetails, setIsFetchingTestDetails] = useState(false);
  
  // Content Hub State
  const [dailyTrends, setDailyTrends] = useState<DailyTrend[] | null>(null);
  const [isFetchingTrends, setIsFetchingTrends] = useState(false);
  const [trendsError, setTrendsError] = useState<string | null>(null);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [adaptedPost, setAdaptedPost] = useState<{title: string, content: string} | null>(null);
  const [isAdapting, setIsAdapting] = useState(false);

  // Blog/Article State
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);


  const { addToast } = useToast();
  const { language, t } = useLanguage();

  // Supabase Auth State Listener
  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          picture: session.user.user_metadata.avatar_url
        });
      }
    });

    // Listen for changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata.full_name || session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          picture: session.user.user_metadata.avatar_url
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const articlesForSearch = (ARTICLES || []).map(a => `Article: ${a.title[language]} ('article', id: ${a.id}). Content: ${a.excerpt[language]}. Category: ${a.category[language]}. Tags: ${(a.tags || []).map(t => t[language]).join(', ')}`).join('\n    ');
  const searchIndex = `
    Product Categories: 
    - ${t('products.food_feed.title')}: ${t('products.food_feed.description')} Keywords: rebar, mesh, construction steel.
    - ${t('products.microbiology.title')}: ${t('products.microbiology.description')} Keywords: IPE beam, IPB beam, honeycomb beam.
    - ${t('products.environmental.title')}: ${t('products.environmental.description')} Keywords: black sheet, galvanized sheet, oiled sheet.

    Sales Team:
    - ${t('ourTeam.doctors.0.name')}: ${t('ourTeam.doctors.0.specialty')} - ${t('ourTeam.doctors.0.bio')}
    - ${t('ourTeam.doctors.1.name')}: ${t('ourTeam.doctors.1.specialty')} - ${t('ourTeam.doctors.1.bio')}
    - ${t('ourTeam.doctors.2.name')}: ${t('ourTeam.doctors.2.specialty')} - ${t('ourTeam.doctors.2.bio')}

    Website Pages & Tools:
    - Page: Home ('home'). Content: Main page with daily steel prices and product categories.
    - Tool: IronSnapp Marketplace ('iron_snapp'). Content: A marketplace to buy steel directly from sellers, find the nearest warehouse, and pay via check or cash.
    - Tool: Smart Steel Advisor ('test_recommender'). Content: AI tool to recommend steel products for construction projects based on type and location.
    - Page: Find Suppliers ('sample_dropoff'). Content: Map and search tool to find steel warehouses and iron depots.
    - Tool: AI Consultant ('ai_consultant'). Content: Chat interface to ask about steel prices and standards.
    - Page: Market Insights ('content_hub'). Content: Tool to track steel market trends and generate content.
    - Page: Blog ('blog'). Content: Articles about steel industry news.
    ${articlesForSearch}
    - Page: Sales Team ('our_experts'). Content: Meet our sales experts.
    - Page: Credit Purchase ('partnerships'). Content: B2B services, check/LC payment options.
    - Page: Tools ('tools'). Content: Weight calculator, shipping cost estimator, credit info.
  `;
    
  const handleApiError = (error: unknown): string => {
    let message = "An unexpected error occurred.";
    if (error instanceof Error) {
        message = error.message;
    } else if (typeof error === 'string') {
        message = error;
    }
    
    if (message.includes('429') || message.includes('quota')) {
        setIsQuotaExhausted(true);
        message = "API quota exceeded. Please check your billing or try again later.";
    }
    
    addToast(message, 'error');
    return message;
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    addToast("You have been logged out.", "info");
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsLoginModalOpen(false);
    addToast(`Welcome, ${userData.name}!`, "success");
    
    if (userData.role === 'admin') {
      setPage('admin_dashboard');
    } else {
      setPage('user_dashboard');
    }
  };

  const handleAiSendMessage = async (message: string) => {
    const userMessage: Message = { role: 'user', parts: [{ text: message }] };
    
    const historyForApi = [...chatHistory, userMessage];
    
    setChatHistory(prev => [...prev, userMessage, { role: 'model', parts: [{ text: '' }] }]);
    setIsStreaming(true);

    try {
        if (!ai) {
            throw new Error('API key not configured. Please add your Gemini API key in secrets.');
        }
        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: historyForApi,
            config: {
                systemInstruction: systemInstruction,
                tools: [{ googleSearch: {} }],
            }
        });

        let fullResponse = '';
        let groundingMetadata: any = null;

        for await (const chunk of responseStream) {
            fullResponse += chunk.text;
            
            if (chunk.candidates?.[0]?.groundingMetadata) {
                groundingMetadata = chunk.candidates[0].groundingMetadata;
            }

            setChatHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = { role: 'model', parts: [{ text: fullResponse }] };
                return newHistory;
            });
        }

        // Append grounding sources if available
        if (groundingMetadata?.groundingChunks) {
            const uniqueSources = new Set();
            const sourcesList: string[] = [];

            groundingMetadata.groundingChunks.forEach((chunk: any) => {
                if (chunk.web?.uri && chunk.web?.title) {
                    const sourceKey = chunk.web.uri;
                    if (!uniqueSources.has(sourceKey)) {
                        uniqueSources.add(sourceKey);
                        sourcesList.push(`[${chunk.web.title}](${chunk.web.uri})`);
                    }
                }
            });

            if (sourcesList.length > 0) {
                 const sourcesText = `\n\n**Sources:**\n${sourcesList.map(s => `- ${s}`).join('\n')}`;
                 fullResponse += sourcesText;
                 
                 setChatHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1] = { role: 'model', parts: [{ text: fullResponse }] };
                    return newHistory;
                });
            }
        }

    } catch (error) {
        handleApiError(error);
        setChatHistory(prev => prev.slice(0, -1)); 
    } finally {
        setIsStreaming(false);
    }
  };
  
  const handleProviderSearch = async (
    searchMethod: 'geo' | 'text',
    query: string,
    searchType: 'distributor' | 'veterinarian' = 'distributor'
  ) => {
      setIsFindingProviders(true);
      setProviderResults(null);
      try {
          let location: { lat: number; lon: number } | null = null;
          if (searchMethod === 'geo') {
              try {
                  location = await new Promise((resolve, reject) => {
                      if (!navigator.geolocation) {
                          reject(new Error("Geolocation not supported"));
                          return;
                      }
                      navigator.geolocation.getCurrentPosition(
                          position => resolve({
                              lat: position.coords.latitude,
                              lon: position.coords.longitude
                          }),
                          (error) => {
                             reject(error);
                          },
                          { timeout: 10000 }
                      );
                  });
              } catch (geoError: any) {
                  console.error("Geolocation error:", geoError);
                  let msg = "Could not get your location.";
                  if (geoError?.code === 1) msg = "Location permission denied.";
                  if (geoError?.code === 2) msg = "Location unavailable. Please check GPS/Network.";
                  if (geoError?.code === 3) msg = "Location request timed out.";
                  addToast(msg, "error");
                  setIsFindingProviders(false);
                  return; // Stop the search if geo failed
              }
          }
          const results = await findLocalProviders(query, location, language, searchType);
          setProviderResults(results);
      } catch (err) {
          handleApiError(err);
      } finally {
          setIsFindingProviders(false);
      }
  };
  
  const handleGetRecommendation = async (inputs: TestSubmissionFormInputs, image: { base64: string, mimeType: string } | null) => {
    setIsGettingRecommendation(true);
    setRecommendationResult(null);
    setTestDetails(null);
    try {
        const imagePart = image 
            ? { inlineData: { data: image.base64, mimeType: image.mimeType } } 
            : null;
        const result = await getAIRecommendation(inputs, imagePart, language);
        setRecommendationResult(result);
    } catch(err) {
        handleApiError(err);
    } finally {
        setIsGettingRecommendation(false);
    }
  };
  
  const handleGetTestDetails = async (testNames: string[]) => {
    setIsFetchingTestDetails(true);
    setTestDetails(null);
    try {
      const result = await getTestDetails(testNames, language);
      setTestDetails(result);
    } catch(err) {
      handleApiError(err);
    } finally {
      setIsFetchingTestDetails(false);
    }
  };
  
  const handleFindDropoffLocation = async (primaryAssessment: string) => {
      await handleProviderSearch('geo', primaryAssessment, 'distributor');
      setPage('sample_dropoff');
  };

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    setSearchResults(null);
    setSearchError(null);

    try {
      const results = await performSemanticSearch(query, searchIndex, language);
      setSearchResults(results);
    } catch (err) {
      const msg = handleApiError(err);
      setSearchError(msg);
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleFetchTrends = async () => {
    setIsFetchingTrends(true);
    setTrendsError(null);
    setDailyTrends(null);
    try {
        const trends = await fetchDailyTrends(language);
        setDailyTrends(trends);
    } catch (err) {
        const msg = handleApiError(err);
        setTrendsError(msg);
    } finally {
        setIsFetchingTrends(false);
    }
  };

  const handleGeneratePost = async (topic: string, platform: GeneratedPost['platform']) => {
    setIsGeneratingPost(true);
    setGeneratedPost({ platform, text: '...', imageUrl: null }); 
    setAdaptedPost(null);
    try {
        const { postText, imagePrompt } = await generateSocialPost(topic, platform, language);
        setGeneratedPost({ platform, text: postText, imageUrl: null });
        
        addToast("Generating visual...", "info");
        const imageBase64 = await generatePostImage(imagePrompt);
        const imageUrl = `data:image/jpeg;base64,${imageBase64}`;
        setGeneratedPost({ platform, text: postText, imageUrl: imageUrl });
        addToast("Content generated!", "success");

    } catch (err) {
        handleApiError(err);
        setGeneratedPost(null);
    } finally {
        setIsGeneratingPost(false);
    }
  };

  const handleAdaptPost = async (postText: string, platform: string) => {
      setIsAdapting(true);
      setAdaptedPost(null);
      try {
          const result = await adaptPostForWebsite(postText, platform, language);
          setAdaptedPost(result);
          addToast("Content adapted!", "success");
      } catch (error) {
          handleApiError(error);
      } finally {
          setIsAdapting(false);
      }
  };

  const handleNavigateFromSearch = (page: Page, id?: number) => {
    if (page === 'article' && id) {
      const article = ARTICLES.find(a => a.id === id);
      if (article) {
        setSelectedArticle(article);
      }
    }
    setPage(page);
    setIsSearchModalOpen(false);
  };
  
  const handleSelectArticle = (article: Article) => {
    setSelectedArticle(article);
    setPage('article');
  };

  const renderPage = () => {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        {(() => {
          switch (currentPage) {
            case 'home':
              return <HomePage setPage={setPage} articles={ARTICLES} onSelectArticle={handleSelectArticle} />;
            case 'prices':
              return <PricesPage setPage={setPage} />;
            case 'map_finder':
              return <MapFinderPage setPage={setPage} />;
            case 'iron_snapp':
              return <IronSnappPage />;
            case 'test_recommender':
              return <RecommendationEnginePage 
                  onGetRecommendation={handleGetRecommendation}
                  isLoading={isGettingRecommendation}
                  result={recommendationResult}
                  onClearResult={() => {
                      setRecommendationResult(null);
                      setTestDetails(null);
                  }}
                  onGetTestDetails={handleGetTestDetails}
                  isFetchingTestDetails={isFetchingTestDetails}
                  testDetails={testDetails}
                  onFindDropoffLocation={handleFindDropoffLocation}
              />;
            case 'sample_dropoff':
              return <DistributorFinderPage 
                  onSearch={handleProviderSearch}
                  isLoading={isFindingProviders}
                  results={providerResults}
                  isQuotaExhausted={isQuotaExhausted}
              />;
            case 'ai_consultant':
              return <AIChatPage
                  chatHistory={chatHistory} 
                  isStreaming={isStreaming} 
                  onSendMessage={handleAiSendMessage}
                  setPage={setPage}
              />;
            case 'blog':
              return <BlogPage articles={ARTICLES} onSelectArticle={handleSelectArticle} />;
            case 'article':
              return selectedArticle 
                  ? <ArticlePage article={selectedArticle} setPage={setPage} /> 
                  : <BlogPage articles={ARTICLES} onSelectArticle={handleSelectArticle} />;
            case 'content_hub':
              return <ContentHubPage
                  onFetchTrends={handleFetchTrends}
                  isFetchingTrends={isFetchingTrends}
                  trends={dailyTrends}
                  trendsError={trendsError}
                  onGeneratePost={handleGeneratePost}
                  isGeneratingPost={isGeneratingPost}
                  generatedPost={generatedPost}
                  onClearPost={() => {
                      setGeneratedPost(null);
                      setAdaptedPost(null);
                  }}
                  onAdaptPost={handleAdaptPost}
                  isAdapting={isAdapting}
                  adaptedPost={adaptedPost}
              />;
            case 'our_experts':
              return <TeamPage />;
            case 'partnerships':
              return <PartnershipsPage setPage={setPage} />;
            case 'tools':
              return <ToolsPage />;
            case 'dashboard':
            case 'admin_dashboard':
              if (!user || user.role !== 'admin') {
                setIsLoginModalOpen(true);
                setPage('home');
                return <HomePage setPage={setPage} articles={ARTICLES} onSelectArticle={handleSelectArticle} />;
              }
              return <DashboardPage setPage={setPage} />;
            case 'user_dashboard':
              if (!user) {
                setIsLoginModalOpen(true);
                setPage('home');
                return <HomePage setPage={setPage} articles={ARTICLES} onSelectArticle={handleSelectArticle} />;
              }
              return <UserDashboardPage setPage={setPage} user={user} onLogout={handleLogout} />;
            default:
              return <HomePage setPage={setPage} articles={ARTICLES} onSelectArticle={handleSelectArticle} />;
          }
        })()}
      </Suspense>
    );
  };

  const isAuthenticated = !!user;

  return (
      <div className="bg-slate-50 text-slate-800 font-sans relative">
        {currentPage !== 'dashboard' && currentPage !== 'admin_dashboard' && currentPage !== 'user_dashboard' && (
            <SiteHeader
            currentPage={currentPage}
            setPage={setPage}
            isAuthenticated={isAuthenticated}
            user={user}
            onLoginClick={() => setIsLoginModalOpen(true)}
            onLogoutClick={handleLogout}
            onSearchClick={() => setIsSearchModalOpen(true)}
            />
        )}
        
        <main>
            {renderPage()}
        </main>
        
        {currentPage !== 'dashboard' && currentPage !== 'admin_dashboard' && currentPage !== 'user_dashboard' && <SiteFooter setPage={setPage} />}
        
        <QuotaErrorModal isOpen={isQuotaExhausted} onClose={() => setIsQuotaExhausted(false)} />
        <LoginModal 
            isOpen={isLoginModalOpen} 
            onClose={() => setIsLoginModalOpen(false)} 
            onLogin={handleLogin} 
        />
        <SearchModal
          isOpen={isSearchModalOpen}
          onClose={() => setIsSearchModalOpen(false)}
          onSearch={handleSearch}
          isLoading={isSearching}
          results={searchResults}
          error={searchError}
          onNavigate={handleNavigateFromSearch}
        />
        {currentPage !== 'dashboard' && currentPage !== 'admin_dashboard' && currentPage !== 'user_dashboard' && (
            <FloatingChatbot
                chatHistory={chatHistory}
                isStreaming={isStreaming}
                onSendMessage={handleAiSendMessage}
                setPage={setPage}
            />
        )}
        {/* Floating SEO Checker Button */}
        {currentPage !== 'dashboard' && currentPage !== 'admin_dashboard' && currentPage !== 'user_dashboard' && <SEOChecker />}
      </div>
  );
};

export default App;
