import React from 'react';
import { Trash2, Heart } from 'lucide-react';

export default function SavedOutfits({ outfits, onDelete }) {
    if (!outfits || outfits.length === 0) return null;

    return (
        <div className="mb-12">
            <h2 className="text-lg font-light text-slate-400 mb-6 uppercase tracking-widest border-l-2 border-red-400 pl-3 flex items-center gap-2">
                Saved Lookbook <Heart size={16} className="text-red-400 fill-red-400" />
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {outfits.map((outfit) => (
                    <div key={outfit.id} className="bg-slate-900 border border-slate-800 rounded-lg p-4 group hover:border-slate-700 transition-all relative">
                        <button
                            onClick={() => onDelete(outfit.id)}
                            className="absolute top-2 right-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all z-10"
                            title="Remove Look"
                        >
                            <Trash2 size={16} />
                        </button>

                        <div className="text-xs text-slate-500 mb-2 font-mono">{new Date(outfit.date).toLocaleDateString()}</div>

                        <div className="grid grid-cols-2 gap-2">
                            {['Tops', 'Bottoms', 'Outerwear', 'Footwear'].map(cat => {
                                const item = outfit.items[cat];
                                if (!item) return null;
                                return (
                                    <div key={cat} className="flex items-center gap-2 overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} className="w-8 h-8 rounded object-cover border border-slate-800" alt={item.name} />
                                        ) : (
                                            <div className="w-8 h-8 rounded bg-slate-950 border border-slate-800 flex-shrink-0"></div>
                                        )}
                                        <div className="truncate text-xs text-cream-100 opacity-80">{item.name}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
