const HF_API_URL = "https://router.huggingface.co/v1/chat/completions";
const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;
import Tesseract from "tesseract.js";

async function callHF(prompt: string): Promise<string> {
  const res = await fetch(HF_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "meta-llama/Meta-Llama-3-8B-Instruct:novita",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("HF API Error:", data);
    throw new Error(`API Error: ${res.status} - ${JSON.stringify(data)}`);
  }

  return data.choices?.[0]?.message?.content?.trim() ?? "No response";
}

export async function summarizeText(text: string) {
  return callHF(`Summarize the following text:\n${text}`);
}

export async function fixGrammar(text: string) {
  return callHF(`Fix the grammar in the following text dont suggest only fix whats given, do not attempt to converse only correct be consise:\n${text}`);
}

export async function correctScribbled(input: string | File): Promise<string> {
  let extractedText = "";

  if (input instanceof File || (typeof input === "string" && input.startsWith("data:image/"))) {
    // Log OCR steps (optional for debugging)
    Tesseract.setLogging(true);

    const result = await Tesseract.recognize(input, "eng");

    // Post-process OCR text
    extractedText = result.data.text
      .replace(/[^a-zA-Z0-9\s]/g, "")  // Remove noise
      .replace(/\s+/g, " ")            // Normalize spacing
      .trim();
  } else {
    extractedText = input;
  }

  if (!extractedText) return "Could not extract any readable text.";

  // Ask LLM to guess
  return callHF(
    `Just respond with text: sureity: \n\n${extractedText}`
  );
}