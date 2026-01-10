import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const CATEGORIES = ['Tops', 'Bottoms', 'Outerwear', 'Footwear'];
const VIBES = ['Casual', 'Formal', 'Business', 'Streetwear', 'Sport', 'Vintage'];

export default function AddItemForm({ onAdd }) {
    const [isOpen, setIsOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: 'Tops',
        vibe: 'Casual',
        color: 'Black',
        image: null
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name) return;

        onAdd(formData);
        setFormData({ name: '', category: 'Tops', vibe: 'Casual', color: 'Black', image: null }); // Reset
        setIsOpen(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-cream-100 text-slate-950 p-4 rounded-full shadow-2xl hover:bg-white hover:scale-105 transition-all z-50 flex items-center gap-2 font-medium"
            >
                <Plus size={24} />
                <span className="hidden md:inline">Add Item</span>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 w-full max-w-md rounded-xl border border-slate-800 shadow-2xl overflow-hidden p-6 relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-cream-100 transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-light text-cream-50 mb-6">Add New Item</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Item Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Oxford Shirt"
                            className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-cream-50 focus:outline-none focus:border-cream-100/30 transition-colors placeholder:text-slate-700"
                            autoFocus
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Category</label>
                            <div className="relative">
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-cream-50 focus:outline-none focus:border-cream-100/30 appearance-none cursor-pointer"
                                >
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Vibe</label>
                            <select
                                value={formData.vibe}
                                onChange={(e) => setFormData({ ...formData, vibe: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-cream-50 focus:outline-none focus:border-cream-100/30 appearance-none cursor-pointer"
                            >
                                {VIBES.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Color (Optional)</label>
                            <select
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-cream-50 focus:outline-none focus:border-cream-100/30 appearance-none cursor-pointer"
                            >
                                {['Black', 'White', 'Navy', 'Grey', 'Beige', 'Brown', 'Olive', 'Red', 'Blue', 'Green', 'Other'].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1">Image (Optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setFormData({ ...formData, image: reader.result });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="w-full bg-slate-950 text-slate-400 text-xs border border-slate-800 rounded p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cream-100 hover:file:bg-slate-700"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-cream-100 text-slate-950 font-medium py-3 rounded mt-4 hover:bg-white transition-colors"
                    >
                        Add to Closet
                    </button>
                </form>
            </div>
        </div>
    );
}
