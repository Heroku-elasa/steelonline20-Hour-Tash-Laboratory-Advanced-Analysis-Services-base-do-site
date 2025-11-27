
import { GoogleGenAI, Type } from "@google/genai";
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
} from '../types';

const apiKey = import.meta.env.VITE_API_KEY;
if (!apiKey) {
    throw new Error("VITE_API_KEY environment variable is not set. Please create a .env file and add `VITE_API_KEY=your_api_key_here`.");
}

const ai = new GoogleGenAI({ apiKey });

// Helper to robustly extract JSON from response text
const extractJson = (text: string): string => {
    let jsonString = text.replace(/```json|```/g, '').trim();
    const startIndex = jsonString.indexOf('[');
    const endIndex = jsonString.lastIndexOf(']') + 1;
    if (startIndex !== -1 && endIndex !== -1) {
        return jsonString.substring(startIndex, endIndex);
    }
    const startObj = jsonString.indexOf('{');
    const endObj = jsonString.lastIndexOf('}') + 1;
    if (startObj !== -1 && endObj !== -1) {
        return jsonString.substring(startObj, endObj);
    }
    return jsonString;
};


// Schemas for structured responses
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

const testDetailsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            testName: { type: Type.STRING, description: "Product Name" },
            purpose: { type: Type.STRING, description: "Main application (e.g., Columns, Beams)." },
            methodology: { type: Type.STRING, description: "Standard (e.g., DIN 1025, ASTM A615)." },
            turnaroundTime: { type: Type.STRING, description: "Availability status (e.g., 'In Stock', '3 Days')." },
            estimatedCost: { type: Type.STRING, description: "Price estimate per Kg/Branch." },
        },
    }
};

const searchResultSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING, description: "A concise, helpful description of why this result matches the query." },
            targetPage: { type: Type.STRING, enum: ['home', 'test_recommender', 'sample_dropoff', 'ai_consultant', 'content_hub', 'our_experts', 'partnerships', 'blog', 'article', 'tools'] },
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

const videoToolSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            name: { type: Type.STRING },
            cost: { type: Type.STRING, description: "Pricing summary (e.g. '$20/mo', 'Free plan available')." },
            farsiSupport: { type: Type.STRING, description: "Level of support for Farsi/Persian language (e.g., 'Excellent', 'Good', 'Poor', 'None')." },
            features: { type: Type.STRING, description: "Key features like Music, video duration, avatar realism." },
            qualityRating: { type: Type.STRING, description: "A rating out of 10 or stars based on user reviews." },
        }
    }
}


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

    if (!response.text) {
        throw new Error("No text was generated by the AI.");
    }
    return JSON.parse(response.text);
};

export const getTestDetails = async (testNames: string[], language: Language): Promise<TestDetailsResult> => {
    const prompt = `
        For the following steel products: ${testNames.join(', ')}.
        Provide a detailed price and spec estimation in JSON format.
        It is CRITICAL that for each product, you provide an 'availability' status (e.g., 'In Stock', 'Factory Order').
        Also include the product's 'application' (purpose), its 'standard' (methodology like DIN/ASTM), and an 'estimatedCost' (e.g., "25,000 Tomans/Kg" or "Contact for price").
        The response language should be ${language}.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: testDetailsSchema,
        },
    });

    if (!response.text) {
        throw new Error("No text was generated by the AI.");
    }
    return JSON.parse(response.text);
};

export const findLocalProviders = async (query: string, location: { lat: number; lon: number } | null, language: Language, searchType: 'distributor' | 'veterinarian'): Promise<ProviderSearchResult[]> => {
    const locationInfo = location ? `The user is near latitude ${location.lat} and longitude ${location.lon}.` : 'The user has not provided their location; base the search on the query.';
    // Map internal types to steel industry terms for the prompt
    const typeTerm = searchType === 'distributor' ? 'Steel Warehouse / Iron Market' : 'Official Steel Dealer';
    
    const prompt = `
      A user is looking for a ${typeTerm} in Iran.
      Search Query: "${query}"
      ${locationInfo}
      
      Generate a list of 5 plausible ${typeTerm}s based on the query (focus on major hubs like Shadabad, Isfahan Iron Market, etc. if query is generic).
      For each, provide a name, full address, phone number, and a fictional website ending in ".example.com".
      Return the result as a JSON array of objects, where each object has "name", "address", "phone", and "website" keys.
      The results should be appropriate for the language: ${language}.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    
    try {
        if (!response.text) {
            throw new Error("No text was generated by the AI.");
        }
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
    
    if (!response.text) {
        throw new Error("No text was generated by the AI.");
    }
    const results = JSON.parse(response.text);
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
    
    if (!response.text) {
        throw new Error("No text was generated by the AI.");
    }
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
    
    if (!response.text) {
        throw new Error("No text was generated by the AI.");
    }
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

    if (!response.text) {
        throw new Error("No text was generated by the AI.");
    }
    return JSON.parse(response.text);
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

    if (!response.text) {
        throw new Error("No text was generated by the AI.");
    }
    return JSON.parse(response.text);
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

    if (!response.text) {
        throw new Error("No text was generated by the AI.");
    }
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

    const image = response.generatedImages?.[0]?.image;
    if (!image?.imageBytes) {
        throw new Error("No image was generated by the AI.");
    }
    return image.imageBytes;
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
    });
    
    if (!response.text) {
        throw new Error("No text was generated by the AI.");
    }
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
    if (!response.text) {
        throw new Error("No text was generated by the AI.");
    }
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

    if (!response.text) {
        throw new Error("No text was generated by the AI.");
    }
    return JSON.parse(extractJson(response.text));
};

// New Function: Estimate Shipping Cost (Automation)
export const estimateShippingCost = async (route: string, language: Language): Promise<ShippingEstimate> => {
    const prompt = `
        Estimate the shipping cost for a truckload (20 tons) of steel for the following route in Iran: "${route}".
        
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
    });

    if (!response.text) {
        throw new Error("No text was generated by the AI.");
    }
    return JSON.parse(extractJson(response.text));
};
