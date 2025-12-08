import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { 
    TestSubmissionFormInputs,
    TestRecommendationResult,
    DailyTrend,
    SearchResultItem,
    ProviderSearchResult,
    Language,
    TestDetailsResult,
    VideoScript,
    PublishingStrategy,
    VideoTool,
    WeightResult,
    ShippingEstimate,
    MarketplaceRequest,
    MarketplaceOffer,
    CreditCheckResult,
    SEOAnalysisResult,
} from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to robustly extract JSON from response text
const extractJson = (text: string): string => {
    // 1. Remove markdown code blocks
    let jsonString = text.replace(/```json|```/g, '').trim();

    // 2. Find the first '{' or '['
    const firstOpenBrace = jsonString.indexOf('{');
    const firstOpenBracket = jsonString.indexOf('[');

    // If neither is found, return original string (parsing will likely fail, but nothing to extract)
    if (firstOpenBrace === -1 && firstOpenBracket === -1) {
        return jsonString;
    }

    // 3. Determine start index and mode (object vs array)
    let startIndex = -1;
    let mode: 'object' | 'array' = 'object';

    if (firstOpenBrace !== -1 && (firstOpenBracket === -1 || firstOpenBrace < firstOpenBracket)) {
        startIndex = firstOpenBrace;
        mode = 'object';
    } else {
        startIndex = firstOpenBracket;
        mode = 'array';
    }

    // 4. Stack-based extraction to find the matching closing character
    let depth = 0;
    for (let i = startIndex; i < jsonString.length; i++) {
        const char = jsonString[i];
        
        if (mode === 'object') {
            if (char === '{') depth++;
            else if (char === '}') depth--;
        } else {
            if (char === '[') depth++;
            else if (char === ']') depth--;
        }

        // Found the matching closing brace/bracket
        if (depth === 0) {
            return jsonString.substring(startIndex, i + 1);
        }
    }

    // If logic fails (e.g. malformed JSON), return substring from start
    return jsonString.substring(startIndex);
};

// ... existing schemas ...
const seoAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        strategy: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of 3 specific technical or content SEO strategies based on the page metadata." 
        },
        directories: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of 3 authoritative local directories or platforms to register on for backlinks."
        },
        keywords: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "List of 5 target LSI keywords based on page content."
        },
    },
};

// New Function: Analyze SEO Strategy
export const analyzeSEOStrategy = async (
    pageData: { title: string; description: string; h1: string; contentSample: string },
    language: Language
): Promise<SEOAnalysisResult['aiRecommendations']> => {
    const prompt = `
        Act as a Senior SEO Specialist for the Industrial/Steel sector in Iran.
        Perform a comprehensive analysis of the following page metadata and content for "Steel Online 20".
        
        Page Metadata:
        - Page Title: "${pageData.title}"
        - Meta Description: "${pageData.description}"
        - H1 Tag: "${pageData.h1}"
        - Content Sample: "${pageData.contentSample.substring(0, 500)}..."

        Your Task:
        1. Evaluate the Title, Description, and H1 for keyword optimization and click-through rate (CTR).
        2. Generate an actionable SEO Strategy based *specifically* on the provided metadata (e.g., "Shorten title to X", "Include keyword Y in Description").
        3. Identify 3 high-value local directories or platforms where this specific page/business should be registered to improve off-page SEO (e.g. Ketab Avval, Wikipedia Persian, specialized steel forums).
        4. Suggest 5 LSI keywords relevant to the content.

        Provide the output in ${language}.
        Return ONLY valid JSON matching the schema.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: seoAnalysisSchema,
        },
    });

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(extractJson(response.text));
};

const testRecommendationSchema = {
    type: Type.OBJECT,
    properties: {
        primaryAssessment: { type: Type.STRING, description: "A concise primary assessment of the construction project needs (e.g., 'Heavy Steel Structure for Industrial Shed')." },
        assessmentDescription: { type: Type.STRING, description: "A one-paragraph summary describing the structural requirements based on the input." },
        potentialIssues: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "Name of a technical consideration (e.g., Seismic Load, Corrosion, Weldability)." },
                    description: { type: Type.STRING, description: "Brief explanation of why this is important." },
                    relevance: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                },
            },
        },
        recommendedTests: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of specific steel products recommended (e.g., 'IPE 270 Beam - Esfahan', 'Rebar Size 16 - Zob Ahan').",
        },
        managementAdvice: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of actionable advice for purchasing, logistics, or storage of steel.",
        },
        nextStepsAndExpertConsultation: {
            type: Type.STRING,
            description: "Guidance on how to proceed with the purchase and when to consult a structural engineer."
        },
        disclaimer: { type: Type.STRING, description: "A standard disclaimer stating this is an AI estimate and not a certified engineering plan." },
    },
};

const searchResultSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING, description: "A concise, helpful description of why this result matches the query." },
            targetPage: { type: Type.STRING, enum: ['home', 'test_recommender', 'sample_dropoff', 'ai_consultant', 'content_hub', 'our_experts', 'partnerships', 'blog', 'article', 'tools', 'iron_snapp'] },
            targetId: { type: Type.NUMBER, description: "If the targetPage is 'article', this is the ID of the article." },
            relevanceScore: { type: Type.NUMBER, description: "A score from 0.0 to 1.0 indicating how relevant this result is to the query." },
        },
        required: ['title', 'description', 'targetPage', 'relevanceScore'],
    }
};

const videoScriptSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "A catchy title for the video." },
        hook: { type: Type.STRING, description: "The first 3 seconds visual and audio hook to grab attention." },
        caption: { type: Type.STRING, description: "A short, engaging caption for the social media post to accompany the video." },
        scenes: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    timecode: { type: Type.STRING, description: "e.g., 0:00-0:03" },
                    visual: { type: Type.STRING, description: "Detailed visual description for the scene." },
                    voiceover: { type: Type.STRING, description: "The exact words to be spoken. MUST be in the requested language." },
                    audio_cues: { type: Type.STRING, description: "Sound effects (SFX) or background music mood." },
                    emotion: { type: Type.STRING, description: "The emotion and tone of the voiceover (e.g., Excited, Serious, Educational)." },
                },
            },
        },
        cta: { type: Type.STRING, description: "The Call to Action for the viewer." },
        hashtags: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
};

const publishingStrategySchema = {
    type: Type.OBJECT,
    properties: {
        bestTime: { type: Type.STRING, description: "Specific best time to publish this content (e.g., 'Tuesday at 6:00 PM')." },
        algorithmTip: { type: Type.STRING, description: "A specific tip to boost engagement based on the platform's current algorithm." },
        nextPostIdea: { type: Type.STRING, description: "A concept for a follow-up post to keep momentum." },
        reasoning: { type: Type.STRING, description: "Why this strategy works." },
    }
};

const creditCheckSchema = {
    type: Type.OBJECT,
    properties: {
        allowed: { type: Type.BOOLEAN },
        score: { type: Type.NUMBER, description: "Credit score out of 1000." },
        maxAmount: { type: Type.STRING, description: "Max credit limit formatted." },
        reason: { type: Type.STRING, description: "Explanation of the decision." },
    }
};


export const getAIRecommendation = async (
    inputs: TestSubmissionFormInputs,
    imagePart: { inlineData: { data: string; mimeType: string; } } | null,
    language: Language
): Promise<TestRecommendationResult> => {

    const promptText = `
        Analyze the following construction/steel project inquiry for Steel Online 20, a leading steel marketplace.
        Language for response: ${language}.

        Project Details:
        - Product Category: ${inputs.sampleType}
        - Tonnage / Destination: ${inputs.batchSizeOrigin || 'Not provided'}
        - Project Description / Requirements: ${inputs.suspectedIssue}
        - Delivery Timeframe: ${inputs.sampleAge || 'Not provided'}
        - Structural Details: ${inputs.specificConditions || 'Not provided'}
        - Preferred Brands: ${inputs.controlSampleInfo || 'Not provided'}
        - Budget/Constraints: ${inputs.previousTests || 'Not provided'}
        - Additional Services: ${inputs.additives || 'Not provided'}

        Based on these details (and the provided plan image if any), act as a structural steel expert. Generate a JSON response with a primary assessment of the material needs, technical considerations (potential issues like corrosion in humid areas), recommended specific products (e.g. 'IPE 180 Esfahan', 'Rebar 16 Zob Ahan'), and advice on purchasing/logistics.
        Provide clear guidance on next steps (e.g. 'Request formal invoice').
        Include a disclaimer that this is an AI estimate and requires engineering approval.
    `;
    
    const contents = imagePart ? [{ text: promptText }, imagePart] : [{ text: promptText }];
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: contents },
        config: {
            responseMimeType: "application/json",
            responseSchema: testRecommendationSchema,
        },
    });

    if (!response.text) throw new Error("No response from AI");
    
    const result = JSON.parse(extractJson(response.text));

    // Sanitize recommendedTests to prevent React Error #31 (Objects are not valid as a React child)
    // This happens if the AI returns an object (like specifications) instead of a string in the array.
    if (result.recommendedTests && Array.isArray(result.recommendedTests)) {
        result.recommendedTests = result.recommendedTests.map((item: any) => {
            if (typeof item === 'string') return item;
            if (typeof item === 'object' && item !== null) {
                // Flatten object to string
                return Object.entries(item).map(([k, v]) => `${k}: ${v}`).join(', ');
            }
            return String(item);
        });
    }

    return result;
};

export const getTestDetails = async (testNames: string[], language: Language): Promise<TestDetailsResult> => {
    const prompt = `
        For the following steel products: ${testNames.join(', ')}.
        Provide a detailed price and spec estimation in JSON format.
        Use Google Search to find the most current approximate prices in the Iranian market (Tomans).
        
        It is CRITICAL that for each product, you provide an 'availability' status (e.g., 'In Stock', 'Factory Order').
        Also include the product's 'application' (purpose), its 'standard' (methodology like DIN/ASTM), and an 'estimatedCost' (e.g., "25,000 Tomans/Kg" or "Contact for price").
        The response language should be ${language}.
        
        Return ONLY a JSON array where each object has: "testName", "purpose", "methodology", "turnaroundTime", "estimatedCost".
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }]
        },
    });

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(extractJson(response.text));
};

export const findLocalProviders = async (query: string, location: { lat: number; lon: number } | null, language: Language, searchType: 'distributor' | 'veterinarian'): Promise<ProviderSearchResult[]> => {
    const locationInfo = location ? `The user is near latitude ${location.lat} and longitude ${location.lon}.` : 'The user has not provided their location; base the search on the query.';
    // Map internal types to steel industry terms for the prompt
    const typeTerm = searchType === 'distributor' ? 'Steel Warehouse / Iron Market' : 'Official Steel Dealer';
    
    const prompt = `
      A user is looking for a ${typeTerm} in Iran.
      Search Query: "${query}"
      ${locationInfo}
      
      Use Google Search to find real ${typeTerm}s in Iran matching the query.
      Generate a list of 5 plausible ${typeTerm}s based on the query (focus on major hubs like Shadabad, Isfahan Iron Market, etc. if query is generic).
      For each, provide a name, full address, phone number, and a website (if found, otherwise fictional ending in ".example.com").
      Return the result as a JSON array of objects, where each object has "name", "address", "phone", and "website" keys.
      The results should be appropriate for the language: ${language}.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }]
        }
    });
    
    try {
        if (!response.text) throw new Error("No response from AI");
        const results = JSON.parse(extractJson(response.text));
        return results.map((r: any) => ({ ...r, type: searchType }));
    } catch (e) {
        console.error("Failed to parse provider search results:", response.text);
        // Fallback for non-JSON responses
        return [{ name: "Error parsing results", address: "Could not read AI response.", phone: "", type: searchType }];
    }
};

export const performSemanticSearch = async (query: string, searchIndex: string, language: Language): Promise<SearchResultItem[]> => {
    const prompt = `
        You are a highly intelligent semantic search engine for the "Steel Online 20" website. Your task is to analyze a user's query and a detailed site index to provide the most relevant results.

        User Query: "${query}"

        Detailed Site Index:
        ---
        ${searchIndex}
        ---

        Instructions:
        1.  **Analyze Intent**: Understand if the user is looking for a specific product price (e.g., "Rebar 16"), a tool (e.g., "advisor", "weight table", "shipping"), a person, or an article.
        2.  **Semantic Matching**: Match keywords and concepts.
        3.  **Rank and Score**: Identify up to 3 results. Score 0.0 to 1.0.
        4.  **Generate Description**: Write a helpful description in ${language}.
        5.  **Target ID**: Include if article.
        6.  **Format Output**: JSON array.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: searchResultSchema,
        }
    });
    
    if (!response.text) throw new Error("No response from AI");
    const results = JSON.parse(extractJson(response.text));
    results.sort((a: SearchResultItem, b: SearchResultItem) => b.relevanceScore - a.relevanceScore);
    return results;
};

export const fetchDailyTrends = async (language: Language): Promise<DailyTrend[]> => {
    const prompt = `
        Identify three current and relevant trends in the Iran and Global Steel Market.
        Focus on price fluctuations of Rebar, Beams, Dollar exchange rate impact, and export regulations.
        For each trend, provide:
        1. "title": A short title.
        2. "summary": A one-sentence summary.
        3. "contentIdea": A specific, engaging prompt to write a social media post about this trend.
        
        IMPORTANT: Return ONLY a valid JSON array.
        The content must be in ${language}.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }] // Use Google Search for up-to-date info
        }
    });
    
    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(extractJson(response.text));
};

export const generateSocialPost = async (topic: string, platform: string, language: Language): Promise<{ postText: string; imagePrompt: string }> => {
    const prompt = `
        You are a social media manager for "Steel Online 20", a steel marketplace.
        Generate content for a social media post on: ${platform}.
        Topic: "${topic}".
        Audience: Contractors, Builders, Iron Sellers.
        Return JSON with "postText" and "imagePrompt" (e.g., 'Stacks of rusted rebar on a construction site at sunset').

        The response language should be ${language}.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(extractJson(response.text));
};

export const generateVideoConcept = async (topic: string, platform: string, language: Language): Promise<VideoScript> => {
    const prompt = `
        Create a Director's Script for a short vertical video about: "${topic}" for Steel Online 20.
        Target Platform: ${platform}.
        Language: ${language}.
        
        Output MUST be valid JSON adhering to the videoScriptSchema.
        Focus on industrial visuals, construction sites, and steel close-ups.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: videoScriptSchema,
        },
    });

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(extractJson(response.text));
};

export const getPublishingStrategy = async (topic: string, platform: string, language: Language): Promise<PublishingStrategy> => {
    const prompt = `
        Act as a Social Media Strategist for the Steel Industry on ${platform}.
        Topic: "${topic}"
        Target Audience: Construction companies, traders.
        Language: ${language}.

        Return JSON with "bestTime", "algorithmTip", "nextPostIdea", "reasoning".
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: publishingStrategySchema,
        },
    });

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(extractJson(response.text));
};

export const findBestVideoTools = async (language: Language): Promise<VideoTool[]> => {
    const prompt = `
        Find 5 best AI video generation tools suitable for creating industrial/construction content.
        Compare specifically for a user creating content in ${language}.
        Return JSON array of objects with name, cost, farsiSupport, features, qualityRating.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }]
        },
    });

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(extractJson(response.text));
};

export const generatePostImage = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
        },
    });

    if (!response.generatedImages?.[0]?.image?.imageBytes) {
        throw new Error("No image generated");
    }
    return response.generatedImages[0].image.imageBytes;
};

export const adaptPostForWebsite = async (postText: string, platform: string, language: Language): Promise<{ title: string; content: string }> => {
    const prompt = `
      Adapt the following social media post (from ${platform}) into a blog post for Steel Online 20.
      Create a compelling "title" and expand the "content" to be detailed and analytical (markdown format).
      Response language: ${language}.

      Original Post:
      "${postText}"
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: null, // Use default text response to ensure valid extraction
        },
    });
    
    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(extractJson(response.text));
};

export const getAutoFilledDetails = async (symptoms: string, language: Language): Promise<{ specificConditions: string, controlSampleInfo: string, sampleAge: string }> => {
    const prompt = `
        Based on the construction project description below, infer likely details for:
        - "specificConditions" (Structural Details, e.g. Concrete structure)
        - "controlSampleInfo" (Preferred Brands, e.g. Esfahan)
        - "sampleAge" (Delivery Time, e.g. Immediate)
        
        Return JSON with keys: "specificConditions", "controlSampleInfo", "sampleAge".
        Response language: ${language}.

        Description: "${symptoms}"
    `;
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(extractJson(response.text));
};

// New Function: Calculate Steel Weight based on Standard Tables (Automation)
export const calculateSteelWeight = async (productName: string, language: Language): Promise<WeightResult> => {
    const prompt = `
        Calculate the standard weight for the following steel product: "${productName}".
        Use standard tables (DIN, Stahl, or Iranian standards like Esfahan Steel).
        
        Return a JSON object with:
        1. "product": The standardized name of the product.
        2. "weight": The calculated weight per branch (12m) or per meter (e.g., "14.5 Kg per branch").
        3. "details": A brief technical note about the standard used (e.g., "Based on DIN 1025 standard for IPE 14").
        
        Response language: ${language}.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(extractJson(response.text));
};

// New Function: Estimate Shipping Cost (Automation)
export const estimateShippingCost = async (route: string, language: Language): Promise<ShippingEstimate> => {
    const prompt = `
        Estimate the shipping cost for a truckload (20 tons) of steel for the following route in Iran: "${route}".
        Use Google Search to find current freight rates or distances if needed.
        
        Return a JSON object with:
        1. "route": The verified route (Origin -> Destination).
        2. "estimatedCost": A price range in Tomans (e.g., "8,000,000 - 10,000,000 Tomans").
        3. "vehicleType": Recommended vehicle type (e.g., "Trailer 18-wheeler").
        
        Response language: ${language}.
        Note: Prices should be realistic estimates for current Iran transport rates.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }]
        }
    });

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(extractJson(response.text));
};

// --- IronSnapp Marketplace Functions ---

// 1. Matching Engine (Simulates finding sellers based on location and price)
export const findMarketplaceMatches = async (request: MarketplaceRequest, language: Language): Promise<MarketplaceOffer[]> => {
    const prompt = `
        Act as the 'Matching Engine' for the IronSnapp steel marketplace.
        User Request:
        - Product: ${request.product}
        - Quantity: ${request.quantity} tons
        - Location: ${request.location}
        - Payment Method: ${request.paymentType} (${request.checkMonths ? request.checkMonths + ' months check' : 'Instant'})
        
        Use Google Search to find the CURRENT market price of ${request.product} in Iran (in Tomans).
        Then, generate 5 fictional but realistic offers from steel sellers/warehouses in Iran based on that real price.
        
        Calculate 'distanceKm' based on the user's location (assume typical hubs like Shadabad, Isfahan, Ahvaz).
        Calculate 'deliveryCost' and 'totalPrice' realistically based on the found market rates.
        Assign a 'matchScore' (0-100) based on Price (lower is better) + Distance (lower is better) + Payment Flexibility (matches user request).
        
        Response Language: ${language}.
        Return ONLY valid JSON array. Each item must have: sellerName, location, distanceKm (number), pricePerUnit, totalPrice, deliveryCost, matchScore (number), paymentFlexibility, deliveryTime.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            tools: [{ googleSearch: {} }]
        },
    });

    if (!response.text) throw new Error("No response from AI");
    const results = JSON.parse(extractJson(response.text));
    // Sort by match score descending
    return results.sort((a: MarketplaceOffer, b: MarketplaceOffer) => b.matchScore - a.matchScore);
};

// 2. Credit Manager (Simulates validation of credit/check payments)
export const checkCreditScore = async (amount: string, months: number, language: Language): Promise<CreditCheckResult> => {
    const prompt = `
        Act as the 'Credit Manager' for the IronSnapp marketplace.
        A user wants to buy steel worth approx ${amount} using a ${months}-month check.
        
        Randomly simulate a credit check result.
        - 80% chance of 'allowed: true' with a high score (600-900).
        - 20% chance of 'allowed: false' with a reason (e.g., 'Recent bounced check', 'Low credit score', 'Amount exceeds limit').
        
        Response Language: ${language}.
        Return ONLY valid JSON conforming to creditCheckSchema.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: creditCheckSchema,
        },
    });

    if (!response.text) throw new Error("No response from AI");
    return JSON.parse(extractJson(response.text));
};