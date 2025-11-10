import React, { useRef } from 'react';
import { ROUNDS } from '../constants/modes';
import { calculateProgress } from '../utils/progressUtils';
import { getLetterIndices, getWordIndexForChar } from '../utils/textUtils';
import { useLearningLogic } from '../hooks/useLearningLogic';
import { useLearningKeyboard } from '../hooks/useLearningKeyboard';
import { useAutoHintTimer } from '../hooks/useAutoHintTimer';
import { useMobileFocus } from '../hooks/useMobileFocus';
import { useAutoScroll } from '../hooks/useAutoScroll';
import StanzaRenderer from './StanzaRenderer';

/**
 * Tanulás komponens - fő tanulási felület
 */
const Learning = ({
  poem,
  learningState,
  caseSensitive,
  requirePunctuation,
  onComplete,
  onExit
}) => {
  const {
    currentRound,
    currentStanzaIndex,
    repeatCount,
    repeatTryCount,
    currentCharIndex,
    userTypedChars,
    hintedWords,
    hoveredWord,
    timeOnChar,
    containerRef
  } = learningState;

  const inputRef = useRef(null);
  const stanzaContainerRef = useRef(null);

  const logic = useLearningLogic(
    learningState,
    poem,
    caseSensitive,
    requirePunctuation,
    onComplete
  );

  const currentStanza = logic.getCurrentStanza();
  const letterIndices = getLetterIndices(currentStanza, requirePunctuation);

  const keyboard = useLearningKeyboard(
    learningState,
    letterIndices,
    currentStanza,
    caseSensitive,
    logic.moveToNext
  );

  // Mobil fókusz kezelés (billentyűzet mindig látható)
  const { handleBlur } = useMobileFocus(inputRef, [currentStanzaIndex, repeatCount, currentRound]);

  // Automatikus görgetés az aktuális karakterhez (mobil)
  useAutoScroll(stanzaContainerRef, currentCharIndex, userTypedChars);

  // Auto hint timer
  useAutoHintTimer(learningState, currentStanza, requirePunctuation, true);

  /**
   * Billentyűzet esemény kezelő - fókusz megtartással
   */
  const handleKeyDownWithFocus = (e) => {
    keyboard.handleKeyDown(e);
    // Fókusz visszaadása mobilon
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  /**
   * Konténer klikk kezelő - fókusz aktiválás
   */
  const handleContainerClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const progress = calculateProgress(poem, currentRound, currentStanzaIndex, repeatCount);

  /**
   * Automatikus hint progress bar láthatóságának meghatározása
   */
  const showAutoHintProgress = currentRound === ROUNDS.SECOND && (() => {
    if (currentCharIndex < letterIndices.length) {
      const charIndex = letterIndices[currentCharIndex];
      const wordIndex = getWordIndexForChar(currentStanza, charIndex);
      return !hintedWords.has(wordIndex);
    }
    return false;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8" onClick={handleContainerClick}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Fejléc és haladás */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-2xl font-bold text-gray-800">
                {currentRound === ROUNDS.FIRST ? 'Első kör' : 'Második kör'}
              </h2>
              <div className="text-right">
                <span className="text-sm text-gray-600">
                  {currentStanzaIndex + 1}. versszak / {repeatCount + 1}. ismétlés
                </span>
                {currentRound === ROUNDS.SECOND && repeatTryCount > 0 && (
                  <span className="text-xs text-indigo-600 block">
                    {repeatTryCount + 1}. próbálkozás
                  </span>
                )}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{Math.round(progress)}% kész</p>
          </div>

          {/* Versszak megjelenítés */}
          <div 
            ref={stanzaContainerRef}
            className="relative"
          >
            {/* Rejtett input mező mobilon a billentyűzet előhozásához */}
            <input
              ref={inputRef}
              type="text"
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              onKeyDown={handleKeyDownWithFocus}
              onBlur={handleBlur}
              className="absolute w-1 h-1 opacity-0"
              style={{ 
                position: 'absolute', 
                top: '-9999px', 
                left: '-9999px',
                pointerEvents: 'none',
                fontSize: '16px', // iOS zoom megakadályozása
                caretColor: 'transparent' // Kurzor elrejtése
              }}
              aria-hidden="true"
              autoFocus
            />
            <div 
              ref={containerRef}
              tabIndex={0}
              onKeyDown={handleKeyDownWithFocus}
              className="bg-blue-50 p-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              autoFocus
            >
              <StanzaRenderer
                stanza={currentStanza}
                currentRound={currentRound}
                currentCharIndex={currentCharIndex}
                userTypedChars={userTypedChars}
                hintedWords={hintedWords}
                hoveredWord={hoveredWord}
                requirePunctuation={requirePunctuation}
                onWordHint={logic.handleWordHint}
                onWordHover={logic.handleWordHover}
              />
            </div>
          </div>

          {/* Automatikus hint progress bar */}
          {showAutoHintProgress && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${(timeOnChar / 5000) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">
                {timeOnChar >= 5000 
                  ? 'Automatikus hint megjelent!' 
                  : `${Math.max(0, 5 - Math.floor(timeOnChar / 1000))}s múlva automatikus hint...`}
              </p>
            </div>
          )}

          {/* Segítség szöveg */}
          <p className="text-sm text-gray-600 mt-4 text-center">
            Gépeld be a betűket. Backspace-szel törölhetsz.
            {currentRound === ROUNDS.SECOND && " Hint használata után: látod → próbáld hint nélkül → látod → próbáld... amíg nem sikerül hint nélkül!"}
            {!caseSensitive && " (kis/nagy betű nem számít)"}
          </p>

          {/* Kilépés gomb */}
          <div className="mt-6 text-center">
            <button
              onClick={onExit}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Kilépés és mentés
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learning;
