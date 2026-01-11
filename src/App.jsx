import React, { useState, useEffect } from 'react';
import Inventory from './components/Inventory';
import OutfitGenerator from './components/OutfitGenerator';
import AddItemForm from './components/AddItemForm';
import SavedOutfits from './components/SavedOutfits';

const MOCK_DATA = [
  { id: '1', name: 'Classic White Tee', category: 'Tops', vibe: 'Casual', color: 'White' },
  { id: '2', name: 'Dark Wash Denim', category: 'Bottoms', vibe: 'Casual', color: 'Navy' },
  { id: '3', name: 'Minimalist White Sneakers', category: 'Footwear', vibe: 'Casual', color: 'White' },
  { id: '4', name: 'Navy Wool Blazer', category: 'Outerwear', vibe: 'Formal', color: 'Navy' },
  { id: '5', name: 'Black Turtleneck', category: 'Tops', vibe: 'Formal', color: 'Black' },
  { id: '6', name: 'Chino Trousers', category: 'Bottoms', vibe: 'Business', color: 'Beige' },
  { id: '7', name: 'Chelsea Boots', category: 'Footwear', vibe: 'Formal', color: 'Black' },
  { id: '8', name: 'Denim Jacket', category: 'Outerwear', vibe: 'Casual', color: 'Blue' },
];

function App() {
  const [items, setItems] = useState(() => {
    // Try to load from local storage or use mock
    const saved = localStorage.getItem('closetItems');
    return saved ? JSON.parse(saved) : MOCK_DATA;
  });

  const [savedOutfits, setSavedOutfits] = useState(() => {
    const saved = localStorage.getItem('savedOutfits');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('closetItems', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('savedOutfits', JSON.stringify(savedOutfits));
  }, [savedOutfits]);

  const handleAddItem = (newItem) => {
    const item = { ...newItem, id: Date.now().toString() };
    setItems([...items, item]);
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  const handleSaveOutfit = (outfit) => {
    if (!outfit) return;
    const newOutfit = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: outfit
    };
    setSavedOutfits([newOutfit, ...savedOutfits]);
  };

  const handleDeleteOutfit = (id) => {
    setSavedOutfits(savedOutfits.filter(o => o.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-cream-100 font-sans selection:bg-cream-100 selection:text-slate-950">

      {/* Header */}
      <header className="border-b border-slate-900 sticky top-0 bg-slate-950/80 backdrop-blur z-40">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight text-cream-50">
            MEN'S <span className="text-slate-500 font-light">CLOSET</span>
          </h1>
          <div className="text-xs text-slate-500 font-mono">
            {items.length} ITEMS
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <OutfitGenerator items={items} onSave={handleSaveOutfit} />

        <SavedOutfits outfits={savedOutfits} onDelete={handleDeleteOutfit} />

        <div className="mt-12">
          <h2 className="text-lg font-light text-slate-400 mb-6 uppercase tracking-widest border-l-2 border-cream-100 pl-3">
            Digital Inventory
          </h2>
          <Inventory items={items} onDelete={handleDeleteItem} />
        </div>
      </main>

      <AddItemForm onAdd={handleAddItem} />
    </div>
  );
}

export default App;
