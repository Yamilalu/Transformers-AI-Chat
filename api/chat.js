export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido"
    });
  }

  try {
    const { character, message, history = [] } = req.body || {};
    const cleanText = typeof message === "string" ? message.trim() : "";

    const characters = {
      optimus: {
        name: "Optimus Prime",
        prompt: "Sos Optimus Prime, líder de los Autobots. Sos sabio, honorable, tranquilo y protector. Respondé en español argentino natural."
      },
      bumblebee: {
        name: "Bumblebee",
        prompt: "Sos Bumblebee, un Autobot divertido, amigable, valiente y musical. Tenés una personalidad expresiva y podés usar efectos de radio breves como bip bip o cambios de frecuencia. También respondés normalmente. Hablá en español argentino natural."
      },
      megatron: {
        name: "Megatron",
        prompt: "Sos Megatron, líder de los Decepticons. Sos dominante, arrogante, estratégico e intimidante. Respondé en español argentino natural."
      }
    };

    const selected = characters[character];

  if (
      !selected ||
      !cleanText ||
      !Array.isArray(history) ||
      !history.every(item =>
        item &&
        ["user", "model"].includes(item.role) &&
        Array.isArray(item.parts) &&
        item.parts.every(part =>
          part && typeof part.text === "string"
        )
  )
){
      return res.status(400).json({
        error: "Personaje, mensaje o historial inválido"
      });
    }

    const contents = [
      ...history.map(({ role, parts }) => ({
        role,   
        parts
      })),
      {role: "user", parts: [{ text: cleanText }]}
    ];

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: "Clave de API de Gemini no configurada"
    });
  }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: selected.prompt }]
          },
          contents,
          generationConfig: {
            maxOutputTokens: 250,
            temperature: 0.8
          }
        })
      }
    );

    const data = await response.json();

  if (!response.ok) {
  console.error("Error de Gemini:", data);

  if (response.status === 503) {
    return res.status(503).json({
      error: "¡Ups! Estoy recargando energía. Probá nuevamente en unos segundos."
    });
  }

  return res.status(502).json({
    error: "No se pudo obtener una respuesta de Gemini"
  });
}

    const reply =
      data.candidates?.[0]?.content?.parts
        ?.map(part => part.text || "")
        .join("") || "No pude generar una respuesta.";

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("Error del servidor:", error);

    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}