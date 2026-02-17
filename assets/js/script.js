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

  setTimeout(() => {
    loading.style.transition = 'opacity 0.5s';
    loading.style.opacity = '0';

    setTimeout(() => {
      loading.style.display = 'none';
    }, 500);
  }, 1000); 
});

const donasiBtn = document.getElementById('donasiBtn');
const donasiModal = document.getElementById('donasiModal');
const closeModal = document.getElementById('closeModal');

function openModal() {
  donasiModal.classList.remove('hidden');
  setTimeout(() => {
    donasiModal.classList.add('opacity-100');
    donasiModal.firstElementChild.classList.add('scale-100');
  }, 10);
}

function closeModalFunc() {
  donasiModal.classList.remove('opacity-100');
  donasiModal.firstElementChild.classList.remove('scale-100');
  setTimeout(() => {
    donasiModal.classList.add('hidden');
  }, 300);
}

donasiBtn.addEventListener('click', openModal);
closeModal.addEventListener('click', closeModalFunc);
donasiModal.addEventListener('click', e => {
  if (e.target === donasiModal) closeModalFunc();
});

const infoBtn = document.getElementById('infoBtn');
const infoModal = document.getElementById('infoModal');
const modalCard = infoModal.querySelector('div');
const infoModalCloseBtn = document.getElementById('infoModalCloseBtn');

infoBtn.addEventListener('click', () => {
  infoModal.classList.remove('opacity-0', 'pointer-events-none');
  infoModal.classList.add('opacity-100');
  modalCard.classList.remove('scale-95');
  modalCard.classList.add('scale-100');
  document.body.classList.add('overflow-hidden');
});

infoModal.addEventListener('click', e => {
  if (e.target === infoModal) {
    infoModal.classList.remove('opacity-100');
    infoModal.classList.add('opacity-0', 'pointer-events-none');
    modalCard.classList.remove('scale-100');
    modalCard.classList.add('scale-95');
    document.body.classList.remove('overflow-hidden');
  }
});

infoModalCloseBtn.addEventListener('click', () => {
  infoModal.classList.remove('opacity-100');
  infoModal.classList.add('opacity-0', 'pointer-events-none');
  modalCard.classList.remove('scale-100');
  modalCard.classList.add('scale-95');
  document.body.classList.remove('overflow-hidden');
});

document.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('keydown', e => {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C' || e.key === 'J')) ||
    (e.ctrlKey && e.key === 'U')
  ) {
    e.preventDefault();
  }
});

(function() {
  let devtoolsOpen = false;
  const threshold = 160;

  const modal = document.getElementById('devtoolsModal');
  const modalCard = modal.querySelector('div');

  function showModal() {
    modal.classList.remove('opacity-0', 'pointer-events-none');
    modal.classList.add('opacity-100');
    modalCard.classList.remove('scale-95');
    modalCard.classList.add('scale-100');
    document.body.classList.add('overflow-hidden');

    setTimeout(() => {
      window.location.href = 'https://ajrahhh.my.id';
    }, 1000);
  }

  setInterval(() => {
    if (
      window.outerWidth - window.innerWidth > threshold ||
      window.outerHeight - window.innerHeight > threshold
    ) {
      if (!devtoolsOpen) {
        devtoolsOpen = true;
        showModal();
      }
    } else {
      devtoolsOpen = false;
    }
  }, 1000);
})();
