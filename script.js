// ── Imágenes reales (ImgBB) ──────────────────────────────────────────────
const FOTOS = [
  'https://i.ibb.co/gMR6c2KT/d53ed4da-57a1-4005-a075-2dddda626a11.jpg',
  'https://i.ibb.co/CK83qKNm/294d4a4a-8d13-4cdb-8199-7f595f0b21aa.jpg',
  'https://i.ibb.co/XrVC8wVb/0976cbe0-6278-4106-9a7e-d407238d7e66.jpg'
];
const neon = ['#D01B1B','#8A0000','#FF2222'];

function ph(idx, label) {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="450">
      <defs><radialGradient id="g${idx}" cx="50%" cy="60%" r="55%">
        <stop offset="0%" stop-color="${neon[idx % 3]}" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#0C0C0C"/>
      </radialGradient></defs>
      <rect width="600" height="450" fill="url(#g${idx})"/>
      <text x="50%" y="46%" text-anchor="middle" font-family="serif" font-size="140" fill="rgba(208,27,27,0.18)" font-weight="bold">${String(idx + 1).padStart(2, '0')}</text>
      <text x="50%" y="60%" text-anchor="middle" font-family="sans-serif" font-size="22" fill="rgba(255,255,255,0.18)" letter-spacing="8">${label}</text>
    </svg>
  `)}`;
}

function setImg(el, src, idx, label) {
  if (!el) return;
  el.referrerPolicy = 'no-referrer';
  el.crossOrigin = 'anonymous';
  el.onerror = function () {
    this.onerror = null;
    this.src = ph(idx, label);
  };
  el.src = src;
}

// Slider
const sliderLbls = ['EL PECADO', 'LA LUJURIA', 'LA GULA'];
['img1', 'img2', 'img3'].forEach((id, i) => {
  setImg(document.getElementById(id), FOTOS[i], i, sliderLbls[i]);
});

// Tiles de burgers
const lbls = ['LA LUJURIA', 'EL PECADO', 'LA GULA', 'LA IRA', 'LA CONDENA', 'LA SOBERBIA'];
for (let i = 0; i < 6; i++) {
  const src = FOTOS[i % 3];
  setImg(document.getElementById(`t-img${i}`), src, i, lbls[i]);
  setImg(document.getElementById(`e-img${i}`), src, i, lbls[i]);
}

// ── Tabs ─────────────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const cat = this.dataset.cat;
    ['burgers', 'sides', 'bebidas'].forEach(c => {
      document.getElementById(`cat-${c}`).style.display = c === cat ? 'grid' : 'none';
    });
    document.querySelectorAll('.burger-tile.expanded').forEach(t => t.classList.remove('expanded'));
  });
});

// ── Toggle expand ─────────────────────────────────────────────────────────
document.querySelectorAll('.burger-tile').forEach(tile => {
  tile.addEventListener('click', function (e) {
    if (e.target.closest('.expand-close')) {
      this.classList.remove('expanded');
      return;
    }
    if (e.target.closest('.tile-add') || e.target.closest('.expand-add')) {
      const btn = e.target.closest('button');
      const orig = btn.textContent;
      btn.textContent = '✓';
      setTimeout(() => { btn.textContent = orig; }, 1500);
      return;
    }
    if (!this.querySelector('.expand-content')) return;
    const wasExpanded = this.classList.contains('expanded');
    document.querySelectorAll('.burger-tile.expanded').forEach(t => {
      if (t !== this) t.classList.remove('expanded');
    });
    this.classList.toggle('expanded');
    if (!wasExpanded) {
      setTimeout(() => {
        const r = this.getBoundingClientRect();
        if (r.top < 100) {
          window.scrollBy({ top: r.top - 100, behavior: 'smooth' });
        }
      }, 50);
    }
  });
});

// ── Slider dots ───────────────────────────────────────────────────────────
const slider = document.getElementById('slider');
const dots = document.querySelectorAll('.dot');
slider.addEventListener('scroll', () => {
  const w = slider.querySelector('.foto-slide').offsetWidth + 10;
  const i = Math.round(slider.scrollLeft / w);
  dots.forEach(d => d.classList.remove('active'));
  if (dots[i]) dots[i].classList.add('active');
}, { passive: true });
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const i = +dot.dataset.i;
    const w = slider.querySelector('.foto-slide').offsetWidth + 10;
    slider.scrollTo({ left: w * i, behavior: 'smooth' });
  });
});

// ── Smooth scroll ─────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ── Nav dropdown ──────────────────────────────────────────────────────────
const menuBtn = document.getElementById('menuBtn');
const navDropdown = document.getElementById('navDropdown');

function openMenu() {
  navDropdown.classList.add('open');
  menuBtn.classList.add('open');
  menuBtn.setAttribute('aria-expanded', 'true');
}
function closeMenu() {
  navDropdown.classList.remove('open');
  menuBtn.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}

menuBtn.addEventListener('click', e => {
  e.stopPropagation();
  navDropdown.classList.contains('open') ? closeMenu() : openMenu();
});

document.addEventListener('click', closeMenu);
navDropdown.addEventListener('click', e => e.stopPropagation());

function activateTab(cat) {
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.cat === cat);
  });
  ['burgers', 'sides', 'bebidas'].forEach(c => {
    document.getElementById(`cat-${c}`).style.display = c === cat ? 'grid' : 'none';
  });
  document.querySelectorAll('.burger-tile.expanded').forEach(t => t.classList.remove('expanded'));
}

navDropdown.querySelectorAll('.nav-drop-item').forEach(item => {
  item.addEventListener('click', () => {
    closeMenu();
    const action = item.dataset.action;
    const carta = document.getElementById('carta');
    carta.scrollIntoView({ behavior: 'smooth' });

    if (action === 'burgers') {
      activateTab('burgers');
    } else if (action === 'sides') {
      activateTab('sides');
    } else if (action === 'batidos' || action === 'bebidas') {
      activateTab('bebidas');
    } else if (action === 'reto') {
      activateTab('burgers');
      setTimeout(() => {
        const condena = document.querySelector('.burger-tile[data-id="4"]');
        if (condena) {
          document.querySelectorAll('.burger-tile.expanded').forEach(t => t.classList.remove('expanded'));
          condena.classList.add('expanded');
          setTimeout(() => {
            const r = condena.getBoundingClientRect();
            if (r.top < 100) window.scrollBy({ top: r.top - 100, behavior: 'smooth' });
          }, 50);
        }
      }, 600);
    }
  });
});
