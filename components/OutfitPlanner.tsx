
import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, RefreshCw, MessageCircle, RotateCw } from 'lucide-react';
import { ClothingItem, UserProfile, WeatherData, ClothingCategory, Occasion } from '../types';
import Avatar from './Avatar';
import { getStylistAdvice } from '../services/geminiService';

interface OutfitPlannerProps {
  userProfile: UserProfile;
  items: ClothingItem[];
  weather: WeatherData;
}

const OutfitPlanner: React.FC<OutfitPlannerProps> = ({ userProfile, items, weather }) => {
  const [suggestion, setSuggestion] = useState<ClothingItem[]>([]);
  const [stylistComment, setStylistComment] = useState<string>("");
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion>(Occasion.CASUAL);
  const [isFlipped, setIsFlipped] = useState(false);

  const generateOutfit = () => {
    const cleanItems = items.filter(i => !i.isDirty);
    const occasionItems = cleanItems.filter(i => i.occasion.includes(selectedOccasion));

    const tops = occasionItems.filter(i => i.category === ClothingCategory.TOP);
    const bottoms = occasionItems.filter(i => i.category === ClothingCategory.BOTTOM);
    const outerwear = occasionItems.filter(i => i.category === ClothingCategory.OUTERWEAR);
    const shoes = occasionItems.filter(i => i.category === ClothingCategory.SHOES);
    const accessories = occasionItems.filter(i => i.category === ClothingCategory.ACCESSORY);

    if (tops.length === 0 || bottoms.length === 0) {
      setSuggestion([]); 
      return; 
    }

    const randomTop = tops[Math.floor(Math.random() * tops.length)];
    const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
    
    const newOutfit = [randomTop, randomBottom];

    // Weather Logic
    if (weather.temp < 15 && outerwear.length > 0) {
        const suitableJackets = outerwear.filter(j => j.warmthLevel >= 5);
        if (suitableJackets.length > 0) {
            newOutfit.push(suitableJackets[Math.floor(Math.random() * suitableJackets.length)]);
        }
    }
    
    if (shoes.length > 0) {
        newOutfit.push(shoes[Math.floor(Math.random() * shoes.length)]);
    }

    // Add random accessory 50% of the time if available
    if (accessories.length > 0 && Math.random() > 0.5) {
        newOutfit.push(accessories[Math.floor(Math.random() * accessories.length)]);
    }

    setSuggestion(newOutfit);
    setStylistComment(""); 
    setIsFlipped(false); // Reset flip
  };

  useEffect(() => {
    generateOutfit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, selectedOccasion]);

  const handleAskStylist = async () => {
    if (suggestion.length === 0) return;
    setIsLoadingAdvice(true);
    const advice = await getStylistAdvice(userProfile, suggestion, weather);
    setStylistComment(advice);
    setIsLoadingAdvice(false);
  };

  // Helper to place items on avatar
  // Updated coordinates for the new Taller Fashion Figure (ViewBox 0 0 200 600)
  const renderClothingLayer = (category: ClothingCategory) => {
    const item = suggestion.find(i => i.category === category);
    if (!item) return null;

    let styles: React.CSSProperties = { position: 'absolute' };
    
    switch (category) {
        case ClothingCategory.TOP:
            // Torso area: Y: 140-280 approx
            styles = { ...styles, top: '24%', left: '20%', width: '60%', zIndex: 10 };
            break;
        case ClothingCategory.BOTTOM:
            // Waist/Legs: Y: 280-550 approx
            styles = { ...styles, top: '48%', left: '22%', width: '56%', zIndex: 5 }; 
            break;
        case ClothingCategory.OUTERWEAR:
            // Covers Top
            styles = { ...styles, top: '22%', left: '15%', width: '70%', zIndex: 20 }; 
            break;
        case ClothingCategory.SHOES:
            // Feet: Y: 550+
            styles = { ...styles, top: '88%', left: '25%', width: '50%', zIndex: 5 };
            break;
        case ClothingCategory.ACCESSORY:
            // Hand/Arm area
            styles = { ...styles, top: '45%', right: '2%', width: '30%', zIndex: 25 }; 
            break;
    }

    return (
        <img 
            src={item.imageUrl} 
            alt={item.name} 
            style={styles} 
            className="drop-shadow-lg object-contain transition-all duration-500 hover:scale-105"
        />
    );
  };

  return (
    <div className="pb-24 px-4 pt-4 h-full flex flex-col">
      {/* Weather Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-2xl p-4 text-white shadow-lg mb-4 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-2xl font-bold">{weather.temp}°C</h2>
          <p className="opacity-90">{weather.condition}</p>
        </div>
        {weather.isRaining ? <CloudRain size={32} /> : <Sun size={32} />}
      </div>

      {/* Occasion Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide shrink-0">
        {Object.values(Occasion).map(occ => (
          <button
            key={occ}
            onClick={() => setSelectedOccasion(occ)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
              selectedOccasion === occ 
                ? 'bg-slate-800 text-white' 
                : 'bg-white text-slate-500 border border-slate-200'
            }`}
          >
            {occ}
          </button>
        ))}
      </div>

      {/* MAIN VISUALIZER */}
      <div className="flex-1 relative mb-4 min-h-0"> 
        {/* min-h-0 is crucial for flex child scrolling/sizing */}
        <div className="absolute inset-0 bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            {/* Background Studio Light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-white via-white to-transparent opacity-80 z-0"></div>
            <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-slate-100 to-transparent z-0"></div>

            {/* Controls */}
            <div className="absolute top-4 right-4 z-50 flex flex-col gap-2">
                <button 
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="p-3 bg-white/90 backdrop-blur rounded-full shadow-lg text-slate-700 hover:text-brand-600 active:scale-95 transition-all"
                >
                    <RotateCw size={24} className={isFlipped ? "animate-spin-once" : ""} />
                </button>
            </div>

            {suggestion.length > 0 ? (
                <div className="w-full h-full relative flex items-center justify-center p-4">
                    
                    {/* AVATAR CONTAINER */}
                    <div 
                        className="relative h-full aspect-[1/3] transition-transform duration-700 preserve-3d"
                        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                    >
                         {/* FRONT SIDE */}
                        <div 
                            className="absolute inset-0 flex items-center justify-center backface-hidden"
                            style={{ backfaceVisibility: 'hidden' }}
                        >
                             <div className="relative w-full h-full flex items-center justify-center">
                                <Avatar 
                                    {...userProfile}
                                    className="h-full w-auto max-h-full z-0" 
                                />
                                {/* Clothes Layers */}
                                {renderClothingLayer(ClothingCategory.BOTTOM)}
                                {renderClothingLayer(ClothingCategory.TOP)}
                                {renderClothingLayer(ClothingCategory.SHOES)}
                                {renderClothingLayer(ClothingCategory.OUTERWEAR)}
                                {renderClothingLayer(ClothingCategory.ACCESSORY)}
                             </div>
                        </div>

                        {/* BACK SIDE */}
                        <div 
                            className="absolute inset-0 flex items-center justify-center backface-hidden"
                            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                        >
                            <div className="relative w-full h-full flex items-center justify-center">
                                <Avatar 
                                    {...userProfile}
                                    isBackView={true}
                                    className="h-full w-auto max-h-full z-0" 
                                />
                                 {/* Grayed out clothes on back for context */}
                                <div className="opacity-80 grayscale brightness-90">
                                    {renderClothingLayer(ClothingCategory.BOTTOM)}
                                    {renderClothingLayer(ClothingCategory.TOP)}
                                    {renderClothingLayer(ClothingCategory.SHOES)}
                                    {renderClothingLayer(ClothingCategory.OUTERWEAR)}
                                    {renderClothingLayer(ClothingCategory.ACCESSORY)}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                    <p>No valid outfit found.</p>
                </div>
            )}
        </div>
      </div>

      {/* Stylist Comment or Shuffle */}
      <div className="min-h-[60px] shrink-0">
        {stylistComment ? (
            <div className="bg-brand-50 p-4 rounded-xl border border-brand-100 text-brand-900 text-sm flex gap-3 animate-in slide-in-from-bottom-2">
                <MessageCircle className="shrink-0 text-brand-500" size={20} />
                <p className="italic">"{stylistComment}"</p>
            </div>
        ) : (
            <div className="grid grid-cols-4 gap-2">
                <button 
                    onClick={generateOutfit}
                    className="col-span-3 bg-slate-900 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-transform active:scale-95 flex items-center justify-center gap-2"
                >
                    <RefreshCw size={20} />
                    Shuffle Outfit
                </button>
                <button 
                     onClick={handleAskStylist}
                     disabled={isLoadingAdvice || suggestion.length === 0}
                     className="col-span-1 bg-brand-100 text-brand-700 rounded-xl flex items-center justify-center hover:bg-brand-200"
                     title="Ask AI Stylist"
                >
                    <MessageCircle size={24} />
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default OutfitPlanner;
