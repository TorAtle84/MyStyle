import React, { useState } from 'react';
import { Briefcase, Plane, Sun } from 'lucide-react';
import { ClothingItem } from '../types';

interface SuitcaseProps {
    items: ClothingItem[];
}

const Suitcase: React.FC<SuitcaseProps> = ({ items }) => {
    const [days, setDays] = useState(3);
    const [destination, setDestination] = useState("London");
    const [generatedList, setGeneratedList] = useState<ClothingItem[] | null>(null);

    const generateList = () => {
        // Very basic logic for MVP: 1 top per day, 1 bottom per 2 days
        const topsNeeded = days;
        const bottomsNeeded = Math.ceil(days / 2);
        
        const tops = items.filter(i => i.category === 'Top' && !i.isDirty).slice(0, topsNeeded);
        const bottoms = items.filter(i => i.category === 'Bottom' && !i.isDirty).slice(0, bottomsNeeded);
        const shoes = items.filter(i => i.category === 'Shoes').slice(0, 1);
        
        setGeneratedList([...tops, ...bottoms, ...shoes]);
    };

    return (
        <div className="pb-24 px-4 pt-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Suitcase Planner</h2>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Destination</label>
                        <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl">
                            <Plane size={18} className="text-slate-400" />
                            <input 
                                type="text" 
                                value={destination} 
                                onChange={(e) => setDestination(e.target.value)}
                                className="bg-transparent w-full outline-none text-slate-800 font-medium"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Duration (Days)</label>
                        <input 
                            type="range" 
                            min="2" 
                            max="14" 
                            value={days} 
                            onChange={(e) => setDays(Number(e.target.value))}
                            className="w-full accent-brand-500" 
                        />
                        <div className="text-right text-brand-600 font-bold">{days} Days</div>
                    </div>
                    
                    <button 
                        onClick={generateList}
                        className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-brand-500 transition-colors"
                    >
                        Generate Packing List
                    </button>
                </div>
            </div>

            {generatedList && (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-700">Packing List ({generatedList.length} Items)</h3>
                        <span className="text-xs text-brand-600 bg-brand-50 px-2 py-1 rounded-full font-bold">Smart Pack</span>
                    </div>
                    <div className="space-y-3">
                        {generatedList.map(item => (
                            <div key={item.id} className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-100">
                                <img src={item.imageUrl} className="w-12 h-12 rounded-lg object-cover bg-slate-100" alt="" />
                                <div>
                                    <p className="font-medium text-slate-800 text-sm">{item.name}</p>
                                    <p className="text-xs text-slate-500">{item.category}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Suitcase;