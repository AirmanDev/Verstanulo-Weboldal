import { useEffect } from 'react';

/**
 * Mobil billentyűzet fókusz kezelése
 * Biztosítja, hogy az input mező folyamatosan fókuszban maradjon mobilon
 * 
 * @param {Object} inputRef - Az input mező referenciája
 * @param {Array} dependencies - Amikor ezek változnak, újra fókuszál
 */
export const useMobileFocus = (inputRef, dependencies = []) => {
  // Kezdeti és változáskor történő fókusz
  useEffect(() => {
    const focusInput = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    // Többszörös fókusz különböző időzítésekkel (mobilon biztos működés)
    focusInput(); // Azonnal
    const timeout1 = setTimeout(focusInput, 50); // Rövid delay
    const timeout2 = setTimeout(focusInput, 200); // Hosszabb delay
    
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
    };
  }, dependencies);

  // Folyamatos fókusz ellenőrzés (500ms-enként)
  useEffect(() => {
    const focusInterval = setInterval(() => {
      if (inputRef.current && document.activeElement !== inputRef.current) {
        inputRef.current.focus();
      }
    }, 500);
    
    return () => clearInterval(focusInterval);
  }, [inputRef]);

  // Ablak fókusz visszatéréskor
  useEffect(() => {
    const handleWindowFocus = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };
    
    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [inputRef]);

  // onBlur handler visszaadása
  const handleBlur = (e) => {
    e.preventDefault();
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  return { handleBlur };
};
