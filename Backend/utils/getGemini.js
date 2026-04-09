 import { GoogleGenAI } from "@google/genai";

// Multiple API keys for failover
const API_KEYS = [
  process.env.GEMINI_API_KEY_1,
  process.env.GEMINI_API_KEY_2,
  process.env.GEMINI_API_KEY_3
].filter(key => key && key !== 'your-second-gemini-api-key-here' && key !== 'your-third-gemini-api-key-here');

// Track current API key index
let currentKeyIndex = 0;
const failedKeys = new Set();

// Get next available API key
const getNextApiKey = () => {
  for (let i = 0; i < API_KEYS.length; i++) {
    const keyIndex = (currentKeyIndex + i) % API_KEYS.length;
    const key = API_KEYS[keyIndex];
    
    if (!failedKeys.has(key)) {
      currentKeyIndex = keyIndex;
      return key;
    }
  }
  
  // If all keys failed, reset and try again
  failedKeys.clear();
  currentKeyIndex = 0;
  return API_KEYS[0];
};

// Create AI instance with specific API key
const createGeminiInstance = (apiKey) => {
  return new GoogleGenAI({
    apiKey: apiKey,
  });
};

const getGemini = async (message) => {
  console.log(`API HIT - Trying key index: ${currentKeyIndex}`);

  for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
    const apiKey = getNextApiKey();
    
    if (!apiKey) {
      throw new Error("No valid Gemini API keys available");
    }

    try {
      const gemini = createGeminiInstance(apiKey);
      const response = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: message,
      });

      // Success! Clear any previous failure for this key
      failedKeys.delete(apiKey);
      console.log(`API SUCCESS - Key index: ${currentKeyIndex}`);
      
      return response.text;
    } catch (err) {
      console.error(`API FAILED - Key index: ${currentKeyIndex}, Error:`, err.message);
      
      // Mark this key as failed
      failedKeys.add(apiKey);
      
      // Check if it's a rate limit/quota error
      if (err.message.includes('quota') || err.message.includes('rate limit') || err.status === 429) {
        console.log(`Rate limit exceeded for key index: ${currentKeyIndex}, switching to next key`);
        continue; // Try next key
      }
      
      // If it's not a rate limit error, throw immediately
      throw err;
    }
  }
  
  throw new Error("All Gemini API keys have failed or reached their limits");
};

export default getGemini;