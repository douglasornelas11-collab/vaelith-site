// VAELITH Pesquisa & Ciência — ranking editorial técnico
const content=require('./content');
const {SITE,shell,esc}=require('./layout');
const {image}=require('./cards');

function scorePaper(p){
  let score=55;
  const now=Date.now();
  const ts=new Date(p.publishedAt||p.date||0).getTime();
  const ageDays=Number.isFinite(ts)?Math.max(0,(now-ts)/86400000):999;
  if(ageDays<=7)score+=15;else if(ageDays<=30)score+=10;else if(ageDays<=90)score+=5;
  if(p.sourceUrl&&/doi\.org|sciencedirect|springer|wiley|asce|tandfonline|mdpi|nature|elsevier/i.test(p.sourceUrl))score+=9;
  if(p.sourceName)score+=4;
  if(p.technicalTakeaway)score+=6;
  const bodySize=(p.body||[]).join(' ').length;
  score+=Math.min(8,Math.floor(bodySize/600));
  if(/concret|estrutur|bridge|ponte|geotec|bim|construction|constru|infraestrut|material|sustent|carbon|inteligência artificial|\bia\b/i.test(`${p.title||''} ${p.dek||''}`))score+=5;
  const popularity=Number(p.views||p.searches||p.popularity||0);
  if(popularity>0)score+=Math.min(8,Math.log10(popularity+1)*2.2);
  return Math.max(0,Math.min(100,Math.round(score)));
}
function level(score){if(score>=90)return 'Muito alta';if(score>=84)return 'Alta';if(score>=76)return 'Relevante';return 'Em observação';}

function featuredPaper(p){
  return `<article class="research-feature">
    <a class="research-feature-media" href="/noticias/${esc(p.slug)}">${image(p,'research-feature-image',true)}</a>
    <div class="research-feature-copy">
      <div class="tag">${esc(p.category)} · ${esc(p.region)}</div>
      <h2><a href="/noticias/${esc(p.slug)}">${esc(p.title)}</a></h2>
      <p class="research-feature-dek">${esc(p.dek)}</p>
      ${p.technicalTakeaway?`<div class="research-why"><strong>Por que importa</strong><p>${esc(p.technicalTakeaway)}</p></div>`:''}
      <div class="research-feature-meta"><span>Importância: ${level(p.researchScore)}</span><span>${esc(p.dateDisplay)}</span><span class="research-feature-score">${p.researchScore}/100</span></div>
    </div>
  </article>`;
}

function rankedPaper(p,i){
  return `<article class="research-ranked-item">
    <div class="research-rank-block"><div class="research-rank-no">${String(i+1).padStart(2,'0')}</div><div class="research-score">${p.researchScore}/100</div></div>
    <a class="research-ranked-image" href="/noticias/${esc(p.slug)}">${image(p,'research-thumb')}</a>
    <div class="research-ranked-copy"><div class="tag">${esc(p.category)} · ${esc(p.region)}</div><h3><a href="/noticias/${esc(p.slug)}">${esc(p.title)}</a></h3><p>${esc(p.dek)}</p><div class="research-ranked-meta"><span>Importância: ${level(p.researchScore)}</span><span>${esc(p.dateDisplay)}</span></div></div>
  </article>`;
}

module.exports=function renderResearch(){
  const papers=content.articles.filter(a=>a.contentType==='research').map(p=>({...p,researchScore:scorePaper(p)})).sort((a,b)=>b.researchScore-a.researchScore||b.date.localeCompare(a.date));
  const week=papers.slice(0,7);
  const archive=papers.slice(7);
  if(!week.length){
    const body=`<main><section class="page-hero"><div class="container"><div class="eyebrow">Pesquisa & Ciência</div><h1>Artigos científicos</h1><p>A curadoria científica da VAELITH está sendo atualizada.</p></div></section></main>`;
    return shell({title:'Artigos científicos',description:'Pesquisa e ciência para engenharia e construção.',canonical:`${SITE}/artigos-cientificos`,active:'research',body});
  }

  const day=week[0];
  const weeklyCards=week.map((p,i)=>rankedPaper(p,i)).join('');
  const archiveHtml=archive.length?`<section class="section alt"><div class="container"><div class="section-head"><div><div class="eyebrow">Acervo científico</div><h2>Pesquisas anteriores</h2><p>Os artigos deixam o Top 7, mas permanecem disponíveis para consulta.</p></div></div><div class="research-archive-list">${archive.map(p=>`<a class="research-archive-row" href="/noticias/${esc(p.slug)}"><div class="research-archive-date">${esc(p.dateDisplay)}</div><div class="research-archive-title">${esc(p.title)}</div><div class="research-archive-score">${scorePaper(p)}/100</div></a>`).join('')}</div></div></section>`:'';

  const body=`<main>
    <section class="page-hero research-hero"><div class="container"><div class="eyebrow">Pesquisa & Ciência</div><h1>Engenharia baseada em evidências.</h1><p>Sete artigos em destaque, ranqueados por relevância técnica, aplicabilidade profissional, qualidade da fonte, profundidade do estudo e atualidade.</p></div></section>

    <section class="section research-day-section"><div class="container"><div class="section-head"><div><div class="eyebrow">Artigo do dia</div><h2>#1 do ranking científico</h2><p>O estudo de maior relevância técnica da seleção atual.</p></div></div>${featuredPaper(day)}</div></section>

    <section class="section alt"><div class="container"><div class="section-head"><div><div class="eyebrow">Ranking semanal</div><h2>Top 7 artigos científicos</h2><p>Ordem determinada por relevância técnica, aplicabilidade, qualidade da publicação, profundidade e atualidade. Métricas de audiência entram no cálculo quando houver dados confiáveis.</p></div></div><div class="research-ranked-list">${weeklyCards}</div></div></section>
    ${archiveHtml}
  </main>`;

  const ld=JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name:'Pesquisa & Ciência — VAELITH',description:'Ranking e curadoria semanal de sete artigos científicos sobre engenharia, construção civil, infraestrutura, gestão, materiais, BIM e tecnologia.',url:`${SITE}/artigos-cientificos`,isPartOf:{'@type':'WebSite',name:'VAELITH',url:SITE}});
  return shell({title:'Pesquisa & Ciência',description:'Ranking de artigos científicos sobre engenharia, construção civil, infraestrutura, materiais, gestão, BIM e tecnologia.',canonical:`${SITE}/artigos-cientificos`,active:'research',body,jsonLd:ld,ogImage:day.image});
};
