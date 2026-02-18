import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Vibe, Color, Item, GeneratedOutfit } from './types';

type ColorRules = Record<Color, Color[] | 'ALL'>;

const COLOR_RULES: ColorRules = {
    'Black': ['White', 'Grey', 'Beige', 'Red', 'Blue', 'Olive', 'Green', 'Black', 'Other'],
    'White': 'ALL',
    'Grey': 'ALL',
    'Navy': ['White', 'Grey', 'Beige', 'Brown', 'Blue', 'Red', 'Olive', 'Green', 'Navy', 'Other'],
    'Beige': 'ALL',
    'Brown': ['White', 'Grey', 'Navy', 'Beige', 'Green', 'Olive', 'Red', 'Blue', 'Brown', 'Other'],
    'Olive': ['White', 'Grey', 'Navy', 'Beige', 'Brown', 'Black', 'Blue', 'Olive', 'Other'],
    'Red': ['White', 'Grey', 'Black', 'Navy', 'Beige', 'Blue', 'Red', 'Other'],
    'Blue': ['White', 'Grey', 'Black', 'Navy', 'Beige', 'Brown', 'Olive', 'Red', 'Blue', 'Other'],
    'Green': ['White', 'Grey', 'Black', 'Navy', 'Beige', 'Brown', 'Olive', 'Green', 'Other'],
    'Other': 'ALL'
};

type VibeRules = Record<Vibe, Vibe[]>;
const VIBE_COMPATIBILITY: VibeRules = {
    'Casual': ['Streetwear', 'Sport', 'Vintage', 'Casual'],
    'Formal': ['Business', 'Formal'],
    'Business': ['Formal', 'Casual', 'Business'],
    'Streetwear': ['Casual', 'Sport', 'Vintage', 'Streetwear'],
    'Sport': ['Casual', 'Streetwear', 'Sport'],
    'Vintage': ['Casual', 'Streetwear', 'Vintage']
};

export const checkColorMatch = (colorA?: Color, colorB?: Color): boolean => {
    if (!colorA || !colorB) return true;
    if (colorA === colorB) return true;

    const allowedA = COLOR_RULES[colorA] || 'ALL';
    const allowedB = COLOR_RULES[colorB] || 'ALL';

    if (allowedA === 'ALL' || allowedB === 'ALL') return true;

    return allowedA.includes(colorB);
};

export const checkVibeMatch = (vibeA?: Vibe, vibeB?: Vibe): boolean => {
    if (!vibeA || !vibeB) return true;
    if (vibeA === vibeB) return true;

    const allowed = VIBE_COMPATIBILITY[vibeA] || [];
    return allowed.includes(vibeB);
};

export const filterCompatibleItems = (anchorItem: Item, candidates: Item[]): Item[] => {
    const perfectMatches = candidates.filter(item =>
        checkColorMatch(anchorItem.color, item.color) &&
        checkVibeMatch(anchorItem.vibe, item.vibe)
    );
    if (perfectMatches.length > 0) return perfectMatches;

    const vibeMatches = candidates.filter(item =>
        checkVibeMatch(anchorItem.vibe, item.vibe)
    );
    if (vibeMatches.length > 0) return vibeMatches;

    const colorMatches = candidates.filter(item =>
        checkColorMatch(anchorItem.color, item.color)
    );
    if (colorMatches.length > 0) return colorMatches;

    return candidates;
};

export async function generateOutfitAI(items: Item[], weather: any, apiKey: string): Promise<GeneratedOutfit> {
    if (!apiKey) throw new Error("API Key missing");

    const genAI = new GoogleGenerativeAI(apiKey);

    // List of models to try in order of preference
    const MODELS = [
        "gemini-flash-latest",
        "gemini-2.0-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash",
        "gemini-pro",
        "gemini-pro-latest"
    ];

    const weatherContext = weather
        ? `Temperature: ${weather.temperature}°C, Rain Prob: ${weather.rainProb}%, Condition: ${JSON.stringify(weather)}`
        : "Standard weather (20°C)";

    const prompt = `
        You are a high-end personal stylist. I will share my closet items and the current weather.
        Please create ONE perfect outfit for me.

        CLOSET ITEMS:
        ${JSON.stringify(items.map(i => ({ id: i.id, name: i.name, category: i.category, color: i.color, vibe: i.vibe })))}

        WEATHER:
        ${weatherContext}

        RULES:
        1. Select 1 item for 'Tops', 1 for 'Bottoms', 1 for 'Footwear' (REQUIRED).
        2. Optionally select 1 'Outerwear' if the weather is cold enough (< 20°C).
        3. Ensure colors and vibes match well.
        4. Return ONLY a valid JSON object mapping category to the ITEM ID.

        Example Output JSON:
        {
            "Tops": "item_id_1",
            "Bottoms": "item_id_2",
            "Footwear": "item_id_3"
        }
    `;

    let lastError = null;

    for (const modelName of MODELS) {
        try {
            console.log(`Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json"
                }
            });
            const response = await result.response;
            const text = response.text();

            // If we get here, it succeeded
            const ids = JSON.parse(text);

            const outfit: GeneratedOutfit = {};
            if (ids.Tops) outfit['Tops'] = items.find(i => i.id === ids.Tops);
            if (ids.Bottoms) outfit['Bottoms'] = items.find(i => i.id === ids.Bottoms);
            if (ids.Footwear) outfit['Footwear'] = items.find(i => i.id === ids.Footwear);
            if (ids.Outerwear) outfit['Outerwear'] = items.find(i => i.id === ids.Outerwear);

            return outfit;

        } catch (e: any) {
            console.warn(`Model ${modelName} failed:`, e.message);
            lastError = e;
            // Continue to next model
        }
    }

    // If we exhausted all models
    console.error("All AI models failed.");
    throw lastError || new Error("All AI models failed");
}
