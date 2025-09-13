/* === onde antes buscava árvore/API/CDN, agora: === */
async function loadProjectsManifest(){
  console.log('[portfolio] GET projects.json');
  const res = await fetch('projects.json', { cache: 'no-store' });
  if(!res.ok) throw new Error(`HTTP ${res.status} ao baixar projects.json`);
  const data = await res.json();
  if(!data || !Array.isArray(data.projects)) throw new Error('projects.json inválido');
  return data.projects;
}

let ALL_ITEMS = [];
let CURRENT_FILTER = 'all';
let CURRENT_PAGE = 0;
const MAX_PER_PAGE = 3;
const DESC_LIMIT = 160;

function clamp(s,n){ return s && s.length>n ? s.slice(0,n-1)+'…' : (s||''); }
function afterRoot(p){ return p.replace(/^Projetos\//,''); }
function enc(p){ return p.split('/').map(encodeURIComponent).join('/'); }

function renderCard(it){
  const name = it.meta?.title || it.dir.split('/').pop();
  const rel  = afterRoot(it.dir);
  const desc = clamp(it.meta?.description || 'Projeto hospedado no GitHub Pages.', DESC_LIMIT);
  const cover = it.meta?.imageUrl
    ? `<img class="cover" src="${it.meta.imageUrl}" alt="${name}">`
    : `<div class="cover" style="display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:12px">⚠️ sem capa</div>`;
  const progress = typeof it.meta?.progress === 'number'
    ? `<span class="progress">Progresso: ${it.meta.progress}%</span>`
    : `<span class="progress">⚠️ sem progresso</span>`;

  const tags = (it.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('');
  const card = document.createElement('article');
  card.className = 'project';
  card.dataset.tags = (it.tags||[]).join(',');
  card.innerHTML = `${cover}
  <div class="body" style="padding:14px">
    <h3 style="margin:6px 0 6px;font-size:18px">${name} ${progress}</h3>
    <p>${desc}</p>
    <div class="tags" style="margin-top:10px">${tags}</div>
    <a class="btn small" href="https://magalps.github.io/Projetos/${enc(rel)}/" target="_blank" rel="noreferrer">Ver projeto</a>
    <a class="btn small" href="https://github.com/magalps/magalps.github.io/tree/main/Projetos/${enc(rel)}" target="_blank" rel="noreferrer">Ver código</a>
  </div>`;
  return card;
}

function getFilteredItems(){
  if(CURRENT_FILTER==='all') return ALL_ITEMS;
  return ALL_ITEMS.filter(it => (it.tags||[]).includes(CURRENT_FILTER));
}

function ensureCarouselControls(){
  const section = document.querySelector('#projetos');
  let ctr = section.querySelector('.carousel-controls');
  if(!ctr){
    ctr = document.createElement('div');
    ctr.className = 'carousel-controls';
    ctr.innerHTML = `
      <button class="btn" data-prev aria-label="Anterior">◀</button>
      <span class="small" data-info style="color:var(--muted)"></span>
      <button class="btn" data-next aria-label="Próximo">▶</button>
      <a class="btn" data-all target="_blank" rel="noreferrer"
         href="https://github.com/magalps/magalps.github.io/tree/main/Projetos">Ver todos os projetos</a>`;
    section.appendChild(ctr);
  }
  return {
    prev: ctr.querySelector('[data-prev]'),
    next: ctr.querySelector('[data-next]'),
    info: ctr.querySelector('[data-info]')
  };
}

function renderPage(){
  const grid = document.getElementById('grid');
  const items = getFilteredItems();
  const totalPages = Math.max(1, Math.ceil(items.length / MAX_PER_PAGE));
  CURRENT_PAGE = Math.max(0, Math.min(CURRENT_PAGE, totalPages - 1));

  grid.innerHTML = '';
  const slice = items.slice(CURRENT_PAGE*MAX_PER_PAGE, CURRENT_PAGE*MAX_PER_PAGE + MAX_PER_PAGE);
  if(slice.length===0){
    grid.innerHTML = `<div class="project" style="padding:16px">Nenhum projeto para este filtro.</div>`;
  }else{
    slice.forEach(it => grid.appendChild(renderCard(it)));
  }

  const {prev,next,info} = ensureCarouselControls();
  if(info) info.textContent = items.length ? `Página ${CURRENT_PAGE+1} de ${totalPages} • ${items.length} projeto(s)` : '0 de 0';
  if(prev) prev.onclick = ()=>{ if(CURRENT_PAGE>0){ CURRENT_PAGE--; renderPage(); } };
  if(next) next.onclick = ()=>{ if(CURRENT_PAGE<totalPages-1){ CURRENT_PAGE++; renderPage(); } };
}

(async function init(){
  // header básico
  const y = document.getElementById('y'); if(y) y.textContent = new Date().getFullYear();
  const gh = document.getElementById('gh-link'); if (gh) gh.href = `https://github.com/magalps`;

  // filtros
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      CURRENT_FILTER = btn.dataset.filter || 'all';
      CURRENT_PAGE = 0;
      renderPage();
    });
  });

  try{
    ALL_ITEMS = await loadProjectsManifest();
    renderPage();
  }catch(e){
    console.warn('[portfolio]', e.message);
    const grid = document.getElementById('grid');
    if(grid){
      grid.innerHTML = `<div class="project" style="padding:16px">
        ⚠️ Erro ao carregar <code>projects.json</code>. Confirme se o GitHub Action gerou o arquivo e comitou no branch <code>main</code>.
      </div>`;
    }
    ensureCarouselControls();
  }
})();