import { useEffect } from 'react';
import { ROUNDS } from '../constants/modes';
import { getLetterIndices, getWordIndexForChar } from '../utils/textUtils';

/**
 * Automatikus hint timer hook
 */
export const useAutoHintTimer = (
  learningState,
  currentStanza,
  requirePunctuation,
  isLearningMode
) => {
  const {
    currentRound,
    currentCharIndex,
    currentStanzaIndex,
    hintedWords,
    repeatTryCount,
    setTimeOnChar,
    setCharTimer,
    setCurrentRepeatHints,
    setHintedWords,
    setWordHintTries,
    setProblemWords
  } = learningState;

  useEffect(() => {
    if (!isLearningMode || currentRound !== ROUNDS.SECOND) return;

    const letterIndices = getLetterIndices(currentStanza, requirePunctuation);
    
    if (currentCharIndex < letterIndices.length) {
      const charIndex = letterIndices[currentCharIndex];
      const wordIndex = getWordIndexForChar(currentStanza, charIndex);
      
      // Ha a szó már fel van fedve, ne indítsunk timert
      if (hintedWords.has(wordIndex)) {
        setTimeOnChar(0);
        return;
      }
    }
    
    // Timer indítása
    setTimeOnChar(0);
    const timer = setInterval(() => {
      setTimeOnChar(prev => {
        const newTime = prev + 100;
        
        // 5 másodperc után automatikus hint
        if (newTime >= 5000) {
          const letterIndices = getLetterIndices(currentStanza, requirePunctuation);
          if (currentCharIndex < letterIndices.length) {
            const charIndex = letterIndices[currentCharIndex];
            const wordIndex = getWordIndexForChar(currentStanza, charIndex);
            
            // Csak akkor adjuk hozzá a currentRepeatHints-hez, ha még nincs benne
            setCurrentRepeatHints(prev => {
              if (!prev.has(wordIndex)) {
                const newSet = new Set(prev);
                newSet.add(wordIndex);
                
                // Ha új hint, rögzítjük
                const stanzaKey = `${currentStanzaIndex}`;
                setWordHintTries(prevTries => ({
                  ...prevTries,
                  [stanzaKey]: {
                    ...(prevTries[stanzaKey] || {}),
                    [wordIndex]: repeatTryCount
                  }
                }));
                
                setProblemWords(prevProblems => ({
                  ...prevProblems,
                  [stanzaKey]: {
                    ...(prevProblems[stanzaKey] || {}),
                    [wordIndex]: prevProblems[stanzaKey]?.[wordIndex] || 'auto'
                  }
                }));
                
                return newSet;
              }
              return prev;
            });
            
            // Mindig mutatjuk a hintet
            setHintedWords(prev => {
              const newSet = new Set(prev);
              newSet.add(wordIndex);
              return newSet;
            });
          }
          
          clearInterval(timer);
          return 5000;
        }
        
        return newTime;
      });
    }, 100);
    
    setCharTimer(timer);
    
    return () => {
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLearningMode, currentCharIndex, currentRound, currentStanzaIndex, hintedWords]);
};
