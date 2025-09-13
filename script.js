/* ========== Configurações ========== */
const GITHUB_USER = 'magalps';
const REPO = `${GITHUB_USER}.github.io`;
const ROOT_DIR = 'Projetos'; // pasta raiz dos projetos

/* Filtros disponíveis na UI */
const INTEREST_TAGS = new Set(['JS','NodeJS','Python','HTML/CSS','PowerBI','SQL','Java']);

/* ========== Utils ========== */
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
function encodePathSegments(relPath){ return relPath.split('/').map(encodeURIComponent).join('/'); }

/* ========== GitHub API ========== */
async function getRepoTree(){
  const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${REPO}/git/trees/main?recursive=1`);
  if(!res.ok) throw new Error('Falha ao obter árvore do repo');
  const j = await res.json();
  return Array.isArray(j.tree) ? j.tree : [];
}
function findProjectsWithReadme(tree){
  const readmeRegex = /\/README(?:\.md)?$/i;
  const readmes = tree.filter(n => n.type === 'blob' && n.path.startsWith(`${ROOT_DIR}/`) && readmeRegex.test(n.path));
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
async function fetchTextRaw(repoPath){
  const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${REPO}/main/${encodePathSegments(repoPath)}`;
  const res = await fetch(url);
  if(!res.ok) return null;
  return await res.text();
}

/* ========== Parser de README ========== */
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

/* ========== Tags por projeto ========== */
function inferTagsForProject(projectDir, tree){
  const prefix = `${projectDir}/`;
  const files = tree.filter(p => p.type==='blob' && p.path.startsWith(prefix)).map(p=>p.path);
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

/* ========== Render ========== */
function renderCard({projectDir, readmeMeta, tags}){
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
      <a class="btn small" href="https://${GITHUB_USER}.github.io/${ROOT_DIR}/${encodePathSegments(rel)}/" target="_blank" rel="noreferrer">Ver projeto</a>
      <a class="btn small" href="https://github.com/${GITHUB_USER}/${REPO}/tree/main/${ROOT_DIR}/${encodePathSegments(rel)}" target="_blank" rel="noreferrer">Ver código</a>
    </div>`;
  grid.appendChild(card);
}

/* ========== Boot ========== */
(async function init(){
  const y = document.getElementById('y'); if(y) y.textContent = new Date().getFullYear();
  const gh = document.getElementById('gh-link'); if (gh) gh.href = `https://github.com/${GITHUB_USER}`;

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
    const tree = await getRepoTree();
    const projects = findProjectsWithReadme(tree);
    for(const {dir, readmePath} of projects){
      const [md, tags] = await Promise.all([
        fetchTextRaw(readmePath),
        Promise.resolve(inferTagsForProject(dir, tree))
      ]);
      const meta = parseReadme(md || '');
      renderCard({projectDir: dir, readmeMeta: meta, tags});
    }
    refresh();
  }catch(e){
    console.warn('Falha no carregamento', e);
  }
})();
