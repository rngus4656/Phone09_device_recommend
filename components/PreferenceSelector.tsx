import React, { useState } from 'react';
import type { UserPreferences, PreferenceOption, Phone } from '../types';
import { PHONE_DATA } from '../constants';


interface PreferenceSelectorProps {
  options: PreferenceOption[];
  onSubmit: (preferences: UserPreferences) => void;
}

export const PreferenceSelector: React.FC<PreferenceSelectorProps> = ({ options, onSubmit }) => {
  const [selectedPriorities, setSelectedPriorities] = useState<Set<string>>(new Set());
  const [previousPhone, setPreviousPhone] = useState('');
  const [suggestions, setSuggestions] = useState<Phone[]>([]);

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

  const handlePreviousPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPreviousPhone(value);
    if (value.length > 1) {
      const filteredSuggestions = PHONE_DATA.filter(phone =>
        `${phone.brand} ${phone.model}`.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (phone: Phone) => {
    setPreviousPhone(`${phone.brand} ${phone.model}`);
    setSuggestions([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuggestions([]);
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
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg scale-105'
                  : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              <div className="font-bold text-lg">{option.label}</div>
              <div className="text-sm opacity-80">{option.description}</div>
            </div>
          ))}
        </div>

        <div className="mb-8 relative">
          <label htmlFor="previous-phone" className="block text-lg font-medium text-slate-700 mb-2">
            이전에 사용한 기종이 있나요? (선택)
          </label>
          <input
            type="text"
            id="previous-phone"
            value={previousPhone}
            onChange={handlePreviousPhoneChange}
            onBlur={() => setTimeout(() => setSuggestions([]), 150)}
            placeholder="예: Galaxy S21, iPhone 13 Pro"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-100 text-slate-800"
            autoComplete="off"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-white border border-slate-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((phone, index) => (
                <li
                  key={`${phone.model}-${index}`}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-50"
                  onMouseDown={() => handleSuggestionClick(phone)}
                >
                  {phone.brand} {phone.model}
                </li>
              ))}
            </ul>
          )}
           <p className="text-sm text-slate-500 mt-2">이전 기종의 장단점을 고려하여 더 정확하게 추천해드려요.</p>
        </div>

        <button
          type="submit"
          disabled={selectedPriorities.size === 0}
          className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
        >
          AI 추천 받기
        </button>
      </form>
    </div>
  );
};