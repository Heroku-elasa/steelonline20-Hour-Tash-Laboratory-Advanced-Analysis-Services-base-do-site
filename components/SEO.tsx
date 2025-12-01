
import React, { useEffect } from 'react';
import { useLanguage } from '../types';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords, image }) => {
    const { language } = useLanguage();

    useEffect(() => {
        // Update Title
        document.title = `${title} | Steel Online 20`;

        // Helper to update meta tags
        const updateMeta = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
            let meta = document.querySelector(`meta[${attr}="${name}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                meta.setAttribute(attr, name);
                document.head.appendChild(meta);
            }
            meta.setAttribute('content', content);
        };

        updateMeta('description', description);
        if (keywords) updateMeta('keywords', keywords);
        
        // Open Graph
        updateMeta('og:title', title, 'property');
        updateMeta('og:description', description, 'property');
        if (image) updateMeta('og:image', image, 'property');
        updateMeta('og:locale', language === 'fa' ? 'fa_IR' : language === 'ar' ? 'ar_SA' : 'en_US', 'property');

    }, [title, description, keywords, image, language]);

    return null;
};

export default SEO;
