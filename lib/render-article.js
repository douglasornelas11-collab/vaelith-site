const content=require('./content');
const {SITE,esc,shell}=require('./layout');
const {resize}=require('./cards');
const engineeringGroup=['engenharia','construcao','infraestrutura'];

module.exports=function renderArticle(slug){
 const a=content.articles.find(x=>x.slug===slug);if(!a)return null;
 const inEngineering=engineeringGroup.includes(a.categorySlug);
 const editorialSlug=inEngineering?'engenharia':a.categorySlug;
 const editorialName=inEngineering?'Engenharia':a.category;
 const related=content.articles.filter(x=>(inEngineering?engineeringGroup.includes(x.categorySlug):x.categorySlug===a.categorySlug)&&x.slug!==a.slug).sort((x,y)=>y.date.localeCompare(x.date)).slice(0,4);
 const side=related.slice(0,3).map(x=>`<div class="sidebar-card"><a href="/noticias/${esc(x.slug)}"><div class="tag">${esc(x.category)}</div><h4>${esc(x.title)}</h4><div class="meta"><span>${esc(x.dateDisplay)}</span></div></a></div>`).join('');
 const relatedList=related.map(x=>`<a href="/noticias/${esc(x.slug)}"><span>${esc(x.category)}</span><strong>${esc(x.title)}</strong><small>${esc(x.dateDisplay)}</small></a>`).join('');
 const story=Array.isArray(a.body)&&a.body.length?a.body.map(p=>`<p>${esc(p)}</p>`).join(''):'';
 const canonical=`${SITE}/noticias/${a.slug}`;
 const hasImage=Boolean(a.image&&String(a.image).trim());
 const srcset=hasImage?[640,960,1280,1600].map(w=>`${esc(resize(a.image,w))} ${w}w`).join(', '):'';
 const caption=a.imageCaption||a.imageCredit?`${a.imageCaption?esc(a.imageCaption):''}${a.imageCaption&&a.imageCredit?' · ':''}${a.imageCredit?`Crédito: ${esc(a.imageCredit)}`:''}`:'';
 const hero=hasImage?`<figure class="article-figure"><img class="article-hero" src="${esc(a.image)}" srcset="${srcset}" sizes="(max-width:900px) 100vw, 720px" alt="${esc(a.imageAlt||a.title)}" width="1280" height="720" fetchpriority="high" loading="eager" decoding="async">${caption?`<figcaption>${caption}</figcaption>`:''}</figure>`:'';
 const facts=Array.isArray(a.keyFacts)&&a.keyFacts.length?`<section class="key-facts"><div class="eyebrow">Dados-chave</div><div class="key-facts-grid">${a.keyFacts.map(f=>`<div><span>${esc(f.label)}</span><strong>${esc(f.value)}</strong></div>`).join('')}</div></section>`:'';
 const takeaway=a.technicalTakeaway?`<div class="insight"><strong>Leitura VAELITH</strong><p>${esc(a.technicalTakeaway)}</p></div>`:'';
 const sourceLink=a.sourceUrl?`<div class="article-source-link"><a href="${esc(a.sourceUrl)}" target="_blank" rel="noopener noreferrer">Fonte original: ${esc(a.sourceName)} ↗</a></div>`:'';
 const schemaType=a.contentType==='research'?'ScholarlyArticle':a.contentType==='news'?'NewsArticle':'Article';
 const articleLd={'@type':schemaType,'@id':`${canonical}#article`,headline:a.title,description:a.dek,datePublished:a.publishedAt||a.date,dateModified:a.modifiedAt||a.publishedAt||a.date,inLanguage:'pt-BR',isAccessibleForFree:true,articleSection:editorialName,mainEntityOfPage:canonical,author:{'@type':'Organization',name:'VAELITH Editorial',url:SITE},publisher:{'@type':'NewsMediaOrganization',name:'VAELITH',url:SITE,logo:{'@type':'ImageObject',url:`${SITE}/favicon.svg`}}};
 if(hasImage)articleLd.image=[a.image];
 const ld=JSON.stringify({'@context':'https://schema.org','@graph':[articleLd,{'@type':'BreadcrumbList','@id':`${canonical}#breadcrumb`,itemListElement:[{'@type':'ListItem',position:1,name:'Início',item:SITE},{'@type':'ListItem',position:2,name:editorialName,item:`${SITE}/categoria/${editorialSlug}`},{'@type':'ListItem',position:3,name:a.title,item:canonical}]}]});
 const body=`<main class="article-shell"><div class="container"><div class="breadcrumb"><a href="/">Início</a> / <a href="/categoria/${esc(editorialSlug)}">${esc(editorialName)}</a></div><div class="article-grid"><article><header class="article-header"><div class="tag">${esc(a.category)} · ${esc(a.region)}</div><h1>${esc(a.title)}</h1><p class="article-dek">${esc(a.dek)}</p><div class="article-info"><span>${esc(a.dateDisplay)}</span></div></header>${hero}${facts}<div class="article-body">${story}${takeaway}${sourceLink}<div class="ad-slot ad-slot-article"><span>Publicidade</span><strong>Espaço reservado para parceiros VAELITH</strong><a href="/midia-kit">Mídia kit →</a></div><section class="related-block"><div class="eyebrow">Continue lendo</div><h2>Relacionadas</h2><div class="related-list">${relatedList}</div></section></div></article><aside class="sidebar"><div class="sidebar-title">Mais em ${esc(editorialName)}</div>${side}</aside></div></div></main>`;
 return shell({title:a.title,description:a.dek,canonical,active:editorialSlug,body,jsonLd:ld,ogImage:hasImage?a.image:'',ogType:'article',articlePublished:a.publishedAt||a.date,articleModified:a.modifiedAt||a.publishedAt||a.date,author:'VAELITH Editorial'});
};
