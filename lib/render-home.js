const content=require('./content');
const {SITE,esc,navItems,shell}=require('./layout');
const {card,side}=require('./cards');

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

module.exports=function renderHome(){
  const sorted=[...content.articles].sort((a,b)=>b.date.localeCompare(a.date));
  const lead=sorted.find(a=>a.slug==='data-centers-resiliencia-emirados')||sorted[0];
  const sides=sorted.filter(a=>a.slug!==lead.slug).slice(0,2);
  const used=new Set([lead.slug,...sides.map(x=>x.slug)]);
  const latest=sorted.filter(a=>!used.has(a.slug)).slice(0,6);
  const essentials=sorted.filter(a=>!used.has(a.slug)).slice(0,5);

  const rail=sorted.slice(0,6).map(a=>`<a class="news-rail-item" href="/noticias/${esc(a.slug)}"><span>${esc(a.category)}</span><strong>${esc(a.title)}</strong><small>${esc(a.dateDisplay)}</small></a>`).join('');

  const ranking=essentials.map((a,i)=>`<a class="rank-item" href="/noticias/${esc(a.slug)}"><span>${String(i+1).padStart(2,'0')}</span><div><small>${esc(a.category)} · ${esc(a.region)}</small><strong>${esc(a.title)}</strong></div></a>`).join('');

  const categories=navItems.map(([slug,name],i)=>`<a class="cat-tile" href="/categoria/${slug}"><small>${String(i+1).padStart(2,'0')}</small><h3>${name}</h3><p>${categoryCopy[slug]}</p></a>`).join('');

  const sections=navItems.map(([slug,name])=>{
    const items=content.articles.filter(a=>a.categorySlug===slug).sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3);
    if(!items.length)return '';
    const [first,...rest]=items;
    return `<section class="section editorial-section ${['arquitetura','tecnologia','mercado','sustentabilidade'].includes(slug)?'alt':''}"><div class="container"><div class="section-head"><div><div class="kicker">Editoria</div><h2>${name}</h2></div><p>${categoryCopy[slug]}</p><a class="section-link" href="/categoria/${slug}">Ver editoria →</a></div><div class="editorial-grid"><div class="editorial-lead">${card(first)}</div><div class="editorial-stack">${rest.map(card).join('')}</div></div></div></section>`;
  }).join('');

  const events=[...content.events].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5).map(ev=>`<a class="event-row" href="/eventos/${esc(ev.slug)}"><div class="date">${esc(ev.dateDisplay)}</div><div><div class="tag">${esc(ev.category)}</div><h3>${esc(ev.title)}</h3><p>${esc(ev.summary)}</p></div><div class="place">${esc(ev.location)}</div></a>`).join('');

  const body=`<main>
    <section class="hero premium-hero"><div class="container"><div class="edition-line"><span class="kicker">VAELITH · EDIÇÃO DO DIA</span><span>Engenharia · Construção · Tecnologia</span></div><div class="hero-grid"><article class="hero-story"><a href="/noticias/${lead.slug}"><div class="cover" style="background-image:url('${esc(lead.image)}')"></div><div class="tag">${esc(lead.category)} · ${esc(lead.region)}</div><h1>${esc(lead.title)}</h1><p>${esc(lead.dek)}</p><div class="meta"><span>${esc(lead.dateDisplay)}</span><span>Fonte: <b>${esc(lead.sourceName)}</b></span></div></a></article><div class="side-stack">${sides.map(side).join('')}</div></div></div></section>

    <section class="news-rail" aria-label="Últimas notícias"><div class="container"><div class="news-rail-label">AGORA</div><div class="news-rail-track">${rail}</div></div></section>

    <section class="section daily-section"><div class="container"><div class="section-head"><div><div class="kicker">Seleção editorial</div><h2>Leitura essencial</h2></div><p>Os movimentos que ajudam profissionais a entender o que está mudando no ambiente construído.</p></div><div class="daily-layout"><div class="daily-cards">${latest.slice(0,4).map(card).join('')}</div><aside class="rank-panel"><div class="rank-title"><span>VAELITH</span><strong>Em foco</strong></div>${ranking}</aside></div></div></section>

    <section class="section alt"><div class="container"><div class="section-head"><div><div class="kicker">Navegação</div><h2>Editorias</h2></div><p>Conteúdo organizado por especialidade para leitura rápida, contexto técnico e descoberta de novos temas.</p></div><div class="category-strip">${categories}</div></div></section>

    ${sections}

    <section class="section" id="agenda"><div class="container"><div class="section-head"><div><div class="kicker">Brasil & Mundo</div><h2>VAELITH Agenda</h2></div><p>Feiras, congressos e conferências de engenharia, construção, arquitetura, BIM, gestão e tecnologia.</p><a class="section-link" href="/eventos">Agenda completa →</a></div><div class="event-grid"><div class="event-list">${events}</div><aside class="radar"><div class="tag">Radar VAELITH</div><h3>Antes. Durante. Depois.</h3><p>O portal acompanha os eventos antes da abertura, destaca anúncios relevantes e registra os movimentos que podem mudar a prática profissional.</p><div class="radar-list"><div>Fontes oficiais</div><div>Brasil e exterior</div><div>Tecnologia e construção</div><div>Datas e locais verificados</div></div></aside></div></div></section>

    <section class="section alt"><div class="container"><div class="editorial-box premium-trust"><div><div class="kicker">Padrão editorial</div><h2>Informação técnica com fonte, contexto e responsabilidade.</h2><p>A VAELITH produz sínteses editoriais próprias, identifica a origem das informações e contextualiza conteúdo internacional em português sem esconder a fonte original.</p></div><a class="trust-action" href="/politica-editorial">Política editorial →</a></div></div></section>
  </main>`;

  const ld=JSON.stringify({'@context':'https://schema.org','@type':'Organization',name:'VAELITH',url:SITE,description:'Portal de engenharia, arquitetura, construção, infraestrutura, gestão e tecnologia.'});
  return shell({title:'VAELITH — Engenharia, Construção e Tecnologia',description:'Notícias do Brasil e do mundo sobre engenharia, arquitetura, construção, infraestrutura, gestão e tecnologia.',canonical:SITE,body,jsonLd:ld,ogImage:lead.image});
};
