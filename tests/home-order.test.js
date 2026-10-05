const test=require('node:test');
const assert=require('node:assert/strict');
const content=require('../lib/content');
const renderHome=require('../lib/render-home');
const {category}=require('../lib/render-pages');

test('general news leads the home and appears in latest news even beside newer research',()=>{
  const news={slug:'regression-general',title:'Pauta geral de teste',dek:'Notícia geral',category:'Mercado',categorySlug:'mercado',region:'Brasil',date:'2026-10-01',dateDisplay:'01 out 2026',contentType:'news',image:'https://example.org/news.jpg'};
  const research={...news,slug:'regression-research',title:'Estudo de teste',category:'Tecnologia',categorySlug:'tecnologia',contentType:'research',date:'2026-10-02',dateDisplay:'02 out 2026',image:'https://example.org/research.png'};
  content.articles.push(news,research);
  try{
    const home=renderHome();
    const lead=home.match(/<article class="hero-story[^>]*><a href="([^"]+)"/);
    assert.ok(lead);
    assert.equal(lead[1],'/noticias/regression-general');
    const latest=home.split('<h2>Últimas notícias</h2>')[1].split('<section class="section alt" id="news-radar"')[0];
    assert.match(latest,/noticias\/regression-general/);
    assert.doesNotMatch(latest,/noticias\/regression-research/);
    assert.doesNotMatch(category('tecnologia'),/noticias\/regression-research/);
  }finally{
    content.articles.pop();content.articles.pop();
  }
});

test('an applied journal study in Architecture stays in the editoria but does not displace general news lead',()=>{
  const news={slug:'regression-general-2030',title:'Pauta geral de teste 2030',dek:'Notícia geral',category:'Mercado',categorySlug:'mercado',region:'Brasil',date:'2030-01-01',dateDisplay:'01 jan 2030',contentType:'news',image:'https://example.org/news.jpg',sourceUrl:'https://www.gov.br/fato'};
  const study={...news,slug:'regression-study-2030',title:'Estudo arquitetônico 2030',category:'Arquitetura',categorySlug:'arquitetura',date:'2030-01-02',dateDisplay:'02 jan 2030',image:'https://example.org/study.webp',sourceUrl:'https://www.frontiersin.org/journals/built-environment/articles/test/full'};
  content.articles.push(news,study);
  try{
    const home=renderHome();
    const lead=home.match(/<article class="hero-story[^>]*><a href="([^"]+)"/);
    assert.equal(lead[1],'/noticias/regression-general-2030');
    assert.match(category('arquitetura'),/noticias\/regression-study-2030/);
  }finally{
    content.articles.pop();content.articles.pop();
  }
});
