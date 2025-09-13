/* ==================== Config ==================== */
const GITHUB_USER = 'magalps';
const REPO = `${GITHUB_USER}.github.io`;
const ROOT_DIR = 'Projetos';
const BRANCH = 'main'; // fixe sua branch aqui

// CDN/APIs públicas (sem rate-limit chato)
const RAW_CDN  = `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${REPO}@${BRANCH}`;
const DATA_API = `https://data.jsdelivr.com/v1/package/gh/${GITHUB_USER}/${REPO}@${BRANCH}`;

const MAX_PER_PAGE = 3;               // 3 cards por página (carrossel)
const DESC_LIMIT   = 160;             // limite de caracteres na descrição
const TREE_CACHE_TTL_MS = 6 * 60 * 60 * 1000; // 6h

const INTEREST_TAGS = new Set(['JS','NodeJS','Python','HTML/CSS','PowerBI','SQL','Java']);
const EXCLUDE_DIRS_RE = /(^|\/)(node_modules|\.venv|venv|__pycache__|dist|build|coverage|\.next|\.nuxt|\.cache|vendor|deps|third[-_]?party|site-packages|dist-packages|packages|\.husky|\.git)(\/|$)/i;

/* ==================== Estado ==================== */
let ALL_ITEMS = [];               // [{dir, readmePath, tags}]
let CURRENT_FILTER = 'all';
let CURRENT_PAGE = 0;
const README_CACHE = new Map();   // path -> {title, description, imageUrl, progress}

/* ==================== Utils ==================== */
console.log('[portfolio] script.js (jsDelivr) carregado');

function clamp(str, n){ if(!str) return ''; return str.length>n ? str.slice(0,n-1)+'…' : str; }
function extToLang(ext){
  switch(ext){
    case 'js': case 'mjs': return 'JS';
    case 'ts': case 'tsx': return 'JS';
    case 'py': case 'ipynb': return 'Python';
    case 'html': case 'css': return 'HTML/CSS';
    case 'sql': case 'psql': case 'pgsql': return 'SQL';
    case 'java': return 'Java';
    case 'pbix': case 'pbit': return 'PowerBI';
    case 'm': return 'PowerBI';
    default: return null;
  }
}
function detectNode(files){ return files.some(p => /(^|\/)package\.json$/i.test(p)) ? 'NodeJS' : null; }
function escapeHtml(str){ return (str||'').replace(/[&<>\"]+/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[s])); }
function afterRoot(path){ return path.replace(new RegExp(`^${ROOT_DIR}/`), ''); }
function lastSegment(path){ const parts = path.split('/').filter(Boolean); return parts[parts.length-1] || path; }
function enc(relPath){ return relPath.split('/').map(encodeURIComponent).join('/'); }
function warn(...args){ console.warn('[portfolio]', ...args); }

/* Marcadores do README (image: e fallback Markdown) */
function getImageMarker(md){
  if(!md) return null;
  const m1 = md.match(/^(?:image|capa)\s*:\s*(\S+)/im);
  if(m1) return m1[1];
  const m2 = md.match(/!\[.*?\]\((.*?)\)/); // padrão MD
  if(m2) return m2[1];
  return null;
}
function getProgressMarker(md){
  const m=(md||'').match(/^(?:progress|feito|conclusao|conclusão)\s*:\s*(\d{1,3})%/im);
  if(m) return Math.min(100, parseInt(m[1],10));
  const loose=(md||'').match(/(\d{1,3})\s*%/);
  return loose ? Math.min(100, parseInt(loose[1],10)) : null;
}

/* ==================== Fetch helpers ==================== */
async function fetchJSON(url){
  console.log('[portfolio] GET', url);
  const res = await fetch(url);
  console.log('[portfolio] ->', res.status, res.statusText);
  if(!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
  return res.json();
}
async function fetchReadmeRaw(path){
  const url = `${RAW_CDN}/${enc(path)}`;
  console.log('[portfolio] GET', url);
  const res = await fetch(url);
  console.log('[portfolio] ->', res.status, res.statusText);
  if(!res.ok) return null;
  return res.text();
}

/* ==================== Tree via jsDelivr (sem GitHub API) ==================== */
// Estrutura do data.jsdelivr: { files: [ {name, type: 'file'|'directory', files?:[...] } ] }
function flattenFiles(node, prefix = ''){
  const acc = [];
  if(!node) return acc;
  const list = Array.isArray(node) ? node : node.files;
  if(!Array.isArray(list)) return acc;

  for(const f of list){
    const p = prefix ? `${prefix}/${f.name}` : f.name;
    if(f.type === 'file'){
      acc.push({ path: p, type: 'blob' });
    }else if(f.type === 'directory'){
      if(!EXCLUDE_DIRS_RE.test(p)){
        acc.push({ path: p+'/', type: 'tree' });
        acc.push(...flattenFiles(f.files, p));
      }
    }
  }
  return acc;
}

function loadTreeFromCache(){
  try{
    const raw = localStorage.getItem('portfolio_tree_cache_jsdelivr');
    if(!raw) return null;
    const obj = JSON.parse(raw);
    if(!obj || !obj.ts || !obj.data) return null;
    if (Date.now() - obj.ts > TREE_CACHE_TTL_MS) return null;
    return obj.data;
  }catch{ return null; }
}
function saveTreeToCache(data){
  try{
    localStorage.setItem('portfolio_tree_cache_jsdelivr', JSON.stringify({ts: Date.now(), data}));
  }catch{}
}

async function getRepoTreeViaCDN(){
  const cached = loadTreeFromCache();
  if(cached){ console.log('[portfolio] usando tree do cache local'); return cached; }
  const data = await fetchJSON(DATA_API);          // 1 chamada
  const tree = flattenFiles(data);                 // transforma em [{path,type}]
  saveTreeToCache(tree);
  return tree;
}

/* Encontrar projetos: qualquer pasta em ROOT_DIR com README.md na raiz */
function findProjectsWithReadmeFromTree(tree){
  const readmeRegex = /\/README(?:\.md)?$/i;
  const readmes = tree.filter(n =>
    n.type === 'blob' &&
    n.path.startsWith(`${ROOT_DIR}/`) &&
    readmeRegex.test(n.path) &&
    !EXCLUDE_DIRS_RE.test(n.path)
  );
  const seen = new Set();
  const projects = [];
  for(const r of readmes){
    const dir = r.path.replace(/\/README(?:\.md)?$/i, '');
    if(seen.has(dir)) continue;
    seen.add(dir);
    projects.push({ dir, readmePath: r.path });
  }
  return projects;
}

/* ==================== README parser ==================== */
function parseReadme(md){
  if(!md) return {};
  const titleMatch = md.match(/^#\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : null;

  // primeira descrição que não seja título/img/linha image:
  const blocks = md.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
  let description = null;
  for(const b of blocks){
    if(/^#/.test(b)) continue;
    if(/^!\[.*?\]\(.*?\)/.test(b)) continue;
    if(/^(image|capa)\s*:/i.test(b)) continue;
    description = b.replace(/\n/g,' ');
    if(description.length>0) break;
  }

  const imageUrl = getImageMarker(md);
  const progress = getProgressMarker(md);

  return {title, description, imageUrl, progress};
}

/* ==================== Tags (usa a tree carregada) ==================== */
function inferTagsForProject(projectDir, tree){
  const prefix = `${projectDir}/`;
  const files = tree
    .filter(p => p.type==='blob' && p.path.startsWith(prefix) && !EXCLUDE_DIRS_RE.test(p.path))
    .map(p=>p.path);

  const tagSet = new Set();
  for(const p of files){
    const m = p.match(/\.([a-z0-9]+)$/i);
    if(!m) continue;
    const tag = extToLang(m[1].toLowerCase());
    if(tag) tagSet.add(tag);
  }
  const nodeTag = detectNode(files); if(nodeTag) tagSet.add(nodeTag);
  const tags = [...tagSet].filter(t => INTEREST_TAGS.has(t));
  return tags.length ? tags : ['HTML/CSS'];
}

/* ==================== Render (card) ==================== */
function renderCard({projectDir, readmeMeta, tags}){
  const name = lastSegment(projectDir);
  const rel = afterRoot(projectDir);
  const desc = clamp(readmeMeta.description || 'Projeto hospedado no GitHub Pages.', DESC_LIMIT);

  const card = document.createElement('article');
  card.className = 'project';
  card.dataset.tags = tags.join(',');

  const cover = readmeMeta.imageUrl
    ? `<img class="cover" src="${escapeHtml(readmeMeta.imageUrl)}" alt="${escapeHtml(readmeMeta.title || name)}">`
    : `<div class="cover" style="display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:12px">⚠️ sem capa</div>`;

  const progressBadge = (typeof readmeMeta.progress === 'number')
    ? `<span class="progress">Progresso: ${readmeMeta.progress}%</span>`
    : `<span class="progress">⚠️ sem progresso</span>`;

  card.innerHTML = `${cover}
    <div class="body" style="padding:14px">
      <h3 style="margin:6px 0 6px;font-size:18px">${escapeHtml(readmeMeta.title || name)} ${progressBadge}</h3>
      <p>${escapeHtml(desc)}</p>
      <div class="tags" style="margin-top:10px">${tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
      <a class="btn small" href="https://${GITHUB_USER}.github.io/${ROOT_DIR}/${enc(rel)}/" target="_blank" rel="noreferrer">Ver projeto</a>
      <a class="btn small" href="https://github.com/${GITHUB_USER}/${REPO}/tree/${BRANCH}/${ROOT_DIR}/${enc(rel)}" target="_blank" rel="noreferrer">Ver código</a>
    </div>`;
  return card;
}

/* ==================== Carrossel & Filtro ==================== */
function ensureCarouselControls(){
  const section = document.querySelector('#projetos');
  if(!section) return {wrap:null, prev:null, next:null, info:null, all:null};

  let ctr = section.querySelector('.carousel-controls');
  if(!ctr){
    ctr = document.createElement('div');
    ctr.className = 'carousel-controls';
    ctr.style.cssText = 'display:flex;align-items:center;gap:10px;margin:12px 0 0;';
    ctr.innerHTML = `
      <button class="btn" data-prev aria-label="Anterior">◀</button>
      <span class="small" data-info style="color:var(--muted)"></span>
      <button class="btn" data-next aria-label="Próximo">▶</button>
      <a class="btn" data-all target="_blank" rel="noreferrer">Ver todos os projetos</a>
    `;
    section.appendChild(ctr);
  }
  const prev = ctr.querySelector('[data-prev]');
  const next = ctr.querySelector('[data-next]');
  const info = ctr.querySelector('[data-info]');
  const all  = ctr.querySelector('[data-all]');
  if(all) all.href = `https://github.com/${GITHUB_USER}/${REPO}/tree/${BRANCH}/${ROOT_DIR}`;
  return {wrap:ctr, prev, next, info, all};
}

function getFilteredItems(){
  if(CURRENT_FILTER === 'all') return ALL_ITEMS;
  return ALL_ITEMS.filter(it => it.tags.includes(CURRENT_FILTER));
}

async function ensureReadmesLoadedForSlice(slice){
  const promises = slice.map(async it=>{
    if(README_CACHE.has(it.readmePath)) return;
    const md = await fetchReadmeRaw(it.readmePath);
    const meta = parseReadme(md || '');
    README_CACHE.set(it.readmePath, meta);
  });
  await Promise.all(promises);
}

async function renderPage(tree){
  const grid = document.getElementById('grid');
  if(!grid) return;

  const items = getFilteredItems();
  const total = items.length;

  const totalPages = Math.max(1, Math.ceil(total / MAX_PER_PAGE));
  if(CURRENT_PAGE > totalPages - 1) CURRENT_PAGE = totalPages - 1;
  if(CURRENT_PAGE < 0) CURRENT_PAGE = 0;

  grid.innerHTML = '';
  if(total === 0){
    grid.innerHTML = `<div class="project" style="padding:16px">Nenhum projeto para este filtro.</div>`;
  }else{
    const start = CURRENT_PAGE * MAX_PER_PAGE;
    const slice = items.slice(start, start + MAX_PER_PAGE);

    await ensureReadmesLoadedForSlice(slice);

    for(const it of slice){
      const meta = README_CACHE.get(it.readmePath) || {};
      grid.appendChild(
        renderCard({ projectDir: it.dir, readmeMeta: meta, tags: it.tags })
      );
    }
  }

  const {prev, next, info} = ensureCarouselControls();
  if(info){
    const totalPages = Math.max(1, Math.ceil(total / MAX_PER_PAGE));
    info.textContent = total === 0
      ? '0 de 0'
      : `Página ${CURRENT_PAGE + 1} de ${totalPages} • ${total} projeto(s)`;
  }
  if(prev) prev.disabled = (CURRENT_PAGE === 0 || total === 0);
  if(next) next.disabled = (CURRENT_PAGE >= Math.ceil(total / MAX_PER_PAGE) - 1 || total === 0);
}

/* ==================== Boot ==================== */
(async function init(){
  // ano + link GitHub
  const y = document.getElementById('y'); if(y) y.textContent = new Date().getFullYear();
  const gh = document.getElementById('gh-link'); if (gh) gh.href = `https://github.com/${GITHUB_USER}`;

  // Filtros
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn=>btn.addEventListener('click',()=>{
    buttons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    CURRENT_FILTER = btn.dataset.filter || 'all';
    CURRENT_PAGE = 0;
    renderPage(_TREE);
  }));

  // carrega a tree pela CDN (com cache local)
  let _TREE = [];
  try{
    _TREE = await getRepoTreeViaCDN();
    console.log('[portfolio] tree (jsDelivr) itens:', _TREE.length);

    const projects = findProjectsWithReadmeFromTree(_TREE);
    console.log('[portfolio] projetos:', projects.length);

    if (projects.length === 0){
      const grid = document.getElementById('grid');
      if (grid){
        grid.innerHTML = `<div class="project" style="padding:16px">
          ⚠️ Nenhum projeto com <code>README.md</code> encontrado em <code>${ROOT_DIR}/</code>.
        </div>`;
      }
      ensureCarouselControls();
      return;
    }

    ALL_ITEMS = projects.map(({dir, readmePath}) => ({
      dir,
      readmePath,
      tags: inferTagsForProject(dir, _TREE)
    }));

    const {prev, next} = ensureCarouselControls();
    if(prev) prev.addEventListener('click', ()=>{ CURRENT_PAGE = Math.max(0, CURRENT_PAGE - 1); renderPage(_TREE); });
    if(next) next.addEventListener('click', ()=>{
      const total = getFilteredItems().length;
      const last = Math.max(0, Math.ceil(total / MAX_PER_PAGE) - 1);
      CURRENT_PAGE = Math.min(last, CURRENT_PAGE + 1);
      renderPage(_TREE);
    });

    await renderPage(_TREE);
  }catch(e){
    warn('Erro no carregamento (CDN):', e.message);
    const grid = document.getElementById('grid');
    if (grid){
      grid.innerHTML = `<div class="project" style="padding:16px">
        ⚠️ Erro ao carregar lista de arquivos via CDN. Tente novamente mais tarde.<br>
        <a class="btn small" style="margin-top:8px" target="_blank" rel="noreferrer"
           href="https://github.com/${GITHUB_USER}/${REPO}/tree/${BRANCH}/${ROOT_DIR}">
          Abrir pasta ${ROOT_DIR} no GitHub
        </a>
      </div>`;
    }
    ensureCarouselControls();
  }
})();
