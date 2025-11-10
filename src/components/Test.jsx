import React, { useState, useRef } from 'react';
import { useMobileFocus } from '../hooks/useMobileFocus';

/**
 * Teszt komponens - versszak beírása memóriából
 */
const Test = ({ poem, currentStanzaIndex, onSubmit, onExit }) => {
  const [testInput, setTestInput] = useState('');
  const textareaRef = useRef(null);

  // Mobil fókusz kezelés
  useMobileFocus(textareaRef, [currentStanzaIndex]);

  const handleSubmit = () => {
    if (testInput.trim()) {
      onSubmit(testInput);
      setTestInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Teszt</h2>
            <p className="text-gray-600">
              {currentStanzaIndex + 1}. versszak / {poem.stanzas.length}
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              ref={textareaRef}
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full p-4 border-2 border-green-300 rounded-lg focus:outline-none focus:border-green-500 min-h-48"
              placeholder="Írd be a versszakot... (Enter a beküldéshez)"
              autoFocus
              inputMode="text"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Beküldés (Enter)
            </button>
            
            <button
              onClick={onExit}
              className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Kilépés (haladás elvész)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
