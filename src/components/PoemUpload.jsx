import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

/**
 * Vers feltöltése komponens
 */
const PoemUpload = ({ onSave, onBack }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [stanzas, setStanzas] = useState(['']);

  const addStanza = () => {
    setStanzas([...stanzas, '']);
  };

  const removeStanza = (index) => {
    if (stanzas.length > 1) {
      setStanzas(stanzas.filter((_, i) => i !== index));
    }
  };

  const updateStanza = (index, value) => {
    const newStanzas = [...stanzas];
    newStanzas[index] = value;
    setStanzas(newStanzas);
  };

  const handleSave = () => {
    if (title && author && stanzas.some(s => s.trim())) {
      onSave({
        title,
        author,
        year,
        stanzas: stanzas.filter(s => s.trim())
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Vers feltöltése</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cím</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Vers címe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Szerző</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ki írta a verset"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Keletkezés</label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Év vagy időszak"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Versszakok</label>
            <div className="space-y-4">
              {stanzas.map((stanza, index) => (
                <div key={index} className="flex gap-2">
                  <textarea
                    value={stanza}
                    onChange={(e) => updateStanza(index, e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-32"
                    placeholder={`${index + 1}. versszak`}
                  />
                  {stanzas.length > 1 && (
                    <button
                      onClick={() => removeStanza(index)}
                      className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addStanza}
              className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Új versszak
            </button>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Mentés
            </button>
            <button
              onClick={onBack}
              className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Mégse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoemUpload;
