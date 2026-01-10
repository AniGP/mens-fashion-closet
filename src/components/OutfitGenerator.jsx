import React, { useState, useEffect } from 'react';
import { RefreshCw, Shirt, Layers, PersonStanding, Footprints, Cloud, Sun, Thermometer, Loader2 } from 'lucide-react';

const CATEGORIES = {
    'Tops': Shirt,
    'Bottoms': PersonStanding,
    'Outerwear': Layers,
    'Footwear': Footprints
};

export default function OutfitGenerator({ items }) {
    const [outfit, setOutfit] = useState(null);
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    // Helper to determine item warmth/suitability
    const isSuitableForWeather = (item, temp) => {
        const name = item.name.toLowerCase();
        const isCold = temp < 15;
        const isHot = temp > 22;

        if (isCold) {
            // In cold weather, avoid shorts/linen
            if (name.includes('shorts') || name.includes('linen') || name.includes('sandal')) return false;
            return true;
        }
        if (isHot) {
            // In hot weather, avoid heavy items
            if (name.includes('wool') || name.includes('coat') || name.includes('heavy') || name.includes('boot') || name.includes('jacket') || name.includes('turtleneck')) return false;
            return true;
        }
        // Mild weather - most things go
        return true;
    };

    const generateOutfit = () => {
        const categories = ['Tops', 'Bottoms', 'Footwear', 'Outerwear'];
        const newOutfit = {};

        // Default to mild if weather failed
        const currentTemp = weather ? weather.temperature : 20;

        categories.forEach(cat => {
            let filteredItems = items.filter(i => i.category === cat);

            // Apply weather filtering
            if (items.length > 0) {
                const weatherItems = filteredItems.filter(i => isSuitableForWeather(i, currentTemp));
                // If we have items that match the weather, use them. Otherwise fallback to all items in category (don't return naked)
                if (weatherItems.length > 0) {
                    filteredItems = weatherItems;
                }
            }

            // Special logic for Outerwear: skip it if it's hot
            if (cat === 'Outerwear' && currentTemp > 24) {
                // 20% chance of adding light layer in heat, otherwise skip
                if (Math.random() > 0.2) return;
            }

            if (filteredItems.length > 0) {
                newOutfit[cat] = filteredItems[Math.floor(Math.random() * filteredItems.length)];
            }
        });

        setOutfit(newOutfit);
    };

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            try {
                // Get user location
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                });
                const { latitude, longitude } = position.coords;

                // Fetch weather with rain probability
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=precipitation_probability&forecast_days=1`);
                const data = await res.json();

                let rainProb = 0;
                if (data.hourly && data.hourly.precipitation_probability) {
                    // Find the index of the current hour. data.current_weather.time is in ISO but local to coordinates maybe? 
                    // Open-Meteo returns 'time' array in ISO. We can just take the index matching the current hour of the day 
                    // assuming the array starts at 00:00. 
                    // Safer: match the hour string.
                    const currentHourISO = data.current_weather.time; // This is usually "YYYY-MM-DDTHH:00"
                    const timeIndex = data.hourly.time.indexOf(currentHourISO);
                    if (timeIndex >= 0) {
                        rainProb = data.hourly.precipitation_probability[timeIndex];
                    }
                }

                setWeather({
                    ...data.current_weather,
                    rainProb
                });
            } catch (e) {
                console.error("Weather fetch failed", e);
                // Fallback or just ignore
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    // Generate outfit when items or weather changes (only initial)
    useEffect(() => {
        if (!outfit && items.length > 0 && !loading) {
            generateOutfit();
        }
    }, [items, loading]);

    return (
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow-xl mb-8 relative overflow-hidden">
            {/* Weather Background Accent */}
            <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-2xl font-light text-cream-50 tracking-wide">Look of the Day</h2>
                    {weather && (
                        <div className="flex items-center gap-2 text-slate-400 text-sm mt-1 animate-in fade-in slide-in-from-left-2 transition-all">
                            {weather.temperature > 20 ? <Sun size={14} className="text-yellow-500" /> : <Cloud size={14} className="text-blue-300" />}
                            <span>
                                {weather.temperature}°C / {Math.round(weather.temperature * 9 / 5 + 32)}°F
                            </span>
                            <span className="text-slate-600">•</span>
                            <span>{weather.rainProb}% Rain</span>
                            <span className="text-slate-600">•</span>
                            <span>It's a {weather.temperature < 15 ? 'chilly' : weather.temperature > 22 ? 'warm' : 'mild'} day</span>
                        </div>
                    )}
                    {!weather && !loading && <div className="text-slate-500 text-xs mt-1">Weather unavailable (using default)</div>}
                </div>

                <button
                    onClick={generateOutfit}
                    className="flex items-center gap-2 bg-cream-100 text-slate-950 px-4 py-2 rounded hover:bg-white transition-colors text-sm font-medium shadow-lg shadow-cream-100/10 z-10"
                >
                    <RefreshCw size={16} />
                    Shuffle
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 z-10 relative">
                {Object.keys(CATEGORIES).map(cat => {
                    const Icon = CATEGORIES[cat];
                    const item = outfit ? outfit[cat] : null;

                    return (
                        <div key={cat} className="bg-slate-950 rounded border border-slate-800 flex flex-col items-center text-center h-48 justify-center group hover:border-slate-600 transition-colors overflow-hidden relative">
                            {item ? (
                                <>
                                    {item.image ? (
                                        <div className="w-full h-full absolute inset-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                                        </div>
                                    ) : (
                                        <div className="mb-2 text-slate-400 group-hover:text-cream-200 transition-colors z-10">
                                            <Icon size={32} strokeWidth={1} />
                                        </div>
                                    )}

                                    <div className="z-10 absolute bottom-4 w-full px-2">
                                        <span className="font-medium text-cream-50 text-sm truncate w-full block drop-shadow-md">{item.name}</span>
                                        <div className="flex items-center justify-center gap-2 mt-1">
                                            <span className="text-xs text-slate-400 uppercase tracking-wider drop-shadow-md">{item.vibe}</span>
                                            {item.color && (
                                                <div
                                                    className="w-2 h-2 rounded-full shadow-sm"
                                                    style={{ backgroundColor: item.color === 'Other' ? 'white' : item.color.toLowerCase() }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center z-10">
                                    <div className="mb-2 text-slate-600">
                                        <Icon size={24} />
                                    </div>
                                    <span className="text-sm text-slate-600 italic">
                                        {cat === 'Outerwear' && weather?.temperature > 20 ? 'Too hot for layers' : `No ${cat}`}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
