
import React, { useState } from 'react';
import { RecommendationCard } from './RecommendationCard';
import type { Recommendation } from '../types';

interface ResultsDisplayProps {
  recommendations: Recommendation[];
  onReset: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ recommendations, onReset }) => {
  const [liked, setLiked] = useState<Set<string>>(new Set());

  const handleLike = (model: string) => {
    setLiked(prev => {
      const newSet = new Set(prev);
      if (newSet.has(model)) {
        newSet.delete(model);
      } else {
        newSet.add(model);
      }
      return newSet;
    });
  };
  
  if (recommendations.length === 0) {
    return (
        <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-slate-700 mb-4">추천 결과를 찾을 수 없습니다.</h2>
            <p className="text-slate-500 mb-6">선택한 조건에 맞는 스마트폰을 찾지 못했습니다. 다른 조건으로 시도해보세요.</p>
            <button
                onClick={onReset}
                className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors"
            >
                다시 추천받기
            </button>
        </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-slate-800">AI 추천 Top 3</h2>
        <p className="mt-3 text-lg text-slate-600">선택하신 기준에 따라 가장 적합한 스마트폰을 추천해 드립니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {recommendations.map((rec, index) => (
          <RecommendationCard
            key={rec.model}
            recommendation={rec}
            isLiked={liked.has(rec.model)}
            onLike={() => handleLike(rec.model)}
            rank={index + 1}
          />
        ))}
      </div>
        <div className="text-center mt-12">
            <button
                onClick={onReset}
                className="bg-slate-200 text-slate-800 font-bold py-3 px-8 rounded-lg hover:bg-slate-300 transition-colors"
            >
                새로운 조건으로 다시 추천받기
            </button>
        </div>
    </div>
  );
};
