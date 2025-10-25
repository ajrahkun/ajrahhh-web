const welcomeScreen = document.getElementById('welcomeScreen');
const welcomeInput = document.getElementById('welcomeInput');
const welcomeBtn = document.getElementById('welcomeBtn');
const chatContainerEl = document.getElementById('chatContainer');
const chatBox = document.getElementById('chat');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');

const urlParams = new URLSearchParams(window.location.search);
let currentModel = urlParams.get('model') || 'gemini';

welcomeBtn.addEventListener('click', startChat);
welcomeInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    startChat();
  }
});

function startChat() {
  const text = welcomeInput.value.trim();
  if (!text) return;
  welcomeScreen.style.opacity = '0';
  setTimeout(() => {
    welcomeScreen.style.display = 'none';
    chatContainerEl.style.display = 'flex';
  }, 300);
  setTimeout(() => {
    chatInput.value = text;
    sendMessage();
  }, 400);
}

sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

async function sendMessage() {
  const userText = chatInput.value.trim();
  if (!userText) return;
  appendMessage(userText, 'user');
  chatInput.value = '';
  chatInput.style.height = 'auto';
  const loadingMsg = appendMessage('', 'ai', true);
  const bubble = loadingMsg.querySelector('.bubble');

  async function fetchReply() {
    if (currentModel === 'copilot') {
      const response = await fetch(`https://sumi-ai-backend.vercel.app/api/copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText })
      });
      const data = await response.json();
      return data.reply || 'Empety Response :(';
    } else {
      const response = await fetch(`https://sumi-ai-backend.vercel.app/api/${currentModel}.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userText }),
      });
      const data = await response.json();
      return data.reply || data.text || data.message || 'No Response :(';
    }
  }

  try {
    let reply = '';
    try {
      reply = await fetchReply();
    } catch (err) {
      if (currentModel === 'gemini') {
        await new Promise(r => setTimeout(r, 1000));
        reply = await fetchReply();
      } else {
        throw err;
      }
    }
    await new Promise(r => setTimeout(r, 700));
    bubble.classList.remove('typing');
    bubble.innerHTML = formatMarkdown(reply.trim());
    bubble.classList.add('fade-slide');
    setTimeout(() => {
      chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
    }, 100);
  } catch (err) {
    console.error(err);
    bubble.textContent = 'Empety Response :(';
  }
  setTimeout(() => {
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
  }, 100);
}

function appendMessage(text, sender, isLoading = false) {
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message', sender);
  const bubble = document.createElement('div');
  bubble.classList.add('bubble', sender);
  if (isLoading) {
    bubble.innerHTML = `<div class='typing'><span></span><span></span><span></span></div>`;
  } else {
    bubble.innerHTML = formatMarkdown(text);
  }
  messageDiv.appendChild(bubble);
  chatBox.appendChild(messageDiv);
  setTimeout(() => {
    chatBox.scrollTo({ top: chatBox.scrollHeight, behavior: 'smooth' });
  }, 50);
  return messageDiv;
}

function formatMarkdown(text) {
  text = text.replace(/\\\*/g, '*');
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  text = text.replace(/^\s*\*\s+/gm, '• ');
  if (/\|(.+)\|/.test(text)) {
    const lines = text.trim().split('\n');
    const rows = lines
      .filter(line => /\|/.test(line) && !/^(\s*\|?\s*-+\s*)+\|?\s*$/.test(line))
      .map(line =>
        '<tr>' +
        line
          .split('|')
          .filter(cell => cell.trim() !== '')
          .map(cell => `<td>${cell.trim()}</td>`)
          .join('') +
        '</tr>'
      )
      .join('');
    const tableHtml = `<div class="markdown-table"><table>${rows}</table></div>`;
    text = text.replace(/((?:\|.+\|\n?)+)/g, tableHtml);
  }
  return text;
}

chatInput.addEventListener('input', () => {
  chatInput.style.height = 'auto';
  chatInput.style.height = chatInput.scrollHeight + 'px';
});

welcomeInput.addEventListener('input', () => {
  welcomeInput.style.height = 'auto';
  const newHeight = Math.min(welcomeInput.scrollHeight, 200);
  welcomeInput.style.height = newHeight + 'px';
  const wrapper = welcomeInput.parentElement;
  if (newHeight > 60) {
    wrapper.classList.add('active');
  } else {
    wrapper.classList.remove('active');
  }
});

const menuBtn = document.getElementById('menuBtn');
const menuPopup = document.getElementById('menuPopup');
const modelModal = document.getElementById('modelModal');
const changeModelBtn = document.getElementById('changeModelBtn');
const closeModel = document.getElementById('closeModel');

if (menuBtn && menuPopup) {
  document.addEventListener('click', (e) => {
    if (menuBtn.contains(e.target)) {
      menuPopup.classList.toggle('show');
    } else if (!menuPopup.contains(e.target)) {
      menuPopup.classList.remove('show');
    }
  });
}

if (changeModelBtn && modelModal) {
  changeModelBtn.addEventListener('click', () => {
    menuPopup.classList.remove('show');
    modelModal.classList.add('show');
  });
}

if (closeModel && modelModal) {
  closeModel.addEventListener('click', () => {
    modelModal.classList.remove('show');
  });
  modelModal.addEventListener('click', (e) => {
    if (e.target === modelModal) {
      modelModal.classList.remove('show');
    }
  });
}

document.querySelectorAll('.model-option').forEach((btn) => {
  btn.addEventListener('click', () => {
    const modelName = btn.textContent.trim().toLowerCase();
    currentModel = modelName;
    const newUrl = `${window.location.origin}${window.location.pathname}?model=${modelName}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    modelModal.classList.remove('show');
    const chatHeader = document.querySelector('h2');
    if (chatHeader) {
      chatHeader.textContent = `Sumi AI 🤖 (${modelName.toUpperCase()})`;
    }
    showModelPopup(modelName);
  });
});

const menuBtnChat = document.getElementById('menuBtnChat');
const menuPopupChat = document.getElementById('menuPopupChat');
const changeModelBtnChat = document.getElementById('changeModelBtnChat');

if (menuBtnChat && menuPopupChat) {
  document.addEventListener('click', (e) => {
    if (menuBtnChat.contains(e.target)) {
      menuPopupChat.classList.toggle('show');
    } else if (!menuPopupChat.contains(e.target)) {
      menuPopupChat.classList.remove('show');
    }
  });
}

if (changeModelBtnChat && modelModal) {
  changeModelBtnChat.addEventListener('click', () => {
    menuPopupChat.classList.remove('show');
    modelModal.classList.add('show');
  });
}

function showModelPopup(model) {
  const popup = document.createElement('div');
  popup.textContent = `Model saat ini : ${model.toUpperCase()}`;
  Object.assign(popup.style, {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    background: 'rgba(255, 255, 255, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(10px)',
    padding: '12px 22px',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '14px',
    opacity: '0',
    transition: 'all 0.5s ease',
    zIndex: '2000',
    letterSpacing: '0.3px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    pointerEvents: 'none'
  });
  const inWelcome = welcomeScreen && welcomeScreen.style.display !== 'none';
  if (inWelcome) {
    popup.style.bottom = '-60px';
  } else {
    popup.style.top = '-60px';
  }
  document.body.appendChild(popup);
  setTimeout(() => {
    if (inWelcome) {
      popup.style.bottom = '40px';
      popup.style.opacity = '1';
    } else {
      popup.style.top = '40px';
      popup.style.opacity = '1';
    }
  }, 50);
  setTimeout(() => {
    if (inWelcome) {
      popup.style.bottom = '-60px';
      popup.style.opacity = '0';
    } else {
      popup.style.top = '-60px';
      popup.style.opacity = '0';
    }
    setTimeout(() => popup.remove(), 500);
  }, 3000);
}

showModelPopup(currentModel);

window.addEventListener('load', () => {
  const loader = document.getElementById('loading-loader');
  setTimeout(() => {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 600);
  }, 1200);
});

function onVerified() {
  const overlay = document.getElementById("cf-overlay");
  setTimeout(() => {
    overlay.classList.add("hidden");
    setTimeout(() => overlay.remove(), 600);
  }, 300);
}

document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("cf-overlay");

  if (overlay) {
    document.body.style.overflow = "hidden";
  }

  window.onVerified = () => {
    overlay.classList.add("hidden");
    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = "auto";
    }, 600);
  };
});
