/**
 * Szöveg normalizálás segédfüggvények
 */

/**
 * Karakter normalizálása a beállításoknak megfelelően
 * @param {string} char - A normalizálandó karakter
 * @param {boolean} caseSensitive - Kis/nagy betű számít-e
 * @returns {string} - A normalizált karakter
 */
export const normalizeChar = (char, caseSensitive) => {
  if (!caseSensitive) {
    return char.toLowerCase();
  }
  return char;
};

/**
 * Ellenőrzi, hogy a karakter betű-e (magyar és angol ABC)
 * @param {string} char - Az ellenőrizendő karakter
 * @returns {boolean}
 */
export const isLetter = (char) => {
  return /[a-záéíóöőúüűA-ZÁÉÍÓÖŐÚÜŰ]/.test(char);
};

/**
 * Ellenőrzi, hogy a karakter írásjel-e
 * @param {string} char - Az ellenőrizendő karakter
 * @returns {boolean}
 */
export const isPunctuation = (char) => {
  return /[.,!?;:'"()-]/.test(char);
};

/**
 * Visszaadja a szöveg azon karaktereinek indexeit, amelyeket be kell gépelni
 * @param {string} text - A szöveg
 * @param {boolean} requirePunctuation - Az írásjelek is számítanak-e
 * @returns {number[]} - A karakterek indexei
 */
export const getLetterIndices = (text, requirePunctuation) => {
  const indices = [];
  for (let i = 0; i < text.length; i++) {
    if (isLetter(text[i]) || (requirePunctuation && isPunctuation(text[i]))) {
      indices.push(i);
    }
  }
  return indices;
};

/**
 * Meghatározza, hogy egy karakter index melyik szóhoz tartozik
 * @param {string} text - A teljes szöveg
 * @param {number} charIndex - A karakter indexe
 * @returns {number} - A szó indexe
 */
export const getWordIndexForChar = (text, charIndex) => {
  let wordIndex = 0;
  for (let i = 0; i < charIndex; i++) {
    if (!isLetter(text[i]) && isLetter(text[i + 1])) {
      wordIndex++;
    }
  }
  return wordIndex;
};

/**
 * Teljes szöveg normalizálása teszteléshez
 * @param {string} text - A normalizálandó szöveg
 * @param {boolean} caseSensitive - Kis/nagy betű számít-e
 * @param {boolean} requirePunctuation - Az írásjelek is számítanak-e
 * @returns {string} - A normalizált szöveg
 */
export const normalizeText = (text, caseSensitive, requirePunctuation) => {
  let normalized = text;
  if (!requirePunctuation) {
    normalized = normalized.replace(/[.,!?;:'"()-]/g, '');
  }
  normalized = normalized.replace(/\s+/g, '');
  if (!caseSensitive) {
    normalized = normalized.toLowerCase();
  }
  return normalized;
};
