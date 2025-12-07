
import React, { useState, useEffect } from 'react';
import { Shirt, Sparkles, Briefcase, Check, ArrowLeft, Settings, Info, X } from 'lucide-react';
import { UserProfile, BodyShape, ColorSeason, HairStyle, ClothingItem, WeatherData, ClothingCategory, Occasion } from './types';
import Wardrobe from './components/Wardrobe';
import OutfitPlanner from './components/OutfitPlanner';
import Suitcase from './components/Suitcase';
import Avatar from './components/Avatar';

// Mock Initial Data
const INITIAL_WEATHER: WeatherData = {
  temp: 12,
  condition: 'Cloudy',
  isRaining: false
};

// Demo Wardrobe Data with new Accessories
const DEMO_WARDROBE: ClothingItem[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&q=80&w=300',
    category: ClothingCategory.TOP,
    color: 'White',
    warmthLevel: 3,
    occasion: [Occasion.CASUAL, Occasion.FORMAL],
    name: 'Classic White Shirt',
    isDirty: false
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=300',
    category: ClothingCategory.TOP,
    color: 'Beige',
    warmthLevel: 7,
    occasion: [Occasion.CASUAL, Occasion.LOUNGE],
    name: 'Cozy Knit Sweater',
    isDirty: false
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1542272617-08f08630329e?auto=format&fit=crop&q=80&w=300',
    category: ClothingCategory.BOTTOM,
    color: 'Blue',
    warmthLevel: 5,
    occasion: [Occasion.CASUAL],
    name: 'Vintage Wash Jeans',
    isDirty: false
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=300',
    category: ClothingCategory.BOTTOM,
    color: 'Cream',
    warmthLevel: 4,
    occasion: [Occasion.FORMAL, Occasion.CASUAL],
    name: 'Tailored Trousers',
    isDirty: false
  },
  {
    id: '7',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=300',
    category: ClothingCategory.OUTERWEAR,
    color: 'Beige',
    warmthLevel: 6,
    occasion: [Occasion.FORMAL, Occasion.CASUAL],
    name: 'Trench Coat',
    isDirty: false
  },
  {
    id: '9',
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=300',
    category: ClothingCategory.SHOES,
    color: 'Blue',
    warmthLevel: 4,
    occasion: [Occasion.CASUAL, Occasion.PARTY],
    name: 'High Heels',
    isDirty: false
  },
  {
    id: '10',
    imageUrl: 'https://images.unsplash.com/photo-1560769625-ed5974877971?auto=format&fit=crop&q=80&w=300',
    category: ClothingCategory.SHOES,
    color: 'White',
    warmthLevel: 4,
    occasion: [Occasion.CASUAL, Occasion.ACTIVE],
    name: 'Clean Sneakers',
    isDirty: false
  },
  // New Accessories
  {
    id: '11',
    imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80&w=300',
    category: ClothingCategory.ACCESSORY,
    color: 'Brown',
    warmthLevel: 1,
    occasion: [Occasion.CASUAL, Occasion.FORMAL],
    name: 'Leather Bag',
    isDirty: false
  },
   {
    id: '12',
    imageUrl: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?auto=format&fit=crop&q=80&w=300',
    category: ClothingCategory.ACCESSORY,
    color: 'Red',
    warmthLevel: 2,
    occasion: [Occasion.CASUAL, Occasion.PARTY],
    name: 'Silk Scarf',
    isDirty: false
  }
];

const SKIN_TONES = [
  { value: '#FFDFC4', name: 'Porcelain' }, 
  { value: '#EAC0B6', name: 'Fair Rose' },
  { value: '#E3B896', name: 'Honey' },
  { value: '#C68666', name: 'Bronze' },
  { value: '#8D553A', name: 'Almond' }, 
  { value: '#54362D', name: 'Espresso' }
];

const HAIR_COLORS = [
    { value: '#E6BE8A', name: 'Blonde' },
    { value: '#8D5524', name: 'Light Brown' },
    { value: '#4A3121', name: 'Dark Brown' },
    { value: '#0F0F0F', name: 'Black' },
    { value: '#A53900', name: 'Red/Auburn' },
    { value: '#9E9E9E', name: 'Grey' }
];

const EYE_COLORS = [
    { value: '#634e34', name: 'Brown' },
    { value: '#2e536f', name: 'Blue' },
    { value: '#3d671d', name: 'Green' },
    { value: '#625b50', name: 'Hazel' }
];

// Reusable Help Modal
const SeasonInfoModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2"
      >
        <X size={20} />
      </button>
      <div className="flex items-center gap-2 text-brand-600 mb-4">
        <Sparkles size={20} />
        <h3 className="text-xl font-bold">What is Color Season?</h3>
      </div>
      <div className="space-y-4 text-sm text-slate-600">
        <p>We use color analysis to suggest clothes that make you glow.</p>
        <div className="space-y-2">
            <div><span className="font-bold">Spring:</span> Warm tones, light features.</div>
            <div><span className="font-bold">Summer:</span> Cool tones, light features.</div>
            <div><span className="font-bold">Autumn:</span> Warm tones, deep features.</div>
            <div><span className="font-bold">Winter:</span> Cool tones, deep features.</div>
        </div>
      </div>
    </div>
  </div>
);

export default function App() {
  const [currentView, setCurrentView] = useState<'onboarding' | 'wardrobe' | 'outfit' | 'suitcase' | 'profile'>('onboarding');
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    bodyShape: BodyShape.HOURGLASS,
    skinTone: '#E3B896',
    hairColor: '#4A3121',
    eyeColor: '#634e34',
    hairStyle: HairStyle.LONG_WAVY,
    colorSeason: ColorSeason.AUTUMN,
    hasCompletedOnboarding: false
  });

  const [wardrobeItems, setWardrobeItems] = useState<ClothingItem[]>(DEMO_WARDROBE);
  const [weather] = useState<WeatherData>(INITIAL_WEATHER);
  const [showSeasonInfo, setShowSeasonInfo] = useState(false);

  useEffect(() => {
    if (userProfile.hasCompletedOnboarding && currentView === 'onboarding') {
      setCurrentView('outfit');
    }
  }, [userProfile.hasCompletedOnboarding, currentView]);

  const completeOnboarding = () => {
    setUserProfile(prev => ({ ...prev, hasCompletedOnboarding: true }));
    setCurrentView('outfit');
  };

  // Render Selectors Helpers
  const renderColorSelector = (options: any[], selected: string, onSelect: (val: string) => void) => (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {options.map(opt => (
            <button
                key={opt.value}
                onClick={() => onSelect(opt.value)}
                className={`flex-shrink-0 w-10 h-10 rounded-full border-2 transition-transform ${selected === opt.value ? 'border-brand-500 scale-110 shadow-md ring-2 ring-brand-200' : 'border-slate-100'}`}
                style={{ backgroundColor: opt.value }}
                title={opt.name}
            />
        ))}
    </div>
  );

  const renderGridSelector = (options: string[], selected: string, onSelect: (val: any) => void) => (
      <div className="grid grid-cols-3 gap-2">
        {options.map(opt => (
            <button
                key={opt}
                onClick={() => onSelect(opt)}
                className={`p-2 rounded-lg text-[10px] font-bold border transition-all truncate ${selected === opt ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm' : 'border-slate-200 text-slate-500'}`}
            >
                {opt}
            </button>
        ))}
    </div>
  );

  // --- Views ---

  if (currentView === 'onboarding') {
    return (
      <div className="min-h-screen bg-white flex flex-col p-6 max-w-md mx-auto relative overflow-y-auto">
        <div className="flex-1">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">My Style</h1>
            <p className="text-slate-500 mb-6">Design your digital twin.</p>
            
            <div className="space-y-5">
                {/* Avatar Preview */}
                <div className="flex justify-center py-4 bg-slate-50 rounded-2xl border border-slate-100 mb-4 sticky top-0 z-10">
                    <Avatar {...userProfile} className="h-40 w-auto" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Skin Tone</label>
                    {renderColorSelector(SKIN_TONES, userProfile.skinTone, (v) => setUserProfile({...userProfile, skinTone: v}))}
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Hair Color</label>
                    {renderColorSelector(HAIR_COLORS, userProfile.hairColor, (v) => setUserProfile({...userProfile, hairColor: v}))}
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Eye Color</label>
                    {renderColorSelector(EYE_COLORS, userProfile.eyeColor, (v) => setUserProfile({...userProfile, eyeColor: v}))}
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Hair Style</label>
                    {renderGridSelector(Object.values(HairStyle), userProfile.hairStyle, (v) => setUserProfile({...userProfile, hairStyle: v}))}
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Body Shape</label>
                    {renderGridSelector(Object.values(BodyShape), userProfile.bodyShape, (v) => setUserProfile({...userProfile, bodyShape: v}))}
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <label className="block text-xs font-bold text-slate-700 uppercase">Color Season</label>
                        <button onClick={() => setShowSeasonInfo(true)} className="text-brand-500">
                          <Info size={14} />
                        </button>
                    </div>
                    {renderGridSelector(Object.values(ColorSeason), userProfile.colorSeason, (v) => setUserProfile({...userProfile, colorSeason: v}))}
                </div>
            </div>
        </div>

        <button 
            onClick={completeOnboarding}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-slate-800 transition-colors mt-8 mb-4"
        >
            Start Styling
        </button>

        {showSeasonInfo && <SeasonInfoModal onClose={() => setShowSeasonInfo(false)} />}
      </div>
    );
  }

  // --- Profile / Settings View ---

  if (currentView === 'profile') {
    return (
      <div className="min-h-screen bg-white flex flex-col max-w-md mx-auto relative">
        <div className="px-4 py-4 flex items-center gap-4 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-20">
          <button onClick={() => setCurrentView('outfit')} className="p-2 rounded-full hover:bg-slate-100">
            <ArrowLeft size={20} className="text-slate-700" />
          </button>
          <h1 className="text-xl font-bold text-slate-800">Edit Profile</h1>
        </div>

        <div className="p-6 space-y-8 pb-24 overflow-y-auto">
          
          <div className="flex flex-col items-center">
             <Avatar {...userProfile} className="h-48 w-auto drop-shadow-2xl" />
          </div>

          <div className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Skin Tone</label>
                {renderColorSelector(SKIN_TONES, userProfile.skinTone, (v) => setUserProfile({...userProfile, skinTone: v}))}
            </div>
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Hair Color</label>
                {renderColorSelector(HAIR_COLORS, userProfile.hairColor, (v) => setUserProfile({...userProfile, hairColor: v}))}
            </div>
             <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Eye Color</label>
                {renderColorSelector(EYE_COLORS, userProfile.eyeColor, (v) => setUserProfile({...userProfile, eyeColor: v}))}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Hair Style</label>
              {renderGridSelector(Object.values(HairStyle), userProfile.hairStyle, (v) => setUserProfile({...userProfile, hairStyle: v}))}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Body Shape</label>
              {renderGridSelector(Object.values(BodyShape), userProfile.bodyShape, (v) => setUserProfile({...userProfile, bodyShape: v}))}
            </div>
          </div>

          <button 
              onClick={() => setCurrentView('outfit')}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-slate-800 transition-colors"
          >
              Save Changes
          </button>
        </div>
      </div>
    )
  }

  // --- Main App Shell ---

  return (
    <div className="min-h-screen bg-slate-50 max-w-md mx-auto relative shadow-2xl overflow-hidden flex flex-col">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3 flex justify-between items-center border-b border-slate-100">
        <h1 className="font-bold text-slate-800 text-lg tracking-tight">My Style</h1>
        <button 
          onClick={() => setCurrentView('profile')}
          className="w-10 h-10 rounded-full bg-brand-50 overflow-hidden border border-brand-200 hover:border-brand-400 transition-colors relative group"
        >
             <Avatar {...userProfile} className="w-full h-full scale-150 translate-y-1" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto">
        {currentView === 'outfit' && (
            <OutfitPlanner 
                userProfile={userProfile} 
                items={wardrobeItems} 
                weather={weather} 
            />
        )}
        {currentView === 'wardrobe' && (
            <Wardrobe items={wardrobeItems} setItems={setWardrobeItems} />
        )}
        {currentView === 'suitcase' && (
            <Suitcase items={wardrobeItems} />
        )}
      </main>

      <nav className="bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-50 pb-safe">
        <NavButton 
            active={currentView === 'wardrobe'} 
            onClick={() => setCurrentView('wardrobe')}
            icon={<Shirt size={22} />}
            label="Wardrobe"
        />
        <NavButton 
            active={currentView === 'outfit'} 
            onClick={() => setCurrentView('outfit')}
            icon={<Sparkles size={22} />}
            label="Stylist"
            highlight
        />
        <NavButton 
            active={currentView === 'suitcase'} 
            onClick={() => setCurrentView('suitcase')}
            icon={<Briefcase size={22} />}
            label="Pack"
        />
      </nav>
    </div>
  );
}

const NavButton = ({ active, onClick, icon, label, highlight }: any) => (
    <button 
        onClick={onClick}
        className={`flex flex-col items-center gap-1 transition-all ${active ? 'text-brand-600 scale-105' : 'text-slate-400 hover:text-slate-600'}`}
    >
        <div className={`${highlight && active ? 'bg-brand-50 p-2 rounded-full -mt-4 shadow-sm border border-brand-100' : ''}`}>
            {icon}
        </div>
        <span className="text-[10px] font-bold">{label}</span>
    </button>
);
