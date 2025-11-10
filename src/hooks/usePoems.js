import { useState, useEffect } from 'react';
import * as apiService from '../services/apiService';
import { handleApiError, displayError } from '../utils/errorHandler';

/**
 * Versek kezelése hook - API-val
 * @returns {Object} - Versek és azok kezelő függvényei
 */
export const usePoems = () => {
  const [poems, setPoems] = useState([]);
  const [selectedPoemId, setSelectedPoemId] = useState(null);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Versek és haladás betöltése kezdéskor
  useEffect(() => {
    loadPoemsAndProgress();
  }, []);

  /**
   * Versek és haladás betöltése API-ból
   */
  const loadPoemsAndProgress = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [poemsData, progressData] = await Promise.all([
        apiService.fetchPoems(),
        apiService.fetchAllProgress()
      ]);
      
      setPoems(poemsData);
      setProgressData(progressData);
    } catch (err) {
      const appError = handleApiError(err, 'loadPoemsAndProgress');
      setError(appError.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Új vers hozzáadása
   * @param {Object} poemData - A vers adatai (title, author, year, stanzas)
   */
  const addPoem = async (poemData) => {
    try {
      const newPoem = await apiService.addPoem(poemData);
      setPoems([...poems, newPoem]);
      return newPoem.id;
    } catch (err) {
      const appError = handleApiError(err, 'addPoem');
      throw appError;
    }
  };

  /**
   * Vers törlése
   * @param {string} poemId - A törlendő vers azonosítója
   */
  const deletePoem = async (poemId) => {
    if (window.confirm('Biztosan törölni szeretnéd ezt a verset?')) {
      try {
        await apiService.deletePoem(poemId);
        setPoems(poems.filter(p => p.id !== poemId));
        
        // Haladás törlése lokálisan is
        const newProgressData = { ...progressData };
        delete newProgressData[poemId];
        setProgressData(newProgressData);
        
        if (selectedPoemId === poemId) {
          setSelectedPoemId(null);
        }
        return true;
      } catch (err) {
        const appError = handleApiError(err, 'deletePoem');
        displayError(appError);
        return false;
      }
    }
    return false;
  };

  /**
   * Kiválasztott vers lekérése
   * @returns {Object|null} - A kiválasztott vers vagy null
   */
  const getSelectedPoem = () => {
    return poems.find(p => p.id === selectedPoemId) || null;
  };

  /**
   * Vers haladásának lekérése
   * @param {string} poemId - A vers azonosítója
   * @returns {Object|null} - A haladás vagy null
   */
  const getProgress = (poemId) => {
    return progressData[poemId] || null;
  };

  /**
   * Tanulási haladás mentése
   * @param {string} poemId - A vers azonosítója
   * @param {Object} learningProgressData - A tanulási haladás adatai
   */
  const saveLearningProgress = async (poemId, learningProgressData) => {
    try {
      const currentProgress = progressData[poemId] || {};
      const updatedProgress = {
        ...currentProgress,
        learning: {
          ...learningProgressData,
          lastUpdated: new Date().toISOString()
        }
      };
      
      await apiService.saveProgress(poemId, updatedProgress);
      
      setProgressData({
        ...progressData,
        [poemId]: updatedProgress
      });
    } catch (err) {
      const appError = handleApiError(err, 'saveLearningProgress');
      throw appError;
    }
  };

  /**
   * Teszt haladás mentése
   * @param {string} poemId - A vers azonosítója
   * @param {Object} testProgressData - A teszt haladás adatai
   */
  const saveTestProgress = async (poemId, testProgressData) => {
    try {
      const currentProgress = progressData[poemId] || {};
      const updatedProgress = {
        ...currentProgress,
        test: {
          ...testProgressData,
          lastUpdated: new Date().toISOString()
        }
      };
      
      await apiService.saveProgress(poemId, updatedProgress);
      
      setProgressData({
        ...progressData,
        [poemId]: updatedProgress
      });
    } catch (err) {
      const appError = handleApiError(err, 'saveTestProgress');
      throw appError;
    }
  };

  /**
   * Haladás törlése
   * @param {string} poemId - A vers azonosítója
   */
  const clearProgress = async (poemId) => {
    try {
      await apiService.deleteProgress(poemId);
      
      const newProgressData = { ...progressData };
      delete newProgressData[poemId];
      setProgressData(newProgressData);
    } catch (err) {
      const appError = handleApiError(err, 'clearProgress');
      throw appError;
    }
  };

  return {
    poems,
    selectedPoemId,
    progressData,
    loading,
    error,
    setSelectedPoemId,
    addPoem,
    deletePoem,
    getSelectedPoem,
    getProgress,
    saveLearningProgress,
    saveTestProgress,
    clearProgress,
    reloadData: loadPoemsAndProgress
  };
};