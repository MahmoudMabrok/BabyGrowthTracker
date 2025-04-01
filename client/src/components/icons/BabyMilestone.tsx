import React from 'react';

interface BabyMilestoneIconProps {
  type: 'newborn' | 'sitting' | 'crawling' | 'walking' | 'cute';
  className?: string;
}

export function BabyMilestoneIcon({ type, className = "h-24 w-24" }: BabyMilestoneIconProps) {
  switch (type) {
    case 'newborn':
      return (
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <circle cx="50" cy="35" r="20" fill="currentColor" opacity="0.2" />
          <circle cx="50" cy="35" r="15" fill="currentColor" opacity="0.3" />
          <ellipse cx="50" cy="65" rx="25" ry="20" fill="currentColor" opacity="0.2" />
          <path
            d="M40 35 A1 1 0 0 0 44 35"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M56 35 A1 1 0 0 0 60 35"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M45 45 A1 1 0 0 0 55 45"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
      
    case 'sitting':
      return (
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <circle cx="50" cy="30" r="15" fill="currentColor" opacity="0.3" />
          <ellipse cx="50" cy="60" rx="20" ry="15" fill="currentColor" opacity="0.2" />
          <path
            d="M42 30 A1 1 0 0 0 46 30"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M54 30 A1 1 0 0 0 58 30"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M45 38 A1 1 0 0 0 55 38"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M30 75 Q 50 60 70 75"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
      
    case 'crawling':
      return (
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <circle cx="30" cy="35" r="12" fill="currentColor" opacity="0.3" />
          <ellipse cx="55" cy="50" rx="25" ry="15" fill="currentColor" opacity="0.2" />
          <path
            d="M25 35 A1 1 0 0 0 28 35"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M32 35 A1 1 0 0 0 35 35"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M28 40 A1 1 0 0 0 32 40"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M20 65 L 30 50 L 80 50 L 85 65"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M30 50 L 40 65"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M60 50 L 65 65"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
      
    case 'walking':
      return (
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <circle cx="50" cy="25" r="12" fill="currentColor" opacity="0.3" />
          <ellipse cx="50" cy="50" rx="10" ry="20" fill="currentColor" opacity="0.2" />
          <path
            d="M45 25 A1 1 0 0 0 48 25"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M52 25 A1 1 0 0 0 55 25"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M47 30 A1 1 0 0 0 53 30"
            stroke="currentColor"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M35 40 L 50 40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M50 40 L 65 40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M45 70 L 50 40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M55 70 L 50 40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M42 80 L 45 70"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M58 80 L 55 70"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      );
      
    case 'cute':
    default:
      return (
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          <circle cx="50" cy="40" r="25" fill="currentColor" opacity="0.2" />
          <circle cx="38" cy="35" r="5" fill="currentColor" opacity="0.3" />
          <circle cx="62" cy="35" r="5" fill="currentColor" opacity="0.3" />
          <path
            d="M38 40 A1.5 1.5 0 0 0 62 40"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M30 65 A30 30 0 0 0 70 65"
            stroke="currentColor"
            strokeWidth="2"
            fill="currentColor"
            fillOpacity="0.1"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}