const content=require('./content');
const {SITE,esc,navItems,shell}=require('./layout');
const {card}=require('./cards');

const catDesc={
  engenharia:'Notícias e análises de engenharia sobre estruturas, projetos, materiais, inspeção, manutenção, obras e prática técnica no Brasil e no mundo.',
  arquitetura:'Notícias e análises de arquitetura sobre projetos, cidades, urbanismo, design, retrofit e cultura do ambiente construído.',
  construcao:'Notícias e análises sobre construção, execução de obras, produtividade, industrialização, métodos construtivos e cadeia produtiva.',
  tecnologia:'Notícias e análises sobre tecnologia aplicada à construção: inteligência artificial, BIM, automação, dados, equipamentos e Construction Tech.',
  infraestrutura:'Notícias e análises sobre infraestrutura: rodovias, ferrovias, pontes, energia, saneamento, concessões e ativos críticos.',
  mercado:'Notícias e análises sobre mercado da construção: crédito, investimentos, empresas, custos, indicadores, negócios e demanda.',
  gestao:'Notícias e análises sobre gestão de projetos e obras: planejamento, contratos, riscos, suprimentos, pessoas, produtividade e entrega.',
  sustentabilidade:'Notícias e análises sobre sustentabilidade no ambiente construído: carbono, energia, materiais, circularidade, rastreabilidade e resiliência.'
};

function category(slug){
  const items=content.articles.filter(x=>x.categorySlug===slug).sort((a,b)=>b.date.localeCompare(a.date));
  if(!items.length)return null;
  const name=items[0].category;
  const desc=catDesc[slug]||`Notícias e análises sobre ${name}.`;
  const other=navItems.filter(([s])=>s!==slug).slice(0,5).map(([s,n])=>`<a class="topic-chip" href="/categoria/${s}">${n}</a>`).join('');
  const body=`<main><section class="page-hero"><div class="container"><div class="eyebrow">Editoria</div><h1>${esc(name)}</h1><p>${esc(desc)}</p></div></section><section class="section alt"><div class="container"><div class="section-head"><div><h2>Últimas de ${esc(name)}</h2><p>Conteúdo com fonte identificada, síntese editorial e contexto para profissionais.</p></div></div><div class="list-grid">${items.map(card).join('')}</div><div class="topic-nav"><span>Explore também</span>${other}</div></div></section></main>`;
  const ld=JSON.stringify({'@context':'https://schema.org','@type':'CollectionPage',name:name,description:desc,url:`${SITE}/categoria/${slug}`,isPartOf:{'@type':'WebSite',name:'VAELITH',url:SITE}});
  return shell({title:name,description:desc,canonical:`${SITE}/categoria/${slug}`,active:slug,body,jsonLd:ld});
}

function eventContext(category=''){
  const c=String(category).toLowerCase();
  if(c.includes('bim'))return 'O encontro é especialmente relevante para profissionais que trabalham com BIM, coordenação de projetos, compatibilização, dados e transformação digital no ciclo de vida dos empreendimentos.';
  if(c.includes('tecnologia'))return 'O evento interessa principalmente a profissionais e empresas que acompanham digitalização, automação, inteligência artificial, software e novas tecnologias aplicadas à arquitetura, engenharia e construção.';
  if(c.includes('infraestrutura'))return 'A programação tende a ser relevante para engenheiros, gestores, projetistas, construtoras, investidores e agentes públicos ligados a planejamento, contratação, execução e operação de infraestrutura.';
  if(c.includes('construção')||c.includes('construcao'))return 'O evento é relevante para construtoras, engenheiros, fornecedores e gestores interessados em produtividade, métodos construtivos, industrialização, equipamentos e inovação no canteiro.';
  return 'O evento reúne temas de interesse para profissionais e empresas do ambiente construído, com potencial para antecipar tendências, tecnologias, projetos e oportunidades do setor.';
}

function events(slug=''){
  if(slug){
    const ev=content.events.find(x=>x.slug===slug);if(!ev)return null;
    const others=content.events.filter(x=>x.slug!==ev.slug).slice(0,4).map(x=>`<div class="sidebar-card"><a href="/eventos/${esc(x.slug)}"><div class="tag">${esc(x.category)}</div><h4>${esc(x.title)}</h4><div class="meta"><span>${esc(x.dateDisplay)}</span><span>${esc(x.location)}</span></div></a></div>`).join('');
    const context=eventContext(ev.category);
    const official=ev.sourceUrl?`<div class="article-source-link"><a href="${esc(ev.sourceUrl)}" target="_blank" rel="noopener noreferrer">Site oficial do evento ↗</a></div>`:'';
    const body=`<main class="article-shell"><div class="container"><div class="breadcrumb"><a href="/">Início</a> / <a href="/eventos">Agenda</a></div><div class="article-grid"><article><header class="article-header"><div class="tag">Agenda · ${esc(ev.category)}</div><h1>${esc(ev.title)}</h1><p class="article-dek">${esc(ev.summary)}</p><div class="article-info"><span>${esc(ev.dateDisplay)}</span><span>${esc(ev.location)}</span></div></header><div class="article-body"><h2>Sobre o evento</h2><p>${esc(ev.summary)}</p><h2>Por que vale acompanhar</h2><p>${esc(context)}</p><h2>Informações principais</h2><p><strong>Data:</strong> ${esc(ev.dateDisplay)}<br><strong>Local:</strong> ${esc(ev.location)}<br><strong>Área:</strong> ${esc(ev.category)}</p>${official}</div></article><aside class="sidebar"><div class="sidebar-title">Outros eventos</div>${others}</aside></div></div></main>`;
    const ld=JSON.stringify({'@context':'https://schema.org','@type':'Event',name:ev.title,description:ev.summary,startDate:ev.startDate||ev.date,eventStatus:'https://schema.org/EventScheduled',location:{'@type':'Place',name:ev.location},url:`${SITE}/eventos/${ev.slug}`});
    return shell({title:ev.title,description:ev.summary,canonical:`${SITE}/eventos/${ev.slug}`,active:'eventos',body,jsonLd:ld,ogType:'article'});
  }
  const rows=[...content.events].sort((a,b)=>a.date.localeCompare(b.date)).map(ev=>`<a class="event-row" href="/eventos/${esc(ev.slug)}"><div class="date">${esc(ev.dateDisplay)}</div><div><div class="tag">${esc(ev.category)}</div><h3>${esc(ev.title)}</h3><p>${esc(ev.summary)}</p></div><div class="place">${esc(ev.location)}</div></a>`).join('');
  const body=`<main><section class="page-hero"><div class="container"><div class="eyebrow">Brasil & Mundo</div><h1>Agenda</h1><p>Feiras, congressos, conferências e encontros relevantes para engenharia, arquitetura, construção, infraestrutura, gestão, BIM e tecnologia.</p></div></section><section class="section alt"><div class="container"><div class="event-grid"><div class="event-list">${rows}</div><aside class="radar"><div class="tag">Radar VAELITH</div><h3>Eventos que merecem atenção.</h3><p>Uma seleção objetiva de encontros relevantes para profissionais e empresas do setor.</p></aside></div></div></section></main>`;
  return shell({title:'Agenda',description:'Agenda VAELITH de eventos de engenharia, construção, arquitetura, BIM e tecnologia.',canonical:`${SITE}/eventos`,active:'eventos',body});
}

function about(){
  const body=`<main><section class="page-hero"><div class="container"><div class="eyebrow">Sobre</div><h1>Douglas Ornelas</h1></div></section><section class="section alt"><div class="container"><article class="article-body institutional-copy"><p>Douglas Ornelas, engenheiro civil com MBA em Gestão de Projetos. A VAELITH nasceu da sua paixão por engenharia, construção e infraestrutura — um espaço criado para trazer as notícias mais relevantes do setor.</p></article></div></section></main>`;
  const ld=JSON.stringify({'@context':'https://schema.org','@type':'AboutPage',name:'Douglas Ornelas — VAELITH',url:`${SITE}/sobre`,about:{'@type':'Person',name:'Douglas Ornelas',jobTitle:'Engenheiro Civil'}});
  return shell({title:'Sobre',description:'Douglas Ornelas, engenheiro civil e fundador da VAELITH.',canonical:`${SITE}/sobre`,body,jsonLd:ld});
}


function privacy(){
  const body=`<main><section class="page-hero"><div class="container"><div class="eyebrow">Privacidade</div><h1>Política de privacidade</h1><p>Como a VAELITH trata dados técnicos e informações de contato.</p></div></section><section class="section alt"><div class="container"><article class="article-body institutional-copy"><p>A VAELITH busca limitar a coleta de dados ao necessário para operação, segurança, comunicação e melhoria da plataforma.</p><h2>Dados técnicos</h2><p>A infraestrutura pode processar informações como endereço IP, navegador, dispositivo, data e horário de acesso para segurança, diagnóstico e entrega do serviço.</p><h2>Contato</h2><p>Questões relacionadas à privacidade podem ser encaminhadas para labsvaelith@gmail.com.</p></article></div></section></main>`;
  return shell({title:'Política de privacidade',description:'Política de privacidade e tratamento de dados da VAELITH.',canonical:`${SITE}/privacidade`,body});
}

function info(type){if(type==='about')return about();if(type==='privacy')return privacy();return null;}
function author(){return about();}

function search(q=''){
  const query=String(q||'').trim().slice(0,200);const normalize=value=>String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR');const needle=normalize(query);
  const results=query?content.articles.filter(a=>normalize([a.title,a.dek,a.category,a.region,a.sourceName,...(a.body||[])].join(' ')).includes(needle)).sort((a,b)=>b.date.localeCompare(a.date)):[];
  const resultHtml=query?(results.length?`<div class="search-count">${results.length} resultado${results.length===1?'':'s'} para “${esc(query)}”</div><div class="list-grid">${results.map(card).join('')}</div>`:`<div class="empty-state"><h2>Nenhum resultado encontrado.</h2><p>Tente outra empresa, obra, tecnologia, categoria ou tema.</p></div>`):`<div class="empty-state"><h2>Pesquise o acervo VAELITH.</h2><p>Busque por engenharia, BIM, infraestrutura, IA, gestão, mercado e outros temas.</p></div>`;
  const body=`<main><section class="page-hero search-hero"><div class="container"><div class="eyebrow">Pesquisa</div><h1>Buscar</h1><form class="search-form" action="/buscar" method="get"><label class="sr-only" for="q">Pesquisar</label><input id="q" name="q" value="${esc(query)}" placeholder="Busque uma obra, empresa ou tema"><button type="submit">Buscar</button></form></div></section><section class="section alt"><div class="container">${resultHtml}</div></section></main>`;
  return shell({title:query?`Busca: ${query}`:'Buscar',description:'Pesquise notícias e análises no acervo VAELITH.',canonical:`${SITE}/buscar`,robots:'noindex,follow',body});
}


module.exports={category,events,info,author,search};
