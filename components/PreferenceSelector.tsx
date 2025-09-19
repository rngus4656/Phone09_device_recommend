
import React, { useState } from 'react';
import type { UserPreferences, PreferenceOption } from '../types';

interface PreferenceSelectorProps {
  options: PreferenceOption[];
  onSubmit: (preferences: UserPreferences) => void;
}

export const PreferenceSelector: React.FC<PreferenceSelectorProps> = ({ options, onSubmit }) => {
  const [selectedPriorities, setSelectedPriorities] = useState<Set<string>>(new Set());
  const [previousPhone, setPreviousPhone] = useState('');

  const handleTogglePriority = (id: string) => {
    setSelectedPriorities(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      priorities: Array.from(selectedPriorities),
      previousPhone,
    });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-slate-800 mb-2">어떤 스마트폰을 찾으시나요?</h2>
      <p className="text-center text-slate-500 mb-8">가장 중요하게 생각하는 요소를 모두 선택해주세요.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {options.map((option) => (
            <div
              key={option.id}
              onClick={() => handleTogglePriority(option.id)}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 text-center ${
                selectedPriorities.has(option.id)
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105'
                  : 'bg-slate-50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50'
              }`}
            >
              <div className="font-bold text-lg">{option.label}</div>
              <div className="text-sm opacity-80">{option.description}</div>
            </div>
          ))}
        </div>

        <div className="mb-8">
          <label htmlFor="previous-phone" className="block text-lg font-medium text-slate-700 mb-2">
            이전에 사용한 기종이 있나요? (선택)
          </label>
          <input
            type="text"
            id="previous-phone"
            value={previousPhone}
            onChange={(e) => setPreviousPhone(e.target.value)}
            placeholder="예: Galaxy S21, iPhone 13 Pro"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
           <p className="text-sm text-slate-500 mt-2">이전 기종의 장단점을 고려하여 더 정확하게 추천해드려요.</p>
        </div>

        <button
          type="submit"
          disabled={selectedPriorities.size === 0}
          className="w-full bg-indigo-600 text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
        >
          AI 추천 받기
        </button>
      </form>
    </div>
  );
};
