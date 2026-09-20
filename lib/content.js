// VAELITH content pipeline — imagens oficiais ou licenciadas diretamente relacionadas; fallback apenas de emergência.
const path=require('path');
const sourceImages=require('./source-images.json');
const {resolveArticles}=require('./image-policy');
const cats=['engenharia','arquitetura','construcao','tecnologia','infraestrutura','mercado','gestao','sustentabilidade'];
const editorialArticles=require('../data/editorial-national.json');
function mergeEditorial(articles=[]){
  const editorialSlugs=new Set(editorialArticles.map(article=>article.slug));
  return [...editorialArticles,...articles.filter(article=>!editorialSlugs.has(article.slug))];
}
const fallbackArticles=resolveArticles(mergeEditorial(cats.flatMap(c=>require(path.join('..','data',c+'.json')))));
const fallbackEvents=require('../data/events.json');
const state={articles:[...fallbackArticles],events:[...fallbackEvents],cats,lastRefresh:0,source:'fallback'};
const PROJECT='s2xosuea';
const DATASET='production';
const API_VERSION='2026-09-11';
const months=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
function dateDisplay(date=''){const [y,m,d]=String(date).slice(0,10).split('-');return y&&m&&d?`${d} ${months[Number(m)-1]} ${y}`:date;}
function blockText(body=[]){return (body||[]).filter(b=>b&&b._type==='block').map(b=>(b.children||[]).map(c=>c.text||'').join('').trim()).filter(Boolean);}
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
async function refreshFromSanity(force=false){if(!force&&Date.now()-state.lastRefresh<30000)return state;try{const articleQuery=`*[_type == "article" && status == "published" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc){title,"slug":slug.current,dek,region,publishedAt,modifiedAt,contentType,technicalTakeaway,keyFacts[]{label,value},"category":category->title,"categorySlug":category->slug.current,"sourceName":coalesce(source->name,sourceName),sourceUrl,sourceLanguage,"authorName":author->name,"mainImageUrl":mainImage.asset->url,"imageAlt":coalesce(mainImage.alt,imageAlt),"imageCaption":coalesce(mainImage.caption,imageCaption),"imageCredit":coalesce(mainImage.credit,imageCredit),externalImageUrl,body[]{_type,children[]{text}}}`;const eventQuery=`*[_type == "event" && defined(slug.current) && !(_id in path("drafts.**"))] | order(startDate asc){title,"slug":slug.current,summary,category,startDate,endDate,dateDisplay,location,sourceName,sourceUrl,featured}`;const [articles,events]=await Promise.all([querySanity(articleQuery),querySanity(eventQuery)]);if(Array.isArray(articles)&&articles.length){const sanityArticles=articles.map(a=>{const date=String(a.publishedAt||'').slice(0,10);const curatedImage=a.mainImageUrl||trustedExternalImage(a.externalImageUrl)||trustedExternalImage(sourceImages[a.slug]?.url)||'';const image=curatedImage;return{...a,date,dateDisplay:dateDisplay(date),image,imageAlt:a.imageAlt||a.title,imageIsEditorialFallback:!curatedImage,imageCaption:a.imageCaption||'',body:blockText(a.body)};});state.articles=resolveArticles(mergeEditorial(sanityArticles));state.source='sanity+editorial';}if(Array.isArray(events)&&events.length){state.events=events.map(e=>({...e,date:e.startDate,dateDisplay:e.dateDisplay||dateDisplay(e.startDate)}));}state.lastRefresh=Date.now();}catch(err){console.error('VAELITH_SANITY_FALLBACK',err&&err.message?err.message:err);state.lastRefresh=Date.now();}return state;}
module.exports=state;
module.exports.refreshFromSanity=refreshFromSanity;
