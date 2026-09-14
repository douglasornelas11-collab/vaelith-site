const test = require('node:test');
const assert = require('node:assert/strict');
const {resolveImage, resolveArticles, usableImage, approvedReview} = require('../lib/image-policy');
const legacy = require('../lib/image-legacy.json');
const {hasRealImage, card} = require('../lib/cards');
const content = require('../lib/content');
const renderArticle = require('../lib/render-article');

test('reviewed photo overrides an outdated CMS image and its credit', () => {
  const a = resolveImage({slug:'grandes-contratos-construcao-semana', title:legacy['grandes-contratos-construcao-semana'].title,
    mainImageUrl:'https://example.com/landscape.jpg', imageCredit:'Wrong credit'});
  assert.match(a.image, /Potomac/);
  assert.match(a.imageCredit, /Tony Webster/);
  assert.match(a.imageCaption, /2024/);
  assert.ok(hasRealImage(a));
});
test('new CMS articles cannot publish merely by supplying an HTTPS image', () => {
  assert.deepEqual(resolveArticles([{slug:'unreviewed-new-story',title:'New',externalImageUrl:'https://example.org/photo.jpg'}]),[]);
  assert.deepEqual(resolveArticles([{slug:'unreviewed-new-story',title:'New'}]),[]);
});
test('archive remains accessible but changing a frozen image invalidates its use', () => {
  const slug='ponte-rio-ibicui-reabilitacao';
  const article={slug,title:legacy[slug].title,externalImageUrl:legacy[slug].url};
  assert.ok(resolveImage(article).image);
  assert.equal(resolveImage({...article,externalImageUrl:'https://example.org/unrelated.jpg'}).image,'');
  assert.equal(resolveArticles([{...article,externalImageUrl:null}]).length,1);
});
test('a review cannot be reused for another title or without source and rights evidence', () => {
  const review=require('../lib/image-overrides.json')['grandes-contratos-construcao-semana'];
  assert.equal(approvedReview(review,{title:review.title}),true);
  assert.equal(approvedReview(review,{title:'Unrelated news'}),false);
  assert.equal(approvedReview({...review,licenseUrl:''},{title:review.title}),false);
  assert.equal(approvedReview({...review,reviewedAt:''},{title:review.title}),false);
});
test('institutional banners are rejected even when provided by the CMS', () => {
  for(const slug of ['corredor-ferroviario-minas-rio-leilao','ponte-estreito-mosquitos-reconstrucao'])
    assert.equal(resolveImage({slug,title:legacy[slug].title,externalImageUrl:legacy[slug].url}).image,'');
});
test('Piraí never displays the institutional notice as a bridge photograph', () => {
  const a = resolveImage({slug:'br280-lancamento-vigas-ponte-pirai',
    externalImageUrl:'https://example.com/aviso.jpeg'});
  assert.equal(a.image, '');
  assert.equal(a.imageCaption, '');
});
test('stock, SVG and fabricated data covers cannot pass the shared policy', () => {
  for (const url of ['https://images.unsplash.com/photo-1','https://pexels.com/a.jpg',
    'data:image/svg+xml,test','http://example.com/a.jpg','https://example.com/a.svg']) {
    assert.equal(usableImage(url),'');
    assert.equal(resolveImage({slug:'test',image:url}).image,'');
  }
});
test('emergency articles use the same image rules', () => {
  assert.ok(content.articles.every(a=>!a.image||usableImage(a.image)));
  const a=content.articles.find(a=>a.slug==='grandes-contratos-construcao-semana');
  assert.match(a.image,/Potomac/);
  assert.match(card(a),/Potomac/);
  assert.match(renderArticle(a.slug),/Tony Webster/);
  assert.doesNotMatch(renderArticle(a.slug),/Two_Medicine|d-JYiVnr8/);
});
test('an article with no usable photo does not expose a generated cover or social image', () => {
  const a={slug:'test-missing-image',title:'Test',category:'Engenharia',categorySlug:'engenharia',
    date:'2026-09-13',body:['Test'],image:'data:image/svg+xml,invalid',imageIsEditorialFallback:true};
  content.articles.push(a);
  try {
    const html=renderArticle(a.slug);
    assert.doesNotMatch(html, /article-hero|property="og:image"|data:image\/svg/);
  } finally {content.articles.pop();}
});
