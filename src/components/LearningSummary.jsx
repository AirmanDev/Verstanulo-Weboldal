import React from 'react';
import { Award } from 'lucide-react';

/**
 * Tanulás összegzés komponens
 */
const LearningSummary = ({ stats, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <Award className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Tanulás befejezve!</h2>
          <p className="text-gray-600">Gratulálunk, sikeresen begyakoroltad a verset!</p>
        </div>

        <div className="bg-indigo-50 rounded-lg p-6 mb-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-indigo-600 mb-2">{stats.percentage}%</div>
            <div className="text-gray-700">Pontosság</div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.correctAttempts}</div>
              <div className="text-sm text-gray-600">Helyes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.totalAttempts}</div>
              <div className="text-sm text-gray-600">Összes</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onNavigate('test-settings')}
            className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
          >
            Teszt indítása
          </button>
          <button
            onClick={() => onNavigate('learning-settings')}
            className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            Újra gyakorlás
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

export default LearningSummary;
