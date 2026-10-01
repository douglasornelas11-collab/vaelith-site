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
