
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("Funcionamiento del chat", () => {
  let renderChat;
  let app;

  beforeEach(async () => {
    localStorage.clear();
    document.body.innerHTML = '<div id="app"></div>';

    vi.resetModules();

    const chatModule = await import("../src/chat.js");
    renderChat = chatModule.renderChat;

    app = document.querySelector("#app");

    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("debe mostrar el saludo del personaje", () => {
    renderChat(app, "bumblebee");

    expect(app.textContent).toContain("Bumblebee");
    expect(app.textContent).toContain("¡Hey!");
  });

  it("debe enviar un mensaje y mostrar la respuesta", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        reply: "¡Hola! Soy Bumblebee."
      })
    });

    vi.stubGlobal("fetch", mockFetch);

    renderChat(app, "bumblebee");

    const input = document.querySelector("#message-input");
    const form = document.querySelector("#chat-form");

    input.value = "Hola Bumblebee";

    form.dispatchEvent(new Event("submit", {
      bubbles: true,
      cancelable: true
    }));

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/chat",
      expect.objectContaining({
        method: "POST"
      })
    );

    expect(app.textContent).toContain("¡Hola! Soy Bumblebee.");
    expect(input.disabled).toBe(false);
  });

  it("debe manejar un error de la API", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({
        error: "Demasiadas solicitudes"
      })
    }));

    renderChat(app, "optimus");

    const input = document.querySelector("#message-input");
    const form = document.querySelector("#chat-form");

    input.value = "Hola Optimus";

    form.dispatchEvent(new Event("submit", {
      bubbles: true,
      cancelable: true
    }));

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(app.textContent).toContain("No pude responder");
    expect(input.disabled).toBe(false);
  });

  it("debe manejar un error de conexión", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(
      new Error("Error de conexión")
    ));

    renderChat(app, "megatron");

    const input = document.querySelector("#message-input");
    const form = document.querySelector("#chat-form");

    input.value = "Hola Megatron";

    form.dispatchEvent(new Event("submit", {
      bubbles: true,
      cancelable: true
    }));

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(app.textContent).toContain("No pude responder");
    expect(input.disabled).toBe(false);
  });
});
