import React from 'react';
import { Settings } from 'lucide-react';
import ToggleSwitch from './common/ToggleSwitch';

/**
 * Teszt beállítások komponens
 */
const TestSettings = ({
  caseSensitive,
  requirePunctuation,
  onCaseSensitiveChange,
  onRequirePunctuationChange,
  onStartTest,
  onBack
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <Settings className="w-8 h-8 text-green-600" />
          <h2 className="text-3xl font-bold text-gray-800">Teszt beállítások</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-800">Kis és nagybetű számít</h3>
              <p className="text-sm text-gray-600">Különbséget tesz a kis és nagybetűk között</p>
            </div>
            <ToggleSwitch checked={caseSensitive} onChange={onCaseSensitiveChange} color="green" />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-800">Írásjelek is kellenek</h3>
              <p className="text-sm text-gray-600">Pontokat, vesszőket stb. is be kell írni</p>
            </div>
            <ToggleSwitch checked={requirePunctuation} onChange={onRequirePunctuationChange} color="green" />
          </div>
        </div>

        <div className="flex gap-4 pt-8">
          <button
            onClick={onStartTest}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Teszt indítása
          </button>
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

export default TestSettings;