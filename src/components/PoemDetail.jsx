import React from 'react';
import { BookOpen, Award } from 'lucide-react';

/**
 * Vers részletek nézet - főoldal a vershez
 */
const PoemDetail = ({ poem, onNavigate, onBack, progress }) => {
  if (!poem) return null;

  const hasLearningProgress = progress?.learning;
  const hasTestProgress = progress?.test;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">{poem.title}</h3>
          <p className="text-gray-700 mb-1">{poem.author}</p>
          {poem.year && <p className="text-gray-600 mb-4">{poem.year}</p>}
          <p className="text-sm text-gray-500">{poem.stanzas.length} versszak</p>
          {(hasLearningProgress || hasTestProgress) && (
            <div className="mt-4 space-y-2">
              {hasLearningProgress && (
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="text-sm text-indigo-700">
                    📖 Van mentett tanulási progresszed ennél a versnél
                  </p>
                  {hasLearningProgress.lastUpdated && (
                    <p className="text-xs text-indigo-600 mt-1">
                      Utolsó frissítés: {new Date(hasLearningProgress.lastUpdated).toLocaleDateString('hu-HU')}
                    </p>
                  )}
                </div>
              )}
              {hasTestProgress && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    ✅ Teszt eredmény: {hasTestProgress.stats?.percentage || 0}%
                  </p>
                  {hasTestProgress.completedAt && (
                    <p className="text-xs text-green-600 mt-1">
                      Befejezve: {new Date(hasTestProgress.completedAt).toLocaleDateString('hu-HU')}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <button
            onClick={() => onNavigate('learning-settings')}
            className="w-full bg-indigo-600 text-white p-6 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2">
                  {hasLearningProgress ? 'Tanulás folytatása' : 'Tanulás indítása'}
                </h3>
                <p className="text-indigo-100">Gyakorold be a verset lépésről lépésre</p>
              </div>
              <BookOpen className="w-8 h-8" />
            </div>
          </button>

          <button
            onClick={() => onNavigate('test-settings')}
            className="w-full bg-green-600 text-white p-6 rounded-lg shadow-md hover:bg-green-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2">Teszt</h3>
                <p className="text-green-100">Ellenőrizd a tudásod</p>
              </div>
              <Award className="w-8 h-8" />
            </div>
          </button>

          <button
            onClick={onBack}
            className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Vissza a versekhez
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoemDetail;
