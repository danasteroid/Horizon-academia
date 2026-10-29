const pages={
  original:{url:'../index.html?revision=menu-5',title:'Original · Pulido visual en azul'},
  institucional:{url:'institucional.html',title:'Institucional · Claridad y confianza'},
  editorial:{url:'editorial.html',title:'Editorial · Vocación y carácter'},
  esencial:{url:'esencial.html',title:'Horizon esencial · Evolución de la identidad'}
};
const overview=document.querySelector('#overview');
const viewer=document.querySelector('#viewer');
const frame=document.querySelector('#design-frame');
let current='';
function showDesign(key,updateHash=true){
  if(!pages[key])return;
  overview.hidden=true;viewer.hidden=false;
  if(current!==key){frame.src=pages[key].url;current=key;}
  document.querySelector('#design-description').textContent=pages[key].title;
  document.querySelector('#open-page').hidden=false;
  document.querySelector('#open-page').href=pages[key].url;
  frame.title=pages[key].title;
  document.querySelectorAll('.viewer-toolbar [data-open]').forEach(b=>b.setAttribute('aria-current',String(b.dataset.open===key)));
  if(updateHash)history.replaceState(null,'',`#${key}`);
  window.scrollTo({top:0,behavior:'instant'});
}
function showOverview(){overview.hidden=false;viewer.hidden=true;document.querySelector('#open-page').hidden=true;history.replaceState(null,'','#comparar');window.scrollTo({top:0,behavior:'instant'});}
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>showDesign(b.dataset.open)));
document.querySelector('[data-overview]').addEventListener('click',showOverview);
document.querySelector('.review-brand').addEventListener('click',e=>{e.preventDefault();showOverview();});
document.querySelectorAll('[data-device]').forEach(b=>b.addEventListener('click',()=>{
  const mobile=b.dataset.device==='mobile';
  document.querySelector('.frame-stage').classList.toggle('mobile',mobile);
  document.querySelectorAll('[data-device]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  document.querySelector('#device-description').textContent=`Página real · Vista de ${mobile?'celular':'computadora'}`;
}));
function fromHash(){const key=location.hash.slice(1);if(pages[key])showDesign(key,false);else showOverview();}
window.addEventListener('hashchange',fromHash);
fromHash();
