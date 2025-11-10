import { useState } from 'react';

/**
 * Alkalmazás beállítások kezelése
 * @returns {Object} - Beállítások és setter függvények
 */
export const useSettings = () => {
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [requirePunctuation, setRequirePunctuation] = useState(false);

  return {
    caseSensitive,
    setCaseSensitive,
    requirePunctuation,
    setRequirePunctuation
  };
};
