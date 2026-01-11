// Define compatible color pairs
// If a color maps to 'ALL', it matches everything.
// Otherwise, it lists the specific colors it pairs well with.
const COLOR_RULES = {
    'Black': ['White', 'Grey', 'Beige', 'Red', 'Blue', 'Olive', 'Green', 'Black', 'Other'], // Strict: No Brown, Navy
    'White': 'ALL',
    'Grey': 'ALL',
    'Navy': ['White', 'Grey', 'Beige', 'Brown', 'Blue', 'Red', 'Olive', 'Green', 'Navy', 'Other'], // Strict: No Black
    'Beige': 'ALL', // Beige is very neutral
    'Brown': ['White', 'Grey', 'Navy', 'Beige', 'Green', 'Olive', 'Red', 'Blue', 'Brown', 'Other'], // Strict: No Black
    'Olive': ['White', 'Grey', 'Navy', 'Beige', 'Brown', 'Black', 'Blue', 'Olive', 'Other'],
    'Red': ['White', 'Grey', 'Black', 'Navy', 'Beige', 'Blue', 'Red', 'Other'], // Classic
    'Blue': ['White', 'Grey', 'Black', 'Navy', 'Beige', 'Brown', 'Olive', 'Red', 'Blue', 'Other'], // Monochromatic with Navy/Blue works
    'Green': ['White', 'Grey', 'Black', 'Navy', 'Beige', 'Brown', 'Olive', 'Green', 'Other'],
    'Other': 'ALL'
};

// Define Vibe compatibility
// Casual can mix with Sport, but Formal shouldn't mix with Sport.
const VIBE_COMPATIBILITY = {
    'Casual': ['Streetwear', 'Sport', 'Vintage', 'Casual'],
    'Formal': ['Business', 'Formal'],
    'Business': ['Formal', 'Casual', 'Business'], // Business Casual is a thing
    'Streetwear': ['Casual', 'Sport', 'Vintage', 'Streetwear'],
    'Sport': ['Casual', 'Streetwear', 'Sport'],
    'Vintage': ['Casual', 'Streetwear', 'Vintage']
};

export const checkColorMatch = (colorA, colorB) => {
    if (!colorA || !colorB) return true; // Missing color info = assume match
    if (colorA === colorB) return true; // Monochromatic

    const allowedA = COLOR_RULES[colorA] || 'ALL';
    const allowedB = COLOR_RULES[colorB] || 'ALL';

    // If either is universal, it's a match
    if (allowedA === 'ALL' || allowedB === 'ALL') return true;

    // Check if B is in A's list
    return allowedA.includes(colorB);
};

export const checkVibeMatch = (vibeA, vibeB) => {
    if (!vibeA || !vibeB) return true;
    if (vibeA === vibeB) return true;

    const allowed = VIBE_COMPATIBILITY[vibeA] || [];
    return allowed.includes(vibeB);
};

// Helper to filter items based on a target "anchor" item
export const filterCompatibleItems = (anchorItem, candidates) => {
    // 1. Try to find Perfect Match (Color AND Vibe)
    const perfectMatches = candidates.filter(item =>
        checkColorMatch(anchorItem.color, item.color) &&
        checkVibeMatch(anchorItem.vibe, item.vibe)
    );
    if (perfectMatches.length > 0) return perfectMatches;

    // 2. Fallback: Match Vibe only (Color might clash, but Style is more important for coherence)
    const vibeMatches = candidates.filter(item =>
        checkVibeMatch(anchorItem.vibe, item.vibe)
    );
    if (vibeMatches.length > 0) return vibeMatches;

    // 3. Fallback: Match Color only
    const colorMatches = candidates.filter(item =>
        checkColorMatch(anchorItem.color, item.color)
    );
    if (colorMatches.length > 0) return colorMatches;

    // 4. Desperation: Return all candidates
    return candidates;
};
