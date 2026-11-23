import { describe, it, expect } from "vitest";
import {
  isValidMessage,
  cleanMessage,
  isValidResponse
} from "../src/utils.js";

describe("Funciones Auxiliares del Chat", () => {
  it("debe aceptar un mensaje con contenido", () => {
    expect(isValidMessage("Hola Bumblebee")).toBe(true);
  });
it("debe rechazar un mensaje vacio", () => {
    expect(isValidMessage("")).toBe(false);
  });

  it("debe rechazar un mensaje con solo espacios", () => {
    expect(isValidMessage("   ")).toBe(false);
  });

  it("debe eliminar espacios al inicio y al final del mensaje", () => {
    expect(cleanMessage("  Hola Optimus  ")).toBe("Hola Optimus");
   });

  it("debe aceptar una respuesta con contenido", () => {
    expect(isValidResponse("Hola Bumblebee")).toBe(true);
  });

  it("debe rechazar una respuesta vacia", () => {
    expect(isValidResponse("")).toBe(false);
  }); 
});