
import React from 'react';
import { Article, Page, useLanguage } from '../types';
import { marked } from 'marked';
import SEO from './SEO';

interface ArticlePageProps {
    article: Article;
    setPage: (page: Page) => void;
}

const ArticlePage: React.FC<ArticlePageProps> = ({ article, setPage }) => {
    const { t, dir, language } = useLanguage();
    const contentHtml = marked.parse(article.content[language]) as string;

    return (
        <div className="bg-white animate-fade-in">
            <SEO 
                title={article.title[language]} 
                description={article.excerpt[language]}
                image={article.image}
            />
            <div className="relative py-16 sm:py-24">
                <div className="absolute inset-0">
                    <img className="w-full h-full object-cover" src={article.image} alt={article.title[language]} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>
                </div>
                <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm font-semibold text-slate-300 uppercase tracking-wider">{article.category[language]}</p>
                    <h1 className="mt-2 text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{article.title[language]}</h1>
                    <div className="mt-6 text-slate-300 flex items-center justify-center gap-4 text-sm">
                        <span>{article.author}</span>
                        <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                        <span>{article.date[language]}</span>
                    </div>
                </div>
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-3xl mx-auto">
                    <button onClick={() => setPage('blog')} className="mb-8 flex items-center gap-2 text-sm font-semibold text-corp-blue-dark hover:underline">
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${dir === 'rtl' ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        {t('articlePage.backToBlog')}
                    </button>
                    <div
                        className={`prose max-w-none ${dir === 'rtl' ? 'prose-rtl' : ''}`}
                        dangerouslySetInnerHTML={{ __html: contentHtml }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ArticlePage;
