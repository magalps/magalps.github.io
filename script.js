/* ==================== Config ==================== */
const GITHUB_USER = 'magalps';
const REPO = `${GITHUB_USER}.github.io`;
const ROOT_DIR = 'Projetos';

const API_BASE = `https://api.github.com/repos/${GITHUB_USER}/${REPO}`;
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO}`;
const API_HEADERS = { 'Accept': 'application/vnd.github+json' };
// const BRANCH_OVERRIDE = 'main'; // opcional: fixe a branch aqui

const INTEREST_TAGS = new Set(['JS','NodeJS','Python','HTML/CSS','PowerBI','SQL','Java']);

// Ignorar dirs de terceiros/artefatos
const EXCLUDE_DIRS_RE = /(^|\/)(node_modules|\.venv|venv|__pycache__|dist|build|coverage|\.next|\.nuxt|\.cache|vendor|deps|third[-_]?party|site-packages|dist-packages|packages|\.husky|\.git)(\/|$)/i;

let DEFAULT_BRANCH = null;

/* ==================== Utils ==================== */
console.log('[portfolio] script.js carregado');

function extToLang(ext){
  switch(ext){
    case 'js': case 'mjs': return 'JS';
    case 'ts': case 'tsx': return 'JS';
    case 'py': case 'ipynb': return 'Python';
    case 'html': case 'css': return 'HTML/CSS';
    case 'sql': case 'psql': case 'pgsql': return 'SQL';
    case 'java': return 'Java';
    case 'pbix': case 'pbit': return 'PowerBI';
    case 'm': return 'PowerBI'; // Power Query (M)
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
function getImageMarker(md){ const m=(md||'').match(/^(?:image|capa)\s*:\s*(\S+)/im); return m?m[1]:null; }
function getProgressMarker(md){
  const m=(md||'').match(/^(?:progress|feito|conclusao|conclusão)\s*:\s*(\d{1,3})%/im);
  if(m) return Math.min(100, parseInt(m[1],10));
  const loose=(md||'').match(/(\d{1,3})\s*%/);
  return loose ? Math.min(100, parseInt(loose[1],10)) : null;
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

/* Árvore: só para inferir tags (não usamos para encontrar projetos) */
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
      // Observação: mesmo tendo README, ainda podemos ter subpastas com seus próprios READMEs.
      // Opcionalmente poderíamos NÃO descer, mas vamos descer para cobrir casos aninhados.
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

/* RAW de arquivos (README) */
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

/* ==================== Render ==================== */
function renderCard({projectDir, readmeMeta, tags, branch}){
  const name = lastSegment(projectDir);
  const rel = afterRoot(projectDir); // remove "Projetos/"
  const grid = document.getElementById('grid'); if(!grid) return;

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
      <p>${escapeHtml(readmeMeta.description || 'Projeto hospedado no GitHub Pages.')}</p>
      <div class="tags">${tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
      <a class="btn small" href="https://${GITHUB_USER}.github.io/${ROOT_DIR}/${enc(rel)}/" target="_blank" rel="noreferrer">Ver projeto</a>
      <a class="btn small" href="https://github.com/${GITHUB_USER}/${REPO}/tree/${encodeURIComponent(branch)}/${ROOT_DIR}/${enc(rel)}" target="_blank" rel="noreferrer">Ver código</a>
    </div>`;
  grid.appendChild(card);
}

/* ==================== Boot ==================== */
(async function init(){
  // ano + link GitHub
  const y = document.getElementById('y'); if(y) y.textContent = new Date().getFullYear();
  const gh = document.getElementById('gh-link'); if (gh) gh.href = `https://github.com/${GITHUB_USER}`;

  // Filtros UI
  const buttons = document.querySelectorAll('.filter-btn');
  const refresh = () => {
    const active = document.querySelector('.filter-btn.active');
    const tag = active ? active.dataset.filter : 'all';
    document.querySelectorAll('.project').forEach(card=>{
      const tags = (card.dataset.tags||'').split(',').map(s=>s.trim());
      card.style.display = (tag==='all' || tags.includes(tag)) ? 'block' : 'none';
    });
  };
  buttons.forEach(btn=>btn.addEventListener('click',()=>{
    buttons.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    refresh();
  }));

  try{
    DEFAULT_BRANCH = await getDefaultBranch();
    console.log('[portfolio] default branch:', DEFAULT_BRANCH);

    // 1) Usamos a árvore SÓ para inferir tags
    const { tree } = await getRepoTree(DEFAULT_BRANCH);
    console.log('[portfolio] tree carregada para tags. blobs:', tree.length);

    // 2) Descobrimos os projetos SEMPRE via /contents
    const projects = await findProjectsWithReadmeViaContents(DEFAULT_BRANCH);
    console.log('[portfolio] projetos (via contents):', projects.length);

    if (projects.length === 0){
      warn(`Nenhum projeto com README.md encontrado em ${ROOT_DIR}/`);
      const grid = document.getElementById('grid');
      if (grid){
        grid.innerHTML = `<div class="project" style="padding:16px">
          ⚠️ Nenhum projeto com <code>README.md</code> na raiz foi encontrado em <code>${ROOT_DIR}/</code>.
        </div>`;
      }
      return;
    }

    // 3) Renderiza todos (mesmo sem image/progress — mostramos ⚠️)
    let rendered = 0;
    for (const {dir, readmePath} of projects){
      const md = await fetchRaw(readmePath, DEFAULT_BRANCH);
      const meta = parseReadme(md || '');
      const tags = inferTagsForProject(dir, tree);
      renderCard({ projectDir: dir, readmeMeta: meta, tags, branch: DEFAULT_BRANCH });
      rendered++;
    }
    console.log('[portfolio] cards renderizados:', rendered);

    refresh();
  }catch(e){
    warn('Erro no carregamento:', e.message);
    const grid = document.getElementById('grid');
    if (grid){
      grid.innerHTML = `<div class="project" style="padding:16px">⚠️ Erro ao carregar projetos. Veja o Console.</div>`;
    }
  }
})();
