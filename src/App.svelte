<script lang="ts">
    import { onMount } from "svelte";
    import { Settings as SettingsIcon } from "lucide-svelte";
    import Inventory from "./lib/components/Inventory.svelte";
    import OutfitGenerator from "./lib/components/OutfitGenerator.svelte";
    import AddItemForm from "./lib/components/AddItemForm.svelte";
    import SavedOutfits from "./lib/components/SavedOutfits.svelte";
    import Settings from "./lib/components/Settings.svelte";
    import type { Item, GeneratedOutfit, SavedOutfit } from "./lib/types";

    const MOCK_DATA: Item[] = [
        {
            id: "1",
            name: "Classic White Tee",
            category: "Tops",
            vibe: "Casual",
            color: "White",
        },
        {
            id: "2",
            name: "Dark Wash Denim",
            category: "Bottoms",
            vibe: "Casual",
            color: "Navy",
        },
        {
            id: "3",
            name: "Minimalist White Sneakers",
            category: "Footwear",
            vibe: "Casual",
            color: "White",
        },
        {
            id: "4",
            name: "Navy Wool Blazer",
            category: "Outerwear",
            vibe: "Formal",
            color: "Navy",
        },
        {
            id: "5",
            name: "Black Turtleneck",
            category: "Tops",
            vibe: "Formal",
            color: "Black",
        },
        {
            id: "6",
            name: "Chino Trousers",
            category: "Bottoms",
            vibe: "Business",
            color: "Beige",
        },
        {
            id: "7",
            name: "Chelsea Boots",
            category: "Footwear",
            vibe: "Formal",
            color: "Black",
        },
        {
            id: "8",
            name: "Denim Jacket",
            category: "Outerwear",
            vibe: "Casual",
            color: "Blue",
        },
    ];

    function loadInitialItems(): Item[] {
        try {
            const s = localStorage.getItem("closetItems");
            return s ? JSON.parse(s) : MOCK_DATA;
        } catch {
            return MOCK_DATA;
        }
    }

    function loadInitialOutfits(): SavedOutfit[] {
        try {
            const s = localStorage.getItem("savedOutfits");
            return s ? JSON.parse(s) : [];
        } catch {
            return [];
        }
    }

    let items = $state<Item[]>(loadInitialItems());
    let savedOutfits = $state<SavedOutfit[]>(loadInitialOutfits());

    // API Key State
    let apiKey = $state("");
    let isSettingsOpen = $state(false);

    onMount(() => {
        apiKey = localStorage.getItem("gemini_api_key") || "";
    });

    function handleSaveKey(key: string) {
        apiKey = key;
        localStorage.setItem("gemini_api_key", key);
    }

    $effect(() => {
        localStorage.setItem("closetItems", JSON.stringify(items));
    });

    $effect(() => {
        localStorage.setItem("savedOutfits", JSON.stringify(savedOutfits));
    });

    function handleAddItem(newItem: Omit<Item, "id">) {
        const item: Item = { ...newItem, id: Date.now().toString() };
        items = [...items, item];
    }

    function handleDeleteItem(id: string) {
        items = items.filter((i) => i.id !== id);
    }

    function handleSaveOutfit(outfitItems: GeneratedOutfit) {
        if (!outfitItems || Object.keys(outfitItems).length === 0) return;
        const newOutfit: SavedOutfit = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            items: outfitItems,
        };
        savedOutfits = [newOutfit, ...savedOutfits];
    }

    function handleDeleteOutfit(id: string) {
        savedOutfits = savedOutfits.filter((o) => o.id !== id);
    }
</script>

<div
    class="min-h-screen bg-slate-950 text-cream-100 font-sans selection:bg-cream-100 selection:text-slate-950"
>
    <header
        class="border-b border-slate-900 sticky top-0 bg-slate-950/80 backdrop-blur z-40"
    >
        <div
            class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between"
        >
            <h1 class="text-xl font-bold tracking-tight text-cream-50">
                MEN'S <span class="text-slate-500 font-light">CLOSET</span>
            </h1>
            <div class="flex items-center gap-4">
                <div class="text-xs text-slate-500 font-mono hidden sm:block">
                    {items.length} ITEMS
                </div>
                <button
                    onclick={() => (isSettingsOpen = true)}
                    class="text-slate-400 hover:text-cream-100 transition-colors"
                >
                    <SettingsIcon size={20} />
                </button>
            </div>
        </div>
    </header>

    <main class="max-w-5xl mx-auto px-4 py-8">
        <OutfitGenerator {items} onSave={handleSaveOutfit} {apiKey} />

        <SavedOutfits outfits={savedOutfits} onDelete={handleDeleteOutfit} />

        <div class="mt-12">
            <h2
                class="text-lg font-light text-slate-400 mb-6 uppercase tracking-widest border-l-2 border-cream-100 pl-3"
            >
                Digital Inventory
            </h2>
            <Inventory {items} onDelete={handleDeleteItem} />
        </div>
    </main>

    <AddItemForm onAdd={handleAddItem} />

    <Settings
        isOpen={isSettingsOpen}
        onClose={() => (isSettingsOpen = false)}
        {apiKey}
        onSaveKey={handleSaveKey}
    />
</div>
