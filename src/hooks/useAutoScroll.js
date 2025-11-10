import { useEffect } from 'react';

/**
 * Automatikus görgetés az aktuális karakterhez (mobil optimalizálva)
 * Biztosítja, hogy az aktuális karakter mindig látható legyen a billentyűzet felett
 * 
 * @param {Object} containerRef - A versszak konténer referenciája
 * @param {number} currentCharIndex - Az aktuális karakter indexe
 * @param {Array} userTypedChars - A beírt karakterek tömbje
 */
export const useAutoScroll = (containerRef, currentCharIndex, userTypedChars) => {
  useEffect(() => {
    if (currentCharIndex < 0) return;

    const scrollTimeout = setTimeout(() => {
      // Megkeressük az aktuális karaktert (kék háttérrel jelölt)
      const currentCharElement = containerRef.current?.querySelector('.bg-blue-200');
      
      if (currentCharElement) {
        currentCharElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 100);
    
    return () => clearTimeout(scrollTimeout);
  }, [containerRef, currentCharIndex, userTypedChars]);
};
