import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
}) => {
  const defaultTitle = 'Wanofi Design — Premium Ethiopian Traditional Clothing';
  const defaultDescription = 'Wanofi Design offers premium Ethiopian traditional clothing, handwoven Habesha Kemis, custom couture, and cultural heritage garments.';
  const defaultImage = 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80';
  const defaultKeywords = 'Ethiopian traditional clothing, Habesha Kemis, Ethiopian culture, Wanofi Design, handwoven dresses, African fashion, Tilet, custom couture';

  const seoTitle = title ? `${title} | Wanofi Design` : defaultTitle;
  const seoDescription = description || defaultDescription;
  const seoImage = image || defaultImage;
  const seoKeywords = keywords || defaultKeywords;
  
  return (
    <Helmet>
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      {url && <meta name="twitter:url" content={url} />}
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
    </Helmet>
  );
};
