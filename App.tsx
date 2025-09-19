
import React, { useState, useMemo } from 'react';
import { PreferenceSelector } from './components/PreferenceSelector';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { PhoneChart } from './components/PhoneChart';
import { fetchRecommendations } from './services/geminiService';
import type { UserPreferences, Recommendation, Phone } from './types';
import { PHONE_DATA, PREFERENCE_OPTIONS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'results'>('form');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = async (preferences: UserPreferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await fetchRecommendations(preferences, PHONE_DATA);
      setRecommendations(results);
      setView('results');
    } catch (err) {
      setError('추천을 받아오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setView('form');
    setRecommendations([]);
    setError(null);
  };

  const brandData = useMemo(() => {
    const brandCounts = PHONE_DATA.reduce((acc, phone) => {
      acc[phone.brand] = (acc[phone.brand] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.keys(brandCounts).map(brand => ({
      name: brand,
      count: brandCounts[brand]
    }));
  }, []);

  return (
    <div className="min-h-screen bg-slate-100/50 text-slate-800 font-sans">
      <Header onReset={handleReset} />
      <main className="container mx-auto p-4 md:p-8">
        {isLoading && <Loader />}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative text-center" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {view === 'form' && !isLoading && (
          <>
            <PreferenceSelector 
              options={PREFERENCE_OPTIONS} 
              onSubmit={handleGetRecommendations} 
            />
            <div className="mt-12 p-6 bg-white rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-center text-slate-700 mb-6">전체 스마트폰 데이터 현황</h2>
              <PhoneChart data={brandData} />
            </div>
          </>
        )}

        {view === 'results' && !isLoading && !error && (
          <ResultsDisplay 
            recommendations={recommendations}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
};

export default App;
