const toolBtn = document.getElementById('toolBtn');
const sideMenu = document.getElementById('sideMenu');
const closeBtn = document.getElementById('closeBtn');
const overlay = document.getElementById('overlay');

toolBtn.addEventListener('click', () => {
  sideMenu.classList.remove('translate-x-full');
  overlay.classList.remove('opacity-0', 'pointer-events-none');
  overlay.classList.add('opacity-100');
  document.body.style.overflow = 'hidden';
});

function closeMenu() {
  sideMenu.classList.add('translate-x-full');
  overlay.classList.remove('opacity-100');
  overlay.classList.add('opacity-0', 'pointer-events-none');
  document.body.style.overflow = '';
}

closeBtn.addEventListener('click', closeMenu);
overlay.addEventListener('click', closeMenu);

window.addEventListener('load', () => {
  if (window.location.hash) {
    history.replaceState(null, null, ' ');
  }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

window.addEventListener('load', () => {
  const loading = document.getElementById('loading');
  loading.style.transition = 'opacity 0.5s';
  loading.style.opacity = '0';
  setTimeout(() => loading.style.display = 'none', 500);
});

const fullTitle = "Jraa Senpai";
let index = 1;
let forward = true;

setInterval(() => {
  document.title = fullTitle.slice(0, index);

  if (forward) {
    index++;
    if (index >= fullTitle.length) forward = false;
  } else {
    index--;
    if (index <= 1) forward = true;
  }
}, 300);
