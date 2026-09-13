(function(){
  function unavailable(img){
    if(!(img instanceof HTMLImageElement)||!img.closest('main'))return;
    img.style.setProperty('display','none','important');
    const card=img.closest('.card,.side-story');if(card)card.classList.add('no-image');
    const figure=img.closest('.article-figure');
    if(figure){let caption=figure.querySelector('figcaption');if(!caption){caption=document.createElement('figcaption');figure.append(caption);}caption.textContent='Imagem da fonte temporariamente indisponível.';}
  }
  document.addEventListener('error',event=>unavailable(event.target),true);
  document.querySelectorAll('main img').forEach(img=>{if(img.complete&&img.naturalWidth===0)unavailable(img);});
})();
