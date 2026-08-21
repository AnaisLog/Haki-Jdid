// ===========================================================
// effects.js — Prononciation audio (TTS) & célébrations (confetti)
// Inspiré du site "Grec pour Karpathos"
// ===========================================================

/* ——— SPEECH SYNTHESIS (prononciation arabe) ——— */
let arabicVoice = null;
let ttsReady = false;

function initTTS() {
  if (!window.speechSynthesis) return;
  function findArabicVoice() {
    const voices = window.speechSynthesis.getVoices();
    arabicVoice =
      voices.find(v => v.lang === "ar-JO") ||
      voices.find(v => v.lang === "ar-SA") ||
      voices.find(v => v.lang.startsWith("ar")) ||
      null;
    ttsReady = true;
    document.querySelectorAll(".tts-notice").forEach(el => {
      el.classList.toggle("visible", !arabicVoice);
    });
  }
  if (window.speechSynthesis.getVoices().length > 0) {
    findArabicVoice();
  } else {
    window.speechSynthesis.onvoiceschanged = findArabicVoice;
    // Filet de sécurité : certains navigateurs ne déclenchent jamais
    // "voiceschanged" quand ils n'ont aucune voix installée. Sans ce
    // délai, la notice "voix indisponible" ne s'afficherait jamais.
    setTimeout(() => { if (!ttsReady) findArabicVoice(); }, 800);
  }
}

function speak(text, btn) {
  if (!window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = "ar-JO";
  utt.rate = 0.82;
  utt.pitch = 1;
  if (arabicVoice) utt.voice = arabicVoice;
  if (btn) {
    btn.classList.add("speaking");
    utt.onend = () => btn.classList.remove("speaking");
    utt.onerror = () => btn.classList.remove("speaking");
  }
  window.speechSynthesis.speak(utt);
}

/* ——— CONFETTI ——— */
let confettiCanvas = null;
let confettiCtx = null;
let confettiParticles = [];
let confettiAnimId = null;

function ensureConfettiCanvas() {
  if (confettiCanvas) return;
  confettiCanvas = document.createElement("canvas");
  confettiCanvas.id = "confetti-canvas";
  document.body.appendChild(confettiCanvas);
  confettiCtx = confettiCanvas.getContext("2d");
}

function launchConfetti() {
  ensureConfettiCanvas();
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  confettiParticles = [];
  const colors = ["#1C5C53", "#2E8074", "#D7943C", "#FFFFFF", "#B8503A", "#F6E7CC", "#DDEAE6"];
  for (let i = 0; i < 120; i++) {
    confettiParticles.push({
      x: Math.random() * confettiCanvas.width,
      y: -10 - Math.random() * 100,
      w: 6 + Math.random() * 8,
      h: 10 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 4,
      angle: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 0.15,
      life: 1,
    });
  }
  if (confettiAnimId) cancelAnimationFrame(confettiAnimId);
  animateConfetti();
}

function animateConfetti() {
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiParticles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.angle += p.spin;
    p.life -= 0.008;
    confettiCtx.save();
    confettiCtx.globalAlpha = Math.max(0, p.life);
    confettiCtx.translate(p.x + p.w / 2, p.y + p.h / 2);
    confettiCtx.rotate(p.angle);
    confettiCtx.fillStyle = p.color;
    confettiCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    confettiCtx.restore();
  });
  confettiParticles = confettiParticles.filter(p => p.life > 0 && p.y < confettiCanvas.height + 20);
  if (confettiParticles.length > 0) confettiAnimId = requestAnimationFrame(animateConfetti);
  else confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}

function ensureCelebrationBox() {
  if (document.getElementById("celebrate-box")) return;
  const box = document.createElement("div");
  box.className = "celebrate";
  box.id = "celebrate-box";
  box.innerHTML = `
    <span class="celebrate-emoji" id="celebrate-emoji">🎉</span>
    <h2 id="celebrate-title">Bravo !</h2>
    <p id="celebrate-msg">Excellent travail !</p>
  `;
  document.body.appendChild(box);
}

function showCelebration(emoji, title, msg) {
  ensureCelebrationBox();
  launchConfetti();
  const box = document.getElementById("celebrate-box");
  document.getElementById("celebrate-emoji").textContent = emoji;
  document.getElementById("celebrate-title").textContent = title;
  document.getElementById("celebrate-msg").textContent = msg;
  box.classList.add("show");
  setTimeout(() => box.classList.remove("show"), 2800);
}

document.addEventListener("DOMContentLoaded", initTTS);
