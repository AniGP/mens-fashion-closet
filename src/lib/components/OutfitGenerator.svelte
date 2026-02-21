<script lang="ts">
    import { onMount } from "svelte";
    import {
        RefreshCw,
        Shirt,
        Layers,
        PersonStanding,
        Footprints,
        Cloud,
        Sun,
        Loader2,
        Heart,
        Sparkles,
        BrainCircuit,
    } from "lucide-svelte";
    import { filterCompatibleItems, generateOutfitAI } from "../fashionLogic";
    import type { Item, GeneratedOutfit, Category } from "../types";

    interface Props {
        items: Item[];
        onSave: (outfit: GeneratedOutfit) => void;
        apiKey: string;
    }

    let { items, onSave, apiKey }: Props = $props();

    let outfit = $state<GeneratedOutfit | null>(null);
    let weather = $state<any>(null);
    let loading = $state(true);
    let generating = $state(false);
    let aiError = $state<string | null>(null);

    const CAT_ICON_MAP: Record<Category, any> = {
        Tops: Shirt,
        Bottoms: PersonStanding,
        Outerwear: Layers,
        Footwear: Footprints,
    };
    const CAT_KEYS = Object.keys(CAT_ICON_MAP) as Category[];

    function isSuitableForWeather(item: Item, temp: number) {
        const name = item.name.toLowerCase();
        const category = item.category;

        if (category === "Bottoms") {
            if (
                temp > 25 &&
                (name.includes("jean") ||
                    name.includes("wool") ||
                    name.includes("heavy"))
            )
                return false;
        }

        const isCold = temp < 15;
        const isHot = temp > 22;

        if (isCold) {
            if (
                name.includes("shorts") ||
                name.includes("linen") ||
                name.includes("sandal")
            )
                return false;
            return true;
        }
        if (isHot) {
            if (
                name.includes("wool") ||
                name.includes("coat") ||
                name.includes("heavy") ||
                name.includes("boot") ||
                name.includes("jacket") ||
                name.includes("turtleneck")
            )
                return false;
            return true;
        }
        return true;
    }

    async function generateOutfit(useAI: boolean = false) {
        generating = true;
        aiError = null;

        try {
            if (useAI && apiKey) {
                // AI Generation
                outfit = await generateOutfitAI(items, weather, apiKey);
            } else {
                // Standard Algorithmic Generation
                generateOutfitAlgorithmic();
            }
        } catch (e) {
            console.error("Generation failed", e);
            aiError = "AI failed. Using standard shuffle.";
            generateOutfitAlgorithmic(); // Fallback
        } finally {
            generating = false;
        }
    }

    function generateOutfitAlgorithmic() {
        const newOutfit: GeneratedOutfit = {};
        const currentTemp = weather ? weather.temperature : 20;

        // 1. Select TOP first (The Anchor)
        const tops = items.filter(
            (i) =>
                i.category === "Tops" && isSuitableForWeather(i, currentTemp),
        );

        const availableTops =
            tops.length > 0 ? tops : items.filter((i) => i.category === "Tops");

        if (availableTops.length > 0) {
            newOutfit["Tops"] =
                availableTops[Math.floor(Math.random() * availableTops.length)];
        }

        const anchorItem = newOutfit["Tops"];

        // 2. Select BOTTOM (Match with Top)
        let bottoms = items.filter(
            (i) =>
                i.category === "Bottoms" &&
                isSuitableForWeather(i, currentTemp),
        );
        if (bottoms.length === 0)
            bottoms = items.filter((i) => i.category === "Bottoms"); // Fallback

        if (anchorItem && bottoms.length > 0) {
            const compatibleBottoms = filterCompatibleItems(
                anchorItem,
                bottoms,
            );
            newOutfit["Bottoms"] =
                compatibleBottoms[
                    Math.floor(Math.random() * compatibleBottoms.length)
                ];
        } else if (bottoms.length > 0) {
            newOutfit["Bottoms"] =
                bottoms[Math.floor(Math.random() * bottoms.length)];
        }

        // 3. Select FOOTWEAR (Match with Bottoms preferred, or Top)
        let footwear = items.filter(
            (i) =>
                i.category === "Footwear" &&
                isSuitableForWeather(i, currentTemp),
        );
        if (footwear.length === 0)
            footwear = items.filter((i) => i.category === "Footwear");

        const bottomItem = newOutfit["Bottoms"];
        const footwearAnchor = bottomItem || anchorItem;

        if (footwearAnchor && footwear.length > 0) {
            const compatibleFootwear = filterCompatibleItems(
                footwearAnchor,
                footwear,
            );
            newOutfit["Footwear"] =
                compatibleFootwear[
                    Math.floor(Math.random() * compatibleFootwear.length)
                ];
        } else if (footwear.length > 0) {
            newOutfit["Footwear"] =
                footwear[Math.floor(Math.random() * footwear.length)];
        }

        // 4. Select OUTERWEAR (If needed)
        const needsLayer =
            currentTemp < 20 || (currentTemp <= 24 && Math.random() > 0.7);

        if (needsLayer) {
            let outerwear = items.filter(
                (i) =>
                    i.category === "Outerwear" &&
                    isSuitableForWeather(i, currentTemp),
            );
            if (outerwear.length === 0 && currentTemp < 15)
                outerwear = items.filter((i) => i.category === "Outerwear"); // Force layer if cold

            if (outerwear.length > 0) {
                const compatibleOuterwear = anchorItem
                    ? filterCompatibleItems(anchorItem, outerwear)
                    : outerwear;
                newOutfit["Outerwear"] =
                    compatibleOuterwear[
                        Math.floor(Math.random() * compatibleOuterwear.length)
                    ];
            }
        }

        outfit = newOutfit;
    }

    onMount(() => {
        async function fetchWeather() {
            loading = true;
            try {
                const position = await new Promise<GeolocationPosition>(
                    (resolve, reject) => {
                        navigator.geolocation.getCurrentPosition(
                            resolve,
                            reject,
                        );
                    },
                );
                const { latitude, longitude } = position.coords;

                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=precipitation_probability&forecast_days=1`,
                );
                const data = await res.json();

                let rainProb = 0;
                if (data.hourly && data.hourly.precipitation_probability) {
                    const currentHourISO = data.current_weather.time;
                    const timeIndex = data.hourly.time.indexOf(currentHourISO);
                    if (timeIndex >= 0) {
                        rainProb =
                            data.hourly.precipitation_probability[timeIndex];
                    }
                }

                weather = {
                    ...data.current_weather,
                    rainProb,
                };
            } catch (e) {
                console.error("Weather fetch failed", e);
            } finally {
                loading = false;
            }
        }

        fetchWeather();
    });

    $effect(() => {
        // If mock data loads and we haven't generated, generate.
        if (!outfit && items.length > 0 && !loading) {
            generateOutfit(false);
        }
    });

    $effect(() => {
        // Regenerate if API key changes (optional, but good UX)
        // Only do this if we have items and aren't already generating
        if (apiKey && items.length > 0 && !generating && !outfit) {
            generateOutfit(true);
        }
    });
</script>

<div
    class="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-xl mb-8 relative overflow-hidden"
>
    <!-- Weather Background Accent -->
    <div
        class="absolute top-0 right-0 p-32 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none"
    ></div>

    <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4"
    >
        <div>
            <h2 class="text-2xl font-light text-cream-50 tracking-wide">
                Look of the Day
            </h2>
            {#if weather}
                <div
                    class="flex items-center gap-2 text-slate-400 text-sm mt-1 animate-in fade-in slide-in-from-left-2 transition-all"
                >
                    {#if weather.temperature > 20}
                        <Sun size={14} class="text-yellow-500" />
                    {:else}
                        <Cloud size={14} class="text-blue-300" />
                    {/if}
                    <span>
                        {weather.temperature}°C / {Math.round(
                            (weather.temperature * 9) / 5 + 32,
                        )}°F
                    </span>
                    <span class="text-slate-600">•</span>
                    <span>{weather.rainProb}% Rain</span>
                    <span class="text-slate-600">•</span>
                    <span
                        >It's a {weather.temperature < 15
                            ? "chilly"
                            : weather.temperature > 22
                              ? "warm"
                              : "mild"} day</span
                    >
                </div>
            {/if}
            {#if !weather && !loading}
                <div class="text-slate-500 text-xs mt-1">
                    Weather unavailable (using default)
                </div>
            {/if}
        </div>

        <div class="flex items-center gap-3">
            <button
                onclick={() => onSave(outfit!)}
                disabled={!outfit || generating}
                class="flex items-center gap-2 bg-slate-800 text-cream-100 px-4 py-2 rounded hover:bg-slate-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                title="Save to Lookbook"
            >
                <Heart size={16} />
                <span class="hidden sm:inline">Save</span>
            </button>

            <button
                onclick={() => generateOutfit(false)}
                disabled={generating}
                class="flex items-center gap-2 px-4 py-2 rounded transition-all text-sm font-medium shadow-lg z-10 bg-cream-100 text-slate-950 hover:bg-white shadow-cream-100/10"
                title="Standard Algorithmic Shuffle"
            >
                {#if generating && !apiKey}
                    <Loader2 size={16} class="animate-spin" />
                    Shuffling...
                {:else}
                    <RefreshCw size={16} />
                    Shuffle
                {/if}
            </button>

            <button
                onclick={() => generateOutfit(true)}
                disabled={generating || !apiKey}
                class={`flex items-center gap-2 px-4 py-2 rounded transition-all text-sm font-medium shadow-lg z-10 ${
                    apiKey
                        ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-900/40"
                        : "bg-indigo-600/50 text-white/50 cursor-not-allowed"
                }`}
                title={apiKey
                    ? "Generate outfit using AI"
                    : "Enter a Gemini API Key in Settings to enable AI Style"}
            >
                {#if generating && apiKey}
                    <Loader2 size={16} class="animate-spin" />
                    AI Styling...
                {:else}
                    <Sparkles size={16} />
                    AI Style Me
                {/if}
            </button>
        </div>
    </div>

    {#if aiError}
        <div
            class="mb-4 text-xs text-red-400 bg-red-900/10 border border-red-900/30 p-2 rounded flex items-center justify-center gap-2"
        >
            <span>{aiError}</span>
        </div>
    {/if}

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 z-10 relative">
        {#each CAT_KEYS as cat}
            {@const Icon = CAT_ICON_MAP[cat]}
            {@const item = outfit ? outfit[cat] : null}

            <div
                class="bg-slate-950 rounded border border-slate-800 flex flex-col items-center text-center h-48 justify-center group hover:border-slate-600 transition-colors overflow-hidden relative"
            >
                {#if item}
                    {#if item.image}
                        <div class="w-full h-full absolute inset-0">
                            <img
                                src={item.image}
                                alt={item.name}
                                class="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity"
                            />
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"
                            ></div>
                        </div>
                    {:else}
                        <div
                            class="mb-2 text-slate-400 group-hover:text-cream-200 transition-colors z-10"
                        >
                            <Icon size={32} strokeWidth={1} />
                        </div>
                    {/if}

                    <div class="z-10 absolute bottom-4 w-full px-2">
                        <span
                            class="font-medium text-cream-50 text-sm truncate w-full block drop-shadow-md"
                            >{item.name}</span
                        >
                        <div
                            class="flex items-center justify-center gap-2 mt-1"
                        >
                            <span
                                class="text-xs text-slate-400 uppercase tracking-wider drop-shadow-md"
                                >{item.vibe}</span
                            >
                            {#if item.color}
                                <div
                                    class="w-2 h-2 rounded-full shadow-sm"
                                    style="background-color: {item.color ===
                                    'Other'
                                        ? 'white'
                                        : item.color.toLowerCase()}"
                                ></div>
                            {/if}
                        </div>
                    </div>
                {:else}
                    <div class="flex flex-col items-center z-10">
                        <div class="mb-2 text-slate-600">
                            <Icon size={24} />
                        </div>
                        <span class="text-sm text-slate-600 italic">
                            {cat === "Outerwear" && weather?.temperature > 20
                                ? "Too hot for layers"
                                : `No ${cat}`}
                        </span>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>
