import { STORAGE_KEYS } from '../constants/storage';

/**
 * LocalStorage kezelés segédfüggvények
 */

/**
 * Versek betöltése a localStorage-ből
 * @returns {Array} - A mentett versek tömbje
 */
export const loadPoems = () => {
  try {
    const savedPoems = localStorage.getItem(STORAGE_KEYS.POEMS);
    if (savedPoems) {
      return JSON.parse(savedPoems);
    }
  } catch (e) {
    console.error('Hiba a versek betöltésekor:', e);
  }
  return [];
};

/**
 * Versek mentése a localStorage-be
 * @param {Array} poems - A mentendő versek tömbje
 */
export const savePoems = (poems) => {
  try {
    if (poems.length > 0) {
      localStorage.setItem(STORAGE_KEYS.POEMS, JSON.stringify(poems));
    }
  } catch (e) {
    console.error('Hiba a versek mentésekor:', e);
  }
};
