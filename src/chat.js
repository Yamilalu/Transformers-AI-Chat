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
      </header>

      <section class="messages" id="messages">
  ${conversationhistories[characterId].length === 0 ? `
    <div class="message character-message">
      <strong>${character.name}</strong>
      <p>${character.greeting}</p>
    </div>
  ` : ""}
      </section>

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