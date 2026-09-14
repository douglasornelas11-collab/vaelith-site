const overrides = require('./image-overrides.json');
const sourceImages = require('./source-images.json');
const legacy = require('./image-legacy.json');

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

function approvedReview(review, article) {
  return Boolean(review?.status === 'approved' && review.title === article.title &&
    usableImage(review.url) && review.alt && review.caption && review.credit &&
    review.sourceUrl && review.licenseUrl && review.reason &&
    Number.isFinite(Date.parse(review.reviewedAt)));
}

function resolveImage(article) {
  const override = overrides[article.slug];
  // A reviewed decision wins over CMS images and every emergency data source.
  if (override) return {
    ...article,
    image: approvedReview(override, article) ? usableImage(override.url) : '',
    imageAlt: override.alt || article.title,
    imageCaption: override.caption || '',
    imageCredit: override.credit || '',
    imageSourceUrl: override.sourceUrl || '',
    imageLicenseUrl: override.licenseUrl || '',
    imageIsEditorialFallback: false,
    imageReviewStatus: approvedReview(override, article) ? 'approved' : 'rejected'
  };
  const curated = sourceImages[article.slug];
  const direct = usableImage(article.mainImageUrl) || usableImage(article.externalImageUrl);
  const candidate = direct || usableImage(curated?.url) || usableImage(article.image);
  // Existing archive entries are frozen, not silently marked as reviewed.
  // Any new article or changed image needs an explicit reviewed manifest entry.
  const previous = legacy[article.slug];
  const image = previous && previous.title === article.title && previous.url === candidate ? candidate : '';
  if (!direct && image && usableImage(curated?.url)) return {...article, image,
    imageIsEditorialFallback: false, imageAlt: curated.alt || article.title,
    imageCaption: curated.caption || '', imageCredit: curated.credit || '',
    imageSourceUrl: curated.sourceUrl || '', imageLicenseUrl: curated.licenseUrl || ''};
  return {...article, image, imageIsEditorialFallback: false, imageReviewStatus: image ? 'legacy-pending-review' : 'pending',
    imageAlt: article.imageAlt || article.title,
    imageCaption: image ? (article.imageCaption || '') : '',
    imageCredit: image ? (article.imageCredit || '') : ''};
}
function resolveArticles(articles) {
  const seen = new Set();
  return articles.map(resolveImage).map(article => {
    if (!article.image) return article;
    const url = new URL(article.image); url.hash = ''; url.search = '';
    if (seen.has(url.href)) return {...article, image: '', imageReviewStatus: 'duplicate'};
    seen.add(url.href);
    return article;
  }).filter(article => Object.hasOwn(legacy, article.slug) ||
    (article.image && article.imageReviewStatus === 'approved'));
}
module.exports = {resolveImage, resolveArticles, usableImage, approvedReview};
