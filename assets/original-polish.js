// Pequeños ajustes de navegación y accesibilidad del diseño original.
const originalHeader = document.querySelector('header');
const desktopNavigation = document.querySelector('#desktop-navigation');
const menuButton = document.querySelector('#original-menu-button');
const mobileNavigation = document.createElement('nav');
mobileNavigation.id = 'original-mobile-navigation';
mobileNavigation.className = 'mobile-navigation';
mobileNavigation.setAttribute('aria-label', 'Navegación móvil');
mobileNavigation.hidden = true;
desktopNavigation.querySelectorAll('a').forEach(link => mobileNavigation.append(link.cloneNode(true)));
const aulaLink = document.createElement('button');
aulaLink.type='button';
aulaLink.textContent='Aula de alumnos';
aulaLink.className='text-blue-300 text-sm font-semibold py-3';
aulaLink.addEventListener('click',()=>{closeMobileMenu();openAulaModal();});
mobileNavigation.append(aulaLink);
originalHeader.append(mobileNavigation);
function closeMobileMenu(){menuButton.setAttribute('aria-expanded','false');mobileNavigation.hidden=true;}
menuButton.addEventListener('click',()=>{
  const expanded=menuButton.getAttribute('aria-expanded')==='true';
  menuButton.setAttribute('aria-expanded',String(!expanded));mobileNavigation.hidden=expanded;
});
mobileNavigation.addEventListener('click',e=>{if(e.target.closest('a'))closeMobileMenu();});
document.addEventListener('click',e=>{if(!originalHeader.contains(e.target))closeMobileMenu();});
window.addEventListener('keydown',e=>{if(e.key==='Escape'&&menuButton.getAttribute('aria-expanded')==='true'){closeMobileMenu();menuButton.focus();}});
window.matchMedia('(min-width:1200px)').addEventListener('change',e=>{if(e.matches)closeMobileMenu();});

document.querySelectorAll('.slider-nav-tab').forEach((tab,i)=>{
  tab.setAttribute('role','button');tab.tabIndex=0;
  tab.setAttribute('aria-label',['Ver convocatoria de admisión','Ver simulacros de admisión','Ver balotarios y entrevista'][i]);
  tab.setAttribute('aria-pressed',String(tab.classList.contains('active')));
  tab.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();goToSlide(i);}});
});

document.querySelectorAll('#d2-ciclos .grid.md\\:grid-cols-3>div').forEach(card=>{
  const link=card.querySelector('a');
  link.addEventListener('click',()=>{
    document.querySelector('#original-cycle').value=card.querySelector('h4').textContent.trim();
    document.querySelector('#original-consultation').hidden=true;
  });
});

const aulaModal=document.querySelector('#modal-aula');
const aulaTitle=aulaModal.querySelector('h4');
aulaTitle.id='original-aula-title';
aulaModal.setAttribute('role','dialog');
aulaModal.setAttribute('aria-modal','true');
aulaModal.setAttribute('aria-labelledby',aulaTitle.id);
aulaModal.querySelector('button').setAttribute('aria-label','Cerrar información del aula');
let modalTrigger=null;
const initialOpenAula=window.openAulaModal;
const initialCloseAula=window.closeAulaModal;
window.openAulaModal=()=>{
  modalTrigger=document.activeElement;
  initialOpenAula();
  document.body.style.overflow='hidden';
  aulaModal.querySelector('button').focus();
};
window.closeAulaModal=()=>{
  initialCloseAula();
  document.body.style.overflow='';
  if(modalTrigger instanceof HTMLElement)modalTrigger.focus();
};
aulaModal.addEventListener('click',e=>{if(e.target===aulaModal)closeAulaModal();});
aulaModal.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();closeAulaModal();}
  if(e.key==='Tab'){
    const items=[...aulaModal.querySelectorAll('button,a[href]')];
    const first=items[0],last=items[items.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
    else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
  }
});
