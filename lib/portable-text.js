const {esc}=require('./layout');
function safeLink(value) {
  try {const url=new URL(String(value));return ['http:','https:'].includes(url.protocol)?url.href:'';}catch{return '';}
}
function renderSpans(block) {
  const definitions=new Map((block.markDefs||[]).map(mark=>[mark._key,mark]));
  return (block.children||[]).map(span=>{
    if(span._type && span._type!=='span')return '';
    const rawText=String(span.text||'');
    const linkMark=(span.marks||[]).map(mark=>definitions.get(mark)).find(mark=>mark?._type==='link'&&safeLink(mark.href));
    const label=linkMark&&rawText.trim()===linkMark.href?'Abrir fonte em '+new URL(linkMark.href).hostname:rawText;
    let text=esc(label).replace(/\n/g,'<br>');
    for(const mark of span.marks||[]) {
      if(mark==='strong')text=`<strong>${text}</strong>`;
      else if(mark==='em')text=`<em>${text}</em>`;
      else {const definition=definitions.get(mark);const href=definition?._type==='link'?safeLink(definition.href):'';if(href)text=`<a href="${esc(href)}" target="_blank" rel="noopener noreferrer">${text}</a>`;}
    }
    return text;
  }).join('');
}
function renderPortableText(blocks) {
  let result='', list='';
  for(const block of blocks||[]) {
    if(block?._type!=='block')continue;
    const html=renderSpans(block);if(!html)continue;
    const kind=block.listItem==='bullet'?'ul':block.listItem==='number'?'ol':'';
    if(list!==kind){if(list)result+=`</${list}>`;if(kind)result+=`<${kind}>`;list=kind;}
    if(kind)result+=`<li>${html}</li>`;
    else {const tag=['h2','h3','h4','blockquote'].includes(block.style)?block.style:'p';result+=`<${tag}>${html}</${tag}>`;}
  }
  if(list)result+=`</${list}>`;
  return result;
}
module.exports={safeLink,renderPortableText};
