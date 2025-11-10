/**
 * Központi error handling utility
 */

/**
 * Error típusok
 */
export const ErrorTypes = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  DUPLICATE: 'DUPLICATE_ERROR',
  SERVER: 'SERVER_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

/**
 * Felhasználóbarát hibaüzenetek
 */
const ERROR_MESSAGES = {
  [ErrorTypes.NETWORK]: 'Hálózati hiba történt. Ellenőrizd az internetkapcsolatot.',
  [ErrorTypes.VALIDATION]: 'Hibás adatok. Kérlek ellenőrizd a megadott értékeket.',
  [ErrorTypes.NOT_FOUND]: 'A keresett elem nem található.',
  [ErrorTypes.DUPLICATE]: 'Ez az elem már létezik.',
  [ErrorTypes.SERVER]: 'Szerverhiba történt. Próbáld újra később.',
  [ErrorTypes.UNKNOWN]: 'Váratlan hiba történt.'
};

/**
 * Egyedi Error osztály
 */
export class AppError extends Error {
  constructor(type, message, originalError = null) {
    super(message || ERROR_MESSAGES[type] || ERROR_MESSAGES[ErrorTypes.UNKNOWN]);
    this.type = type;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * API hiba kezelése
 * @param {Error} error - Az eredeti hiba
 * @param {string} context - Kontextus leírás
 * @returns {AppError} - Formázott alkalmazás hiba
 */
export const handleApiError = (error, context = '') => {
  console.error(`[API Error${context ? ` - ${context}` : ''}]:`, error);
  
  if (error instanceof AppError) {
    return error;
  }
  
  if (!navigator.onLine) {
    return new AppError(ErrorTypes.NETWORK, null, error);
  }
  
  if (error.message?.includes('duplicate') || error.message?.includes('létezik')) {
    return new AppError(ErrorTypes.DUPLICATE, error.message, error);
  }
  
  if (error.message?.includes('nem található') || error.message?.includes('404')) {
    return new AppError(ErrorTypes.NOT_FOUND, null, error);
  }
  
  return new AppError(ErrorTypes.SERVER, error.message, error);
};

/**
 * User-friendly hibaüzenet megjelenítése
 * @param {Error|AppError} error - A hiba objektum
 * @param {function} displayFn - Megjelenítő függvény (pl. alert, toast, stb.)
 */
export const displayError = (error, displayFn = alert) => {
  const message = error instanceof AppError 
    ? error.message 
    : ERROR_MESSAGES[ErrorTypes.UNKNOWN];
  
  displayFn(message);
};

/**
 * Hiba logolása fejlesztői környezetben
 * @param {Error} error - A hiba objektum
 * @param {Object} context - Kontextus információk
 */
export const logError = (error, context = {}) => {
  if (process.env.NODE_ENV === 'development') {
    console.group('🔴 Error Log');
    console.error('Error:', error);
    console.log('Context:', context);
    console.log('Timestamp:', new Date().toISOString());
    if (error instanceof AppError) {
      console.log('Type:', error.type);
      console.log('Original Error:', error.originalError);
    }
    console.groupEnd();
  }
};