
import React, { useState, useEffect, useRef } from 'react';
import { useLanguage, TestSubmissionFormInputs, TestRecommendationResult, PotentialIssue, TestDetailsResult, TestDetailsItem } from '../types';
import { getAutoFilledDetails } from '../services/geminiService';
import { useToast } from './Toast';


interface RecommendationEnginePageProps {
    onGetRecommendation: (inputs: TestSubmissionFormInputs, image: { base64: string, mimeType: string } | null) => void;
    isLoading: boolean;
    result: TestRecommendationResult | null;
    onClearResult: () => void;
    onGetTestDetails: (products: string[]) => void;
    isFetchingTestDetails: boolean;
    testDetails: TestDetailsResult | null;
    onFindDropoffLocation: (primaryAssessment: string) => void;
}

const TestDetailsDisplay: React.FC<{ details: TestDetailsResult }> = ({ details }) => {
    const { t } = useLanguage();

    const InfoCard: React.FC<{ title: string; children: React.ReactNode; }> = ({ title, children }) => (
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 h-full">
            <h5 className="font-semibold text-corp-teal-light mb-2">{title}</h5>
            <div className="text-sm text-slate-300 space-y-1">{children}</div>
        </div>
    );

    return (
        <div className="pt-8 border-t-2 border-dashed border-slate-600">
            <h3 className="text-2xl font-bold text-white text-center mb-6">{t('recommendationEngine.detailedPlanTitle')}</h3>
            <div className="space-y-6">
                {details.map((item: TestDetailsItem) => (
                    <div key={item.testName} className="bg-slate-800 p-5 rounded-lg border border-white/10">
                        <h4 className="text-xl font-bold text-white mb-4">{item.testName}</h4>
                        <div className="mb-4">
                            <InfoCard title={t('recommendationEngine.purpose')}>
                                <p>{item.purpose}</p>
                            </InfoCard>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <InfoCard title={t('recommendationEngine.methodology')}>
                                <p>{item.methodology}</p>
                            </InfoCard>
                            <InfoCard title={t('recommendationEngine.turnaroundTime')}>
                                <p>{item.turnaroundTime}</p>
                            </InfoCard>
                            <InfoCard title={t('recommendationEngine.estimatedCost')}>
                                <p className="font-bold text-lg text-yellow-300">{item.estimatedCost}</p>
                            </InfoCard>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const ResultDisplay: React.FC<{ 
    result: TestRecommendationResult; 
    onClear: () => void;
    onGetTestDetails: (products: string[]) => void;
    isFetchingTestDetails: boolean;
    testDetails: TestDetailsResult | null;
    onFindDropoffLocation: (primaryAssessment: string) => void;
}> = ({ result, onClear, onGetTestDetails, isFetchingTestDetails, testDetails, onFindDropoffLocation }) => {
    const { t } = useLanguage();
    const { addToast } = useToast();

    const getRelevanceClass = (relevance: 'High' | 'Medium' | 'Low') => {
        switch (relevance) {
            case 'High': return 'bg-red-900/50 text-red-300 border-red-500/50';
            case 'Medium': return 'bg-yellow-900/50 text-yellow-300 border-yellow-500/50';
            case 'Low': return 'bg-green-900/50 text-green-300 border-green-500/50';
            default: return 'bg-gray-700 text-gray-300 border-gray-600';
        }
    };

    const handleSavePdf = async () => {
        const element = document.getElementById('recommendation-report-content');
        if (!element) return;
        
        // Dynamic load of html2pdf
        // @ts-ignore
        if (typeof window.html2pdf === 'undefined') {
            addToast("Loading PDF generator...", "info");
            try {
                await new Promise<void>((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
                    script.onload = () => resolve();
                    script.onerror = () => reject(new Error('Failed to load html2pdf'));
                    document.body.appendChild(script);
                });
            } catch (e) {
                addToast("Failed to load PDF library. Check your connection.", "error");
                return;
            }
        }

        const opt = {
          margin: [10, 10, 10, 10], 
          filename: 'Steel_Online_Quote.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#1e293b' }, 
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        addToast("Generating PDF...", "info");
        // @ts-ignore
        window.html2pdf().set(opt).from(element).save().then(() => {
            addToast("PDF saved!", "success");
        }).catch((err: any) => {
            console.error(err);
            addToast("Failed to save PDF.", "error");
        });
    };

    const Section: React.FC<{ title: string; children: React.ReactNode, icon: React.ReactNode }> = ({ title, children, icon }) => (
        <section>
          <div className="flex items-center mb-4">
            <span className="text-corp-teal text-2xl p-2 bg-slate-900/50 rounded-lg mr-4 rtl:ml-4 rtl:mr-0">{icon}</span>
            <h3 className="text-xl font-semibold text-white">{title}</h3>
          </div>
          <div className="pl-14 rtl:pr-14 text-slate-300">{children}</div>
        </section>
    );

    return (
        <div className="animate-fade-in">
            <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{t('recommendationEngine.resultTitle')}</h1>
            </div>
            <div className="bg-slate-800/80 p-6 sm:p-8 rounded-lg mt-12 border border-white/10 max-w-4xl mx-auto space-y-10 shadow-2xl" id="recommendation-report-content">
                <header className="text-center border-b-2 border-dashed border-slate-600 pb-6 mb-6">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-slate-400">{t('recommendationEngine.primaryAssessmentTitle')}</h2>
                    <p className="text-4xl font-extrabold text-corp-teal-light mt-2">{result.primaryAssessment}</p>
                    <p className="text-slate-300 mt-4 max-w-3xl mx-auto">{result.assessmentDescription}</p>
                </header>
                
                <Section title={t('recommendationEngine.potentialConditionsTitle')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                    <div className="space-y-4">
                        {result.potentialIssues?.map((issue, index) => (
                            <div key={index} className="bg-slate-900/50 p-4 rounded-lg border border-white/10">
                                <div className="flex justify-between items-start gap-4">
                                    <h4 className="font-semibold text-white">{issue.name}</h4>
                                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getRelevanceClass(issue.relevance as any)}`}>{issue.relevance}</span>
                                </div>
                                <p className="text-sm text-slate-400 mt-1">{issue.description}</p>
                            </div>
                        ))}
                    </div>
                </Section>

                <Section title={t('recommendationEngine.recommendedProductsTitle')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-12v4m-2-2h4m5 4v4m-2-2h4M17 3v4m-2-2h4M6 3v4m-2-2h4" /></svg>}>
                    <div className="flex flex-wrap gap-3">
                        {result.recommendedTests?.map((test, index) => (
                           <span key={index} className="px-3 py-1.5 bg-corp-teal-dark/50 text-corp-teal-light text-sm font-medium rounded-full border border-corp-teal/30">{test}</span>
                        ))}
                    </div>
                </Section>
                
                <Section title={t('recommendationEngine.managementAdviceTitle')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V5a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15 6.464V14.536L13 15.464V5.536L15 6.464zM4 17a1 1 0 01-1.447-.894l-2-4A1 1 0 011 11V5a1 1 0 011.447-.894l2 4A1 1 0 015 9v6a1 1 0 01-1 1z" /></svg>}>
                    <ul className="list-disc list-inside space-y-2 text-sm">
                        {result.managementAdvice?.map((advice, index) => (
                           <li key={index}>{advice}</li>
                        ))}
                    </ul>
                </Section>

                <Section title={t('recommendationEngine.nextStepsTitle')} icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}>
                    <div className="space-y-4">
                        <p className="text-sm text-slate-400 whitespace-pre-line">{result.nextStepsAndExpertConsultation}</p>
                        <button 
                            data-html2canvas-ignore="true"
                            onClick={() => onFindDropoffLocation(result.primaryAssessment)} 
                            className="w-full sm:w-auto flex items-center justify-center gap-2 py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-corp-teal hover:bg-corp-teal-dark transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span>{t('recommendationEngine.findDropoffLocation')}</span>
                        </button>
                    </div>
                </Section>
                 
                {!testDetails && (
                <div className="pt-6 border-t border-white/10 grid grid-cols-1 gap-4" data-html2canvas-ignore="true">
                     <button onClick={() => onGetTestDetails(result.recommendedTests)} disabled={isFetchingTestDetails} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-corp-red hover:bg-corp-red-dark disabled:bg-slate-500 transition-colors">
                        {isFetchingTestDetails ? (
                            <><div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin"></div> {t('recommendationEngine.gettingPlan')}</>
                        ) : t('recommendationEngine.getTreatmentPlan')}
                     </button>
                </div>
                )}
                
                {isFetchingTestDetails && !testDetails && (
                    <div className="flex items-center justify-center py-6" data-html2canvas-ignore="true">
                        <div className="w-6 h-6 border-2 border-dashed rounded-full animate-spin border-corp-teal"></div>
                        <span className="ml-3 text-slate-400">{t('recommendationEngine.gettingPlan')}</span>
                    </div>
                )}
                
                {testDetails && <TestDetailsDisplay details={testDetails} />}

                <div className="pt-6 border-t border-white/10">
                    <div className="p-4 bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-300 text-sm" role="alert">
                        <h4 className="font-bold">{t('recommendationEngine.disclaimerTitle')}</h4>
                        <p>{result.disclaimer}</p>
                    </div>
                </div>

                <div className="text-center pt-6 flex flex-col sm:flex-row justify-center gap-4" data-html2canvas-ignore="true">
                    <button
                        onClick={handleSavePdf}
                        className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        {t('recommendationEngine.savePdf')}
                    </button>
                    <button
                        onClick={onClear}
                        className="px-8 py-3 bg-slate-600 text-white font-bold rounded-lg hover:bg-slate-700 transition-colors shadow-lg"
                    >
                        {t('recommendationEngine.startNewAnalysis')}
                    </button>
                </div>
            </div>
        </div>
    );
}


const RecommendationEnginePage: React.FC<RecommendationEnginePageProps> = ({ 
    onGetRecommendation, 
    isLoading, 
    result,
    onClearResult,
    onGetTestDetails,
    isFetchingTestDetails,
    testDetails,
    onFindDropoffLocation,
}) => {
    const { t, language } = useLanguage();
    const { addToast } = useToast();
    const [formInputs, setFormInputs] = useState<TestSubmissionFormInputs>({
        sampleType: '', suspectedIssue: '', batchSizeOrigin: '', specificConditions: '',
        controlSampleInfo: '', sampleAge: '', previousTests: '', additives: '',
    });
    const [image, setImage] = useState<{ base64: string, mimeType: string } | null>(null);
    const [autoFillDetails, setAutoFillDetails] = useState(true);
    const [isAutoFilling, setIsAutoFilling] = useState(false);
    const [errors, setErrors] = useState<{suspectedIssue?: string; sampleType?: string}>({});

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormInputs(prev => ({ ...prev, [name]: value }));
        if ((name === 'suspectedIssue' || name === 'sampleType') && errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };
    
    const handleAutoFillOptionalDetails = async () => {
        if (autoFillDetails && formInputs.suspectedIssue.trim().length > 10 && !isAutoFilling) {
            setIsAutoFilling(true);
            try {
                const details = await getAutoFilledDetails(formInputs.suspectedIssue, language);
                setFormInputs(prev => ({
                    ...prev,
                    specificConditions: !prev.specificConditions.trim() && details.specificConditions ? details.specificConditions : prev.specificConditions,
                    controlSampleInfo: !prev.controlSampleInfo.trim() && details.controlSampleInfo ? details.controlSampleInfo : prev.controlSampleInfo,
                    sampleAge: !prev.sampleAge.trim() && details.sampleAge ? details.sampleAge : prev.sampleAge,
                }));
            } catch (error) {
                console.error("Failed to auto-fill details:", error);
                addToast("Could not auto-fill details.", "error");
            } finally {
                setIsAutoFilling(false);
            }
        }
    };

    const handleImageFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64String = (e.target?.result as string).split(',')[1];
            setImage({ base64: base64String, mimeType: file.type });
        };
        reader.readAsDataURL(file);
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) { handleImageFile(e.target.files[0]); }
    };

    const onRemoveImage = () => {
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        if (cameraInputRef.current) cameraInputRef.current.value = "";
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newErrors: {suspectedIssue?: string; sampleType?: string} = {};
        if (!formInputs.suspectedIssue.trim()) {
            newErrors.suspectedIssue = t('validation.required');
        }
        if (!formInputs.sampleType.trim()) {
            newErrors.sampleType = t('validation.required');
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            addToast(t('validation.fillRequiredFields'), "error");
            return;
        }

        setErrors({});
        onGetRecommendation(formInputs, image);
    };
    
    const symptomsSuggestions = t('recommendationEngine.symptomsSuggestions');
    const suggestionPrompts = t('recommendationEngine.suggestionPrompts');
    const animalTypeSuggestions = t('recommendationEngine.animalTypeSuggestions');

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center min-h-[70vh] flex flex-col justify-center">
                <div className="flex items-center justify-center py-10">
                    <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-corp-red"></div>
                    <span className="ml-4 text-slate-600 text-lg">{t('recommendationEngine.generating')}</span>
                </div>
            </div>
        );
    }

    if (result) {
        return (
             <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in bg-slate-900 min-h-screen">
                <ResultDisplay 
                    result={result} 
                    onClear={onClearResult}
                    onGetTestDetails={onGetTestDetails}
                    isFetchingTestDetails={isFetchingTestDetails}
                    testDetails={testDetails}
                    onFindDropoffLocation={onFindDropoffLocation}
                />
             </div>
        );
    }
    
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in bg-slate-50">
            <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">{t('recommendationEngine.title')}</h1>
                <p className="mt-4 text-lg text-slate-600">{t('recommendationEngine.subtitle')}</p>
            </div>
            
            <div className="mt-12 max-w-3xl mx-auto">
                 <div className="bg-white rounded-lg p-8 shadow-xl border border-slate-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Uploader */}
                        <div className="pt-2">
                            <h3 className="text-lg font-semibold text-slate-700 mb-4">{t('recommendationEngine.uploadImageTitle')}</h3>
                            {image ? (
                                <div className="relative group">
                                    <img src={`data:${image.mimeType};base64,${image.base64}`} alt="Project plan" className="rounded-lg w-full max-w-sm mx-auto shadow-lg" />
                                    <button onClick={onRemoveImage} type="button" className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-white hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100" title={t('recommendationEngine.removeImage')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                     <input type="file" accept="image/*" ref={fileInputRef} onChange={onFileChange} className="hidden" />
                                     <input type="file" accept="image/*" capture="user" ref={cameraInputRef} onChange={onFileChange} className="hidden" />
                                     <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 text-slate-700 border border-slate-300 rounded-md hover:bg-slate-200 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                        <span>{t('recommendationEngine.uploadButton')}</span>
                                     </button>
                                     <button type="button" onClick={() => cameraInputRef.current?.click()} className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-slate-100 text-slate-700 border border-slate-300 rounded-md hover:bg-slate-200 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                                        <span>{t('recommendationEngine.cameraButton')}</span>
                                     </button>
                                </div>
                            )}
                        </div>
                        
                        {/* Main Form */}
                        <div className="space-y-6 pt-6 border-t border-slate-200">
                            <h2 className="text-2xl font-bold text-slate-900">{t('recommendationEngine.formTitle')}</h2>
                             <div>
                                <label htmlFor="suspectedIssue" className="block text-sm font-medium text-slate-700">{t('recommendationEngine.symptomsLabel')}</label>
                                <textarea id="suspectedIssue" name="suspectedIssue" rows={4} value={formInputs.suspectedIssue} onChange={handleInputChange} onBlur={handleAutoFillOptionalDetails} className={`mt-1 block w-full bg-slate-50 rounded-md shadow-sm py-2 px-3 sm:text-sm text-slate-900 transition-colors ${errors.suspectedIssue ? 'border-red-500 ring-2 ring-red-500/50 focus:border-red-500' : 'border-slate-300 focus:outline-none focus:ring-corp-red focus:border-corp-red'}`} placeholder={t('recommendationEngine.symptomsPlaceholder')} />
                                {errors.suspectedIssue && <p className="mt-2 text-sm text-red-500">{errors.suspectedIssue}</p>}
                                <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-200">
                                    {Array.isArray(symptomsSuggestions) && symptomsSuggestions.map((suggestion: string) => (
                                        <button key={suggestion} type="button" onClick={() => {
                                            setFormInputs(p => ({...p, suspectedIssue: p.suspectedIssue ? `${p.suspectedIssue.trim().replace(/,$/, '')}, ${suggestion}` : suggestion}));
                                            if (errors.suspectedIssue) setErrors(prev => ({...prev, suspectedIssue: undefined}));
                                        }} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full hover:bg-slate-200 hover:text-slate-900 transition-colors">
                                            + {suggestion}
                                        </button>
                                    ))}
                                </div>
                             </div>
                              <div className="pt-4 border-t border-slate-200">
                                <h4 className="text-xs font-semibold text-slate-500 mb-3">{t('recommendationEngine.suggestionPromptsTitle')}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(suggestionPrompts) && suggestionPrompts.map((prompt: string, index: number) => (
                                    <button key={index} type="button" onClick={() => {
                                        setFormInputs(p => ({...p, suspectedIssue: prompt}));
                                    }} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full hover:bg-slate-200 hover:text-slate-900 transition-colors text-left">
                                        {prompt}
                                    </button>
                                    ))}
                                </div>
                             </div>
                        </div>

                        {/* Details Form */}
                        <div className="space-y-6 pt-6 border-t border-slate-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h3 className="text-lg font-semibold text-slate-700">{t('recommendationEngine.detailsTitle')}</h3>
                                {isAutoFilling && <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-corp-red"></div>}
                            </div>
                            <div className="flex items-center">
                                <input id="autoFill" type="checkbox" checked={autoFillDetails} onChange={(e) => setAutoFillDetails(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-corp-red focus:ring-corp-red" />
                                <label htmlFor="autoFill" className="ml-2 rtl:mr-2 block text-xs text-slate-500">{t('recommendationEngine.autoFillCheckboxLabel')}</label>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                             <div>
                               <label htmlFor="sampleType" className="block text-sm font-medium text-slate-700">{t('recommendationEngine.sampleTypeLabel')}</label>
                               <input type="text" id="sampleType" name="sampleType" list="sampleType-suggestions" value={formInputs.sampleType} onChange={handleInputChange} className={`mt-1 block w-full bg-slate-50 border rounded-md shadow-sm py-2 px-3 sm:text-sm text-slate-900 transition-colors ${errors.sampleType ? 'border-red-500 ring-2 ring-red-500/50 focus:border-red-500' : 'border-slate-300 focus:outline-none focus:ring-corp-red focus:border-corp-red'}`} placeholder={t('recommendationEngine.sampleTypePlaceholder')}/>
                               <datalist id="sampleType-suggestions">
                                {Array.isArray(animalTypeSuggestions) && animalTypeSuggestions.map((s: string) => <option key={s} value={s} />)}
                               </datalist>
                               <div className="flex flex-wrap gap-2 mt-2">
                                    {Array.isArray(animalTypeSuggestions) && animalTypeSuggestions.slice(0, 5).map((suggestion: string) => (
                                        <button key={suggestion} type="button" onClick={() => {
                                            setFormInputs(p => ({...p, sampleType: suggestion}));
                                            if (errors.sampleType) setErrors(prev => ({ ...prev, sampleType: undefined }));
                                        }} className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full hover:bg-slate-200 transition-colors">
                                            {suggestion}
                                        </button>
                                    ))}
                               </div>
                               {errors.sampleType && <p className="mt-1 text-sm text-red-500">{errors.sampleType}</p>}
                             </div>
                             <div>
                                <label htmlFor="batchSizeOrigin" className="block text-sm font-medium text-slate-700">{t('recommendationEngine.batchSizeOriginLabel')}</label>
                                <input type="text" id="batchSizeOrigin" name="batchSizeOrigin" value={formInputs.batchSizeOrigin} onChange={handleInputChange} className="mt-1 block w-full bg-slate-50 border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-corp-red focus:border-corp-red sm:text-sm text-slate-900" placeholder={t('recommendationEngine.batchSizeOriginPlaceholder')}/>
                             </div>
                            <div>
                              <label htmlFor="specificConditions" className="block text-sm font-medium text-slate-700">{t('recommendationEngine.specificConditions')}</label>
                              <input type="text" name="specificConditions" id="specificConditions" value={formInputs.specificConditions} onChange={handleInputChange} disabled={isAutoFilling} className="mt-1 block w-full bg-slate-50 border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-corp-red focus:border-corp-red sm:text-sm text-slate-900 disabled:opacity-50" />
                            </div>
                            <div>
                              <label htmlFor="controlSampleInfo" className="block text-sm font-medium text-slate-700">{t('recommendationEngine.controlSampleInfo')}</label>
                              <input type="text" name="controlSampleInfo" id="controlSampleInfo" value={formInputs.controlSampleInfo} onChange={handleInputChange} disabled={isAutoFilling} className="mt-1 block w-full bg-slate-50 border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-corp-red focus:border-corp-red sm:text-sm text-slate-900 disabled:opacity-50" />
                            </div>
                            <div className="sm:col-span-2">
                              <label htmlFor="sampleAge" className="block text-sm font-medium text-slate-700">{t('recommendationEngine.sampleAge')}</label>
                              <input type="text" name="sampleAge" id="sampleAge" value={formInputs.sampleAge} onChange={handleInputChange} disabled={isAutoFilling} placeholder={t('recommendationEngine.sampleAgePlaceholder')} className="mt-1 block w-full bg-slate-50 border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-corp-red focus:border-corp-red sm:text-sm text-slate-900 disabled:opacity-50" />
                            </div>
                            <div>
                                <label htmlFor="previousTests" className="block text-sm font-medium text-slate-700">{t('recommendationEngine.previousTests')}</label>
                                <input type="text" name="previousTests" id="previousTests" value={formInputs.previousTests} onChange={handleInputChange} disabled={isAutoFilling} className="mt-1 block w-full bg-slate-50 border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-corp-red focus:border-corp-red sm:text-sm text-slate-900 disabled:opacity-50" />
                            </div>
                            <div>
                                <label htmlFor="additives" className="block text-sm font-medium text-slate-700">{t('recommendationEngine.additives')}</label>
                                <input type="text" name="additives" id="additives" value={formInputs.additives} onChange={handleInputChange} disabled={isAutoFilling} className="mt-1 block w-full bg-slate-50 border border-slate-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-corp-red focus:border-corp-red sm:text-sm text-slate-900 disabled:opacity-50" />
                            </div>
                          </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-corp-red hover:bg-corp-red-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 focus:ring-corp-red disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                                {t('recommendationEngine.buttonText')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RecommendationEnginePage;
