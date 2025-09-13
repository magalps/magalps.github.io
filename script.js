/* ==================== Config ==================== */
const GITHUB_USER = 'magalps';
const REPO = `${GITHUB_USER}.github.io`;

// >>>>> SOMENTE projetos 1 nível abaixo destas bases:
const PROJECT_BASES = [
  'Projetos/Alura/7DaysOfCode',   // <base>/<projeto>/README.md
];

const API_BASE = `https://api.github.com/repos/${GITHUB_USER}/${REPO}`;
const RAW_BASE = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO}`;
const API_HEADERS = { 'Accept': 'application/vnd.github+json' };
// const BRANCH_OVERRIDE = 'main';

const INTEREST_TAGS = new Set(['JS','NodeJS','Python','HTML/CSS','PowerBI','SQL','Java']);
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
    case 'm': return 'PowerBI';
    default: return null;
  }
}
function detectNode(files){ return files.some(p => /(^|\/)package\.json$/i.test(p)) ? 'NodeJS' : null; }
function escapeHtml(str){ return (str||'').replace(/[&<>\"]+/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[s])); }
function enc(relPath){ return relPath.split('/').map(encodeURIComponent).join('/'); }
function lastSegment(path){ const parts = path.split('/').filter(Boolean); return parts[parts.length-1] || path; }
function warn(...args){ console.warn('[portfolio]', ...args); }

function hasOurMarkers(md){
  if(!md) return false;
  const hasImage = /^(?:image|capa)\s*:\s*\S+/im.test(md);
  const hasProgress = /^(?:progress|feito|conclusao|conclusão)\s*:\s*\d{1,3}%/im.test(md);
  return hasImage || hasProgress;
}

function isUnderAllowedBaseExactlyOneLevel(dir){
  // dir deve ser <base>/<nomeDoProjeto> (apenas um segmento a mais)
  for(const base of PROJECT_BASES){
    if(!dir.startsWith(base + '/')) continue;
    if(EXCLUDE_DIRS_RE.test(dir)) continue;
    const rest = dir.slice(base.length + 1); // remove "base/"
    if(!rest || rest.includes('/')) continue; // deve ter 1 segmento apenas
    return true;
  }
  return false;
}

/* ==================== Fetch helpers ==================== */
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
  return { tree: Array.isArray(j.tree) ? j.tree : [], truncated: !!j.truncated };
}

/* 
  Só aceita README que esteja exatamente em: <base>/<projeto>/README.md
  e ignora qualquer outro caminho.
*/
function findProjectsWithReadmeFromTree(tree){
  const readmeRegex = /\/README(?:\.md)?$/i;
  const readmes = tree.filter(n =>
    n.type === 'blob' &&
    readmeRegex.test(n.path) &&
    PROJECT_BASES.some(base => n.path.startsWith(base + '/')) &&
    !EXCLUDE_DIRS_RE.test(n.path)
  );

  const projects = [];
  const seen = new Set();
  for(const r of readmes){
    const dir = r.path.replace(/\/README(?:\.md)?$/i, '');
    if(!isUnderAllowedBaseExactlyOneLevel(dir)) continue; // <<< regra 1 nível
    if(seen.has(dir)) continue;
    seen.add(dir);
    projects.push({ dir, readmePath: r.path });
  }
  return projects;
}

// Fallback via /contents respeitando as mesmas regras
async function findProjectsWithReadmeViaContents(branch){
  const projects = [];
  for(const base of PROJECT_BASES){
    // lista os itens diretamente dentro da base
    const url = `${API_BASE}/contents/${enc(base)}?ref=${encodeURIComponent(branch)}`;
    let list;
    try { list = await safeFetchJSON(url); } catch(e){ warn('contents falhou em', base, e.message); continue; }
    if(!Array.isArray(list)) continue;

    for(const item of list){
      if(item.type !== 'dir') continue;
      const dir = `${base}/${item.name}`;
      if(EXCLUDE_DIRS_RE.test(dir)) continue;

      // precisa ter README na raiz dessa pasta
      const url2 = `${API_BASE}/contents/${enc(dir)}?ref=${encodeURIComponent(branch)}`;
      let list2;
      try { list2 = await safeFetchJSON(url2); } catch(e){ continue; }
      const hasReadme = Array.isArray(list2) && list2.some(f => f.type==='file' && /^README(?:\.md)?$/i.test(f.name));
      if(hasReadme){
        projects.push({ dir, readmePath: `${dir}/README.md` });
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
  const rel = projectDir.replace(/^.*?\//, m => ''); // remove prefixo até primeiro '/'; não usamos na URL
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
      <a class="btn small" href="https://${GITHUB_USER}.github.io/${enc(projectDir)}/" target="_blank" rel="noreferrer">Ver projeto</a>
      <a class="btn small" href="https://github.com/${GITHUB_USER}/${REPO}/tree/${encodeURIComponent(branch)}/${enc(projectDir)}" target="_blank" rel="noreferrer">Ver código</a>
    </div>`;
  grid.appendChild(card);
}

/* ==================== Boot ==================== */
(async function init(){
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
    console.log('[portfolio] candidatos (base + README):', projects.length);

    let rendered = 0;
    for (const {dir, readmePath} of projects){
      const md = await fetchRaw(readmePath, DEFAULT_BRANCH);
      if (!hasOurMarkers(md || '')) {
        console.log('[portfolio] ignorando (sem image/progress):', readmePath);
        continue;
      }
      const meta = parseReadme(md || '');
      const tags = inferTagsForProject(dir, tree);
      renderCard({ projectDir: dir, readmeMeta: meta, tags, branch: DEFAULT_BRANCH });
      rendered++;
    }
    console.log('[portfolio] cards renderizados:', rendered);

    if(rendered === 0){
      const grid = document.getElementById('grid');
      if (grid){
        grid.innerHTML = `<div class="project" style="padding:16px">
          ⚠️ Nenhum projeto válido encontrado.<br>
          Certifique-se de criar pastas em <code>${PROJECT_BASES.join('</code> e <code>')}</code>
          com um <code>README.md</code> contendo <code>image:</code> e/ou <code>progress:</code>.
        </div>`;
      }
    }

    refresh();
  }catch(e){
    warn('Erro no carregamento:', e.message);
    const grid = document.getElementById('grid');
    if (grid){
      grid.innerHTML = `<div class="project" style="padding:16px">⚠️ Erro ao carregar projetos. Veja o Console.</div>`;
    }
  }
})();
