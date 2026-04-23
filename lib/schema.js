export const generateWebPageSchema = (data) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: data?.Title || '',
    description: data?.description || '',
    url: data?.url || '',
    dateModified: data?.lastUpdated || '',
    publisher: {
      '@type': 'Organization',
      name: 'Blueprint',
      logo: {
        '@type': 'ImageObject',
        url: ''
      }
    },
  };
};