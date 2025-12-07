import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, Droplets } from 'lucide-react';
import { ClothingItem, ClothingCategory } from '../types';
import { analyzeClothingImage } from '../services/geminiService';

interface WardrobeProps {
  items: ClothingItem[];
  setItems: React.Dispatch<React.SetStateAction<ClothingItem[]>>;
}

const Wardrobe: React.FC<WardrobeProps> = ({ items, setItems }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      
      // Call Gemini Service
      const analysis = await analyzeClothingImage(base64String);
      
      const newItem: ClothingItem = {
        id: Date.now().toString(),
        imageUrl: reader.result as string,
        category: analysis.category || ClothingCategory.TOP,
        color: analysis.color || 'Unknown',
        warmthLevel: analysis.warmthLevel || 5,
        occasion: analysis.occasion || [],
        name: analysis.name || 'New Item',
        isDirty: false
      };

      setItems(prev => [newItem, ...prev]);
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const toggleDirty = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, isDirty: !item.isDirty } : item
    ));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="pb-24 px-4 pt-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">My Wardrobe</h2>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-brand-600 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg hover:bg-brand-500 transition-colors"
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <span className="animate-pulse">Analyzing...</span>
          ) : (
            <>
              <Camera size={20} />
              <span>Add Item</span>
            </>
          )}
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileUpload}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {items.length === 0 && (
          <div className="col-span-2 text-center py-12 text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
            <Upload className="mx-auto mb-2 opacity-50" size={48} />
            <p>Your closet is empty. Upload your first item!</p>
          </div>
        )}
        
        {items.map(item => (
          <div key={item.id} className={`bg-white rounded-xl shadow-sm overflow-hidden relative group border ${item.isDirty ? 'border-amber-400 bg-amber-50' : 'border-slate-100'}`}>
            <div className="aspect-square bg-slate-100 relative">
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
              {item.isDirty && (
                <div className="absolute inset-0 bg-amber-900/20 flex items-center justify-center backdrop-blur-[1px]">
                  <span className="bg-white text-amber-600 px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider">Laundry</span>
                </div>
              )}
            </div>
            
            <div className="p-3">
              <h3 className="font-medium text-slate-800 text-sm truncate">{item.name}</h3>
              <p className="text-xs text-slate-500 capitalize">{item.color} • {item.category}</p>
              
              <div className="flex gap-2 mt-3 justify-end">
                <button 
                  onClick={() => toggleDirty(item.id)}
                  className={`p-1.5 rounded-full ${item.isDirty ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400 hover:text-blue-500'}`}
                  title="Toggle Laundry Mode"
                >
                  <Droplets size={16} />
                </button>
                <button 
                  onClick={() => deleteItem(item.id)}
                  className="p-1.5 rounded-full bg-slate-100 text-slate-400 hover:text-red-500"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wardrobe;