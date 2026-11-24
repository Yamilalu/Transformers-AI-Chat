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

        <header class="about-header">
          <h2>TRANSFORMERS <span>AI</span></h2>
          <button id="back-home">VOLVER AL INICIO</button>
        </header>

        <section class="about-hero">
          <p class="eyebrow">SISTEMA DE INFORMACIÓN · CYBERTRON</p>
          <h1>UNA NUEVA ERA<br><span>DE CONEXIÓN.</span></h1>
          <p class="about-intro">
            Transformers AI Chat es una experiencia interactiva
            que une el universo Transformers con la inteligencia
            artificial. Elegí tu personaje favorito y descubrí
            una nueva forma de conversar.
          </p>
        </section>

        <section class="about-characters">
          <p class="eyebrow">ARCHIVOS DE CYBERTRON</p>
          <h2>CONOCÉ A LOS <span>PERSONAJES.</span></h2>

          <div class="about-grid">

            <article class="about-card optimus">
              <img src="/images/optimus.jpg" alt="Optimus Prime">
              <div class="about-card-content">
                <span class="faction">AUTOBOT</span>
                <h3>OPTIMUS PRIME</h3>
                <p>Liderazgo, sabiduría y honor. Un protector que lucha por la libertad.</p>
              </div>
            </article>

            <article class="about-card bumblebee">
              <img src="/images/bumblebee.jpg" alt="Bumblebee">
              <div class="about-card-content">
                <span class="faction">AUTOBOT</span>
                <h3>BUMBLEBEE</h3>
                <p>Valentía, humor y música. Un compañero siempre listo para la aventura.</p>
              </div>
            </article>

            <article class="about-card megatron">
              <img src="/images/megatron.jpg" alt="Megatron">
              <div class="about-card-content">
                <span class="faction">DECEPTICON</span>
                <h3>MEGATRON</h3>
                <p>Poder, estrategia y ambición. Un líder decidido a imponer su dominio.</p>
              </div>
            </article>

          </div>
        </section>

        <section class="about-tech">
          <p class="eyebrow">TECNOLOGÍA APLICADA</p>
          <h2>CONSTRUIDO CON <span>INTELIGENCIA.</span></h2>

          <div class="tech-list">
            <span>HTML5</span>
            <span>CSS3</span>
            <span>JavaScript</span>
            <span>Vite</span>
            <span>Gemini API</span>
            <span>Vercel Functions</span>
            <span>Vitest</span>
          </div>
        </section>

        <footer class="about-footer">
          TRANSFORMERS AI CHAT · EL FUTURO COMIENZA AQUÍ
        </footer>

      </main>
    `;

    document.querySelector("#back-home").addEventListener("click", () => {
      navigateTo("/home");
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
      <button id="about-button">ACERCA DEL PROYECTO</button>
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

  const aboutButton = document.querySelector("#about-button");

if (aboutButton) {
  aboutButton.addEventListener("click", () => {
    navigateTo("/about");
  });
}

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