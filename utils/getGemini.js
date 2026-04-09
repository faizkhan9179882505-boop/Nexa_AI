 import { GoogleGenAI } from "@google/genai";

// ✅ AI initialize karo
const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const getGemini = async (message) => {
  console.log("API HIT");

  try {
    const response = await gemini.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
    });

    return response.text; // ✅ sirf return
  } catch (err) {
    console.log(err);
    throw err; // route handle karega
  }
};

export default getGemini;