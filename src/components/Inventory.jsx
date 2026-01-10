import React from 'react';
import { Shirt, Layers, PersonStanding, Footprints, Trash2 } from 'lucide-react';

const CATEGORIES = {
    'Tops': { icon: Shirt, label: 'Tops' },
    'Bottoms': { icon: PersonStanding, label: 'Bottoms' }, // Fallback to generic if needed
    'Outerwear': { icon: Layers, label: 'Outerwear' },
    'Footwear': { icon: Footprints, label: 'Footwear' }
};

export default function Inventory({ items, onDelete }) {

    const getCategoryItems = (cat) => items.filter(i => i.category === cat);

    return (
        <div className="space-y-8">
            {Object.keys(CATEGORIES).map(cat => {
                const { icon: Icon, label } = CATEGORIES[cat];
                const catItems = getCategoryItems(cat);

                return (
                    <section key={cat}>
                        <div className="flex items-center gap-2 mb-4 text-slate-400 border-b border-slate-800 pb-2">
                            <Icon size={20} />
                            <h3 className="text-sm font-medium uppercase tracking-widest">{label}</h3>
                            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-500">{catItems.length}</span>
                        </div>

                        {catItems.length === 0 ? (
                            <div className="text-slate-600 text-sm italic py-4">No items yet.</div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {catItems.map(item => (
                                    <div key={item.id} className="group relative bg-slate-900 border border-slate-800 rounded overflow-hidden hover:bg-slate-800 transition-all">

                                        {/* Image or Placeholder Area */}
                                        <div className="h-32 w-full bg-slate-950 flex items-center justify-center relative overflow-hidden">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-slate-800">
                                                    <Icon size={48} strokeWidth={1} />
                                                </div>
                                            )}

                                            {/* Delete button (overlay) */}
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-slate-950/50 p-1 rounded">
                                                <button
                                                    onClick={() => onDelete(item.id)}
                                                    className="text-white hover:text-red-400 block"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="p-3">
                                            <div className="flex justify-between items-start gap-2">
                                                <h4 className="font-medium text-cream-50 text-sm truncate">{item.name}</h4>
                                                {/* Color Dot */}
                                                {item.color && (
                                                    <div
                                                        className="w-3 h-3 rounded-full border border-slate-700 shadow-sm shrink-0 mt-1"
                                                        style={{ backgroundColor: item.color === 'Other' ? 'transparent' : item.color.toLowerCase() }}
                                                        title={item.color}
                                                    />
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1">{item.vibe}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                );
            })}
        </div>
    );
}
