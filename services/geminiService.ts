import { GoogleGenAI, Type } from "@google/genai";
import { ClothingItem, UserProfile, WeatherData, ClothingCategory, Occasion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Analyze an uploaded clothing image to auto-tag it
export const analyzeClothingImage = async (base64Image: string): Promise<Partial<ClothingItem>> => {
  const model = "gemini-2.5-flash";

  const prompt = `Analyze this image of a clothing item. 
  Identify the category (Top, Bottom, Dress, Outerwear, Shoes, Accessory).
  Identify the primary color (generic name).
  Estimate warmth level on a scale of 1-10 (1=tank top, 10=heavy parka).
  Identify suitable occasions (Casual, Formal, Lounge, Active, Party).
  Provide a short descriptive name (e.g., "Blue Denim Jacket").
  Return JSON only.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            color: { type: Type.STRING },
            warmthLevel: { type: Type.NUMBER },
            occasion: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            name: { type: Type.STRING }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");
    
    const data = JSON.parse(text);

    // Map string response to Enums roughly
    let mappedCategory = ClothingCategory.TOP;
    if (Object.values(ClothingCategory).includes(data.category as any)) {
      mappedCategory = data.category as ClothingCategory;
    }

    return {
      category: mappedCategory,
      color: data.color || "Unknown",
      warmthLevel: data.warmthLevel || 5,
      occasion: data.occasion || [Occasion.CASUAL],
      name: data.name || "New Item"
    };

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    // Fallback if AI fails
    return {
      category: ClothingCategory.TOP,
      color: "Unknown",
      warmthLevel: 5,
      occasion: [Occasion.CASUAL],
      name: "Uploaded Item"
    };
  }
};

// Generate stylist advice based on selected outfit
export const getStylistAdvice = async (
  profile: UserProfile, 
  outfit: ClothingItem[], 
  weather: WeatherData
): Promise<string> => {
  const model = "gemini-2.5-flash";
  
  const outfitDesc = outfit.map(item => `${item.name} (${item.color}, ${item.category})`).join(", ");
  
  const prompt = `Act as a high-end fashion stylist.
  User Profile: ${profile.bodyShape} body shape, ${profile.colorSeason} color season.
  Current Weather: ${weather.condition}, ${weather.temp}°C.
  Selected Outfit: ${outfitDesc}.
  
  Give brief, punchy feedback (max 2 sentences). 
  1. Comment on color harmony for their season.
  2. Comment on weather appropriateness.
  3. Suggest one small improvement if needed.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt
    });
    return response.text || "Looking good! This outfit seems balanced.";
  } catch (error) {
    console.error("Stylist advice failed:", error);
    return "You look great! Trust your instincts.";
  }
};