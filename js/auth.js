// ===========================================================
// auth.js — Barrière par mot de passe simple
//
// ⚠️ Ceci n'est PAS une vraie sécurité : le dépôt GitHub reste
// public, donc le code (et ce mot de passe haché) restent
// techniquement consultables par quelqu'un de très déterminé.
// C'est juste un filtre pour éviter qu'un visiteur de passage
// tombe dessus par hasard. Pour une vraie confidentialité,
// il faudrait un dépôt privé + GitHub Pages payant.
//
// Pour CHANGER le mot de passe :
//   1. Ouvre la console du navigateur (F12) sur n'importe quelle page
//   2. Tape : await sha256("ton-nouveau-mot-de-passe")
//   3. Copie le résultat (une longue chaîne de lettres/chiffres)
//   4. Remplace la valeur de PASSWORD_HASH ci-dessous par ce résultat
// ===========================================================

const PASSWORD_HASH = "2bc67f5e5e90c2fc2e9a09e455f148bde044c15d4a98c3ba1d63f4a70e43f315"; // = "jordanie2025"
const AUTH_KEY = "hakijdid_unlocked";

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

function isUnlocked() {
  return localStorage.getItem(AUTH_KEY) === "true";
}

function lock() {
  localStorage.removeItem(AUTH_KEY);
  location.reload();
}

async function tryUnlock(password) {
  const hash = await sha256(password.trim());
  if (hash === PASSWORD_HASH) {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

function renderLoginScreen(onSuccess) {
  const root = document.getElementById("app");
  root.innerHTML = `
    <div class="login-screen">
      <div class="login-card">
        <span class="ar-mark">حكي</span>
        <h1>Hakî Jdîd</h1>
        <p class="sub">Tes cours d'arabe jordanien — accès personnel</p>
        <input type="password" id="pw-input" placeholder="Mot de passe" autocomplete="current-password" />
        <div class="login-error" id="pw-error"></div>
        <button class="btn" id="pw-submit">Entrer</button>
      </div>
    </div>
  `;
  const input = document.getElementById("pw-input");
  const errorEl = document.getElementById("pw-error");
  const submit = document.getElementById("pw-submit");

  async function attempt() {
    const ok = await tryUnlock(input.value);
    if (ok) {
      onSuccess();
    } else {
      errorEl.textContent = "Mot de passe incorrect, réessaie 🙂";
      input.value = "";
      input.focus();
    }
  }

  submit.addEventListener("click", attempt);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") attempt();
  });
  input.focus();
}
