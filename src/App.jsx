import React, { useState } from 'react';
import { MODES } from './constants/modes';
import { usePoems } from './hooks/usePoems';
import { useLearningState } from './hooks/useLearningState';
import { useSettings } from './hooks/useSettings';
import { calculateLearningStats, calculateTestStats } from './utils/progressUtils';
import { normalizeText } from './utils/textUtils';

// Komponensek
import Menu from './components/Menu';
import PoemList from './components/PoemList';
import PoemDetail from './components/PoemDetail';
import PoemUpload from './components/PoemUpload';
import LearningSettings from './components/LearningSettings';
import Learning from './components/Learning';
import LearningSummary from './components/LearningSummary';
import TestSettings from './components/TestSettings';
import Test from './components/Test';
import TestSummary from './components/TestSummary';

/**
 * Főalkalmazás komponens
 */
export default function PoemLearningApp() {
  const [mode, setMode] = useState(MODES.MENU);
  const [testResults, setTestResults] = useState([]);

  // Custom hooks
  const poems = usePoems();
  const learningState = useLearningState();
  const settings = useSettings();

  const selectedPoem = poems.getSelectedPoem();

  /**
   * Navigáció kezelése
   */
  const handleNavigate = (newMode) => {
    setMode(newMode);
  };

  /**
   * Vers kiválasztása
   */
  const handleSelectPoem = (poemId) => {
    poems.setSelectedPoemId(poemId);
    setMode(MODES.POEM_DETAIL);
  };

  /**
   * Vers mentése
   */
  const handleSavePoem = async (poemData) => {
    try {
      await poems.addPoem(poemData);
      setMode(MODES.MENU);
    } catch (error) {
      alert(error.message || 'Hiba történt a vers mentésekor');
    }
  };

  /**
   * Tanulás indítása (folytatás)
   */
  const handleStartLearning = () => {
    const progress = poems.getProgress(poems.selectedPoemId);
    learningState.loadProgress(progress?.learning);
    setMode(MODES.LEARNING);
  };

  /**
   * Tanulás indítása (újrakezdés)
   */
  const handleStartLearningFresh = () => {
    learningState.resetProgress();
    setMode(MODES.LEARNING);
  };

  /**
   * Tanulás befejezése
   */
  const handleLearningComplete = async () => {
    const stats = calculateLearningStats(learningState.attempts);
    
    if (stats.percentage >= 90) {
      try {
        await poems.saveLearningProgress(poems.selectedPoemId, learningState.getProgressData());
        setMode(MODES.SUMMARY);
      } catch (error) {
        console.error('Hiba a haladás mentésekor:', error);
        alert('Nem sikerült menteni a haladást');
      }
    } else {
      learningState.resetProgress();
    }
  };

  /**
   * Tanulási haladás mentése
   */
  const handleSaveLearningProgress = async () => {
    if (poems.selectedPoemId) {
      try {
        await poems.saveLearningProgress(poems.selectedPoemId, learningState.getProgressData());
      } catch (error) {
        console.error('Hiba a haladás mentésekor:', error);
      }
    }
  };

  /**
   * Teszt indítása
   */
  const handleStartTest = () => {
    learningState.setCurrentStanzaIndex(0);
    setTestResults([]);
    setMode(MODES.TEST);
  };

  /**
   * Teszt válasz beküldése
   */
  const handleTestSubmit = async (userAnswer) => {
    const stanza = selectedPoem.stanzas[learningState.currentStanzaIndex];
    const targetText = normalizeText(stanza, settings.caseSensitive, settings.requirePunctuation);
    const userText = normalizeText(userAnswer, settings.caseSensitive, settings.requirePunctuation);
    const correct = userText === targetText;
    
    const newResults = [...testResults, {
      stanzaIndex: learningState.currentStanzaIndex,
      correct,
      userAnswer
    }];
    setTestResults(newResults);
    
    if (learningState.currentStanzaIndex < selectedPoem.stanzas.length - 1) {
      learningState.setCurrentStanzaIndex(learningState.currentStanzaIndex + 1);
    } else {
      // Teszt befejezése - haladás mentése
      try {
        const testStats = calculateTestStats(newResults);
        await poems.saveTestProgress(poems.selectedPoemId, {
          results: newResults,
          stats: testStats,
          completedAt: new Date().toISOString()
        });
      } catch (error) {
        console.error('Hiba a teszt eredmény mentésekor:', error);
      }
      setMode(MODES.TEST_SUMMARY);
    }
  };

  // Haladás mentése amikor kilép a tanulásból
  React.useEffect(() => {
    if (mode !== MODES.LEARNING && learningState.attempts.length > 0) {
      handleSaveLearningProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Renderelés módok szerint
  
  // Betöltési állapot
  if (poems.loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg">Betöltés...</p>
        </div>
      </div>
    );
  }

  // Hiba állapot
  if (poems.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Hiba történt</h2>
          <p className="text-gray-700 mb-6">{poems.error}</p>
          <button
            onClick={() => poems.reloadData()}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Újrapróbálás
          </button>
        </div>
      </div>
    );
  }
  
  switch (mode) {
    case MODES.MENU:
      return (
        <Menu 
          onNavigate={handleNavigate}
          poemsCount={poems.poems.length}
        />
      );

    case MODES.POEM_LIST:
      return (
        <PoemList
          poems={poems.poems}
          onSelectPoem={handleSelectPoem}
          onDeletePoem={poems.deletePoem}
          onBack={() => handleNavigate(MODES.MENU)}
        />
      );

    case MODES.POEM_DETAIL:
      return (
        <PoemDetail
          poem={selectedPoem}
          progress={poems.getProgress(poems.selectedPoemId)}
          onNavigate={handleNavigate}
          onBack={() => handleNavigate(MODES.POEM_LIST)}
        />
      );

    case MODES.UPLOAD:
      return (
        <PoemUpload
          onSave={handleSavePoem}
          onBack={() => handleNavigate(MODES.MENU)}
        />
      );

    case MODES.LEARNING_SETTINGS:
      return (
        <LearningSettings
          poem={selectedPoem}
          progress={poems.getProgress(poems.selectedPoemId)}
          caseSensitive={settings.caseSensitive}
          requirePunctuation={settings.requirePunctuation}
          onCaseSensitiveChange={settings.setCaseSensitive}
          onRequirePunctuationChange={settings.setRequirePunctuation}
          onStartLearning={handleStartLearning}
          onStartFresh={handleStartLearningFresh}
          onBack={() => handleNavigate(MODES.POEM_DETAIL)}
        />
      );

    case MODES.LEARNING:
      return (
        <Learning
          poem={selectedPoem}
          learningState={learningState}
          caseSensitive={settings.caseSensitive}
          requirePunctuation={settings.requirePunctuation}
          onComplete={handleLearningComplete}
          onExit={() => {
            handleSaveLearningProgress();
            handleNavigate(MODES.MENU);
          }}
        />
      );

    case MODES.SUMMARY:
      return (
        <LearningSummary
          stats={calculateLearningStats(learningState.attempts)}
          onNavigate={handleNavigate}
        />
      );

    case MODES.TEST_SETTINGS:
      return (
        <TestSettings
          caseSensitive={settings.caseSensitive}
          requirePunctuation={settings.requirePunctuation}
          onCaseSensitiveChange={settings.setCaseSensitive}
          onRequirePunctuationChange={settings.setRequirePunctuation}
          onStartTest={handleStartTest}
          onBack={() => handleNavigate(MODES.POEM_DETAIL)}
        />
      );

    case MODES.TEST:
      return (
        <Test
          poem={selectedPoem}
          currentStanzaIndex={learningState.currentStanzaIndex}
          onSubmit={handleTestSubmit}
          onExit={() => {
            setTestResults([]);
            handleNavigate(MODES.MENU);
          }}
        />
      );

    case MODES.TEST_SUMMARY:
      return (
        <TestSummary
          testResults={testResults}
          stats={calculateTestStats(testResults)}
          onNavigate={handleNavigate}
        />
      );

    default:
      return null;
  }
}
