
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-t-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg font-semibold text-slate-700">AI가 최고의 스마트폰을 분석중입니다...</p>
    </div>
  );
};
