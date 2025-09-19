
import React from 'react';
import type { Recommendation } from '../types';

interface RecommendationCardProps {
  recommendation: Recommendation;
  isLiked: boolean;
  onLike: () => void;
  rank: number;
}

const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  const colors = [
    'bg-amber-400 text-amber-900', // Gold
    'bg-slate-300 text-slate-800', // Silver
    'bg-yellow-600 text-yellow-100'  // Bronze
  ];
  const colorClass = colors[rank - 1] || 'bg-slate-200 text-slate-700';
  
  return (
    <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center text-xl font-extrabold shadow-lg ${colorClass}`}>
      {rank}
    </div>
  );
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation, isLiked, onLike, rank }) => {
  const { brand, model, recommendationReason, keyPros, priceRange } = recommendation;

  return (
    <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 flex flex-col p-6 relative transform hover:-translate-y-2">
      <RankBadge rank={rank} />
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-semibold text-indigo-600">{brand}</p>
            <h3 className="text-2xl font-bold text-slate-900">{model}</h3>
          </div>
          <button onClick={onLike} className="p-2 rounded-full hover:bg-red-100 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-7 w-7 transition-all duration-200 ${isLiked ? 'text-red-500 fill-current' : 'text-slate-400'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4 text-slate-700">
          <div>
            <h4 className="font-semibold text-slate-800 mb-1">
              <span className="text-indigo-500 mr-2">✓</span> 추천 이유
            </h4>
            <p className="text-sm leading-relaxed bg-indigo-50/50 p-3 rounded-md">{recommendationReason}</p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-1">
              <span className="text-indigo-500 mr-2">✓</span> 주요 장점
            </h4>
            <p className="text-sm leading-relaxed bg-indigo-50/50 p-3 rounded-md">{keyPros}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200">
        <p className="text-lg font-bold text-right text-slate-800">{priceRange}</p>
      </div>
    </div>
  );
};
