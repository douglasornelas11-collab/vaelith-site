const overrides = require('./image-overrides.json');
const sourceImages = require('./source-images.json');

function usableImage(value) {
  if (!value || typeof value !== 'string') return '';
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return '';
    if (/(^|\.)(unsplash\.com|pexels\.com|pixabay\.com)$/.test(url.hostname)) return '';
    if (/\.(svg)(?:$|\?)/i.test(url.pathname)) return '';
    return value;
  } catch { return ''; }
}

function resolveImage(article) {
  const override = overrides[article.slug];
  // A reviewed decision wins over CMS images and every emergency data source.
  if (override) return {
    ...article,
    image: override.status === 'approved' ? usableImage(override.url) : '',
    imageAlt: override.alt || article.title,
    imageCaption: override.caption || '',
    imageCredit: override.credit || '',
    imageSourceUrl: override.sourceUrl || '',
    imageLicenseUrl: override.licenseUrl || '',
    imageIsEditorialFallback: false
  };
  const curated = sourceImages[article.slug];
  const direct = usableImage(article.mainImageUrl) || usableImage(article.externalImageUrl);
  const image = direct || usableImage(curated?.url) || usableImage(article.image);
  if (!direct && usableImage(curated?.url)) return {...article, image,
    imageIsEditorialFallback: false, imageAlt: curated.alt || article.title,
    imageCaption: curated.caption || '', imageCredit: curated.credit || '',
    imageSourceUrl: curated.sourceUrl || '', imageLicenseUrl: curated.licenseUrl || ''};
  return {...article, image, imageIsEditorialFallback: false,
    imageAlt: article.imageAlt || article.title,
    imageCaption: image ? (article.imageCaption || '') : '',
    imageCredit: image ? (article.imageCredit || '') : ''};
}
module.exports = {resolveImage, usableImage};
