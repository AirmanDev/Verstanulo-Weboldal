import React from 'react';
import { BookOpen, Plus, List } from 'lucide-react';

/**
 * Főmenü komponens
 */
const Menu = ({ onNavigate, poemsCount }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-indigo-600" />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Verstanuló</h1>
          <p className="text-gray-600">Tanulj meg verseket interaktívan</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onNavigate('upload')}
            className="w-full bg-indigo-600 text-white p-6 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-xl font-semibold mb-2">Új vers feltöltése</h3>
                <p className="text-indigo-100">Adj meg egy új verset a tanuláshoz</p>
              </div>
              <Plus className="w-8 h-8" />
            </div>
          </button>

          {poemsCount > 0 && (
            <button
              onClick={() => onNavigate('poem-list')}
              className="w-full bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Verseim ({poemsCount})
                  </h3>
                  <p className="text-gray-600">Választ egy verset a tanuláshoz</p>
                </div>
                <List className="w-8 h-8 text-indigo-600" />
              </div>
            </button>
          )}

          {poemsCount === 0 && (
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Még nincs feltöltött versed</p>
              <p className="text-sm text-gray-500 mt-2">Kezdj egy új vers feltöltésével!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
