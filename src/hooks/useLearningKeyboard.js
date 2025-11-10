import { normalizeChar } from '../utils/textUtils';

/**
 * Billentyűzet kezelés a tanulási módhoz
 */
export const useLearningKeyboard = (
  learningState,
  letterIndices,
  stanza,
  caseSensitive,
  moveToNext
) => {
  const {
    currentCharIndex,
    userTypedChars,
    setCurrentCharIndex,
    setUserTypedChars,
    setTimeOnChar,
    charTimer,
    recordAttempt
  } = learningState;

  /**
   * Billentyű lenyomás kezelése
   */
  const handleKeyDown = (e) => {
    const key = e.key;
    
    // Backspace kezelése
    if (key === 'Backspace') {
      e.preventDefault();
      
      if (userTypedChars[currentCharIndex]) {
        const newTypedChars = [...userTypedChars];
        newTypedChars[currentCharIndex] = undefined;
        setUserTypedChars(newTypedChars);
      } else if (currentCharIndex > 0) {
        const newTypedChars = [...userTypedChars];
        newTypedChars[currentCharIndex - 1] = undefined;
        setUserTypedChars(newTypedChars);
        setCurrentCharIndex(currentCharIndex - 1);
      }
      return;
    }
    
    // Space és Enter blokkolása
    if (key === ' ' || key === 'Enter') {
      e.preventDefault();
      return;
    }
    
    if (currentCharIndex >= letterIndices.length) return;
    
    // Karakter gépelés
    if (key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      
      const actualIndex = letterIndices[currentCharIndex];
      const targetChar = stanza[actualIndex];
      const isCorrect = normalizeChar(key, caseSensitive) === normalizeChar(targetChar, caseSensitive);
      
      const newTypedChars = [...userTypedChars];
      newTypedChars[currentCharIndex] = {
        char: isCorrect ? targetChar : key,
        correct: isCorrect
      };
      setUserTypedChars(newTypedChars);
      
      if (isCorrect) {
        const nextIndex = currentCharIndex + 1;
        
        // Timer reset
        setTimeOnChar(0);
        if (charTimer) clearInterval(charTimer);
        
        if (nextIndex >= letterIndices.length) {
          setTimeout(() => {
            recordAttempt(true);
            moveToNext();
          }, 100);
        } else {
          setCurrentCharIndex(nextIndex);
        }
      }
    }
  };

  return { handleKeyDown };
};
