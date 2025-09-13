const GITHUB_USER = 'magalps';
const INTEREST_LANGS = new Set(['JavaScript','TypeScript','Python','HTML','CSS','Java','Jupyter Notebook','SQL']);


document.getElementById('y').textContent = new Date().getFullYear();


const gh = document.getElementById('gh-link');
if (gh) gh.href = `https://github.com/${GITHUB_USER}`;


const buttons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.project');
buttons.forEach(btn=>btn.addEventListener('click',()=>{
buttons.forEach(b=>b.classList.remove('active'));
btn.classList.add('active');
const tag = btn.dataset.filter;
cards.forEach(card=>{
const tags = (card.dataset.tags||'').split(',').map(s=>s.trim());
card.style.display = (tag==='all' || tags.includes(tag)) ? 'block' : 'none';
});
}));


async function loadRepos(){
if(!GITHUB_USER || GITHUB_USER==='magalps') return;
try{
const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`);
const data = await res.json();
if(!Array.isArray(data)) return;


const filtered = data
.filter(r => !r.fork && !r.archived && !r.private)
.filter(r => !r.name.includes('.github.io'))
.sort((a,b)=> (b.stargazers_count||0) - (a.stargazers_count||0));


const grid = document.getElementById('grid');
if(!grid) return;


let count = 0;
for(const r of filtered){
const lang = r.language || 'JS';
if(!INTEREST_LANGS.has(lang) && count>6) continue;
const tags = [lang];
const card = document.createElement('article');
card.className = 'project';
card.dataset.tags = mapLangToFilter(lang);
card.innerHTML = `
<h3>${escapeHtml(r.name)}</h3>
<p>${escapeHtml(r.description || 'Projeto no GitHub')}</p>
<div class="tags">${tags.map(t=>`<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
<a class="btn small" href="${r.html_url}" target="_blank" rel="noreferrer">Ver repositório</a>
`;
grid.appendChild(card);
count++; if(count>=12) break;
}
}catch(e){console.warn('Falha ao carregar repositórios', e);}
}


function mapLangToFilter(lang){
switch(lang){
case 'JavaScript': return 'JS';
case 'TypeScript': return 'JS';
case 'HTML':
case 'CSS': return 'HTML/CSS';
case 'Python': return 'Python';
case 'Java': return 'Java';
case 'Jupyter Notebook': return 'Python';
case 'TSQL': case 'PLSQL': case 'SQL': return 'SQL';
default: return 'JS';
}
}


function escapeHtml(str){
return str.replace(/[&<>\"]+/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[s]));
}


loadRepos();