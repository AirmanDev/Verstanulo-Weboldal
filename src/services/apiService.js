/**
 * Továbbfejlesztett API szolgáltatás retry logic-kal és timeout kezeléssel
 */

import { AppError, ErrorTypes, handleApiError } from '../utils/errorHandler';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
const DEFAULT_TIMEOUT = 10000; // 10 másodperc
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 másodperc

/**
 * Felhasználó ID kezelése
 */
export const getUserId = () => {
  let userId = localStorage.getItem('verstanulo_userId');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('verstanulo_userId', userId);
  }
  return userId;
};

/**
 * Delay függvény
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Fetch timeout wrapper
 */
const fetchWithTimeout = async (url, options = {}, timeout = DEFAULT_TIMEOUT) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new AppError(ErrorTypes.NETWORK, 'A kérés túllépte az időkorlátot');
    }
    throw error;
  }
};

/**
 * Fetch retry wrapper
 */
const fetchWithRetry = async (url, options = {}, retries = MAX_RETRIES) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchWithTimeout(url, options);
    } catch (error) {
      const isLastAttempt = i === retries - 1;
      const isNetworkError = !navigator.onLine || error.type === ErrorTypes.NETWORK;
      
      if (isLastAttempt || !isNetworkError) {
        throw error;
      }
      
      console.log(`Retry attempt ${i + 1}/${retries} after ${RETRY_DELAY}ms...`);
      await delay(RETRY_DELAY * (i + 1)); // Exponential backoff
    }
  }
};

/**
 * API hívás wrapper
 */
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (data.duplicate) {
        throw new AppError(
          ErrorTypes.DUPLICATE,
          'Ez a vers (ugyanazzal a címmel és szerzővel) már létezik az adatbázisban!'
        );
      }
      throw new AppError(ErrorTypes.SERVER, data.error || 'Szerverhiba történt');
    }
    
    return data;
  } catch (error) {
    throw handleApiError(error, endpoint);
  }
};

/**
 * Versek lekérése
 */
export const fetchPoems = async () => {
  return apiCall('/poems');
};

/**
 * Új vers hozzáadása
 */
export const addPoem = async (poemData) => {
  return apiCall('/poems', {
    method: 'POST',
    body: JSON.stringify(poemData)
  });
};

/**
 * Vers törlése
 */
export const deletePoem = async (poemId) => {
  return apiCall(`/poems/${poemId}`, {
    method: 'DELETE'
  });
};

/**
 * Felhasználó haladásának lekérése egy vershez
 */
export const fetchProgress = async (poemId) => {
  const userId = getUserId();
  return apiCall(`/progress/${userId}/${poemId}`);
};

/**
 * Felhasználó összes haladásának lekérése
 */
export const fetchAllProgress = async () => {
  const userId = getUserId();
  return apiCall(`/progress/${userId}`);
};

/**
 * Haladás mentése
 */
export const saveProgress = async (poemId, progressData) => {
  const userId = getUserId();
  return apiCall(`/progress/${userId}/${poemId}`, {
    method: 'PUT',
    body: JSON.stringify(progressData)
  });
};

/**
 * Haladás törlése
 */
export const deleteProgress = async (poemId) => {
  const userId = getUserId();
  return apiCall(`/progress/${userId}/${poemId}`, {
    method: 'DELETE'
  });
};

/**
 * Health check endpoint
 */
export const checkHealth = async () => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/health`, {}, 5000);
    return response.ok;
  } catch (error) {
    return false;
  }
};