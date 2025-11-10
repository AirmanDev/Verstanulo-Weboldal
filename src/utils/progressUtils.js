/**
 * Tanulási haladás számítási segédfüggvények
 */

/**
 * Tanulási haladás százalékos kiszámítása
 * @param {Object} poem - A vers objektum
 * @param {number} currentRound - Az aktuális kör (1 vagy 2)
 * @param {number} currentStanzaIndex - Az aktuális versszak indexe
 * @param {number} repeatCount - Az aktuális ismétlés száma
 * @returns {number} - A haladás százalékban (0-100)
 */
export const calculateProgress = (poem, currentRound, currentStanzaIndex, repeatCount) => {
  if (!poem) return 0;
  
  const totalRepeats = poem.stanzas.length * 3 * 2; // versszakok * ismétlések * körök
  const currentProgress = (currentRound - 1) * poem.stanzas.length * 3 + 
                         currentStanzaIndex * 3 + 
                         repeatCount;
  return (currentProgress / totalRepeats) * 100;
};

/**
 * Tanulási statisztikák kiszámítása
 * @param {Array} attempts - A próbálkozások tömbje
 * @returns {Object} - Statisztikai adatok
 */
export const calculateLearningStats = (attempts) => {
  const totalAttempts = attempts.length;
  const correctAttempts = attempts.filter(a => a.correct).length;
  const percentage = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
  
  return {
    totalAttempts,
    correctAttempts,
    percentage: Math.round(percentage)
  };
};

/**
 * Teszt eredmények kiszámítása
 * @param {Array} testResults - A teszt eredmények tömbje
 * @returns {Object} - Teszt statisztikák
 */
export const calculateTestStats = (testResults) => {
  const correctAnswers = testResults.filter(r => r.correct).length;
  const percentage = testResults.length > 0 
    ? Math.round((correctAnswers / testResults.length) * 100) 
    : 0;
  
  return {
    totalAnswers: testResults.length,
    correctAnswers,
    percentage
  };
};
