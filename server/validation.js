/**
 * Backend validációs utility függvények
 */

/**
 * Vers validációs szabályok
 */
const VALIDATION_RULES = {
  title: {
    minLength: 1,
    maxLength: 200,
    required: true
  },
  author: {
    minLength: 1,
    maxLength: 100,
    required: true
  },
  year: {
    maxLength: 50,
    required: false
  },
  stanzas: {
    minCount: 1,
    maxCount: 50,
    minLength: 1,
    maxLength: 5000,
    required: true
  }
};

/**
 * Validációs hiba osztály
 */
class ValidationError extends Error {
  constructor(field, message) {
    super(message);
    this.field = field;
    this.name = 'ValidationError';
  }
}

/**
 * String validáció
 */
const validateString = (value, field, rules) => {
  if (rules.required && (!value || typeof value !== 'string' || !value.trim())) {
    throw new ValidationError(field, `${field} mező kötelező`);
  }
  
  if (value && typeof value === 'string') {
    const trimmed = value.trim();
    
    if (rules.minLength && trimmed.length < rules.minLength) {
      throw new ValidationError(
        field, 
        `${field} legalább ${rules.minLength} karakter hosszú kell legyen`
      );
    }
    
    if (rules.maxLength && trimmed.length > rules.maxLength) {
      throw new ValidationError(
        field,
        `${field} maximum ${rules.maxLength} karakter hosszú lehet`
      );
    }
  }
  
  return true;
};

/**
 * Versszakok validációja
 */
const validateStanzas = (stanzas) => {
  const rules = VALIDATION_RULES.stanzas;
  
  if (!Array.isArray(stanzas)) {
    throw new ValidationError('stanzas', 'Versszakok egy tömb kell legyen');
  }
  
  if (stanzas.length < rules.minCount) {
    throw new ValidationError('stanzas', `Legalább ${rules.minCount} versszak szükséges`);
  }
  
  if (stanzas.length > rules.maxCount) {
    throw new ValidationError('stanzas', `Maximum ${rules.maxCount} versszak lehet`);
  }
  
  stanzas.forEach((stanza, index) => {
    if (typeof stanza !== 'string' || !stanza.trim()) {
      throw new ValidationError(
        `stanzas[${index}]`,
        `${index + 1}. versszak üres vagy hibás`
      );
    }
    
    const trimmed = stanza.trim();
    if (trimmed.length < rules.minLength) {
      throw new ValidationError(
        `stanzas[${index}]`,
        `${index + 1}. versszak túl rövid`
      );
    }
    
    if (trimmed.length > rules.maxLength) {
      throw new ValidationError(
        `stanzas[${index}]`,
        `${index + 1}. versszak túl hosszú (max ${rules.maxLength} karakter)`
      );
    }
  });
  
  return true;
};

/**
 * Vers objektum validációja
 */
const validatePoem = (poemData) => {
  try {
    validateString(poemData.title, 'title', VALIDATION_RULES.title);
    validateString(poemData.author, 'author', VALIDATION_RULES.author);
    validateString(poemData.year, 'year', VALIDATION_RULES.year);
    validateStanzas(poemData.stanzas);
    return { valid: true };
  } catch (error) {
    if (error instanceof ValidationError) {
      return {
        valid: false,
        field: error.field,
        message: error.message
      };
    }
    throw error;
  }
};

/**
 * Haladás objektum validációja
 */
const validateProgress = (progressData) => {
  if (!progressData || typeof progressData !== 'object') {
    return {
      valid: false,
      message: 'Haladás objektum hibás formátumú'
    };
  }
  
  // Learning progress validáció
  if (progressData.learning) {
    const { learning } = progressData;
    if (typeof learning.currentRound !== 'number' ||
        typeof learning.currentStanzaIndex !== 'number' ||
        typeof learning.repeatCount !== 'number') {
      return {
        valid: false,
        message: 'Tanulási haladás hibás formátumú'
      };
    }
  }
  
  // Test progress validáció
  if (progressData.test) {
    const { test } = progressData;
    if (!Array.isArray(test.results) || !test.stats) {
      return {
        valid: false,
        message: 'Teszt haladás hibás formátumú'
      };
    }
  }
  
  return { valid: true };
};

/**
 * User ID validáció
 */
const validateUserId = (userId) => {
  if (!userId || typeof userId !== 'string') {
    return {
      valid: false,
      message: 'User ID hiányzik vagy hibás'
    };
  }
  
  if (!/^user_\d+_[a-z0-9]+$/.test(userId)) {
    return {
      valid: false,
      message: 'User ID formátuma hibás'
    };
  }
  
  return { valid: true };
};

/**
 * Poem ID validáció
 */
const validatePoemId = (poemId) => {
  if (!poemId || typeof poemId !== 'string') {
    return {
      valid: false,
      message: 'Poem ID hiányzik vagy hibás'
    };
  }
  
  return { valid: true };
};

module.exports = {
  validatePoem,
  validateProgress,
  validateUserId,
  validatePoemId,
  ValidationError
};