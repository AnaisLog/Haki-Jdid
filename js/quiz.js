// ===========================================================
// quiz.js — Moteur de révision : flashcards, QCM, texte à trous
// ===========================================================

let quizState = null; // { mode, scope, pool, index, score, history }

function buildPool(scope) {
  let words;
  if (scope === "arabic") words = allArabicWords();
  else if (scope === "nursing") words = allNursingWords();
  else words = allWords();

  words = words.filter(w => w.complete !== false && w.french && w.phonetic);

  // Priorise les mots marqués "à revoir" / jamais vus, via un léger mélange pondéré
  const progress = getProgress();
  const weighted = [];
  words.forEach(w => {
    const status = progress[w.id];
    const weight = status === "unknown" ? 3 : status === "known" ? 1 : 2;
    for (let i = 0; i < weight; i++) weighted.push(w);
  });

  // Mélange (Fisher-Yates) puis déduplique en gardant l'ordre de première apparition mélangée
  for (let i = weighted.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [weighted[i], weighted[j]] = [weighted[j], weighted[i]];
  }
  const seen = new Set();
  const pool = [];
  weighted.forEach(w => {
    if (!seen.has(w.id)) { seen.add(w.id); pool.push(w); }
  });
  return pool;
}

function renderQuizHome(view, sub) {
  if (sub === "run") return; // handled by runner, kept for safety
  const totalAvailable = allWords().filter(w => w.complete !== false && w.french && w.phonetic).length;

  view.innerHTML = `
    <div class="quiz-intro">
      <h1>🧠 Réviser</h1>
      <p>${totalAvailable} mots et phrases sont prêts à être révisés (les entrées incomplètes sont automatiquement exclues).</p>
    </div>

    <div class="scope-row" id="scope-row">
      <button data-scope="all" class="active">Tout (arabe + infirmier)</button>
      <button data-scope="arabic">Arabe seulement</button>
      <button data-scope="nursing">Infirmier seulement</button>
    </div>

    <div class="mode-grid">
      <button class="mode-card" data-mode="flashcards">
        <div class="ic">🃏</div>
        <h3>Flashcards</h3>
        <p>Le mot arabe d'un côté, la traduction de l'autre. Clique pour retourner.</p>
      </button>
      <button class="mode-card" data-mode="qcm-fr">
        <div class="ic">✅</div>
        <h3>QCM — Arabe → Français</h3>
        <p>On te montre le mot arabe, tu choisis la bonne traduction parmi 4.</p>
      </button>
      <button class="mode-card" data-mode="qcm-ar">
        <div class="ic">🔄</div>
        <h3>QCM — Français → Arabe</h3>
        <p>On te montre la traduction, tu choisis la bonne transcription parmi 4.</p>
      </button>
    </div>
  `;

  let scope = "all";
  view.querySelectorAll("#scope-row button").forEach(btn => {
    btn.addEventListener("click", () => {
      view.querySelectorAll("#scope-row button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      scope = btn.dataset.scope;
    });
  });

  view.querySelectorAll(".mode-card").forEach(btn => {
    btn.addEventListener("click", () => startQuiz(view, btn.dataset.mode, scope));
  });
}

function startQuiz(view, mode, scope) {
  const pool = buildPool(scope).slice(0, 20); // session de 20 max, pour rester digeste
  if (pool.length < 4 && mode !== "flashcards") {
    view.innerHTML = `<div class="empty-state"><div class="ic">😅</div><p>Pas encore assez de mots complets dans cette sélection pour un QCM (il en faut au moins 4). Essaie "Tout" ou les flashcards !</p><button class="btn btn-outline btn-small" id="back-quiz">← Retour</button></div>`;
    document.getElementById("back-quiz").addEventListener("click", () => renderQuizHome(view));
    return;
  }
  if (pool.length === 0) {
    view.innerHTML = `<div class="empty-state"><div class="ic">😅</div><p>Pas de mots complets disponibles ici.</p></div>`;
    return;
  }
  quizState = { mode, scope, pool, index: 0, score: 0, total: pool.length, flipped: false };
  renderQuizStep(view);
}

function renderQuizStep(view) {
  const { mode, pool, index, total } = quizState;
  if (index >= total) return renderQuizResult(view);

  const word = pool[index];
  const pct = Math.round((index / total) * 100);

  const header = `
    <div class="quiz-runner">
      <div class="quiz-progress">
        <div class="bar"><div style="width:${pct}%"></div></div>
        <div class="count">${index + 1}/${total}</div>
      </div>
  `;

  if (mode === "flashcards") {
    view.innerHTML = header + `
      <div class="quiz-card" id="flash-card">
        <div class="helper">Arabe</div>
        <div class="arabic-big">${escapeHtml(word.arabic)}</div>
        <div class="phonetic-big">${escapeHtml(word.phonetic)}</div>
        <div class="flashcard-flip-hint" id="flip-hint">👆 Clique pour voir la traduction</div>
      </div>
      <div class="flash-actions" id="flash-actions" style="display:none;">
        <button class="btn btn-outline" data-result="unknown">↻ À revoir</button>
        <button class="btn" data-result="known">✓ Je savais !</button>
      </div>
    </div>`;
    const card = document.getElementById("flash-card");
    card.addEventListener("click", () => {
      if (quizState.flipped) return;
      quizState.flipped = true;
      card.innerHTML = `
        <div class="helper">Français</div>
        <div class="prompt-fr">${escapeHtml(word.french)}</div>
        <div class="phonetic-big">${escapeHtml(word.phonetic)}</div>
      `;
      document.getElementById("flash-actions").style.display = "flex";
    });
    view.querySelectorAll("[data-result]").forEach(btn => {
      btn.addEventListener("click", () => {
        setWordStatus(word.id, btn.dataset.result);
        if (btn.dataset.result === "known") quizState.score++;
        quizState.index++;
        quizState.flipped = false;
        renderQuizStep(view);
      });
    });
  }

  if (mode === "qcm-fr" || mode === "qcm-ar") {
    const isFr = mode === "qcm-fr";
    const correctAnswer = isFr ? word.french : word.phonetic;
    const distractorsPool = quizState.pool.filter(w => w.id !== word.id);
    const distractors = shuffle(distractorsPool).slice(0, 3).map(w => isFr ? w.french : w.phonetic);
    const options = shuffle([correctAnswer, ...distractors]);

    view.innerHTML = header + `
      <div class="quiz-card">
        <div class="helper">${isFr ? "Quelle est la traduction ?" : "Quelle est la transcription ?"}</div>
        ${isFr
          ? `<div class="arabic-big">${escapeHtml(word.arabic)}</div><div class="phonetic-big">${escapeHtml(word.phonetic)}</div>`
          : `<div class="prompt-fr">${escapeHtml(word.french)}</div>`
        }
      </div>
      <div class="qcm-options">
        ${options.map(opt => `<button data-opt="${escapeHtml(opt)}">${escapeHtml(opt)}</button>`).join("")}
      </div>
    </div>`;

    view.querySelectorAll(".qcm-options button").forEach(btn => {
      btn.addEventListener("click", () => {
        const isCorrect = btn.dataset.opt === correctAnswer;
        view.querySelectorAll(".qcm-options button").forEach(b => {
          b.disabled = true;
          if (b.dataset.opt === correctAnswer) b.classList.add("correct");
          else if (b === btn) b.classList.add("wrong");
        });
        setWordStatus(word.id, isCorrect ? "known" : "unknown");
        if (isCorrect) quizState.score++;
        setTimeout(() => {
          quizState.index++;
          renderQuizStep(view);
        }, 900);
      });
    });
  }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function renderQuizResult(view) {
  const { score, total, scope, mode } = quizState;
  const pct = Math.round((score / total) * 100);
  let msg = "Continue comme ça ! 💪";
  if (pct >= 90) msg = "Impressionnant, tu maîtrises ça ! 🌟";
  else if (pct >= 60) msg = "Bien joué, encore un peu d'entraînement ! 👏";

  view.innerHTML = `
    <div class="quiz-result">
      <div class="score-big">${score}/${total}</div>
      <p>${msg}</p>
      <div class="actions">
        <button class="btn btn-outline" id="retry-same">🔁 Refaire</button>
        <button class="btn" id="back-home-quiz">🏠 Retour à l'accueil</button>
      </div>
    </div>
  `;
  document.getElementById("retry-same").addEventListener("click", () => startQuiz(view, mode, scope));
  document.getElementById("back-home-quiz").addEventListener("click", () => navigate("/home"));
}
