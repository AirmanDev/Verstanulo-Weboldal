import React from 'react';
import { ROUNDS } from '../constants/modes';
import { getLetterIndices, getWordIndexForChar, isLetter } from '../utils/textUtils';

/**
 * Versszak megjelenítő komponens a tanulási módhoz
 */
const StanzaRenderer = ({
  stanza,
  currentRound,
  currentCharIndex,
  userTypedChars,
  hintedWords,
  hoveredWord,
  requirePunctuation,
  onWordHint,
  onWordHover
}) => {
  const letterIndices = getLetterIndices(stanza, requirePunctuation);
  
  return (
    <div className="relative font-mono text-2xl leading-relaxed whitespace-pre-wrap">
      {stanza.split('').map((char, index) => {
        const letterIndex = letterIndices.indexOf(index);
        const isTargetLetter = letterIndex !== -1;
        
        if (!isTargetLetter) {
          return <span key={index} className="text-gray-800">{char}</span>;
        }
        
        const typed = userTypedChars[letterIndex];
        const isCurrent = letterIndex === currentCharIndex;
        const wordIndex = getWordIndexForChar(stanza, index);
        const isWordHinted = hintedWords.has(wordIndex);
        const isWordHovered = hoveredWord === wordIndex;
        const showHint = isWordHinted || isWordHovered;
        
        // Első kör - egyszerű megjelenítés
        if (currentRound === ROUNDS.FIRST) {
          if (typed) {
            return (
              <span key={index} className={typed.correct ? 'text-gray-800' : 'text-red-600'}>
                {typed.char}
              </span>
            );
          } else {
            return (
              <span 
                key={index} 
                className={`${isCurrent ? 'bg-blue-200' : ''} text-gray-400`}
              >
                {char}
              </span>
            );
          }
        } 
        
        // Második kör - hint rendszerrel
        else {
          const isFirstOfWord = index === 0 || !isLetter(stanza[index - 1]);
          
          if (typed) {
            return (
              <span key={index} className={typed.correct ? 'text-green-600' : 'text-red-600'}>
                {typed.char}
              </span>
            );
          } else if (isFirstOfWord) {
            // Szó első betűje - mindig látszik
            return (
              <span 
                key={index} 
                className={`${isCurrent ? 'bg-blue-200' : ''} text-gray-700 cursor-pointer hover:bg-yellow-100`}
                onClick={() => onWordHint(wordIndex)}
                onMouseEnter={() => onWordHover(wordIndex, true)}
                onMouseLeave={() => onWordHover(wordIndex, false)}
              >
                {char}
              </span>
            );
          } else {
            // Szó többi betűje
            if (showHint) {
              // Hint mutatás - halványan látszik
              return (
                <span 
                  key={index} 
                  className={`${isCurrent ? 'bg-blue-200' : ''} text-gray-500 opacity-40 cursor-pointer hover:bg-yellow-100`}
                  onClick={() => onWordHint(wordIndex)}
                  onMouseEnter={() => onWordHover(wordIndex, true)}
                  onMouseLeave={() => onWordHover(wordIndex, false)}
                >
                  {char}
                </span>
              );
            } else {
              // Nincs hint - aláhúzás
              return (
                <span 
                  key={index} 
                  className={`${isCurrent ? 'bg-blue-200' : ''} text-gray-300 cursor-pointer hover:bg-yellow-100`}
                  onClick={() => onWordHint(wordIndex)}
                  onMouseEnter={() => onWordHover(wordIndex, true)}
                  onMouseLeave={() => onWordHover(wordIndex, false)}
                >
                  _
                </span>
              );
            }
          }
        }
      })}
    </div>
  );
};

export default StanzaRenderer;
