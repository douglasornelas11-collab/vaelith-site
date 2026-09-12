const path=require('path');
const cats=['engenharia','arquitetura','construcao','tecnologia','infraestrutura','mercado','gestao','sustentabilidade'];
const fallbackArticles=cats.flatMap(c=>require(path.join('..','data',c+'.json')));
const fallbackEvents=require('../data/events.json');
const state={articles:[...fallbackArticles],events:[...fallbackEvents],cats,lastRefresh:0,source:'fallback'};
const PROJECT='s2xosuea';
const DATASET='production';
const API_VERSION='2026-09-11';
const months=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
function dateDisplay(date=''){const [y,m,d]=String(date).slice(0,10).split('-');return y&&m&&d?`${d} ${months[Number(m)-1]} ${y}`:date;}
function blockText(body=[]){return (body||[]).filter(b=>b&&b._type==='block').map(b=>(b.children||[]).map(c=>c.text||'').join('').trim()).filter(Boolean);}
async function querySanity(query){const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),4500);try{const url=`https://${PROJECT}.api.sanity.io/v${API_VERSION}/data/query/${DATASET}?query=${encodeURIComponent(query)}`;const r=await fetch(url,{headers:{Accept:'application/json'},signal:controller.signal});if(!r.ok)throw new Error(`Sanity ${r.status}`);const j=await r.json();return j.result||[];}finally{clearTimeout(timer);}}
async function refreshFromSanity(force=false){if(!force&&Date.now()-state.lastRefresh<30000)return state;try{const articleQuery=`*[_type == "article" && status == "published" && defined(slug.current) && !(_id in path("drafts.**"))] | order(publishedAt desc){title,"slug":slug.current,dek,region,publishedAt,modifiedAt,"category":category->title,"categorySlug":category->slug.current,"sourceName":source->name,sourceUrl,sourceLanguage,"mainImageUrl":mainImage.asset->url,externalImageUrl,body[]{_type,children[]{text}}}`;const eventQuery=`*[_type == "event" && defined(slug.current) && !(_id in path("drafts.**"))] | order(startDate asc){title,"slug":slug.current,summary,category,startDate,endDate,dateDisplay,location,sourceName,sourceUrl,featured}`;const [articles,events]=await Promise.all([querySanity(articleQuery),querySanity(eventQuery)]);if(Array.isArray(articles)&&articles.length){state.articles=articles.map(a=>{const date=String(a.publishedAt||'').slice(0,10);return{...a,date,dateDisplay:dateDisplay(date),image:a.mainImageUrl||a.externalImageUrl||'',body:blockText(a.body)};});state.source='sanity';}if(Array.isArray(events)&&events.length){state.events=events.map(e=>({...e,date:e.startDate,dateDisplay:e.dateDisplay||dateDisplay(e.startDate)}));}state.lastRefresh=Date.now();}catch(err){console.error('VAELITH_SANITY_FALLBACK',err&&err.message?err.message:err);state.lastRefresh=Date.now();}return state;}
module.exports=state;
module.exports.refreshFromSanity=refreshFromSanity;
