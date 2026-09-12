const content=require('./content');
const {SITE,shell,esc}=require('./layout');
const {card,image}=require('./cards');

module.exports=function renderResearch(){
  const papers=content.articles.filter(a=>a.contentType==='research').sort((a,b)=>b.date.localeCompare(a.date));
  const week=papers.slice(0,7);
  const archive=papers.slice(7);
  if(!week.length){
    const body=`<main><section class="page-hero"><div class="container"><div class="eyebrow">Pesquisa & Ciência</div><h1>Artigos científicos</h1><p>A curadoria científica da VAELITH está sendo atualizada.</p></div></section></main>`;
    return shell({title:'Artigos científicos',description:'Pesquisa e ciência para engenharia e construção.',canonical:`${SITE}/artigos-cientificos`,active:'research',body});
  }

  const todayIndex=(Math.floor(Date.now()/86400000)+3)%week.length;
  const day=week[todayIndex];
  const weeklyCards=week.map((p,i)=>`<div class="research-week-item"><div class="research-rank">${String(i+1).padStart(2,'0')}</div>${card(p)}</div>`).join('');
  const archiveHtml=archive.length?`<section class="section alt"><div class="container"><div class="section-head"><div><div class="eyebrow">Acervo científico</div><h2>Pesquisas anteriores</h2><p>Os artigos deixam a seleção semanal, mas permanecem disponíveis para consulta.</p></div></div><div class="list-grid">${archive.map(card).join('')}</div></div></section>`:'';

  const body=`<main>
    <section class="page-hero research-hero"><div class="container"><div class="eyebrow">Pesquisa & Ciência</div><h1>Engenharia baseada em evidências.</h1><p>Sete artigos por semana, selecionados entre pesquisas recentes de engenharia civil, construção, infraestrutura, estruturas, materiais, BIM, gestão, sustentabilidade e tecnologia.</p></div></section>

    <section class="section research-day-section"><div class="container"><div class="section-head"><div><div class="eyebrow">Artigo do dia</div><h2>O estudo que merece atenção hoje</h2><p>Escolhido entre os sete destaques da semana por relevância técnica e aplicação profissional.</p></div></div><article class="research-day"><a class="research-day-image" href="/noticias/${esc(day.slug)}">${image(day,'cover',true)}</a><div class="research-day-copy"><div class="tag">${esc(day.category)} · ${esc(day.region)}</div><h2><a href="/noticias/${esc(day.slug)}">${esc(day.title)}</a></h2><p class="research-day-summary">${esc(day.dek)}</p>${day.technicalTakeaway?`<div class="research-why"><strong>Por que importa</strong><p>${esc(day.technicalTakeaway)}</p></div>`:''}<div class="meta"><span>${esc(day.dateDisplay)}</span></div><a class="section-link" href="/noticias/${esc(day.slug)}">Ler o artigo na VAELITH →</a></div></article></div></section>

    <section class="section alt"><div class="container"><div class="section-head"><div><div class="eyebrow">Seleção semanal</div><h2>Os 7 artigos da semana</h2><p>Cada item traz um resumo do estudo e uma Leitura VAELITH separada com implicações práticas.</p></div></div><div class="research-week-grid">${weeklyCards}</div></div></section>
    ${archiveHtml}
  </main>`;

  const ld=JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name:'Pesquisa & Ciência — VAELITH',description:'Curadoria semanal de sete artigos científicos sobre engenharia, construção civil, infraestrutura, gestão, materiais, BIM e tecnologia.',url:`${SITE}/artigos-cientificos`,isPartOf:{'@type':'WebSite',name:'VAELITH',url:SITE}});
  return shell({title:'Pesquisa & Ciência',description:'Sete artigos científicos por semana sobre engenharia, construção civil, infraestrutura, materiais, gestão, BIM e tecnologia.',canonical:`${SITE}/artigos-cientificos`,active:'research',body,jsonLd:ld,ogImage:day.image});
};
