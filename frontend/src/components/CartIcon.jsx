import React from 'react';

export function CartIcon({ count }) {
  return (
    <div className="relative">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.35 2.7A1 1 0 007 17h10a1 1 0 00.95-.68L21 13M7 13V6a1 1 0 011-1h5a1 1 0 011 1v7" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#a53973] text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[1.5em] text-center">
          {count}
        </span>
      )}
    </div>
  );
}
