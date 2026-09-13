// VAELITH content pipeline — imagens oficiais ou licenciadas diretamente relacionadas; fallback apenas de emergência.
const path=require('path');
const sourceImages=require('./source-images.json');
const cats=['engenharia','arquitetura','construcao','tecnologia','infraestrutura','mercado','gestao','sustentabilidade'];
const fallbackArticles=cats.flatMap(c=>require(path.join('..','data',c+'.json')));
const fallbackEvents=require('../data/events.json');
const state={articles:[...fallbackArticles],events:[...fallbackEvents],cats,lastRefresh:0,source:'fallback'};
const PROJECT='s2xosuea';
const DATASET='production';
const API_VERSION='2026-09-11';
const months=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const categoryColors={engenharia:'#22313f',arquitetura:'#3f352f',construcao:'#4a3f2f',tecnologia:'#23354a',infraestrutura:'#273a33',mercado:'#3a3147',gestao:'#3d3d33',sustentabilidade:'#31452d'};
function dateDisplay(date=''){const [y,m,d]=String(date).slice(0,10).split('-');return y&&m&&d?`${d} ${months[Number(m)-1]} ${y}`:date;}
function blockText(body=[]){return (body||[]).filter(b=>b&&b._type==='block').map(b=>(b.children||[]).map(c=>c.text||'').join('').trim()).filter(Boolean);}
function hashOf(value=''){let h=2166136261;for(const ch of String(value)){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0;}
function editorialCover(categorySlug='',title='',slug=''){
  const color=categoryColors[categorySlug]||'#293238';
  const h=hashOf(slug||title);
  const a=100+(h%150),b=170+((h>>>5)%220),c=560+((h>>>9)%250),d=120+((h>>>13)%210);
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#111315"/><rect width="1600" height="900" fill="${color}" opacity=".64"/><path d="M${a} 760 L${c} 135 L1490 135 L${b+520} 760 Z" fill="none" stroke="#d8ff3e" stroke-width="3" opacity=".78"/><path d="M${d} 118 H1490 M${d} 780 H1490" stroke="#ffffff" stroke-width="1" opacity=".16"/><circle cx="${c}" cy="${d+245}" r="${100+(h%85)}" fill="none" stroke="#ffffff" stroke-width="1" opacity=".14"/><path d="M110 155h34l110 187 112-187h31L254 392z" fill="#d8ff3e" opacity=".92"/><text x="110" y="825" fill="#d7dde0" font-family="Arial,Helvetica,sans-serif" font-size="24" font-weight="700" letter-spacing="6">VAELITH EDITORIAL</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
function trustedExternalImage(url=''){
  const u=String(url||'').trim();
  if(!u||u.startsWith('data:image/'))return '';
  let parsed;
  try{parsed=new URL(u);}catch(_){return '';}
  if(parsed.protocol!=='https:')return '';
  const host=String(parsed.hostname||'').toLowerCase();
  const stockHosts=['unsplash.com','pexels.com','pixabay.com'];
  if(stockHosts.some(domain=>host===domain||host.endsWith('.'+domain)))return '';
  return u;
}
async function querySanity(query){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),4500);try{const url=`https://${PROJECT}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;const r=await fetch(url,{headers:{Accept:'application/json'},signal:controller.signal});if(!r.ok)throw new Error(`Sanity ${r.status}`);const j=await r.json();return j.result||[];}finally{clearTimeout(timer);}}
async function refreshFromSanity(force=false){if(!force&&Date.now()-state.lastRefresh<30000)return state;try{const articleQuery=`*[_type == "article" && status == "published" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc){title,"slug":slug.current,dek,region,publishedAt,modifiedAt,contentType,technicalTakeaway,keyFacts[]{label,value},"category":category->title,"categorySlug":category->slug.current,"sourceName":source->name,sourceUrl,sourceLanguage,"authorName":author->name,"mainImageUrl":mainImage.asset->url,"imageAlt":coalesce(mainImage.alt,imageAlt),"imageCaption":coalesce(mainImage.caption,imageCaption),"imageCredit":coalesce(mainImage.credit,imageCredit),externalImageUrl,body[]{_type,children[]{text}}}`;const eventQuery=`*[_type == "event" && defined(slug.current) && !(_id in path("drafts.**"))] | order(startDate asc){title,"slug":slug.current,summary,category,startDate,endDate,dateDisplay,location,sourceName,sourceUrl,featured}`;const [articles,events]=await Promise.all([querySanity(articleQuery),querySanity(eventQuery)]);if(Array.isArray(articles)&&articles.length){state.articles=articles.map(a=>{const date=String(a.publishedAt||'').slice(0,10);const curatedImage=a.mainImageUrl||trustedExternalImage(a.externalImageUrl)||trustedExternalImage(sourceImages[a.slug]?.url)||'';const image=curatedImage||editorialCover(a.categorySlug,a.title,a.slug);return{...a,date,dateDisplay:dateDisplay(date),image,imageAlt:a.imageAlt||a.title,imageIsEditorialFallback:!curatedImage,imageCaption:a.imageCaption||(sourceImages[a.slug]?'Imagem da publicação original.':!curatedImage?'Imagem editorial VAELITH — não representa registro fotográfico do fato.':''),body:blockText(a.body)};});state.source='sanity';}if(Array.isArray(events)&&events.length){state.events=events.map(e=>({...e,date:e.startDate,dateDisplay:e.dateDisplay||dateDisplay(e.startDate)}));}state.lastRefresh=Date.now();}catch(err){console.error('VAELITH_SANITY_FALLBACK',err&&err.message?err.message:err);state.lastRefresh=Date.now();}return state;}
module.exports=state;
module.exports.refreshFromSanity=refreshFromSanity;
module.exports.editorialCover=editorialCover;
