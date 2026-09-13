const test = require('node:test');
const assert = require('node:assert/strict');
const {resolveImage, usableImage} = require('../lib/image-policy');
const {hasRealImage, card} = require('../lib/cards');
const content = require('../lib/content');
const renderArticle = require('../lib/render-article');

test('reviewed photo overrides an outdated CMS image and its credit', () => {
  const a = resolveImage({slug:'grandes-contratos-construcao-semana', title:'Contratos',
    mainImageUrl:'https://example.com/landscape.jpg', imageCredit:'Wrong credit'});
  assert.match(a.image, /Potomac/);
  assert.match(a.imageCredit, /Tony Webster/);
  assert.match(a.imageCaption, /2024/);
  assert.ok(hasRealImage(a));
});
test('Piraí uses the bridge construction photo, not the institutional notice', () => {
  const a = resolveImage({slug:'br280-lancamento-vigas-ponte-pirai',
    externalImageUrl:'https://example.com/aviso.jpeg'});
  assert.match(a.image, /d7fa158f/);
  assert.match(a.imageAlt, /Guindastes/);
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
