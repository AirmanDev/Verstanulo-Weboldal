import React from 'react';
import { Trash2 } from 'lucide-react';

/**
 * Verslista komponens
 */
const PoemList = ({ poems, onSelectPoem, onDeletePoem, onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Verseim</h2>
        
        <div className="space-y-4">
          {poems.map((poem) => (
            <div key={poem.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => onSelectPoem(poem.id)}>
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{poem.title}</h3>
                  <p className="text-gray-700 mb-1">{poem.author}</p>
                  {poem.year && <p className="text-gray-600 mb-2">{poem.year}</p>}
                  <p className="text-sm text-gray-500">{poem.stanzas.length} versszak</p>
                  {poem.progress && (
                    <p className="text-sm text-indigo-600 mt-2">
                      📖 Tanulási progress mentve
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeletePoem(poem.id);
                  }}
                  className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onBack}
          className="mt-6 w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Vissza
        </button>
      </div>
    </div>
  );
};

export default PoemList;
