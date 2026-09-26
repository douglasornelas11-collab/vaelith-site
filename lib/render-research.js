// VAELITH Pesquisa & Ciência — ranking editorial técnico
const content=require('./content');
const {SITE,shell,esc}=require('./layout');
const {image}=require('./cards');

function scorePaper(p){
  let score=55;
  const now=Date.now();
  const ts=new Date(p.publishedAt||p.date||0).getTime();
  const ageDays=Number.isFinite(ts)?Math.max(0,(now-ts)/86400000):999;
  // Atualidade precisa desempatar o Artigo do Dia: estudos publicados nas
  // últimas 24 horas recebem prioridade sobre o restante da seleção semanal.
  if(ageDays<=1)score+=25;else if(ageDays<=7)score+=15;else if(ageDays<=30)score+=10;else if(ageDays<=90)score+=5;
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
function hasVerifiedImage(p){
  const src=String(p&&p.image||'').trim();
  if(!src||p.imageIsEditorialFallback||src.startsWith('data:'))return false;
  if(/unsplash\.com|pexels\.com|pixabay\.com|commons\.wikimedia\.org/i.test(src))return false;
  return /^https:\/\//i.test(src);
}

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

function rankedPaper(p,position){
  return `<article class="research-ranked-item">
    <div class="research-rank-block"><div class="research-rank-no">${String(position).padStart(2,'0')}</div><div class="research-score">${p.researchScore}/100</div></div>
    <a class="research-ranked-image" href="/noticias/${esc(p.slug)}">${image(p,'research-thumb')}</a>
    <div class="research-ranked-copy"><div class="tag">${esc(p.category)} · ${esc(p.region)}</div><h3><a href="/noticias/${esc(p.slug)}">${esc(p.title)}</a></h3><p>${esc(p.dek)}</p><div class="research-ranked-meta"><span>Importância: ${level(p.researchScore)}</span><span>${esc(p.dateDisplay)}</span></div></div>
  </article>`;
}

module.exports=function renderResearch(){
  const papers=content.articles.filter(a=>a.contentType==='research').map(p=>({...p,researchScore:scorePaper(p)})).sort((a,b)=>b.researchScore-a.researchScore||b.date.localeCompare(a.date));

  // Regra editorial premium: só entram no ranking matérias com imagem real, diretamente
  // relacionada e não reutilizada. Placeholders, bancos genéricos e fallbacks ficam fora.
  const seenImages=new Set();
  const eligible=papers.filter(p=>{
    if(!hasVerifiedImage(p))return false;
    const key=String(p.image).trim();
    if(seenImages.has(key))return false;
    seenImages.add(key);
    return true;
  });
  const week=eligible.slice(0,7);
  const weekIds=new Set(week.map(p=>p.slug));
  const archive=papers.filter(p=>!weekIds.has(p.slug));
  if(!week.length){
    const body=`<main><section class="page-hero"><div class="container"><div class="eyebrow">Pesquisa & Ciência</div><h1>Artigos científicos</h1><p>A curadoria científica da VAELITH está sendo atualizada. Nenhum estudo entra no ranking sem imagem original ou oficial validada.</p></div></section></main>`;
    return shell({title:'Artigos científicos',description:'Pesquisa e ciência para engenharia e construção.',canonical:`${SITE}/artigos-cientificos`,active:'research',body});
  }

  const day=week[0];
  const weeklyCards=week.slice(1).map((p,i)=>rankedPaper(p,i+2)).join('');
  const rankingTitle=week.length===7?'Top 7 artigos científicos':'Seleção científica validada';
  const rankingText=week.length===7?'Posições 02 a 07 da seleção atual.':`Há ${week.length} estudo${week.length===1?'':'s'} com imagem original ou oficial validada. Novos itens só entram após verificação de fonte, licença e imagem.`;
  const archiveHtml=archive.length?`<section class="section alt"><div class="container"><div class="section-head"><div><div class="eyebrow">Acervo científico</div><h2>Pesquisas anteriores</h2><p>Os artigos que não estão na seleção validada continuam disponíveis para consulta.</p></div></div><div class="research-archive-list">${archive.map(p=>`<a class="research-archive-row" href="/noticias/${esc(p.slug)}"><div class="research-archive-date">${esc(p.dateDisplay)}</div><div class="research-archive-title">${esc(p.title)}</div><div class="research-archive-score">${scorePaper(p)}/100</div></a>`).join('')}</div></div></section>`:'';

  const body=`<main>
    <section class="page-hero research-hero"><div class="container"><div class="eyebrow">Pesquisa & Ciência</div><h1>Engenharia baseada em evidências.</h1><p>Curadoria semanal de estudos relevantes para engenharia, construção, infraestrutura, materiais, gestão e tecnologia.</p></div></section>

    <section class="section research-day-section"><div class="container"><div class="section-head"><div><div class="eyebrow">Artigo do dia</div><h2>#1 do ranking científico</h2></div></div>${featuredPaper(day)}</div></section>

    <section class="section alt"><div class="container"><div class="section-head"><div><div class="eyebrow">Ranking semanal</div><h2>${rankingTitle}</h2><p>${rankingText}</p></div></div><div class="research-ranked-list">${weeklyCards}</div></div></section>
    ${archiveHtml}
  </main>`;

  const ld=JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name:'Pesquisa & Ciência — VAELITH',description:'Ranking e curadoria semanal de artigos científicos sobre engenharia, construção civil, infraestrutura, gestão, materiais, BIM e tecnologia.',url:`${SITE}/artigos-cientificos`,isPartOf:{'@type':'WebSite',name:'VAELITH',url:SITE}});
  return shell({title:'Pesquisa & Ciência',description:'Ranking de artigos científicos sobre engenharia, construção civil, infraestrutura, materiais, gestão, BIM e tecnologia.',canonical:`${SITE}/artigos-cientificos`,active:'research',body,jsonLd:ld,ogImage:day.image});
};
