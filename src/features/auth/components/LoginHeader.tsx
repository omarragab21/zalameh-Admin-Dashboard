import React from 'react';

export const LoginHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      {/* Brand Icon Badge - Strictly Square (Equal Width & Height) with User's Exact SVG */}
      <div className="w-16 h-16 aspect-square bg-[#d83f2a] rounded-2xl flex items-center justify-center shadow-lg shadow-[#d83f2a]/30 mb-5 mx-auto shrink-0">
        <svg
          className="w-9 h-9"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
          <path
            d="M2 17L12 22L22 17"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 12L12 17L22 12"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Main Title & Subtitle */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
        منصة زلمة
      </h1>
      <p className="text-sm font-semibold text-slate-500 font-sans tracking-wide">
        Zalameh Dashboard
      </p>
    </div>
  );
};
