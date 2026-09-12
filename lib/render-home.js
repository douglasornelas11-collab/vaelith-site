const content=require('./content');
const {SITE,esc,navItems,shell}=require('./layout');
const {card,side,image}=require('./cards');

const categoryCopy={
  engenharia:'Estruturas, projetos, materiais e prática técnica.',
  arquitetura:'Projetos, cidades, urbanismo e cultura do projeto.',
  construcao:'Execução, produtividade, métodos e cadeia produtiva.',
  tecnologia:'IA, BIM, automação, dados e Construction Tech.',
  infraestrutura:'Rodovias, ferrovias, pontes, energia e ativos críticos.',
  mercado:'Crédito, investimentos, empresas e indicadores.',
  gestao:'Planejamento, riscos, contratos e entrega de projetos.',
  sustentabilidade:'Carbono, energia, materiais e resiliência.'
};
const adSlot=(label='Publicidade')=>`<div class="ad-slot" aria-label="${label}"><span>${label}</span><strong>Espaço reservado para parceiros VAELITH</strong><a href="/midia-kit">Mídia kit →</a></div>`;

module.exports=function renderHome(){
  const sorted=[...content.articles].sort((a,b)=>b.date.localeCompare(a.date));
  const lead=sorted[0];
  const sides=sorted.slice(1,3);
  const featured=new Set([lead.slug,...sides.map(x=>x.slug)]);
  const latest=sorted.filter(a=>!featured.has(a.slug)).slice(0,4);
  const latestSet=new Set(latest.map(x=>x.slug));
  const rankingItems=sorted.filter(a=>!featured.has(a.slug)&&!latestSet.has(a.slug)).slice(0,5);
  const ranking=rankingItems.map((a,i)=>`<a class="rank-item" href="/noticias/${esc(a.slug)}"><span>${String(i+1).padStart(2,'0')}</span><div><small>${esc(a.category)}</small><strong>${esc(a.title)}</strong></div></a>`).join('');
  const categories=navItems.map(([slug,name],i)=>`<a class="cat-tile" href="/categoria/${slug}"><small>${String(i+1).padStart(2,'0')}</small><h3>${name}</h3><p>${categoryCopy[slug]}</p></a>`).join('');
  const research=sorted.filter(a=>a.contentType==='research').slice(0,3);
  const researchSection=research.length?`<section class="section research-section"><div class="container"><div class="section-head"><div><div class="eyebrow">Pesquisa & Ciência</div><h2>Artigos científicos em destaque</h2><p>Estudos recentes com relevância prática para engenharia, construção, infraestrutura, gestão e tecnologia.</p></div><a class="section-link" href="/artigos-cientificos">Ver todos →</a></div><div class="list-grid">${research.map(card).join('')}</div></div></section>`:'';

  const sections=navItems.map(([slug,name],idx)=>{
    const items=content.articles.filter(a=>a.categorySlug===slug&&a.contentType!=='research').sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
    if(!items.length)return '';
    const [first,...rest]=items;
    const section=`<section class="section ${idx%2?'alt':''}"><div class="container"><div class="section-head"><div><div class="eyebrow">${name}</div><h2>${name}</h2><p>${categoryCopy[slug]}</p></div><a class="section-link" href="/categoria/${slug}">Ver editoria →</a></div><div class="editorial-grid"><div class="editorial-lead">${card(first)}</div><div class="editorial-stack">${rest.map(card).join('')}</div></div></div></section>`;
    return idx===3?`${section}<section class="ad-section"><div class="container">${adSlot()}</div></section>`:section;
  }).join('');

  const events=[...content.events].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5).map(ev=>`<a class="event-row" href="/eventos/${esc(ev.slug)}"><div class="date">${esc(ev.dateDisplay)}</div><div><div class="tag">${esc(ev.category)}</div><h3>${esc(ev.title)}</h3><p>${esc(ev.summary)}</p></div><div class="place">${esc(ev.location)}</div></a>`).join('');

  const body=`<main>
    <section class="hero"><div class="container"><div class="hero-grid"><article class="hero-story"><a href="/noticias/${esc(lead.slug)}">${image(lead,'cover',true)}<div class="tag">${esc(lead.category)} · ${esc(lead.region)}</div><h1>${esc(lead.title)}</h1><p>${esc(lead.dek)}</p><div class="meta"><span>${esc(lead.dateDisplay)}</span></div></a></article><div class="side-stack">${sides.map(side).join('')}</div></div></div></section>
    <section class="section"><div class="container"><div class="section-head"><div><div class="eyebrow">Atualização</div><h2>Últimas notícias</h2><p>Os assuntos mais recentes de engenharia, construção, infraestrutura, tecnologia e mercado.</p></div></div><div class="daily-layout"><div class="daily-cards">${latest.map(card).join('')}</div><aside class="rank-panel"><div class="rank-title"><span>VAELITH</span><strong>Em foco</strong></div>${ranking}</aside></div></div></section>
    ${researchSection}
    <section class="ad-section"><div class="container">${adSlot('Publicidade')}</div></section>
    <section class="section alt"><div class="container"><div class="section-head"><div><div class="eyebrow">Navegação</div><h2>Editorias</h2><p>Encontre rapidamente a área profissional que você acompanha.</p></div></div><div class="category-strip">${categories}</div></div></section>
    ${sections}
    <section class="section" id="agenda"><div class="container"><div class="section-head"><div><div class="eyebrow">Agenda</div><h2>Eventos do setor</h2><p>Feiras, congressos e encontros relevantes para engenharia, construção, arquitetura, gestão e tecnologia.</p></div><a class="section-link" href="/eventos">Agenda completa →</a></div><div class="event-grid"><div class="event-list">${events}</div><aside class="radar"><div class="tag">Radar VAELITH</div><h3>O que merece atenção.</h3><p>Eventos selecionados por relevância para profissionais e empresas do ambiente construído.</p></aside></div></div></section>
  </main>`;

  const ld=JSON.stringify({'@context':'https://schema.org','@graph':[{'@type':'NewsMediaOrganization','@id':`${SITE}/#organization`,name:'VAELITH',url:SITE,description:'Portal de informação para engenharia, arquitetura, construção, infraestrutura, gestão e tecnologia.',email:'labsvaelith@gmail.com'},{'@type':'WebSite','@id':`${SITE}/#website`,url:SITE,name:'VAELITH',publisher:{'@id':`${SITE}/#organization`},potentialAction:{'@type':'SearchAction',target:`${SITE}/buscar?q={search_term_string}`,'query-input':'required name=search_term_string'}}]});
  return shell({title:'VAELITH — Engenharia, Construção e Tecnologia',description:'Notícias e contexto sobre engenharia, arquitetura, construção, infraestrutura, gestão e tecnologia.',canonical:SITE,active:'home',body,jsonLd:ld,ogImage:lead.image});
};
