
export enum BodyShape {
  HOURGLASS = 'Hourglass',
  PEAR = 'Pear',
  APPLE = 'Apple',
  RECTANGLE = 'Rectangle',
  INVERTED_TRIANGLE = 'Inverted Triangle'
}

export enum ColorSeason {
  SPRING = 'Spring',
  SUMMER = 'Summer',
  AUTUMN = 'Autumn',
  WINTER = 'Winter'
}

export enum HairStyle {
  PIXIE = 'Pixie',
  BOB = 'Bob',
  LONG_WAVY = 'Long Wavy',
  LONG_STRAIGHT = 'Long Straight',
  BUN = 'Bun',
  AFRO = 'Afro'
}

export enum ClothingCategory {
  TOP = 'Top',
  BOTTOM = 'Bottom',
  DRESS = 'Dress',
  OUTERWEAR = 'Outerwear',
  SHOES = 'Shoes',
  ACCESSORY = 'Accessory'
}

export enum Occasion {
  CASUAL = 'Casual',
  FORMAL = 'Formal',
  LOUNGE = 'Lounge',
  ACTIVE = 'Active',
  PARTY = 'Party'
}

export interface ClothingItem {
  id: string;
  imageUrl: string;
  category: ClothingCategory;
  color: string;
  warmthLevel: number; // 1-10
  occasion: Occasion[];
  isDirty: boolean;
  name: string;
}

export interface UserProfile {
  name: string;
  bodyShape: BodyShape;
  skinTone: string; // Hex code
  eyeColor: string; // Hex code
  hairColor: string; // Hex code
  hairStyle: HairStyle;
  colorSeason: ColorSeason;
  hasCompletedOnboarding: boolean;
}

export interface WeatherData {
  temp: number;
  condition: 'Sunny' | 'Rainy' | 'Cloudy' | 'Snowy';
  isRaining: boolean;
}
