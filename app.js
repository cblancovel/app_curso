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
