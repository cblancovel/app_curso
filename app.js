// Tab navigation
const tabs = document.querySelectorAll('.tab');
const sections = document.querySelectorAll('main > section');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
    sections.forEach(s => s.hidden = true);
    tab.setAttribute('aria-selected', 'true');
    document.getElementById(tab.getAttribute('aria-controls')).hidden = false;
    history.replaceState(null, '', `#${tab.getAttribute('aria-controls')}`);
  });
});

// deep link by hash
const hash = location.hash.replace('#','');
if (hash) {
  const t = document.querySelector(`.tab[aria-controls="${hash}"]`);
  if (t) t.click();
}

// Load notices/materials
async function loadJSON(path) {
  try {
    const res = await fetch(path);
    return await res.json();
  } catch (e) {
    return null;
  }
}

// Notices
loadJSON('data/notices.json').then(data => {
  if (!data) return;
  const wrap = document.getElementById('avisos-list');
  wrap.innerHTML = '';
  data.notices.forEach(n => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div class="pill">${n.date}</div><div class="block-title">${n.title}</div><div class="muted">${n.body}</div>`;
    wrap.appendChild(card);
  });
  if (data.channel) {
    const link = document.getElementById('canal-link');
    link.href = data.channel;
  }
});

// Materials
loadJSON('data/materials.json').then(data => {
  if (!data) return;
  const wrap = document.getElementById('materiales-list');
  wrap.innerHTML = '';
  data.materials.forEach(m => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div class="block-title">${m.title}</div><div class="muted">${m.desc||''}</div><p><a class="btn" href="${m.href}" target="_blank" rel="noopener">Abrir</a></p>`;
    wrap.appendChild(card);
  });
  // surveys & live Q&A
  if (data.surveys) {
    ['day1','day2','day3','day4'].forEach((k,i)=>{
      const el = document.getElementById(`survey-${k}`);
      if (el && data.surveys[k]) el.href = data.surveys[k];
    });
  }
  if (data.liveQA) {
    const l = document.getElementById('live-qa');
    l.href = data.liveQA;
  }
});

// PWA install
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js');
  });
}

// === Ponentes ===
function initialsFromName(name){
  return (name||"")
    .split(/\s+/).map(p=>p[0]).filter(Boolean).slice(0,2)
    .join('').toUpperCase();
}

function openSpeakerModal(s){
  const modal=document.getElementById('speaker-modal'); if(!modal) return;
  modal.hidden=false;
  document.getElementById('sp-name').textContent = s.name||'';
  document.getElementById('sp-role').textContent = [s.title,s.org].filter(Boolean).join(' · ');
  document.getElementById('sp-bio').textContent = s.bio||'';
  const img=document.getElementById('sp-photo');
  if(s.photo){ img.src=s.photo; img.alt=`Foto de ${s.name}`; img.style.display='block'; }
  else { img.removeAttribute('src'); img.alt=''; img.style.display='none'; }
  const link=document.getElementById('sp-linkedin');
  if(s.linkedin){ link.href=s.linkedin; link.style.display='inline-block'; }
  else { link.style.display='none'; }
}
function closeSpeakerModal(){ const m=document.getElementById('speaker-modal'); if(m) m.hidden=true; }
document.getElementById('speaker-modal')?.addEventListener('click',e=>{ if(e.target.id==='speaker-modal') closeSpeakerModal(); });
document.querySelector('.modal-close')?.addEventListener('click', closeSpeakerModal);
document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeSpeakerModal(); });

loadJSON('data/speakers.json').then(data=>{
  if(!data || !data.speakers) return;
  const grid=document.getElementById('speakers-grid'); if(!grid) return;
  grid.innerHTML='';
  data.speakers.forEach(s=>{
    const card=document.createElement('div'); card.className='speaker-card';
    const initials=initialsFromName(s.name);
    card.innerHTML = `
      <div class="photo-wrap">
        <img ${s.photo?`src="${s.photo}"`:''} alt="${s.name?`Foto de ${s.name}`:''}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <div class="initials" style="display:${s.photo?'none':'block'}">${initials}</div>
      </div>
      <div class="speaker-name">${s.name||''}</div>
      <div class="speaker-role">${[s.title,s.org].filter(Boolean).join(' · ')}</div>
    `;
    card.addEventListener('click', ()=> openSpeakerModal(s));
    grid.appendChild(card);


  
// === Panelistas (nuevo) ===
function openPanelistModal(p){
  const modal = document.getElementById('panelist-modal'); 
  if(!modal) return;
  modal.hidden = false;
  const nameEl = modal.querySelector('#pl-name');
  const roleEl = modal.querySelector('#pl-role');
  const bioEl  = modal.querySelector('#pl-bio');
  const img    = modal.querySelector('#pl-photo');
  const link   = modal.querySelector('#pl-linkedin');

  if (nameEl) nameEl.textContent = p.name || '';
  if (roleEl) roleEl.textContent = [p.title, p.org].filter(Boolean).join(' · ');
  if (bioEl)  bioEl.textContent  = p.bio || '';

  if (img){
    if(p.photo){ img.src = p.photo; img.alt = `Foto de ${p.name||''}`; img.style.display = 'block'; }
    else { img.removeAttribute('src'); img.alt=''; img.style.display='none'; }
  }
  if (link){
    if(p.linkedin){ link.href = p.linkedin; link.style.display='inline-block'; }
    else { link.style.display='none'; }
  }
}
function closePanelistModal(){ 
  const m = document.getElementById('panelist-modal'); 
  if(m) m.hidden = true; 
}
document.getElementById('panelist-modal')?.addEventListener('click', e => { 
  if (e.target.id === 'panelist-modal') closePanelistModal(); 
});
document.getElementById('panelist-modal')?.querySelector('.modal-close')?.addEventListener('click', closePanelistModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePanelistModal(); });

loadJSON('data/panelists.json').then(data=>{
  if(!data || !data.panelists) return;
  const grid = document.getElementById('panelists-grid'); 
  if(!grid) return;
  grid.innerHTML = '';
  data.panelists.forEach(p=>{
    const card = document.createElement('div'); 
    card.className = 'speaker-card';
    const initials = initialsFromName(p.name);
    card.innerHTML = `
      <div class="photo-wrap">
        <img ${p.photo?`src="${p.photo}"`:''} alt="${p.name?`Foto de ${p.name}`:''}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
        <div class="initials" style="display:${p.photo?'none':'block'}">${initials}</div>
      </div>
      <div class="speaker-name">${p.name||''}</div>
      <div class="speaker-role">${[p.title,p.org].filter(Boolean).join(' · ')}</div>
    `;
    card.addEventListener('click', ()=> openPanelistModal(p));
    grid.appendChild(card);

  });
});
