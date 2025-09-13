/* ==================== Config ==================== */
const GITHUB_USER = 'magalps';
const REPO = `${GITHUB_USER}.github.io`;
const ROOT_DIR = 'Projetos';

const API_BASE = `https://api.github.com/repos/${GITHUB_USER}/${REPO}`;
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO}`;
const API_HEADERS = { 'Accept': 'application/vnd.github+json' };
// Opcional: force uma branch específica (ex.: 'main')
// const BRANCH_OVERRIDE = 'main';

const INTEREST_TAGS = new Set(['JS','NodeJS','Python','HTML/CSS','PowerBI','SQL','Java']);

// Ignorar dirs de terceiros/artefatos
const EXCLUDE_DIRS_RE = /(^|\/)(node_modules|\.venv|venv|__pycache__|dist|build|coverage|\.next|\.nuxt|\.cache|vendor|deps|third[-_]?party|site-packages|dist-packages|packages|.husky|\.git)(\/|$)/i;

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

function hasOurMarkers(md){
  if(!md) return false;
  const hasImage = /^(?:image|capa)\s*:\s*\S+/im.test(md);
  const hasProgress = /^(?:progress|feito|conclusao|conclusão)\s*:\s*\d{1,3}%/im.test(md);
  return hasImage || hasProgress;
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

async function getRepoTree(branch){
  const j = await safeFetchJSON(`${API_BASE}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
  const tree = Array.isArray(j.tree) ? j.tree : [];
  return { tree, truncated: !!j.truncated };
}

function findProjectsWithReadmeFromTree(tree){
  const readmeRegex = /\/README(?:\.md)?$/i;
  const readmes = tree.filter(n =>
    n.type === 'blob' &&
    n.path.startsWith(`${ROOT_DIR}/`) &&
    readmeRegex.test(n.path) &&
    !EXCLUDE_DIRS_RE.test(n.path)
  );
  const projects = [];
  const seen = new Set();
  for(const r of readmes){
    const dir = r.path.replace(/\/README(?:\.md)?$/i, '');
    if(seen.has(dir)) continue;
    seen.add(dir);
    projects.push({ dir, readmePath: r.path });
  }
  return projects;
}

// Fallback quando a tree é truncada: caminha via /contents
async function findProjectsWithReadmeViaContents(branch){
  const projects = [];
  const queue = [`${ROOT_DIR}`];
  const seenDirs = new Set(queue);
  let calls = 0, CALL_LIMIT = 250;

  while(queue.length){
    const dir = queue.shift();
    if(EXCLUDE_DIRS_RE.test(dir)) continue;

    const url = `${API_BASE}/contents/${enc(dir)}?ref=${encodeURIComponent(branch)}`;
    let list;
    try {
      list = await safeFetchJSON(url);
    } catch (e){
      warn('contents falhou em', dir, e.message);
      continue;
    }
    calls++;
    if (calls > CALL_LIMIT) { warn('Limite de chamadas contents atingido'); break; }
    if (!Array.isArray(list)) continue;

    let hasReadme = false;
    for (const item of list){
      if (item.type === 'file' && /README(?:\.md)?$/i.test(item.name)) {
        projects.push({ dir, readmePath: `${dir}/README.md` });
        hasReadme = true;
      }
    }
    if (!hasReadme){
      for (const item of list){
        if (item.type === 'dir'){
          const nd = `${dir}/${item.name}`;
          if (!seenDirs.has(nd)){
            seenDirs.add(nd);
            queue.push(nd);
          }
        }
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

  const blocks = md.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
  let description = null;
  for(const b of blocks){
    if(/^#/.test(b)) continue;
    if(/^!\[.*?\]\(.*?\)/.test(b)) continue;
    if(/^(image|capa)\s*:/i.test(b)) continue;
    description = b.replace(/\n/g,' ');
    if(description.length>0){ break; }
  }

  let imageUrl = null;
  const imgLine = md.match(/^(?:image|capa)\s*:\s*(\S+)/im);
  if(imgLine) imageUrl = imgLine[1];

  let progress = null;
  const progLine = md.match(/^(?:progress|feito|conclusao|conclusão)\s*:\s*(\d{1,3})%/im);
  if(progLine) progress = Math.min(100, parseInt(progLine[1],10));
  if(progress==null){
    const loose = md.match(/(\d{1,3})\s*%/);
    if(loose) progress = Math.min(100, parseInt(loose[1],10));
  }
  return {title, description, imageUrl, progress};
}

/* ==================== Tags por projeto ==================== */
function inferTagsForProject(projectDir, tree){
  const prefix = `${projectDir}/`;
  const files = tree.filter(p => p.type==='blob' && p.path.startsWith(prefix) && !EXCLUDE_DIRS_RE.test(p.path)).map(p=>p.path);
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
  const rel = afterRoot(projectDir);
  const grid = document.getElementById('grid'); if(!grid) return;

  const card = document.createElement('article');
  card.className = 'project';
  card.dataset.tags = tags.join(',');

  let cover;
  if(readmeMeta.imageUrl){
    cover = `<img class="cover" src="${escapeHtml(readmeMeta.imageUrl)}" alt="${escapeHtml(readmeMeta.title || name)}">`;
  } else {
    cover = `<div class="cover" style="display:flex;align-items:center;justify-content:center;color:var(--muted);font-size:12px">⚠️ sem capa</div>`;
  }

  let progressBadge;
  if(typeof readmeMeta.progress === 'number'){
    progressBadge = `<span class="progress">Progresso: ${readmeMeta.progress}%</span>`;
  } else {
    progressBadge = `<span class="progress">⚠️ sem progresso</span>`;
  }

  card.innerHTML = `${cover}
    <div class="body">
      <h3>${escapeHtml(readmeMeta.title || name)} ${progressBadge}</h3>
      <p>${escapeHtml(readmeMeta.description || 'Projeto hospedado no GitHub Pages.')}</p>
      <div class="tags">${tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
      <a class="btn small" href="https://${GITHUB_USER}.github.io/${ROOT_DIR}/${enc(rel)}/" target="_blank" rel="noreferrer">Ver projeto</a>
      <a class="btn small" href="https://github.com/${GITHUB_USER}/${REPO}/tree/${encodeURIComponent(branch)}/${ROOT_DIR}/${enc(rel)}" target="_blank" rel="noreferrer">Ver código</a>
    </div>`;
  document.getElementById('grid').appendChild(card);
}

/* ==================== Boot ==================== */
(async function init(){
  // ano e link
  const y = document.getElementById('y'); if(y) y.textContent = new Date().getFullYear();
  const gh = document.getElementById('gh-link'); if (gh) gh.href = `https://github.com/${GITHUB_USER}`;

  // filtros
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

    const { tree, truncated } = await getRepoTree(DEFAULT_BRANCH);
    console.log('[portfolio] tree size:', tree.length, 'truncated:', truncated);

    let projects = findProjectsWithReadmeFromTree(tree);
    if (truncated || projects.length === 0){
      console.log('[portfolio] usando fallback via /contents…');
      projects = await findProjectsWithReadmeViaContents(DEFAULT_BRANCH);
    }
    console.log('[portfolio] projetos com README encontrados:', projects.length);

    if (projects.length === 0){
      warn(`Nenhum README encontrado em ${ROOT_DIR}/`);
      const grid = document.getElementById('grid');
      if (grid){
        grid.innerHTML = `<div class="project" style="padding:16px">⚠️ Nenhum projeto com README.md encontrado em <code>${ROOT_DIR}/</code>.</div>`;
      }
      return;
    }

    let rendered = 0;
    for (const {dir, readmePath} of projects){
      const [md, tags] = await Promise.all([
        fetchRaw(readmePath, DEFAULT_BRANCH),
        Promise.resolve(inferTagsForProject(dir, tree))
      ]);

      if (!hasOurMarkers(md || '')) {
        console.log('[portfolio] ignorando (sem marcadores image/progress):', readmePath);
        continue;
      }

      const meta = parseReadme(md || '');
      renderCard({ projectDir: dir, readmeMeta: meta, tags, branch: DEFAULT_BRANCH });
      rendered++;
    }
    console.log('[portfolio] cards renderizados:', rendered);
    if(rendered === 0){
      const grid = document.getElementById('grid');
      if (grid){
        grid.innerHTML = `<div class="project" style="padding:16px">
          ⚠️ Encontramos READMEs, mas nenhum contém <code>image:</code> ou <code>progress:</code>.<br>
          Adicione ao menos um desses marcadores para cada projeto.
        </div>`;
      }
    }

    refresh();
  }catch(e){
    warn('Erro no carregamento:', e.message);
    const grid = document.getElementById('grid');
    if (grid){
      grid.innerHTML = `<div class="project" style="padding:16px">⚠️ Erro ao carregar projetos. Veja o Console para detalhes.</div>`;
    }
  }
})();
