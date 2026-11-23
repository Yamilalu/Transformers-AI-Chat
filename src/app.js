import {renderChat} from "./chat.js";
console.log("TRANSFORMERS APP CARGADA");
const app = document.querySelector("#app");
let selectedCharacter = sessionStorage.getItem("selectedCharacter");
const routes = {
  home: "/home",
  chat: "/chat",
  about: "/about",
};

function navigateTo(path) {
  history.pushState({}, "", path);
  router();
};

function router() {
  const path = window.location.pathname;

  if (path === "/" || path === "/home") {
    renderHome();

  } else if (path === "/chat") {
    renderChat(app, selectedCharacter);

  } else if (path === "/about") {
    app.innerHTML = `
      <main class="about">
        <p class="eyebrow">TRANSFORMERS AI CHAT</p>

        <h1>ACERCA DEL <span>PROYECTO.</span></h1>

        <p>
          Este proyecto permite conversar con tres personajes
          del universo Transformers. Cada uno tiene su propia
          personalidad y una forma diferente de responder.
        </p>

        <h2>PERSONAJES</h2>
        <ul>
          <li>Optimus Prime — Sabiduría y liderazgo.</li>
          <li>Bumblebee — Humor y música.</li>
          <li>Megatron — Poder y estrategia.</li>
        </ul>

        <h2>TECNOLOGÍAS UTILIZADAS</h2>
        <p>HTML · CSS · JavaScript · Vite · Vitest · Gemini API</p>

        <button id="back-home">VOLVER AL INICIO</button>
      </main>
    `;

    document.querySelector("#back-home").addEventListener("click", () => {
      history.pushState({}, "", "/home");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

  } else {
    app.innerHTML = "<h1>Página no encontrada</h1>";
  }
}

window.addEventListener("popstate", router);

function renderHome() {
  app.innerHTML = `
    <header class="header">
      <h2>TRANSFORMERS <span>AI</span></h2>
      <span class="status">● SISTEMA ACTIVO</span>
    </header>

    <main class="home">
      <p class="eyebrow">EL UNIVERSO TRANSFORMERS</p>

      <h1>ELIGE TU<br><span>ALIADO.</span></h1>

      <p class="intro">
        Cybertron te espera. Conversa con tus personajes
        favoritos y descubre qué tienen para contarte.
      </p>

      <section class="characters">
        <article class="character-card optimus">
          <img src="/images/optimus.jpg" alt="Rostro de Optimus Prime">
          <span class="faction">AUTOBOT</span>
          <h2>OPTIMUS PRIME</h2>
          <p>Sabiduría, honor y liderazgo.</p>
          <button data-character="optimus">ELEGIR PERSONAJE</button>
        </article>

        <article class="character-card bumblebee">
          <img src="/images/bumblebee.jpg" alt="Rostro de Bumblebee">
          <span class="faction">AUTOBOT</span>
          <h2>BUMBLEBEE</h2>
          <p>Humor, música y valentía.</p>
          <button data-character="bumblebee">ELEGIR PERSONAJE</button>
        </article>

        <article class="character-card megatron">
          <img src="/images/megatron.jpg" alt="Rostro de Megatron">
          <span class="faction">DECEPTICON</span>
          <h2>MEGATRON</h2>
          <p>Poder, estrategia y dominio.</p>
          <button data-character="megatron">ELEGIR PERSONAJE</button>
        </article>
      </section>
    </main>

    <footer>
      TRANSFORMERS AI CHAT · UNA NUEVA ERA COMIENZA
    </footer>
  `;
}

function selectCharacter(character) {
  selectedCharacter = character;
  sessionStorage.setItem("selectedCharacter", character);
  navigateTo("/chat");
}

app.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-character]");
    if (!button) return; 
      const character = button.dataset.character;
      selectCharacter(character);
});

router();