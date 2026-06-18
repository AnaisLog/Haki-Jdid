// ===========================================================
// app.js — Routeur et vues principales
// ===========================================================

const PROGRESS_KEY = "hakijdid_progress"; // { wordId: "known" | "unknown" }

function getProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
  catch { return {}; }
}
function setWordStatus(wordId, status) {
  const p = getProgress();
  if (p[wordId] === status) { delete p[wordId]; } // re-click to unset
  else { p[wordId] = status; }
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
}

function allArabicWords() {
  let words = [];
  ARABIC_LESSONS.forEach(l => {
    l.words.forEach(w => words.push({ ...w, lessonId: l.id, lessonTitle: l.theme, source: "arabic" }));
  });
  return words;
}
function allNursingWords() {
  let words = [];
  NURSING_DATA.categories.forEach(cat => {
    cat.words.forEach(w => words.push({ ...w, lessonId: cat.id, lessonTitle: cat.title, source: "nursing" }));
  });
  return words;
}
function allWords() {
  return allArabicWords().concat(allNursingWords());
}

function escapeHtml(s) {
  if (s == null) return "";
  return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// ---------------- ROUTER ----------------
function navigate(hash) {
  location.hash = hash;
}

function currentRoute() {
  const h = location.hash.replace(/^#\/?/, "");
  const parts = h.split("/").filter(Boolean);
  return parts.length ? parts : ["home"];
}

function renderApp() {
  const root = document.getElementById("app");
  const route = currentRoute();

  root.innerHTML = `
    <header class="topbar">
      <a href="#/home" class="brand"><span class="ar">حكي</span> Hakî Jdîd</a>
      <nav id="top-nav"></nav>
      <button class="logout" id="logout-btn">Se déconnecter</button>
    </header>
    <main class="view" id="view"></main>
    <nav class="tabbar" id="tab-nav"></nav>
    <footer class="app-footer">Fait avec 🤍 pour réviser avant la reprise de septembre</footer>
  `;

  document.getElementById("logout-btn").addEventListener("click", lock);

  const navItems = [
    { key: "home", label: "Accueil", icon: "🏠" },
    { key: "arabic", label: "Cours d'arabe", icon: "📖" },
    { key: "nursing", label: "Infirmier", icon: "🩺" },
    { key: "quiz", label: "Réviser", icon: "🧠" },
  ];

  function navHtml(forTab) {
    return navItems.map(it => `
      <button data-nav="${it.key}" class="${route[0] === it.key || (route[0]==='home' && it.key==='home') ? 'active' : ''}">
        ${forTab ? `<span class="ic">${it.icon}</span>` : ""}${it.label}
      </button>
    `).join("");
  }
  document.getElementById("top-nav").innerHTML = navHtml(false);
  document.getElementById("tab-nav").innerHTML = navHtml(true);
  root.querySelectorAll("[data-nav]").forEach(btn => {
    btn.addEventListener("click", () => navigate("/" + btn.dataset.nav));
  });

  const view = document.getElementById("view");

  if (route[0] === "home") renderHome(view);
  else if (route[0] === "arabic" && route[1]) renderLesson(view, route[1], "arabic");
  else if (route[0] === "arabic") renderLessonList(view, "arabic");
  else if (route[0] === "nursing" && route[1]) renderLesson(view, route[1], "nursing");
  else if (route[0] === "nursing") renderLessonList(view, "nursing");
  else if (route[0] === "quiz") renderQuizHome(view, route[1]);
  else renderHome(view);
}

window.addEventListener("hashchange", renderApp);

// ---------------- HOME ----------------
function renderHome(view) {
  const progress = getProgress();
  const aWords = allArabicWords().filter(w => w.complete !== false);
  const known = aWords.filter(w => progress[w.id] === "known").length;
  const totalLessons = ARABIC_LESSONS.length;

  view.innerHTML = `
    <section class="hero">
      <h1>MarHaba ! 👋</h1>
      <p>Ton espace pour réviser l'arabe jordanien avant la reprise de septembre — à ton rythme, sans pression.</p>
      <div class="progress-row">
        <div class="stat"><div class="num">${known}/${aWords.length}</div><div class="lab">mots maîtrisés</div></div>
        <div class="stat"><div class="num">${totalLessons}</div><div class="lab">cours d'arabe</div></div>
        <div class="stat"><div class="num">${NURSING_DATA.categories.length}</div><div class="lab">fiches infirmier</div></div>
      </div>
    </section>

    <div class="section-title"><h2>📖 Cours d'arabe jordanien</h2><span class="count">${ARABIC_LESSONS.length} leçons</span></div>
    <div class="card-grid">${ARABIC_LESSONS.map(l => lessonCardHtml(l, "arabic")).join("")}</div>

    <div class="section-title"><h2>🩺 Vocabulaire infirmier</h2><span class="count">${NURSING_DATA.categories.length} fiches</span></div>
    <div class="card-grid">${NURSING_DATA.categories.map(c => lessonCardHtml(c, "nursing")).join("")}</div>

    <div class="cta-revise">
      <div>
        <h3>Prête à réviser tout ça ? 🧠</h3>
        <p>Flashcards, QCM ou texte à trous — généré à partir de tous tes cours.</p>
      </div>
      <button class="btn btn-gold btn-small" id="go-quiz">Lancer une révision</button>
    </div>
  `;
  view.querySelectorAll("[data-goto]").forEach(el => el.addEventListener("click", () => navigate(el.dataset.goto)));
  document.getElementById("go-quiz").addEventListener("click", () => navigate("/quiz"));
}

function lessonCardHtml(lesson, source) {
  const progress = getProgress();
  const words = lesson.words.filter(w => w.complete !== false);
  const known = words.filter(w => progress[(w.id || lesson.id)] === "known").length;
  const pct = words.length ? Math.round((known / words.length) * 100) : 0;
  const badge = source === "arabic" ? `Cours ${lesson.num}` : "🩺 Fiche";
  const title = source === "arabic" ? lesson.theme : lesson.title;
  const sub = source === "arabic" ? (lesson.date ? `Le ${lesson.date} · ${lesson.words.length} mots` : `${lesson.words.length} mots`) : `${lesson.theme} · ${lesson.words.length} phrases`;
  return `
    <button class="lesson-card" data-goto="#/${source}/${lesson.id}">
      <div class="top-row">
        <span class="badge-num">${escapeHtml(badge)}</span>
      </div>
      <h3>${escapeHtml(title)}</h3>
      <div class="meta">${escapeHtml(sub)}</div>
      <div class="progress-bar"><div style="width:${pct}%"></div></div>
    </button>
  `;
}

// ---------------- LESSON LIST (mobile-friendly full list) ----------------
function renderLessonList(view, source) {
  if (source === "arabic") {
    view.innerHTML = `
      <div class="section-title"><h2>📖 Cours d'arabe jordanien</h2><span class="count">${ARABIC_LESSONS.length} leçons</span></div>
      <div class="card-grid">${ARABIC_LESSONS.map(l => lessonCardHtml(l, "arabic")).join("")}</div>
    `;
  } else {
    view.innerHTML = `
      <div class="section-title"><h2>🩺 Vocabulaire infirmier</h2><span class="count">${NURSING_DATA.categories.length} fiches</span></div>
      <div class="disclaimer-box"><strong>⚠️ À vérifier :</strong> ${escapeHtml(NURSING_DATA.disclaimer)}</div>
      <div class="card-grid">${NURSING_DATA.categories.map(c => lessonCardHtml(c, "nursing")).join("")}</div>
    `;
  }
  view.querySelectorAll("[data-goto]").forEach(el => el.addEventListener("click", () => navigate(el.dataset.goto)));
}

// ---------------- LESSON DETAIL ----------------
function renderLesson(view, id, source) {
  const lesson = source === "arabic"
    ? ARABIC_LESSONS.find(l => l.id === id)
    : NURSING_DATA.categories.find(c => c.id === id);

  if (!lesson) {
    view.innerHTML = `<div class="empty-state"><div class="ic">🤔</div><p>Leçon introuvable.</p></div>`;
    return;
  }

  const title = source === "arabic" ? `Cours ${lesson.num} — ${lesson.theme}` : lesson.title;
  const audioFile = `audio/${lesson.id}.mp3`;

  view.innerHTML = `
    <button class="back-link" data-goto="#/${source}">← Retour</button>
    <div class="lesson-header">
      <h1>${escapeHtml(title)}</h1>
      <div class="meta">${source === "arabic" && lesson.date ? `Cours du ${escapeHtml(lesson.date)} · ` : ""}${lesson.words.length} mots${source === "nursing" ? ` · ${escapeHtml(lesson.theme)}` : ""}</div>
    </div>

    ${source === "nursing" ? `<div class="disclaimer-box"><strong>⚠️ À vérifier avec ta prof :</strong> ${escapeHtml(NURSING_DATA.disclaimer)}</div>` : ""}

    <div class="audio-box" id="audio-box">
      <span class="audio-missing">⏳ Chargement de l'audio…</span>
    </div>

    <div class="word-list">
      ${lesson.words.map(w => wordCardHtml(w, lesson.id)).join("")}
    </div>

    ${lesson.bonus_words && lesson.bonus_words.length ? `
      <div class="bonus-section">
        <h3>🎁 Mots bonus entendus en cours</h3>
        <div class="bonus-grid">
          ${lesson.bonus_words.map(b => `
            <div class="bonus-card">
              <div class="phonetic">${escapeHtml(b.phonetic)}</div>
              <div class="french">${escapeHtml(b.french)}</div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ""}
  `;

  document.querySelector("[data-goto]").addEventListener("click", e => navigate(e.currentTarget.dataset.goto));

  // Try loading audio, show graceful empty state if missing
  const audioBox = document.getElementById("audio-box");
  const testAudio = new Audio();
  testAudio.addEventListener("loadedmetadata", () => {
    audioBox.innerHTML = `🎧 <audio controls preload="none" src="${audioFile}"></audio>`;
  });
  testAudio.addEventListener("error", () => {
    audioBox.innerHTML = `<span class="audio-missing">🎧 Pas encore de fichier audio pour ce cours. Dépose un fichier nommé <code>${lesson.id}.mp3</code> dans le dossier <code>/audio/</code> sur GitHub pour qu'il apparaisse ici.</span>`;
  });
  testAudio.src = audioFile;

  // Word card interactions
  view.querySelectorAll(".word-card").forEach(card => {
    card.addEventListener("click", e => {
      if (e.target.closest(".track-btns")) return;
      card.classList.toggle("flipped");
    });
  });
  view.querySelectorAll(".track-btns button").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      setWordStatus(btn.dataset.wid, btn.dataset.status);
      renderLesson(view, id, source); // re-render to update active states
    });
  });
}

function wordCardHtml(w, lessonId) {
  const progress = getProgress();
  const wid = w.id || `${lessonId}-${w.num}`;
  const status = progress[wid];
  const incomplete = w.complete === false;
  return `
    <div class="word-card">
      <div class="num">${w.num != null ? "#" + w.num : ""}</div>
      <div class="content">
        ${w.tag ? `<span class="tag-pill">${escapeHtml(w.tag.split(",")[0])}</span>` : ""}
        ${incomplete ? `<span class="incomplete-pill">✏️ à compléter</span>` : ""}
        <div class="arabic">${escapeHtml(w.arabic)}</div>
        ${w.phonetic ? `<div class="phonetic">${escapeHtml(w.phonetic)}</div>` : ""}
        ${w.french ? `<div class="french">${escapeHtml(w.french)}</div>` : `<div class="french">— traduction manquante —</div>`}
        ${w.extra && w.extra.length ? `<div class="extra-notes">📎 ${w.extra.map(escapeHtml).join("\n\n")}</div>` : ""}
      </div>
      ${!incomplete ? `
      <div class="track-btns">
        <button class="known ${status === 'known' ? 'active' : ''}" data-wid="${wid}" data-status="known" title="Je connais">✓</button>
        <button class="unknown ${status === 'unknown' ? 'active' : ''}" data-wid="${wid}" data-status="unknown" title="À revoir">↻</button>
      </div>` : ""}
    </div>
  `;
}

// ---------------- BOOT ----------------
function boot() {
  if (isUnlocked()) {
    renderApp();
  } else {
    renderLoginScreen(renderApp);
  }
}

document.addEventListener("DOMContentLoaded", boot);
