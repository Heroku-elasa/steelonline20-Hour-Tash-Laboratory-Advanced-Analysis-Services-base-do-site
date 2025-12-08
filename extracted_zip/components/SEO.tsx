
import React, { useEffect } from 'react';
import { useLanguage } from '../types';

interface SEOProps {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    canonicalUrl?: string;
    noIndex?: boolean;
}

const SEO: React.FC<SEOProps> = ({ title, description, keywords, image, canonicalUrl, noIndex = false }) => {
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

        const updateLink = (rel: string, href: string) => {
            let link = document.querySelector(`link[rel="${rel}"]`);
            if (!link) {
                link = document.createElement('link');
                link.setAttribute('rel', rel);
                document.head.appendChild(link);
            }
            link.setAttribute('href', href);
        };

        updateMeta('description', description);
        if (keywords) updateMeta('keywords', keywords);
        if (noIndex) {
            updateMeta('robots', 'noindex, nofollow');
        } else {
             updateMeta('robots', 'index, follow');
        }

        // Open Graph
        updateMeta('og:title', title, 'property');
        updateMeta('og:description', description, 'property');
        if (image) updateMeta('og:image', image, 'property');
        updateMeta('og:locale', language === 'fa' ? 'fa_IR' : language === 'ar' ? 'ar_SA' : 'en_US', 'property');
        updateMeta('og:site_name', 'Steel Online 20', 'property');

        // Twitter Card
        updateMeta('twitter:card', 'summary_large_image');
        updateMeta('twitter:title', title);
        updateMeta('twitter:description', description);
        if (image) updateMeta('twitter:image', image);

        // Canonical
        const currentUrl = window.location.href;
        updateLink('canonical', canonicalUrl || currentUrl);

    }, [title, description, keywords, image, language, canonicalUrl, noIndex]);

    return null;
};

export default SEO;
