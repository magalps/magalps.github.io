/* ==================== Config ==================== */
const GITHUB_USER = 'magalps';
const REPO = `${GITHUB_USER}.github.io`;
const ROOT_DIR = 'Projetos';

const API_BASE = `https://api.github.com/repos/${GITHUB_USER}/${REPO}`;
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO}`;
const API_HEADERS = { 'Accept': 'application/vnd.github+json' };
// const BRANCH_OVERRIDE = 'main'; // opcional

const INTEREST_TAGS = new Set(['JS','NodeJS','Python','HTML/CSS','PowerBI','SQL','Java']);

const EXCLUDE_DIRS_RE = /(^|\/)(node_modules|\.venv|venv|__pycache__|dist|build|coverage|\.next|\.nuxt|\.cache|vendor|deps|third[-_]?party|site-packages|dist-packages|packages|\.husky|\.git)(\/|$)/i;

const MAX_PER_PAGE = 3;          // 3 cards por página (carrossel)
const DESC_LIMIT   = 160;        // limite de caracteres da descrição

/* ==================== Estado do carrossel ==================== */
let DEFAULT_BRANCH = null;
let ALL_ITEMS = [];              // [{dir, readmeMeta, tags}]
let CURRENT_FILTER = 'all';
let CURRENT_PAGE = 0;            // index da página dentro do filtro

/* ==================== Utils ==================== */
console.log('[portfolio] script.js carregado');

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
    case 'm': return 'PowerBI'; // Power Query M
    default: return null;
  }
}
function detectNode(files){ return files.some(p => /(^|\/)package\.json$/i.test(p)) ? 'NodeJS' : null; }
function escapeHtml(str){ return (str||'').replace(/[&<>\"]+/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[s])); }
function afterRoot(path){ return path.replace(new RegExp(`^${ROOT_DIR}/`), ''); }
function lastSegment(path){ const parts = path.split('/').filter(Boolean); return parts[parts.length-1] || path; }
function enc(relPath){ return relPath.split('/').map(encodeURIComponent).join('/'); }
function warn(...args){ console.warn('[portfolio]', ...args); }

/* Marcadores do README */
function getImageMarker(md){
  if(!md) return null;
  // 1) padrão "image:" ou "capa:"
  const m1 = md.match(/^(?:image|capa)\s*:\s*(\S+)/im);
  if(m1) return m1[1];
  // 2) fallback para sintaxe markdown ![alt](url)
  const m2 = md.match(/!\[.*?\]\((.*?)\)/);
  if(m2) return m2[1];
  return null;
}

/* ==================== Fetch helpers (verbosos) ==================== */
async function safeFetchJSON(url, headers = API_HEADERS){
  console.log('[portfolio] GET', url);
  const res = await fetch(url, { headers });
  console.log('[portfolio] ->', res.status, res.statusText);
  if(!res.ok) throw new Error(`HTTP ${res.status} em ${url}`);
  return res.json();
}
async function safeFetchText(url){
  console.log('[portfolio] GET', url);
  const res = await fetch(url);
  console.log('[portfolio] ->', res.status, res.statusText);
  if(!res.ok) return null;
  return res.text();
}

/* ==================== GitHub API ==================== */
async function getDefaultBranch(){
  if (typeof BRANCH_OVERRIDE !== 'undefined') return BRANCH_OVERRIDE;
  const meta = await safeFetchJSON(API_BASE);
  return meta.default_branch || 'main';
}

/* Árvore: só para inferir tags */
async function getRepoTree(branch){
  const j = await safeFetchJSON(`${API_BASE}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
  return { tree: Array.isArray(j.tree) ? j.tree : [], truncated: !!j.truncated };
}

/* Descobre projetos via /contents (varredura completa em Projetos/) */
async function findProjectsWithReadmeViaContents(branch){
  const projects = [];
  const queue = [ROOT_DIR];
  const visited = new Set(queue);

  while(queue.length){
    const dir = queue.shift();
    if(EXCLUDE_DIRS_RE.test(dir)) continue;

    let list;
    try { list = await safeFetchJSON(`${API_BASE}/contents/${enc(dir)}?ref=${encodeURIComponent(branch)}`); }
    catch(e){ warn('contents falhou em', dir, e.message); continue; }

    if(!Array.isArray(list)) continue;

    // projeto = pasta que contém README na raiz
    const hasReadme = list.some(i => i.type==='file' && /^README(?:\.md)?$/i.test(i.name));
    if(hasReadme){
      projects.push({ dir, readmePath: `${dir}/README.md` });
      // ainda descemos para pegar subprojetos aninhados, caso existam
    }

    // continua descendo em subpastas
    for(const item of list){
      if(item.type === 'dir'){
        const nd = `${dir}/${item.name}`;
        if(!visited.has(nd)){ visited.add(nd); queue.push(nd); }
      }
    }
  }
  return projects;
}

async function fetchRaw(path, branch){
  return safeFetchText(`${RAW_BASE}/${encodeURIComponent(branch)}/${enc(path)}`);
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

/* ==================== Tags por projeto (usa a árvore) ==================== */
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
function renderCard({projectDir, readmeMeta, tags, branch}){
  const name = lastSegment(projectDir);
  const rel = afterRoot(projectDir); // remove "Projetos/"
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
    <div class="body">
      <h3>${escapeHtml(readmeMeta.title || name)} ${progressBadge}</h3>
      <p>${escapeHtml(desc)}</p>
      <div class="tags">${tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
      <a class="btn small" href="https://${GITHUB_USER}.github.io/${ROOT_DIR}/${enc(rel)}/" target="_blank" rel="noreferrer">Ver projeto</a>
      <a class="btn small" href="https://github.com/${GITHUB_USER}/${REPO}/tree/${encodeURIComponent(branch)}/${ROOT_DIR}/${enc(rel)}" target="_blank" rel="noreferrer">Ver código</a>
    </div>`;
  return card;
}

/* ==================== UI do carrossel ==================== */
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
  if(all) all.href = `https://github.com/${GITHUB_USER}/${REPO}/tree/${encodeURIComponent(DEFAULT_BRANCH||'main')}/${ROOT_DIR}`;
  return {wrap:ctr, prev, next, info, all};
}

function getFilteredItems(){
  if(CURRENT_FILTER === 'all') return ALL_ITEMS;
  return ALL_ITEMS.filter(it => it.tags.includes(CURRENT_FILTER));
}

function renderPage(){
  const grid = document.getElementById('grid');
  if(!grid) return;

  const items = getFilteredItems();
  const total = items.length;

  // corrige página fora do range
  const totalPages = Math.max(1, Math.ceil(total / MAX_PER_PAGE));
  if(CURRENT_PAGE > totalPages - 1) CURRENT_PAGE = totalPages - 1;
  if(CURRENT_PAGE < 0) CURRENT_PAGE = 0;

  grid.innerHTML = '';
  if(total === 0){
    grid.innerHTML = `<div class="project" style="padding:16px">Nenhum projeto para este filtro.</div>`;
  }else{
    const start = CURRENT_PAGE * MAX_PER_PAGE;
    const slice = items.slice(start, start + MAX_PER_PAGE);
    for(const it of slice){
      grid.appendChild(
        renderCard({ projectDir: it.dir, readmeMeta: it.readmeMeta, tags: it.tags, branch: DEFAULT_BRANCH })
      );
    }
  }

  // controles
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

  // filtro UI
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn=>btn.addEventListener('click',()=>{
    buttons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    CURRENT_FILTER = btn.dataset.filter || 'all';
    CURRENT_PAGE = 0;           // reset para 1ª página ao mudar filtro
    renderPage();
  }));

  try{
    DEFAULT_BRANCH = await getDefaultBranch();
    console.log('[portfolio] default branch:', DEFAULT_BRANCH);

    // 1) árvore para tags
    const { tree } = await getRepoTree(DEFAULT_BRANCH);
    console.log('[portfolio] tree blobs:', tree.length);

    // 2) projetos via /contents
    const projects = await findProjectsWithReadmeViaContents(DEFAULT_BRANCH);
    console.log('[portfolio] projetos (via contents):', projects.length);

    if (projects.length === 0){
      const grid = document.getElementById('grid');
      if (grid){
        grid.innerHTML = `<div class="project" style="padding:16px">⚠️ Nenhum projeto com README.md em <code>${ROOT_DIR}/</code>.</div>`;
      }
      return;
    }

    // 3) monta ALL_ITEMS (metadados + tags)
    ALL_ITEMS = [];
    for (const {dir, readmePath} of projects){
      const md = await fetchRaw(readmePath, DEFAULT_BRANCH);
      const readmeMeta = parseReadme(md || '');
      const tags = inferTagsForProject(dir, tree);
      ALL_ITEMS.push({ dir, readmeMeta, tags });
    }

    // 4) cria controles do carrossel e listeners
    const {prev, next} = ensureCarouselControls();
    if(prev) prev.addEventListener('click', ()=>{ CURRENT_PAGE = Math.max(0, CURRENT_PAGE - 1); renderPage(); });
    if(next) next.addEventListener('click', ()=>{
      const total = getFilteredItems().length;
      const last = Math.max(0, Math.ceil(total / MAX_PER_PAGE) - 1);
      CURRENT_PAGE = Math.min(last, CURRENT_PAGE + 1);
      renderPage();
    });

    // 5) render inicial
    renderPage();
  }catch(e){
    warn('Erro no carregamento:', e.message);
    const grid = document.getElementById('grid');
    if (grid){
      grid.innerHTML = `<div class="project" style="padding:16px">⚠️ Erro ao carregar projetos. Veja o Console.</div>`;
    }
  }
})();
