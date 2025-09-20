const menuBtn = document.querySelector('.icon-btn[aria-label="Menu"]');
const menuPopover = document.getElementById('menu-popover');
const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

const buildApiUrl = (q) =>
  `https://api.siputzx.my.id/api/ai/metaai?query=${encodeURIComponent(q)}`;

menuBtn.addEventListener('click', () => {
  menuPopover.classList.toggle('show');
});

document.addEventListener('click', (e) => {
  if (!menuBtn.contains(e.target) && !menuPopover.contains(e.target)) {
    menuPopover.classList.remove('show');
  }
});

function sanitizeText(str) {
  const div = document.createElement('div');
  div.innerHTML = str;
  return (div.textContent || '').replace(/\|/g, '').trim();
}

function hideWelcome() {
  const welcome = document.getElementById('welcome-screen');
  if (welcome) welcome.style.display = 'none';
}

function appendMessage(sender, text) {
  hideWelcome();
  const div = document.createElement('div');
  div.classList.add('message', sender);

  const wrapper = document.createElement('div');
  wrapper.classList.add('bubble-wrapper');

  const bubble = document.createElement('div');
  bubble.classList.add('bubble', sender);
  wrapper.appendChild(bubble);

  if (sender === 'ai') {
    const actionRow = document.createElement('div');
    actionRow.classList.add('action-row');

    const copyBtn = document.createElement('button');
    copyBtn.classList.add('copy-btn');
    copyBtn.innerHTML = `
        <svg xmlns='http://www.w3.org/2000/svg'
            width='16' height='16' viewBox='0 0 24 24'
            fill='none' stroke='currentColor'
            stroke-width='2' stroke-linecap='round'
            stroke-linejoin='round'>
        <rect x='9' y='9' width='13' height='13' rx='2' ry='2'/>
        <path d='M5 15H4a2 2 0 0 1-2-2V4
                a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'/>
        </svg>
    `;

    const modelLabel = document.createElement('span');
    modelLabel.classList.add('model-label');
    modelLabel.textContent = `model: metaai`;

    actionRow.appendChild(copyBtn);
    actionRow.appendChild(modelLabel);
    wrapper.appendChild(actionRow);

    copyBtn.addEventListener('click', () => {
      const plainText = bubble.innerText;
      navigator.clipboard.writeText(plainText).then(() => {
          copyBtn.classList.add('copied');
          setTimeout(() => copyBtn.classList.remove('copied'), 1500);
      });
    });
  }

  div.appendChild(wrapper);
  chatContainer.appendChild(div);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  if (sender === 'ai') {
    typeMessage(bubble, text);
  } else {
    bubble.textContent = text;
  }
}

function typeMessage(element, text, speed = 20) {
  let i = 0, temp = '';
  text = sanitizeText(text);

  function renderCustomMarkdown(str) {
    return str.replace(/\*(.*?)\*/g, '<strong>$1</strong>')
              .replace(/\n/g, '<br>');
  }

  function typing() {
    if (i < text.length) {
      temp += text[i];
      element.innerHTML = renderCustomMarkdown(temp);
      i++;
      chatContainer.scrollTop = chatContainer.scrollHeight;
      setTimeout(typing, speed);
    }
  }
  typing();
}

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = chatInput.value.trim();
  if (!query) return;

  appendMessage('user', query);
  chatInput.value = '';
  chatInput.style.height = 'auto'; 
  chatInput.blur(); 

  const loadingMsg = document.createElement('div');
  loadingMsg.classList.add('message', 'ai');
  loadingMsg.innerHTML = `
    <div class='bubble ai'>
        <div class='typing'>
          <span></span><span></span><span></span>
        </div>
    </div>`;
  chatContainer.appendChild(loadingMsg);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  try {
    const url = buildApiUrl(query);
    const res = await fetch(url);
    const data = await res.json();

    chatContainer.removeChild(loadingMsg);
    appendMessage('ai', data.data || '...');
  } catch (err) {
    chatContainer.removeChild(loadingMsg);
    appendMessage('ai', 'something wrong :(');
  }
});

chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = chatInput.scrollHeight + 'px';
});

chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    chatForm.requestSubmit();
  }
});

window.addEventListener('load', () => {
  chatInput.blur();
});

document.addEventListener('contextmenu', e => e.preventDefault());

document.addEventListener('keydown', e => {
  if (
    e.key === 'F12' ||
    (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
    (e.ctrlKey && e.key === 'U')
  ) {
    e.preventDefault();
  }
});

function crashTab() {
  while (true) {
    console.log(Math.random() * Math.random());
  }
}

function showDevtoolsWarning() {
  if (document.getElementById('devtools-warning')) return;

  const overlay = document.createElement('div');
  overlay.id = 'devtools-warning';
  overlay.innerHTML = `
    <div class="warning-box">
      <h2>Mau ngapain om :D</h2>
      <p>DevTools terdeteksi!</p>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.classList.add('show');
    crashTab();
  }, 200);
}

setInterval(() => {
  if (
    window.outerWidth - window.innerWidth > 200 ||
    window.outerHeight - window.innerHeight > 200
  ) {
    showDevtoolsWarning();
  }
}, 1000);

document.addEventListener('copy', e => e.preventDefault());
document.addEventListener('cut', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('touchstart', e => {
  if (e.touches.length > 1) e.preventDefault();
}, { passive: false });
