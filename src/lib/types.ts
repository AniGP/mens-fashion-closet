export type Category = 'Tops' | 'Bottoms' | 'Outerwear' | 'Footwear';
export const CATEGORIES_LIST: Category[] = ['Tops', 'Bottoms', 'Outerwear', 'Footwear'];

export type Vibe = 'Casual' | 'Formal' | 'Business' | 'Streetwear' | 'Sport' | 'Vintage';
export const VIBES_LIST: Vibe[] = ['Casual', 'Formal', 'Business', 'Streetwear', 'Sport', 'Vintage'];

export type Color = 'Black' | 'White' | 'Navy' | 'Grey' | 'Beige' | 'Brown' | 'Olive' | 'Red' | 'Blue' | 'Green' | 'Other';
export const COLORS_LIST: Color[] = ['Black', 'White', 'Navy', 'Grey', 'Beige', 'Brown', 'Olive', 'Red', 'Blue', 'Green', 'Other'];

export interface Item {
    id: string;
    name: string;
    category: Category;
    vibe: Vibe;
    color?: Color; // optional because older items might not have it
    image?: string;
}

export type GeneratedOutfit = Partial<Record<Category, Item>>;

export interface SavedOutfit {
    id: string;
    date: string;
    items: GeneratedOutfit;
}
