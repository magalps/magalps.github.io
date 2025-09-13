const GITHUB_USER = 'magalps';


async function listProjects(){
const res = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${REPO}/contents/${PROJECTS_DIR}`);
if(!res.ok) return [];
const data = await res.json();
return Array.isArray(data) ? data.filter(i=>i.type==='dir').map(i=>i.name) : [];
}


function inferTagsForProject(projectName, allPaths){
const prefix = `${PROJECTS_DIR}/${projectName}/`;
const files = allPaths.filter(p => p.path.startsWith(prefix) && p.type==='blob').map(p=>p.path);
const tagSet = new Set();


// Por extensão
for(const p of files){
const m = p.match(/\.([a-z0-9]+)$/i);
if(!m) continue;
const tag = extToLang(m[1].toLowerCase());
if(tag) tagSet.add(tag);
}
// NodeJS por package.json
const nodeTag = detectNode(files);
if(nodeTag) tagSet.add(nodeTag);


// Garante apenas tags conhecidas
const tags = [...tagSet].filter(t => INTEREST_TAGS.has(t));
return tags.length ? tags : ['HTML/CSS']; // fallback
}


async function loadRepos(){
try{
const [projects, tree] = await Promise.all([listProjects(), getRepoTree()]);
const grid = document.getElementById('grid');
if(!grid) return;


for(const name of projects){
const tags = inferTagsForProject(name, tree);
const datasetTags = tags.join(',');


const card = document.createElement('article');
card.className = 'project';
card.dataset.tags = datasetTags;
card.innerHTML = `
<h3>${escapeHtml(name)}</h3>
<p>Projeto hospedado no GitHub Pages.</p>
<div class="tags">${tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
<a class="btn small" href="https://${GITHUB_USER}.github.io/${PROJECTS_DIR}/${encodeURIComponent(name)}/" target="_blank" rel="noreferrer">Ver projeto</a>
<a class="btn small" href="https://github.com/${GITHUB_USER}/${REPO}/tree/main/${PROJECTS_DIR}/${encodeURIComponent(name)}" target="_blank" rel="noreferrer">Ver código</a>
`;
grid.appendChild(card);
}
}catch(e){
console.warn('Falha ao carregar projetos', e);
}
}


// Ano dinâmico + link GitHub
(function initBasics(){
const y = document.getElementById('y'); if(y) y.textContent = new Date().getFullYear();
const gh = document.getElementById('gh-link'); if (gh) gh.href = `https://github.com/${GITHUB_USER}`;
})();


// Filtro por tags
(function initFilters(){
const buttons = document.querySelectorAll('.filter-btn');
const refresh = () => {
const cards = document.querySelectorAll('.project');
const active = document.querySelector('.filter-btn.active');
const tag = active ? active.dataset.filter : 'all';
cards.forEach(card=>{
const tags = (card.dataset.tags||'').split(',').map(s=>s.trim());
card.style.display = (tag==='all' || tags.includes(tag)) ? 'block' : 'none';
});
};
buttons.forEach(btn=>btn.addEventListener('click',()=>{
buttons.forEach(b=>b.classList.remove('active'));
btn.classList.add('active');
refresh();
}));
// primeira render após carregar projetos
const mo = new MutationObserver(()=>refresh());
mo.observe(document.getElementById('grid'), {childList:true});
})();


loadRepos();