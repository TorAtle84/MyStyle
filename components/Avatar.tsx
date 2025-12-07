
import React from 'react';
import { BodyShape, HairStyle } from '../types';

interface AvatarProps {
  bodyShape: BodyShape;
  skinTone: string;
  hairColor?: string;
  hairStyle?: HairStyle;
  eyeColor?: string;
  className?: string;
  isBackView?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({ 
  bodyShape, 
  skinTone, 
  hairColor = '#4A3121',
  hairStyle = HairStyle.LONG_WAVY,
  eyeColor = '#634e34',
  className,
  isBackView = false
}) => {
  
  // -- DEFINITIONS & STYLES --

  // Generate a slightly darker version of skin tone for shading/outline
  const getShadeColor = (hex: string, percent: number) => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };

  const shadowColor = getShadeColor(skinTone, -30); // Darker outline
  const highlightColor = getShadeColor(skinTone, 20); // Lighter highlight

  // Body Shapes (Fashion Croquis Style - Elongated & Elegant)
  const getBodyPath = () => {
    switch (bodyShape) {
      case BodyShape.APPLE:
        return "M75,160 C60,180 60,240 70,280 C80,310 90,320 100,320 C110,320 120,310 130,280 C140,240 140,180 125,160 L125,140 L75,140 Z"; 
      case BodyShape.PEAR:
        return "M75,160 C75,180 65,260 60,290 C55,320 90,330 100,330 C110,330 145,320 140,290 C135,260 125,180 125,160 L125,140 L75,140 Z"; 
      case BodyShape.INVERTED_TRIANGLE:
        return "M70,140 L65,180 C65,220 80,280 90,300 C95,310 105,310 110,300 C120,280 135,220 135,180 L130,140 Z"; 
      case BodyShape.RECTANGLE:
        return "M75,140 L75,280 C75,300 90,310 100,310 C110,310 125,300 125,280 L125,140 Z"; 
      case BodyShape.HOURGLASS:
      default:
        // Classic hourglass curves
        return "M72,140 C72,180 65,200 85,220 C65,250 60,280 65,300 C70,320 90,325 100,325 C110,325 130,320 135,300 C140,280 135,250 115,220 C135,200 128,180 128,140 Z"; 
    }
  };

  const renderHair = () => {
    // Hair needs to look organic with strands
    switch (hairStyle) {
      case HairStyle.PIXIE:
        return (
          <g>
             <path d="M70,60 C60,50 60,30 100,25 C140,30 140,50 130,60 C130,75 120,80 120,65 L115,55" fill={hairColor} />
             <path d="M70,60 C65,70 75,75 80,60" fill={hairColor} /> 
          </g>
        );
      case HairStyle.BOB:
        return (
          <path d="M75,30 C60,30 55,60 55,90 C55,100 65,105 80,100 L80,50 M120,50 L120,100 C135,105 145,100 145,90 C145,60 140,30 125,30 Z" fill={hairColor} stroke={shadowColor} strokeWidth="0.5" />
        );
      case HairStyle.LONG_STRAIGHT:
        return (
          <g>
            {/* Back hair layer */}
            {!isBackView && <path d="M60,40 L50,160 C70,170 130,170 150,160 L140,40 Z" fill={hairColor} opacity="0.9" />}
            {/* Front part */}
            <path d="M100,25 C70,25 60,50 60,130 L75,130 C75,80 85,50 100,40 C115,50 125,80 125,130 L140,130 C140,50 130,25 100,25 Z" fill={hairColor} />
          </g>
        );
      case HairStyle.LONG_WAVY:
        return (
           <g>
            {!isBackView && <path d="M55,40 Q45,100 60,160 Q100,180 140,160 Q155,100 145,40 Z" fill={hairColor} opacity="0.9"/>}
            <path d="M100,25 C70,25 55,60 60,150 L80,140 C75,100 85,50 100,40 C115,50 125,100 120,140 L140,150 C145,60 130,25 100,25 Z" fill={hairColor} />
          </g>
        );
      case HairStyle.BUN:
        return (
          <g>
            <circle cx="100" cy="20" r="15" fill={hairColor} />
            <path d="M70,40 C70,25 130,25 130,40 C130,60 120,70 100,70 C80,70 70,60 70,40 Z" fill={hairColor} />
          </g>
        );
      case HairStyle.AFRO:
        return (
          <circle cx="100" cy="60" r="45" fill={hairColor} />
        );
      default:
        return null;
    }
  };

  return (
    <svg 
      viewBox="0 0 200 600" 
      className={`drop-shadow-2xl transition-transform duration-700 ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Skin Gradient for 3D effect */}
        <radialGradient id="skinGradient" cx="50%" cy="20%" r="80%" fx="50%" fy="20%">
          <stop offset="0%" stopColor={skinTone} />
          <stop offset="100%" stopColor={shadowColor} />
        </radialGradient>
        {/* Blush */}
        <radialGradient id="blush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff9999" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ff9999" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* --- BACK HAIR (if applicable) --- */}
      {isBackView && (hairStyle === HairStyle.LONG_STRAIGHT || hairStyle === HairStyle.LONG_WAVY) && (
          <path d="M60,40 L50,180 C80,200 120,200 150,180 L140,40 Z" fill={hairColor} />
      )}

      {/* --- BODY --- */}
      <g transform="translate(0, 20)">
        {/* Legs */}
        <path d="M85,300 C80,350 75,450 70,550 L85,550 L95,330 L105,330 L115,550 L130,550 C125,450 120,350 115,300 Z" fill="url(#skinGradient)" stroke={shadowColor} strokeWidth="0.5" />
        
        {/* Torso/Hips */}
        <path d={getBodyPath()} fill="url(#skinGradient)" stroke={shadowColor} strokeWidth="0.5" />
        
        {/* Neck */}
        <path d="M88,100 C88,120 85,140 75,150 L125,150 C115,140 112,120 112,100 Z" fill="url(#skinGradient)" />

        {/* Arms */}
        <path d="M72,150 C60,160 40,200 35,280 C35,290 45,290 45,280 C50,220 65,180 75,170" fill={skinTone} stroke={shadowColor} strokeWidth="0.5" />
        <path d="M128,150 C140,160 160,200 165,280 C165,290 155,290 155,280 C150,220 135,180 125,170" fill={skinTone} stroke={shadowColor} strokeWidth="0.5" />
        
        {/* Base Layer / Underwear (For modesty/style) */}
        {!isBackView && (
            <path d="M75,145 C85,170 115,170 125,145 L125,160 C115,190 85,190 75,160 Z" fill="white" fillOpacity="0.8" />
        )}
        <path d="M85,300 L115,300 L100,335 Z" fill="white" fillOpacity="0.8" />

      </g>

      {/* --- HEAD --- */}
      <g transform="translate(0, 20)">
         <ellipse cx="100" cy="80" rx="28" ry="36" fill="url(#skinGradient)" stroke={shadowColor} strokeWidth="0.5" />
         
         {!isBackView && (
            <>
                {/* Ears */}
                <path d="M72,80 C70,75 65,75 65,85 C65,95 72,90 72,85" fill={skinTone} />
                <path d="M128,80 C130,75 135,75 135,85 C135,95 128,90 128,85" fill={skinTone} />

                {/* Blush */}
                <ellipse cx="85" cy="90" rx="8" ry="5" fill="url(#blush)" />
                <ellipse cx="115" cy="90" rx="8" ry="5" fill="url(#blush)" />

                {/* Eyes */}
                <g transform="translate(0, 2)">
                    {/* Left Eye */}
                    <path d="M82,78 Q90,72 98,78" stroke="#333" strokeWidth="1.5" fill="none" /> {/* Lid */}
                    <circle cx="90" cy="78" r="3" fill={eyeColor} />
                    <circle cx="90" cy="78" r="1" fill="black" />
                    
                    {/* Right Eye */}
                    <path d="M102,78 Q110,72 118,78" stroke="#333" strokeWidth="1.5" fill="none" />
                    <circle cx="110" cy="78" r="3" fill={eyeColor} />
                    <circle cx="110" cy="78" r="1" fill="black" />
                    
                    {/* Brows */}
                    <path d="M80,72 Q90,68 98,72" stroke={hairColor} strokeWidth="1.5" fill="none" opacity="0.8" />
                    <path d="M102,72 Q110,68 120,72" stroke={hairColor} strokeWidth="1.5" fill="none" opacity="0.8" />
                </g>

                {/* Nose */}
                <path d="M100,85 L98,95 L102,95 Z" fill={shadowColor} opacity="0.5" />

                {/* Lips */}
                <path d="M92,102 Q100,105 108,102 Q100,110 92,102" fill="#d48c94" />
            </>
         )}
      </g>

      {/* --- HAIR (Front Layer) --- */}
      <g transform="translate(0, 20)">
        {renderHair()}
      </g>

    </svg>
  );
};

export default Avatar;
