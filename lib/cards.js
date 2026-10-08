const {esc}=require('./layout');
function sanityUrl(value){try{const u=new URL(String(value||''));return u.protocol==='https:'&&u.hostname==='cdn.sanity.io'?u:null;}catch{return null;}}
function dimensions(value){const u=sanityUrl(value);if(!u)return null;const m=u.pathname.match(/-(\d+)x(\d+)\.(?:jpg|jpeg|png|webp|gif|avif)(?:\/|$)/i);return m?{width:Number(m[1]),height:Number(m[2])}:null;}
function resize(url,w,{lossless=false}={}){
 const u=sanityUrl(url);if(!u)return String(url||'');
 const native=dimensions(url);const width=Math.max(1,Math.min(Math.round(w),native?.width||Math.round(w)));
 u.searchParams.set('w',String(width));u.searchParams.set('fit','max');
 if(lossless){u.searchParams.set('fm','png');u.searchParams.delete('auto');u.searchParams.delete('q');}
 else{u.searchParams.set('auto','format');u.searchParams.set('q','90');u.searchParams.delete('fm');}
 return u.href;
}
function hasRealImage(a){return Boolean(a&&a.image&&!a.imageIsEditorialFallback&&!String(a.image).startsWith('data:'));}
function imageSizes(cls){
 if(cls==='cover')return '(min-width:1296px) 530px, (min-width:761px) 46vw, calc(100vw - 40px)';
 if(cls==='article-hero')return '(max-width:900px) calc(100vw - 40px), 680px';
 if(cls==='research-feature-image')return '(max-width:640px) calc(100vw - 40px), 410px';
 return '(min-width:1296px) 518px, (min-width:761px) calc(50vw - 84px), calc(100vw - 96px)';
}
function image(a,cls='image',priority=false){
 if(!hasRealImage(a))return '';
 const native=dimensions(a.image);const diagram=a.imageRightsType==='original'||a.contentType==='research';
 const preserve=Boolean(a.imagePreserveFull||diagram);const lossless=diagram||/\.png(?:\?|$)/i.test(a.image);
 const max=cls==='article-hero'?1920:1600;
 const limit=Math.min(native?.width||max,max);
 const widths=[...new Set([... [320,480,640,768,960,1280,1600,1920].filter(w=>w<=limit),limit])].sort((x,y)=>x-y);
 const responsive=sanityUrl(a.image)?` srcset="${widths.map(w=>`${esc(resize(a.image,w,{lossless}))} ${w}w`).join(', ')}" sizes="${imageSizes(cls)}"`:'';
 const intrinsic=native?` width="${native.width}" height="${native.height}" style="--image-native-width:${native.width}px;--image-ratio:${native.width}/${native.height}"`:'';
 const flags=`${a.contentType==='research'?' data-scientific-figure="true"':''}${preserve?' data-preserve-full="true"':''}${diagram?' data-diagram="true"':''}`;
 return `<img class="${cls}" src="${esc(a.image)}"${responsive}${flags} alt="${esc(a.imageAlt||a.title)}"${intrinsic} ${priority?'fetchpriority="high" loading="eager"':'loading="lazy"'} decoding="async">`;
}
function card(a){const hasImage=hasRealImage(a);return `<article class="card${hasImage?'':' no-image'}"><a href="/noticias/${esc(a.slug)}">${hasImage?image(a):''}<div class="tag">${esc(a.category)} · ${esc(a.region)}</div><h3>${esc(a.title)}</h3><p>${esc(a.dek)}</p><div class="meta"><span>${esc(a.dateDisplay)}</span></div></a></article>`}
function side(a){const hasImage=hasRealImage(a);return `<article class="side-story${hasImage?'':' no-image'}"><a href="/noticias/${esc(a.slug)}">${hasImage?image(a,'thumb'):''}<div class="tag">${esc(a.category)} · ${esc(a.region)}</div><h2>${esc(a.title)}</h2><div class="meta"><span>${esc(a.dateDisplay)}</span></div></a></article>`}
module.exports={card,side,image,resize,hasRealImage,dimensions,imageSizes};
