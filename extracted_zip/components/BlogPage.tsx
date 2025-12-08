
import React from 'react';
import { useLanguage, Article } from '../types';

interface BlogPageProps {
    articles: Article[];
    onSelectArticle: (article: Article) => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ articles, onSelectArticle }) => {
    const { t, language } = useLanguage();

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 animate-fade-in">
            <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                    {t('blogPage.title')}
                </h1>
                <p className="mt-4 text-lg text-slate-600">{t('blogPage.subtitle')}</p>
            </div>

            <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 gap-12">
                {articles.map(post => (
                    <div key={post.id} className="bg-white border border-slate-200 rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-corp-blue-dark/50 flex flex-col md:flex-row group">
                        <div className="md:w-1/3 overflow-hidden">
                            <button onClick={() => onSelectArticle(post)} className="block w-full h-full">
                                <img src={post.image} alt={post.title[language]} className="w-full h-48 md:h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                            </button>
                        </div>
                        <div className="p-6 md:w-2/3 flex flex-col">
                            <p className="text-xs text-slate-500 mb-2">{post.date[language]}</p>
                            <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-corp-blue-dark transition-colors">
                                <button onClick={() => onSelectArticle(post)}>{post.title[language]}</button>
                            </h2>
                            <p className="text-sm text-slate-600 leading-relaxed flex-grow">{post.excerpt[language]}</p>
                            <div className="mt-4">
                                <button onClick={() => onSelectArticle(post)} className="text-sm font-semibold text-corp-blue-dark hover:underline">
                                    {t('blogPage.readMore')} &rarr;
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlogPage;