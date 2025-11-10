import React from 'react';
import { BarChart3 } from 'lucide-react';

/**
 * Teszt eredmények összegzés komponens
 */
const TestSummary = ({ testResults, stats, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-green-600" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Teszt eredmény</h2>
        </div>

        <div className="bg-green-50 rounded-lg p-6 mb-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-green-600 mb-2">{stats.percentage}%</div>
            <div className="text-gray-700">Pontosság</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.correctAnswers}</div>
              <div className="text-sm text-gray-600">Helyes versszak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.totalAnswers}</div>
              <div className="text-sm text-gray-600">Összes versszak</div>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${result.correct ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-800">{index + 1}. versszak</span>
                <span className={`font-semibold ${result.correct ? 'text-green-600' : 'text-red-600'}`}>
                  {result.correct ? '✓ Helyes' : '✗ Hibás'}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onNavigate('test-settings')}
            className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Teszt újra
          </button>
          <button
            onClick={() => onNavigate('poem-detail')}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Vissza a vershez
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestSummary;
