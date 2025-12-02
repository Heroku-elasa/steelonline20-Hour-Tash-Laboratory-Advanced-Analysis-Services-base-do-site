
import React, { useState, useEffect } from 'react';
import { useLanguage, DailyTrend, GeneratedPost, VideoScript, PublishingStrategy, VideoTool } from '../types';
import { useToast } from './Toast';
import { marked } from 'marked';
import { generateVideoConcept, getPublishingStrategy, findBestVideoTools } from '../services/geminiService';

type ContentSource = 'trends' | 'text' | 'search';
type SocialPlatform = 'linkedin' | 'twitter' | 'instagram' | 'facebook';

interface ContentHubPageProps {
    onFetchTrends: () => void;
    isFetchingTrends: boolean;
    trends: DailyTrend[] | null;
    trendsError: string | null;
    onGeneratePost: (topic: string, platform: SocialPlatform) => void;
    isGeneratingPost: boolean;
    generatedPost: GeneratedPost | null;
    onClearPost: () => void;
    onAdaptPost: (postText: string, platform: string) => void;
    isAdapting: boolean;
    adaptedPost: { title: string; content: string } | null;
}

const socialIcons: Record<SocialPlatform, React.ReactNode> = {
    linkedin: <svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>,
    twitter: <svg fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
    instagram: <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.012 3.584-.07 4.85c-.148 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.012-3.584.07,4.85c.148-3.225,1.664-4.771,4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.74 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.74 0 12s.014 3.667.072 4.947c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.74 24 12 24s3.667-.014 4.947-.072c4.358-.2 6.78-2.618 6.98-6.98C23.986 15.667 24 15.259 24 12s-.014-3.667-.072-4.947c-.2-4.358-2.618-6.78-6.98-6.98C15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" /></svg>,
    facebook: <svg fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V21.878A10.003 10.003 0 0022 12z" /></svg>,
};

const platformThemes: Record<SocialPlatform, { text: string; bg: string; border: string }> = {
    linkedin: { text: 'text-[#0077b5]', bg: 'bg-[#0077b5]/10', border: 'border-[#0077b5]' },
    twitter: { text: 'text-black', bg: 'bg-black/5', border: 'border-black' },
    instagram: { text: 'text-[#E4405F]', bg: 'bg-[#E4405F]/10', border: 'border-[#E4405F]' },
    facebook: { text: 'text-[#1877F2]', bg: 'bg-[#1877F2]/10', border: 'border-[#1877F2]' },
};


const ContentHubPage: React.FC<ContentHubPageProps> = ({
    onFetchTrends, isFetchingTrends, trends, trendsError,
    onGeneratePost, isGeneratingPost, generatedPost, onClearPost,
    onAdaptPost, isAdapting, adaptedPost,
}) => {
    const { t, language } = useLanguage();
    const { addToast } = useToast();

    const [activeTab, setActiveTab] = useState<ContentSource>('trends');
    const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | null>(null);
    const [topic, setTopic] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);
    
    const [isVideoGenerating, setIsVideoGenerating] = useState(false);
    const [videoScript, setVideoScript] = useState<VideoScript | null>(null);
    
    const [isStrategyLoading, setIsStrategyLoading] = useState(false);
    const [publishingStrategy, setPublishingStrategy] = useState<PublishingStrategy | null>(null);

    const [videoTools, setVideoTools] = useState<VideoTool[] | null>(null);
    const [isLoadingTools, setIsLoadingTools] = useState(false);

    useEffect(() => {
        if (activeTab === 'trends' && !trends && !isFetchingTrends && !trendsError) {
            onFetchTrends();
        }
    }, [activeTab, trends, isFetchingTrends, trendsError, onFetchTrends]);
    
    // Clear sub-content when new post is generated or cleared
    useEffect(() => {
        if (!generatedPost) {
            setVideoScript(null);
            setPublishingStrategy(null);
            setVideoTools(null);
        }
    }, [generatedPost]);

    const handleGenerateClick = () => {
        if (!selectedPlatform) {
            addToast("Please select a social media platform first.", "error");
            return;
        }
        if (!topic.trim()) {
            addToast("Please provide a topic for the post.", "error");
            return;
        }
        onGeneratePost(topic, selectedPlatform);
    };
    
    const handleCopy = (text: string) => {
        if (text) {
            navigator.clipboard.writeText(text);
            setCopySuccess(true);
            addToast(t('contentHub.copySuccess'), 'success');
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };
    
    const handleCopyScript = () => {
        if (!videoScript) return;
        let text = `Title: ${videoScript.title}\n\nHook: ${videoScript.hook}\n\nSCENES:\n`;
        if (videoScript.scenes) {
            videoScript.scenes.forEach((scene, i) => {
                text += `${i+1}. [${scene.timecode}] VISUAL: ${scene.visual}\n   AUDIO: "${scene.voiceover}" (${scene.emotion})\n   SFX: ${scene.audio_cues}\n\n`;
            });
        }
        text += `CTA: ${videoScript.cta}\n\nCaption: ${videoScript.caption}\n\nHashtags: ${(videoScript.hashtags || []).join(' ')}`;
        handleCopy(text);
    };

    const handleAdaptForWebsite = () => {
        if (generatedPost) {
            onAdaptPost(generatedPost.text, generatedPost.platform);
        }
    };
    
    const handleGenerateVideo = async () => {
        if (!generatedPost) return;
        setIsVideoGenerating(true);
        try {
            const script = await generateVideoConcept(topic, generatedPost.platform, language);
            setVideoScript(script);
        } catch (error) {
            console.error(error);
            addToast("Failed to generate video script.", "error");
        } finally {
            setIsVideoGenerating(false);
        }
    };

    const handleFindTools = async () => {
        setIsLoadingTools(true);
        setVideoTools(null);
        try {
            const tools = await findBestVideoTools(language);
            setVideoTools(tools);
        } catch (error) {
            console.error(error);
            addToast("Failed to find video tools.", "error");
        } finally {
            setIsLoadingTools(false);
        }
    }

    const handleGetStrategy = async () => {
        if (!generatedPost) return;
        setIsStrategyLoading(true);
        try {
            const strategy = await getPublishingStrategy(topic, generatedPost.platform, language);
            setPublishingStrategy(strategy);
        } catch (error) {
            console.error(error);
            addToast("Failed to get publishing strategy.", "error");
        } finally {
            setIsStrategyLoading(false);
        }
    }

    const isGenerateDisabled = isGeneratingPost || !selectedPlatform || !topic.trim();
    const searchSuggestions = t('contentHub.userSearchSuggestions');
    const safeSearchSuggestions = Array.isArray(searchSuggestions) ? searchSuggestions : [];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">{t('contentHub.title')}</h1>
                <p className="mt-4 text-lg text-slate-600">{t('contentHub.subtitle')}</p>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
                {/* Left side: Controls */}
                <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-lg space-y-8">
                    {/* Step 1: Platform Selection */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">{t('contentHub.platformSelectorTitle')}</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {(Object.keys(socialIcons) as SocialPlatform[]).map(platform => {
                                const theme = platformThemes[platform];
                                const isSelected = selectedPlatform === platform;
                                return (
                                    <button 
                                        key={platform} 
                                        onClick={() => setSelectedPlatform(platform)} 
                                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${isSelected ? `${theme.bg} ${theme.border}` : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                                    >
                                        <span className={`h-8 w-8 transition-transform duration-200 ${isSelected ? 'scale-110' : 'scale-100'} ${theme.text}`}>
                                            {socialIcons[platform]}
                                        </span>
                                        <span className={`text-xs font-bold capitalize ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>{platform}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 2: Topic Selection */}
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-4">{t('contentHub.topicTitle')}</h2>
                        <div className="flex border-b border-slate-200 mb-4">
                            {(['trends', 'text', 'search'] as ContentSource[]).map(tab => (
                                <button key={tab} onClick={() => {
                                    setActiveTab(tab);
                                    setTopic('');
                                    onClearPost();
                                }} className={`px-4 py-2 text-sm font-semibold transition-colors ${activeTab === tab ? 'border-b-2 border-corp-blue-dark text-corp-blue-dark' : 'text-slate-500 hover:text-slate-900'}`}>
                                    {t(`contentHub.${tab}Tab`)}
                                </button>
                            ))}
                        </div>
                        <div className="min-h-[200px]">
                            {activeTab === 'trends' && (
                                <div className="space-y-4">
                                    {isFetchingTrends && <p className="text-slate-500 text-sm">{t('contentHub.fetchingTrends')}</p>}
                                    {trendsError && <p className="text-red-500 text-sm">{trendsError}</p>}
                                    {trends && trends.length > 0 && trends.map((trend, i) => (
                                        <button key={i} onClick={() => {
                                            setTopic(trend.contentIdea || trend.title);
                                            setActiveTab('text');
                                            addToast("Content idea loaded. You can edit it now.", "info");
                                        }} className={`w-full p-4 rounded-lg text-left transition-all border-l-4 border-l-corp-red border-y border-r border-slate-200 bg-white hover:shadow-md group relative overflow-hidden`}>
                                            <div className="relative z-10">
                                                <h4 className="font-bold text-slate-900 text-base">{trend.title}</h4>
                                                <p className="text-sm text-slate-600 mt-1 leading-snug">{trend.summary}</p>
                                                {trend.contentIdea && (
                                                    <div className="mt-3 p-3 bg-corp-blue/5 rounded border border-corp-blue/10">
                                                        <span className="text-[10px] uppercase font-bold text-corp-blue tracking-wider block mb-1">Content Idea:</span>
                                                        <p className="text-sm text-slate-800 italic">"{trend.contentIdea}"</p>
                                                    </div>
                                                )}
                                                <div className="mt-3 text-right">
                                                    <span className="text-xs font-bold text-corp-blue-dark hover:underline inline-flex items-center gap-1">
                                                        Click to edit & generate &rarr;
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {activeTab === 'text' && (
                                <textarea value={topic} onChange={e => setTopic(e.target.value)} placeholder={t('contentHub.customTextPlaceholder')} rows={6} className="w-full bg-slate-50 border-slate-300 rounded-md p-3 focus:ring-corp-blue-dark focus:border-corp-blue-dark text-slate-800 text-sm" />
                            )}
                             {activeTab === 'search' && (
                                <div className="space-y-3">
                                    <p className="text-sm text-slate-500">{t('contentHub.selectSearchTopic')}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {safeSearchSuggestions.map((suggestion: string, i: number) => (
                                            <button
                                                key={i}
                                                onClick={() => setTopic(suggestion)}
                                                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${topic === suggestion ? 'bg-corp-blue-dark text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                     {/* Step 3: Generate */}
                     <div>
                         {topic && (
                            <div className="p-3 mb-4 bg-slate-50 rounded-md border border-slate-200 border-l-4 border-l-corp-blue-dark">
                                <p className="text-xs text-slate-500 uppercase font-bold">Selected Topic:</p>
                                <p className="text-sm text-slate-800 font-semibold line-clamp-3">{topic}</p>
                            </div>
                         )}
                         <button onClick={handleGenerateClick} disabled={isGenerateDisabled} className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-transparent rounded-md shadow-md text-base font-medium text-white bg-corp-blue-dark hover:bg-corp-blue-dark/90 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                            {isGeneratingPost && <div className="w-5 h-5 border-2 border-dashed rounded-full animate-spin border-white"></div>}
                            <span>{isGeneratingPost ? t('contentHub.generatingPost') : t('contentHub.generateButton')}</span>
                         </button>
                     </div>
                </div>

                 {/* Right side: Results */}
                 <div className="bg-white p-6 sm:p-8 rounded-lg border border-slate-200 shadow-lg min-h-[500px] space-y-6">
                    <h2 className="text-xl font-bold text-slate-900">{t('contentHub.resultsTitle')}</h2>
                    
                    {!generatedPost && !isGeneratingPost && (
                        <div className="h-full flex items-center justify-center text-center text-slate-400">
                            <p>{t('contentHub.placeholder')}</p>
                        </div>
                    )}
                    
                    {(isGeneratingPost && !generatedPost) && (
                         <div className="aspect-square bg-slate-50 rounded-md flex items-center justify-center overflow-hidden border border-slate-200">
                            <div className="flex flex-col items-center text-center text-slate-500 p-4">
                                <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-corp-blue-dark"></div>
                                <span className="text-sm mt-3">Generating content...</span>
                            </div>
                        </div>
                    )}

                    {generatedPost && (
                        <div className="space-y-6 animate-fade-in">
                            {/* Image Display */}
                            <div className="aspect-square bg-slate-50 rounded-md flex items-center justify-center overflow-hidden border border-slate-200">
                                {generatedPost.imageUrl ? (
                                    <img src={generatedPost.imageUrl} alt="Generated for social media post" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center text-center text-slate-500 p-4">
                                        <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-corp-blue-dark"></div>
                                        <span className="text-sm mt-3">Generating image...</span>
                                    </div>
                                )}
                            </div>

                             {/* Text Display & Actions */}
                             <div className="space-y-3">
                                <textarea
                                    readOnly 
                                    value={generatedPost.text || ''}
                                    className="w-full h-40 bg-slate-50 border-slate-300 rounded-md p-3 text-slate-800 text-sm resize-none focus:ring-1 focus:ring-corp-blue-dark"
                                />
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={() => handleCopy(generatedPost.text)} className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors border border-slate-200">
                                        {copySuccess ? t('contentHub.copySuccess') : t('contentHub.copyButton')}
                                    </button>
                                    <button onClick={() => addToast(t('contentHub.connectAccountToPublish'), 'info')} className="flex-1 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition-colors border border-slate-200">
                                        {t('contentHub.publishToPlatformButton').replace('{platform}', generatedPost.platform)}
                                    </button>
                                    <button onClick={handleAdaptForWebsite} disabled={isAdapting} className="flex-1 px-3 py-2 bg-corp-blue hover:bg-corp-blue-light text-white text-xs font-semibold rounded-md transition-colors disabled:bg-slate-400">
                                        {isAdapting ? t('contentHub.adaptingForWebsite') : t('contentHub.adaptForWebsiteButton')}
                                    </button>
                                </div>
                             </div>

                             {/* Strategy Generator */}
                             <div className="pt-4 border-t border-slate-200">
                                {!publishingStrategy ? (
                                    <button
                                        onClick={handleGetStrategy}
                                        disabled={isStrategyLoading}
                                        className="w-full flex justify-center items-center gap-2 px-4 py-3 bg-slate-800 text-white font-semibold rounded-md hover:bg-slate-900 transition-all shadow-sm"
                                    >
                                        {isStrategyLoading ? (
                                            <><div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-white"></div> {t('contentHub.fetchingStrategy')}</>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                </svg>
                                                {t('contentHub.getStrategyButton')}
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 animate-fade-in">
                                        <h3 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-corp-blue" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                                            </svg>
                                            {t('contentHub.strategyTitle')}
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="bg-white p-3 rounded border border-slate-200">
                                                <p className="text-xs font-bold text-slate-500 uppercase">{t('contentHub.bestTime')}</p>
                                                <p className="text-slate-800 font-medium mt-1">{publishingStrategy.bestTime}</p>
                                                <p className="text-xs text-slate-500 mt-1">{publishingStrategy.reasoning}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded border border-slate-200">
                                                <p className="text-xs font-bold text-slate-500 uppercase">Algorithm Tip</p>
                                                <p className="text-slate-800 font-medium mt-1">{publishingStrategy.algorithmTip}</p>
                                            </div>
                                            <div className="bg-white p-3 rounded border border-slate-200">
                                                <p className="text-xs font-bold text-slate-500 uppercase">{t('contentHub.nextPost')}</p>
                                                <p className="text-slate-800 font-medium mt-1">{publishingStrategy.nextPostIdea}</p>
                                                <button onClick={() => {
                                                    onGeneratePost(publishingStrategy.nextPostIdea, generatedPost.platform);
                                                }} className="mt-2 text-xs text-corp-blue-dark hover:underline font-semibold">
                                                    Generate this post &rarr;
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                             </div>
                             
                             {/* Video Generator Section */}
                             <div className="pt-4 border-t border-slate-200 space-y-4">
                                {!videoScript ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <button 
                                            onClick={handleGenerateVideo} 
                                            disabled={isVideoGenerating}
                                            className="flex justify-center items-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-500 to-violet-600 text-white font-semibold rounded-md hover:opacity-90 transition-all shadow-sm"
                                        >
                                            {isVideoGenerating ? (
                                                <><div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-white"></div> {t('contentHub.generatingVideo')}</>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                                    </svg>
                                                    {t('contentHub.generateVideoButton')}
                                                </>
                                            )}
                                        </button>
                                        <button
                                             onClick={handleFindTools}
                                             disabled={isLoadingTools}
                                             className="flex justify-center items-center gap-2 px-4 py-3 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 transition-all shadow-sm"
                                        >
                                             {isLoadingTools ? (
                                                 <><div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-white"></div> {t('contentHub.findingTools')}</>
                                             ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                                    </svg>
                                                    {t('contentHub.findVideoTools')}
                                                </>
                                             )}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="bg-slate-50 rounded-lg border border-slate-200 animate-fade-in overflow-hidden shadow-lg">
                                        <div className="bg-slate-800 text-white p-4 flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold flex items-center gap-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                                    </svg>
                                                    {videoScript.title}
                                                </h3>
                                                <p className="text-sm text-slate-300 mt-1 italic">"{videoScript.hook}"</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button onClick={handleCopyScript} className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white transition-colors border border-white/20">
                                                    Copy Script
                                                </button>
                                                <button onClick={() => handleCopy(JSON.stringify(videoScript, null, 2))} className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white transition-colors border border-white/20">
                                                    Copy JSON
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="p-0 overflow-x-auto">
                                            <table className="min-w-full divide-y divide-slate-200">
                                                <thead className="bg-slate-100">
                                                    <tr>
                                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-16">{t('contentHub.timecode')}</th>
                                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t('contentHub.visual')}</th>
                                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">{t('contentHub.voiceover')}</th>
                                                        <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider w-24">{t('contentHub.emotion')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-slate-200">
                                                    {videoScript.scenes && videoScript.scenes.map((scene, idx) => (
                                                        <tr key={idx} className="hover:bg-slate-50">
                                                            <td className="px-4 py-3 text-xs font-mono text-slate-500 align-top">
                                                                {scene.timecode}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-slate-900 align-top">
                                                                {scene.visual}
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-slate-900 align-top">
                                                                <div className="font-semibold text-corp-blue-dark">"{scene.voiceover}"</div>
                                                                <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                                                                    </svg>
                                                                    {scene.audio_cues}
                                                                </div>
                                                            </td>
                                                            <td className="px-4 py-3 text-sm text-slate-500 align-top">
                                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                    {scene.emotion}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
                                            <div className="flex items-start gap-2">
                                                <span className="text-xs font-bold uppercase text-slate-500 mt-1">Caption:</span>
                                                <p className="text-sm text-slate-700">{videoScript.caption}</p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-xs font-bold uppercase text-slate-500 mt-1">CTA:</span>
                                                <p className="text-sm font-bold text-corp-blue-dark">{videoScript.cta}</p>
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {videoScript.hashtags && videoScript.hashtags.map((tag, i) => (
                                                    <span key={i} className="text-xs text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded">#{tag}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {videoTools && (
                                     <div className="bg-indigo-50 rounded-lg border border-indigo-100 animate-fade-in overflow-hidden shadow-sm mt-4">
                                        <div className="px-4 py-3 bg-indigo-600 text-white font-bold text-sm">
                                            AI Video Tools Comparison
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-indigo-200">
                                                <thead className="bg-indigo-100/50">
                                                    <tr>
                                                        <th className="px-4 py-2 text-left text-xs font-bold text-indigo-800 uppercase">{t('contentHub.toolName')}</th>
                                                        <th className="px-4 py-2 text-left text-xs font-bold text-indigo-800 uppercase">{t('contentHub.toolCost')}</th>
                                                        <th className="px-4 py-2 text-left text-xs font-bold text-indigo-800 uppercase">{t('contentHub.toolFarsi')}</th>
                                                        <th className="px-4 py-2 text-left text-xs font-bold text-indigo-800 uppercase">{t('contentHub.toolFeatures')}</th>
                                                        <th className="px-4 py-2 text-left text-xs font-bold text-indigo-800 uppercase">{t('contentHub.toolQuality')}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-indigo-100">
                                                    {videoTools.map((tool, idx) => (
                                                        <tr key={idx}>
                                                            <td className="px-4 py-2 text-sm font-bold text-slate-800">{tool.name}</td>
                                                            <td className="px-4 py-2 text-sm text-slate-600">{tool.cost}</td>
                                                            <td className="px-4 py-2 text-sm text-slate-600">{tool.farsiSupport}</td>
                                                            <td className="px-4 py-2 text-xs text-slate-500">{tool.features}</td>
                                                            <td className="px-4 py-2 text-sm font-bold text-indigo-600">{tool.qualityRating}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                     </div>
                                )}
                             </div>
                        </div>
                    )}
                    
                    {(isAdapting || adaptedPost) && (
                        <div className="pt-6 border-t-2 border-dashed border-slate-200 space-y-4 animate-fade-in">
                            <h3 className="text-lg font-bold text-slate-900">{t('contentHub.websitePreviewTitle')}</h3>
                            {isAdapting && (
                                <div className="bg-slate-50 p-4 rounded-md border border-slate-200">
                                    <div className="flex items-center justify-center py-10">
                                        <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-corp-blue-dark"></div>
                                        <span className="ml-3 text-slate-500 text-sm">{t('contentHub.adaptingForWebsite')}</span>
                                    </div>
                                </div>
                            )}
                            {adaptedPost && (
                                <div className="bg-slate-50 p-4 sm:p-6 rounded-lg border border-slate-200 space-y-4">
                                    <h4 className="text-2xl font-extrabold text-slate-800 tracking-tight">{adaptedPost.title}</h4>
                                    <div
                                        className="prose prose-sm max-w-none text-slate-700"
                                        dangerouslySetInnerHTML={{ __html: marked.parse(adaptedPost.content) as string }}
                                    />
                                    <div className="pt-4 border-t border-slate-200">
                                        <button onClick={() => addToast(t('contentHub.publishedSuccess'), 'success')} className="w-full flex justify-center items-center gap-2 mt-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 16.571V11.5a1 1 0 012 0v5.071a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                            </svg>
                                            <span>{t('contentHub.publishToWebsiteButton')}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                 </div>
            </div>
        </div>
    );
};

export default ContentHubPage;
