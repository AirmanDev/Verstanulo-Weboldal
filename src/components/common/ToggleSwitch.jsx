import React from 'react';

/**
 * Újrafelhasználható Toggle Switch komponens
 * @param {boolean} checked - Be van-e kapcsolva
 * @param {function} onChange - Változás eseménykezelő
 * @param {string} color - Szín (indigo, green)
 */
const ToggleSwitch = ({ checked, onChange, color = 'indigo' }) => {
  // Tailwind osztályok statikusan definiálva
  const bgColorClass = color === 'green' 
    ? 'peer-checked:bg-green-600' 
    : 'peer-checked:bg-indigo-600';

  return (
    <label className="relative inline-block w-14 h-8 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className={`w-14 h-8 bg-gray-300 rounded-full transition-colors ${bgColorClass}`} />
      <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
    </label>
  );
};

export default ToggleSwitch;