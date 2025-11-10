/**
 * API szolgáltatás a backend kommunikációhoz
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

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
 * Versek lekérése
 */
export const fetchPoems = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/poems`);
    if (!response.ok) {
      throw new Error('Hiba a versek betöltésekor');
    }
    return await response.json();
  } catch (error) {
    console.error('Versek betöltése sikertelen:', error);
    throw error;
  }
};

/**
 * Új vers hozzáadása
 */
export const addPoem = async (poemData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/poems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(poemData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (data.duplicate) {
        throw new Error('Ez a vers (ugyanazzal a címmel és szerzővel) már létezik az adatbázisban!');
      }
      throw new Error(data.error || 'Hiba a vers mentésekor');
    }
    
    return data;
  } catch (error) {
    console.error('Vers hozzáadása sikertelen:', error);
    throw error;
  }
};

/**
 * Vers törlése
 */
export const deletePoem = async (poemId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/poems/${poemId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Hiba a vers törlésekor');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Vers törlése sikertelen:', error);
    throw error;
  }
};

/**
 * Felhasználó haladásának lekérése egy vershez
 */
export const fetchProgress = async (poemId) => {
  try {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/progress/${userId}/${poemId}`);
    
    if (!response.ok) {
      throw new Error('Hiba a haladás betöltésekor');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Haladás betöltése sikertelen:', error);
    throw error;
  }
};

/**
 * Felhasználó összes haladásának lekérése
 */
export const fetchAllProgress = async () => {
  try {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/progress/${userId}`);
    
    if (!response.ok) {
      throw new Error('Hiba a haladások betöltésekor');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Haladások betöltése sikertelen:', error);
    throw error;
  }
};

/**
 * Haladás mentése
 */
export const saveProgress = async (poemId, progressData) => {
  try {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/progress/${userId}/${poemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(progressData),
    });
    
    if (!response.ok) {
      throw new Error('Hiba a haladás mentésekor');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Haladás mentése sikertelen:', error);
    throw error;
  }
};

/**
 * Haladás törlése
 */
export const deleteProgress = async (poemId) => {
  try {
    const userId = getUserId();
    const response = await fetch(`${API_BASE_URL}/progress/${userId}/${poemId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Hiba a haladás törlésekor');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Haladás törlése sikertelen:', error);
    throw error;
  }
};
