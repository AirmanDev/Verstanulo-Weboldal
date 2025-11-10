import { useState, useRef } from 'react';
import { ROUNDS } from '../constants/modes';

/**
 * Tanulási folyamat állapotkezelése
 * @returns {Object} - A tanulási állapot és kezelő függvények
 */
export const useLearningState = () => {
  // Alap tanulási állapot
  const [currentRound, setCurrentRound] = useState(ROUNDS.FIRST);
  const [currentStanzaIndex, setCurrentStanzaIndex] = useState(0);
  const [repeatCount, setRepeatCount] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [userTypedChars, setUserTypedChars] = useState([]);
  const [attempts, setAttempts] = useState([]);
  
  // Hint kezelés
  const [hintedWords, setHintedWords] = useState(new Set());
  const [hoveredWord, setHoveredWord] = useState(null);
  const [problemWords, setProblemWords] = useState({});
  const [currentRepeatHints, setCurrentRepeatHints] = useState(new Set());
  const [repeatTryCount, setRepeatTryCount] = useState(0);
  const [wordHintTries, setWordHintTries] = useState({});
  
  // Timer az automatikus hinthez
  const [charTimer, setCharTimer] = useState(null);
  const [timeOnChar, setTimeOnChar] = useState(0);
  
  const containerRef = useRef(null);

  /**
   * Állapot alaphelyzetbe állítása
   */
  const resetProgress = () => {
    setCurrentRound(ROUNDS.FIRST);
    setCurrentStanzaIndex(0);
    setRepeatCount(0);
    setAttempts([]);
    setCurrentCharIndex(0);
    setUserTypedChars([]);
    setHintedWords(new Set());
    setHoveredWord(null);
    setProblemWords({});
    setTimeOnChar(0);
    setCurrentRepeatHints(new Set());
    setRepeatTryCount(0);
    setWordHintTries({});
    if (charTimer) clearInterval(charTimer);
  };

  /**
   * Mentett haladás betöltése
   * @param {Object} progress - A betöltendő haladás adatai
   */
  const loadProgress = (progress) => {
    if (progress) {
      setCurrentRound(progress.currentRound || ROUNDS.FIRST);
      setCurrentStanzaIndex(progress.currentStanzaIndex || 0);
      setRepeatCount(progress.repeatCount || 0);
      setAttempts(progress.attempts || []);
      setProblemWords(progress.problemWords || {});
      setWordHintTries(progress.wordHintTries || {});
      setCurrentCharIndex(0);
      setUserTypedChars([]);
      setHintedWords(new Set());
      setHoveredWord(null);
      setTimeOnChar(0);
      setCurrentRepeatHints(new Set());
      setRepeatTryCount(0);
    } else {
      resetProgress();
    }
  };

  /**
   * Próbálkozás rögzítése
   * @param {boolean} correct - Sikeres volt-e
   */
  const recordAttempt = (correct) => {
    setAttempts(prev => [...prev, {
      stanzaIndex: currentStanzaIndex,
      round: currentRound,
      correct,
      repeat: repeatCount
    }]);
  };

  /**
   * Exportálható állapot jelenlegi haladáshoz
   * @returns {Object} - A mentendő haladás
   */
  const getProgressData = () => ({
    currentRound,
    currentStanzaIndex,
    repeatCount,
    attempts,
    problemWords,
    wordHintTries
  });

  return {
    // Állapotok
    currentRound,
    currentStanzaIndex,
    repeatCount,
    currentCharIndex,
    userTypedChars,
    attempts,
    hintedWords,
    hoveredWord,
    problemWords,
    currentRepeatHints,
    repeatTryCount,
    wordHintTries,
    charTimer,
    timeOnChar,
    containerRef,
    
    // Setter-ek
    setCurrentRound,
    setCurrentStanzaIndex,
    setRepeatCount,
    setCurrentCharIndex,
    setUserTypedChars,
    setAttempts,
    setHintedWords,
    setHoveredWord,
    setProblemWords,
    setCurrentRepeatHints,
    setRepeatTryCount,
    setWordHintTries,
    setCharTimer,
    setTimeOnChar,
    
    // Segédfüggvények
    resetProgress,
    loadProgress,
    recordAttempt,
    getProgressData
  };
};
