
import React, { useEffect } from 'react';
import { useLanguage } from '../types';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description, image }) => {
  const { language } = useLanguage();
  
  useEffect(() => {
    // Basic Title
    const siteTitle = 'استیل آنلاین ۲۰ | Steel Online 20';
    document.title = title ? `${title} | ${siteTitle}` : siteTitle;

    // Update Meta Tags Helper
    const updateMeta = (name: string, content: string | undefined, attr: 'name' | 'property' = 'name') => {
      if (!content) return;
      let element = document.querySelector(`meta[${attr}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', description);
    updateMeta('og:title', title || siteTitle, 'property');
    updateMeta('og:description', description, 'property');
    updateMeta('og:image', image, 'property');
    updateMeta('twitter:title', title || siteTitle);
    updateMeta('twitter:description', description);
    updateMeta('twitter:image', image);

  }, [title, description, image, language]);

  return null;
};

export default SEO;
