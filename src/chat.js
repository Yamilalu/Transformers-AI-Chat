import {
  isValidMessage,
  cleanMessage,
  isValidResponse
} from "./utils.js";

const characters = {
  optimus: {
    name: "Optimus Prime",
    faction: "AUTOBOT",
    color: "#2876c7",
    greeting: "La libertad es el derecho de todos los seres conscientes. ¿En qué puedo ayudarte?"
  },
  bumblebee: {
    name: "Bumblebee",
    faction: "AUTOBOT",
    color: "#e5ad32",
    greeting: "¡Hey! ¿Qué pasa? Sintonizando la mejor frecuencia para nuestra conversación. ¡Bip bip!"
  },
  megatron: {
    name: "Megatron",
    faction: "DECEPTICON",
    color: "#b83d45",
    greeting: "Has llamado la atención de Megatron. Habla, ¿qué deseas?"
  }
};

const savedHistories = JSON.parse(localStorage.getItem("transformers-chat-histories") || "{}");

const conversationhistories = {
  optimus: savedHistories.optimus || [],
  bumblebee: savedHistories.bumblebee || [],
  megatron: savedHistories.megatron || []
};

function playRadioSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const duration = 1.5;
  const now = audioContext.currentTime;

  // Ruido de interferencia
  const bufferSize = audioContext.sampleRate * duration;
  const buffer = audioContext.createBuffer(
    1,
    bufferSize,
    audioContext.sampleRate
  );

  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.35;
  }

  const noise = audioContext.createBufferSource();
  noise.buffer = buffer;

  const noiseGain = audioContext.createGain();
  noiseGain.gain.setValueAtTime(0.001, now);
  noiseGain.gain.linearRampToValueAtTime(0.12, now + 0.15);
  noiseGain.gain.setValueAtTime(0.08, now + 0.5);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noise.connect(noiseGain);
  noiseGain.connect(audioContext.destination);
  noise.start(now);
  noise.stop(now + duration);

  // Sintonización electrónica
  const oscillator = audioContext.createOscillator();
  const toneGain = audioContext.createGain();

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(1200, now);
  oscillator.frequency.exponentialRampToValueAtTime(350, now + 0.7);

  toneGain.gain.setValueAtTime(0.001, now);
  toneGain.gain.linearRampToValueAtTime(0.07, now + 0.1);
  toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

  oscillator.connect(toneGain);
  toneGain.connect(audioContext.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.8);

  setTimeout(() => audioContext.close(), 1800);
}

function playBeeResponseSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "square";
  oscillator.frequency.setValueAtTime(700, audioContext.currentTime);
  oscillator.frequency.linearRampToValueAtTime(1100, audioContext.currentTime + 0.15);
  oscillator.frequency.linearRampToValueAtTime(500, audioContext.currentTime + 0.4);

  gain.gain.setValueAtTime(0.001, audioContext.currentTime);
  gain.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.4);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.4);

  oscillator.onended = () => audioContext.close();
}

export function renderChat(app, characterId) {
  const character = characters[characterId];

  document.documentElement.style.setProperty("--character-color", character?.color || "#2876c7");

  if (!character) {
    app.innerHTML = "<h1>Personaje no encontrado</h1>";
    return;
  }

  app.innerHTML = `
    <main class="chat-screen">
      <header class="chat-header">
        <button id="back-home">← VOLVER</button>
        <div>
          <h2>${character.name}</h2>
          <span style="color: ${character.color}">
            ${character.faction}
          </span>
        </div>
            ${characterId === "bumblebee" ? `
        <button id="radio-toggle">🔊 ACTIVAR RADIO</button>
` : ""}
      </header>

      <div class="chat-content">
      <section class="messages" id="messages">
  ${conversationhistories[characterId].length === 0 ? `
    <div class="message character-message">
      <strong>${character.name}</strong>
      <p>${character.greeting}</p>
    </div>
  ` : ""}
      </section>

              <aside class="radio-sidebar">
          <div id="radio-player"></div>
        </aside>
      </div>

      <form id="chat-form" class="chat-form">
        <input
          type="text"
          id="message-input"
          placeholder="Escribí tu mensaje..."
          autocomplete="off"
          required
        >
        <button type="submit">ENVIAR</button>
      </form>
    </main>
  `;
const form = document.querySelector("#chat-form");
const input = document.querySelector("#message-input");
const messages = document.querySelector("#messages");
const conversationHistory = conversationhistories[characterId];
const radioButton = document.querySelector("#radio-toggle");
const radioPlayer = document.querySelector("#radio-player");

let radioEnabled = false;

if (radioButton) {
  radioButton.addEventListener("click", () => {
    radioEnabled = !radioEnabled;
    radioButton.classList.toggle("radio-active", radioEnabled);

    if (radioEnabled) {
  radioButton.textContent = "📻 RADIO ENCENDIDA";
  playRadioSound();

  radioPlayer.innerHTML = `
    <select id="radio-song-select">
     <option value="258417161">Second to None - Styles of Beyond</option>
     <option value="591534951">What I've Done - Linkin Park</option>
     <option value="368555810">Take On Me - a-ha</option>
     <option value="254632948">The Touch - Stan Bush</option>
    </select>

  <iframe
    id="radio-song-frame"
    src="https://embed.music.apple.com/us/song/258417161"
    width="100%"
    height="150"
    frameborder="0"
    allow="autoplay *; encrypted-media *;"
  ></iframe>
`;

const songSelect = document.querySelector("#radio-song-select");
const songFrame = document.querySelector("#radio-song-frame");

songSelect.addEventListener("change", () => {
  songFrame.src = `https://embed.music.apple.com/us/song/${songSelect.value}`;
});
}
  });
}

conversationHistory.forEach((message) => {
  const messageElement = document.createElement("div");

  if (message.role === "user") {
    messageElement.classList.add("message", "user-message");
    const paragraph = document.createElement("p");
    paragraph.textContent = message.parts[0].text;

    const time = document.createElement("small");
    time.textContent = message.timestamp ? new Date(message.timestamp).toLocaleTimeString("es-AR", { 
      hour: "2-digit", 
      minute: "2-digit"
     }) : "";

    messageElement.appendChild(paragraph);
    messageElement.appendChild(time);

  } else {
    messageElement.classList.add("message", "character-message");

    const name = document.createElement("strong");
    name.textContent = character.name;

    const paragraph = document.createElement("p");
    paragraph.textContent = message.parts[0].text;

    messageElement.appendChild(name);
    messageElement.appendChild(paragraph);

    const time = document.createElement("small");
    time.textContent = message.timestamp ? new Date(message.timestamp).toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit"
    }) : "";  

    messageElement.appendChild(time);
  }

  messages.appendChild(messageElement);
  
});

  setTimeout(() => {
    messages.scrollTop = messages.scrollHeight;
  }, 300);

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = cleanMessage(input.value);

  if (!isValidMessage(text)) return;

  const userMessage = document.createElement("div");
  userMessage.classList.add("message", "user-message");
  const userParagraph = document.createElement("p");
  userParagraph.textContent = text;

  const userTime = document.createElement("small");
  userTime.textContent = new Date().toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit"
  }); 

  userMessage.appendChild(userParagraph);
  userMessage.appendChild(userTime);

  messages.appendChild(userMessage);
  input.value = "";
  input.disabled = true;

  const loading = document.createElement("div");
loading.classList.add("message", "character-message");

loading.innerHTML = `
  <strong>${character.name}</strong>
  <p class="typing">
    Está escribiendo<span>.</span><span>.</span><span>.</span>
  </p>
`;

messages.appendChild(loading);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        character: characterId,
        message: text,
        history: conversationHistory.map(({ role, parts }) => ({
          role,
          parts     
        }))
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al comunicarse con Gemini");
    }

    if (!isValidResponse(data.reply)) {
      throw new Error("Gemini devolvió una respuesta vacía o inválida");
    }

    loading.innerHTML = `
      <strong>${character.name}</strong>
      <p></p>
    `;

    loading.querySelector("p").textContent = data.reply;
    if (characterId === "bumblebee" && radioEnabled) {
  playBeeResponseSound();
}
    const characterTime = document.createElement("small");
    characterTime.textContent = new Date().toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit"
    });
    loading.appendChild(characterTime);

    conversationHistory.push({
      role: "user",
      parts: [{ text }],
      timestamp: Date.now()
    });

    conversationHistory.push({
      role: "model",
      parts: [{ text: data.reply }],
      timestamp: Date.now()
    });

    localStorage.setItem(
      "transformers-chat-histories",
      JSON.stringify(conversationhistories)
    );

  } catch (error) {
    loading.textContent = error.message.startsWith("¡Ups!")
      ? error.message
      : "No pude responder. Intentá nuevamente.";

    console.error(error);

  } finally {
    input.disabled = false;
    input.focus();
    messages.scrollTop = messages.scrollHeight;
  }
});

  document.querySelector("#back-home").addEventListener("click", () => {
    history.pushState({}, "", "/home");
    window.dispatchEvent(new PopStateEvent("popstate"));
  });
}