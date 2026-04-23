/**
 * @param {Object} seoBlock
 * @param {Object} fallback
 * @returns {Object}
 */
export function generateMetadataFromSeoBlock(seoBlock, fallback = {}) {
  if (!seoBlock) {
    return {
      title: fallback.title || "Estro",
      description: fallback.description || "Estro - Art Inside",
    };
  }

  const getImageUrl = (image) => {
    if (!image?.url) return null;

    if (image.url.startsWith("http")) {
      return image.url;
    }

    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL || "";
    return `${strapiUrl}${image.url}`;
  };

  const getBestImageSize = (image) => {
    if (!image) return null;

    if (image.formats?.large) {
      return getImageUrl(image.formats.large);
    }
    if (image.formats?.medium) {
      return getImageUrl(image.formats.medium);
    }
    if (image.formats?.small) {
      return getImageUrl(image.formats.small);
    }
    return getImageUrl(image);
  };

  const metadata = {
    title: seoBlock.Meta_title,
    description: seoBlock.Meta_description,
    openGraph: {
      title: seoBlock.OG_title,
      description: seoBlock.OG_description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seoBlock.OG_title,
      description: seoBlock.OG_description,
    },
  };

  const metaImageUrl = getBestImageSize(seoBlock.metaImage);
  if (metaImageUrl) {
    metadata.metadataBase = new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    );
  }

  const ogImageUrl = getBestImageSize(seoBlock.OG_image);
  if (ogImageUrl) {
    metadata.openGraph.images = [
      {
        url: ogImageUrl,
        width: seoBlock.OG_image?.width || 1200,
        height: seoBlock.OG_image?.height || 630,
        alt: seoBlock.OG_image?.alternativeText || seoBlock.OG_title,
      },
    ];
  }

  const twitterImageUrl = ogImageUrl || metaImageUrl;
  if (twitterImageUrl) {
    metadata.twitter.images = [
      {
        url: twitterImageUrl,
        alt:
          seoBlock.ogImage?.alternativeText ||
          seoBlock.metaImage?.alternativeText ||
          seoBlock.ogTitle,
      },
    ];
  }

  if (seoBlock.ogGif?.url) {
    const ogGifUrl = getImageUrl(seoBlock.ogGif);
    if (ogGifUrl) {
      metadata.openGraph.videos = [
        {
          url: ogGifUrl,
          width: seoBlock.ogGif?.width || 800,
          height: seoBlock.ogGif?.height || 600,
        },
      ];
    }
  }

  return metadata;
}
