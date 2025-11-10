import React from 'react';
import { Settings } from 'lucide-react';

/**
 * Beállítások toggle komponens
 */
const ToggleSwitch = ({ checked, onChange }) => (
  <label className="relative inline-block w-14 h-8">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="sr-only peer"
    />
    <div className="w-14 h-8 bg-gray-300 rounded-full peer peer-checked:bg-indigo-600 transition-colors"></div>
    <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
  </label>
);

/**
 * Tanulás beállítások komponens
 */
const LearningSettings = ({
  poem,
  progress,
  caseSensitive,
  requirePunctuation,
  onCaseSensitiveChange,
  onRequirePunctuationChange,
  onStartLearning,
  onStartFresh,
  onBack
}) => {
  const hasLearningProgress = progress?.learning;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-8 h-8 text-indigo-600" />
          <h2 className="text-3xl font-bold text-gray-800">Tanulás beállítások</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-800">Kis és nagybetű számít</h3>
              <p className="text-sm text-gray-600">Különbséget tesz a kis és nagybetűk között</p>
            </div>
            <ToggleSwitch checked={caseSensitive} onChange={onCaseSensitiveChange} />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-800">Írásjelek is kellenek</h3>
              <p className="text-sm text-gray-600">Pontokat, vesszőket stb. is be kell írni</p>
            </div>
            <ToggleSwitch checked={requirePunctuation} onChange={onRequirePunctuationChange} />
          </div>
        </div>

        <div className="flex gap-4 pt-8">
          {hasLearningProgress ? (
            <>
              <button
                onClick={onStartLearning}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
              >
                Folytatás
              </button>
              <button
                onClick={onStartFresh}
                className="flex-1 bg-indigo-500 text-white py-3 rounded-lg hover:bg-indigo-600 transition-colors"
              >
                Újrakezd
              </button>
            </>
          ) : (
            <button
              onClick={onStartFresh}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Tanulás indítása
            </button>
          )}
          <button
            onClick={onBack}
            className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Vissza
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningSettings;
