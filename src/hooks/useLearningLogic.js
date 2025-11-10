import { ROUNDS } from '../constants/modes';

/**
 * Tanulási logika hook
 */
export const useLearningLogic = (
  learningState,
  poem,
  caseSensitive,
  requirePunctuation,
  onComplete
) => {
  const {
    currentRound,
    currentStanzaIndex,
    repeatCount,
    hintedWords,
    currentRepeatHints,
    repeatTryCount,
    wordHintTries,
    problemWords,
    setCurrentRound,
    setCurrentStanzaIndex,
    setRepeatCount,
    setCurrentCharIndex,
    setUserTypedChars,
    setHintedWords,
    setHoveredWord,
    setProblemWords,
    setCurrentRepeatHints,
    setRepeatTryCount,
    setWordHintTries,
    setTimeOnChar
  } = learningState;

  /**
   * Aktuális versszak szövegének lekérése
   */
  const getCurrentStanza = () => {
    return poem?.stanzas[currentStanzaIndex] || '';
  };

  /**
   * Szó hint kezelése (kattintás)
   */
  const handleWordHint = (wordIndex) => {
    if (currentRound === ROUNDS.SECOND) {
      // Csak akkor számít hintnek, ha még nem használtuk ebben a try-ban
      if (!currentRepeatHints.has(wordIndex)) {
        const newHinted = new Set(hintedWords);
        newHinted.add(wordIndex);
        setHintedWords(newHinted);
        
        setCurrentRepeatHints(prev => {
          const newSet = new Set(prev);
          newSet.add(wordIndex);
          return newSet;
        });
        
        const stanzaKey = `${currentStanzaIndex}`;
        setWordHintTries(prev => ({
          ...prev,
          [stanzaKey]: {
            ...(prev[stanzaKey] || {}),
            [wordIndex]: repeatTryCount
          }
        }));
        
        setProblemWords(prev => ({
          ...prev,
          [stanzaKey]: {
            ...(prev[stanzaKey] || {}),
            [wordIndex]: 'click'
          }
        }));
      } else {
        // Ha már használtuk ebben a try-ban, csak megjelenitjük
        const newHinted = new Set(hintedWords);
        newHinted.add(wordIndex);
        setHintedWords(newHinted);
      }
    }
  };

  /**
   * Szó hover kezelése (egér ráhúzás)
   */
  const handleWordHover = (wordIndex, isEntering) => {
    if (currentRound === ROUNDS.SECOND) {
      setHoveredWord(isEntering ? wordIndex : null);
      
      // Csak akkor számít hintnek, ha még nem volt használva ebben a try-ban
      if (isEntering && !hintedWords.has(wordIndex) && !currentRepeatHints.has(wordIndex)) {
        setCurrentRepeatHints(prev => {
          const newSet = new Set(prev);
          newSet.add(wordIndex);
          return newSet;
        });
        
        const stanzaKey = `${currentStanzaIndex}`;
        setWordHintTries(prev => ({
          ...prev,
          [stanzaKey]: {
            ...(prev[stanzaKey] || {}),
            [wordIndex]: repeatTryCount
          }
        }));
        
        setProblemWords(prev => ({
          ...prev,
          [stanzaKey]: {
            ...(prev[stanzaKey] || {}),
            [wordIndex]: prev[stanzaKey]?.[wordIndex] || 'hover'
          }
        }));
      }
    }
  };

  /**
   * Következő lépésre váltás
   */
  const moveToNext = () => {
    const hadNewHints = currentRepeatHints.size > 0;
    
    if (hadNewHints && currentRound === ROUNDS.SECOND) {
      // Voltak új hintek -> újabb try
      const newTryCount = repeatTryCount + 1;
      setRepeatTryCount(newTryCount);
      
      const stanzaKey = `${currentStanzaIndex}`;
      const wordHintTriesForStanza = wordHintTries[stanzaKey] || {};
      
      // CSAK azokat a szavakat mutatjuk, amelyek az ELŐZŐ try-ban (newTryCount - 1) voltak használva
      let newHinted = new Set();
      Object.keys(wordHintTriesForStanza).forEach(wordIdxStr => {
        const wordIdx = parseInt(wordIdxStr);
        const hintTry = wordHintTriesForStanza[wordIdxStr];
        
        // Csak az előző try hintjeit mutatjuk
        if (hintTry === newTryCount - 1) {
          newHinted.add(wordIdx);
        }
      });
      
      setCurrentCharIndex(0);
      setUserTypedChars([]);
      setCurrentRepeatHints(new Set());
      setHintedWords(newHinted);
      setHoveredWord(null);
      setTimeOnChar(0);
      return;
    }
    
    // Nem voltak új hintek -> továbblépés
    setCurrentCharIndex(0);
    setUserTypedChars([]);
    setCurrentRepeatHints(new Set());
    setRepeatTryCount(0);
    setHoveredWord(null);
    setTimeOnChar(0);
    
    if (repeatCount < 2) {
      const stanzaKey = `${currentStanzaIndex}`;
      const problemWordsForStanza = problemWords[stanzaKey];
      
      const newHinted = new Set();
      if (problemWordsForStanza) {
        Object.keys(problemWordsForStanza).forEach(wordIdx => {
          newHinted.add(parseInt(wordIdx));
        });
      }
      setHintedWords(newHinted);
      setRepeatCount(repeatCount + 1);
    } else {
      setHintedWords(new Set());
      setWordHintTries({});
      
      if (currentStanzaIndex < poem.stanzas.length - 1) {
        setCurrentStanzaIndex(currentStanzaIndex + 1);
        setRepeatCount(0);
      } else {
        if (currentRound === ROUNDS.FIRST) {
          setCurrentRound(ROUNDS.SECOND);
          setCurrentStanzaIndex(0);
          setRepeatCount(0);
        } else {
          onComplete();
        }
      }
    }
  };

  return {
    getCurrentStanza,
    handleWordHint,
    handleWordHover,
    moveToNext
  };
};
