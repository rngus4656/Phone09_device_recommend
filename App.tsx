import React, { useState, useMemo } from 'react';
import { PreferenceSelector } from './components/PreferenceSelector';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { PhoneChart } from './components/PhoneChart';
import { fetchRecommendations } from './services/geminiService';
import type { UserPreferences, Recommendation, Phone, ChartType } from './types';
import { PHONE_DATA, PREFERENCE_OPTIONS } from './constants';

const App: React.FC = () => {
  const [view, setView] = useState<'form' | 'results'>('form');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<ChartType>('brand');

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

  const brandChartData = useMemo(() => {
    const brandStats = PHONE_DATA.reduce((acc, phone) => {
      if (!acc[phone.brand]) {
        acc[phone.brand] = { count: 0, total_mAh: 0 };
      }
      acc[phone.brand].count += 1;
      acc[phone.brand].total_mAh += phone.battery_mAh;
      return acc;
    }, {} as Record<string, { count: number; total_mAh: number }>);

    return Object.entries(brandStats).map(([brand, stats]) => ({
      name: brand,
      '기종 수': stats.count,
      '평균 배터리': Math.round(stats.total_mAh / stats.count),
    }));
  }, []);

  const yearlyChartData = useMemo(() => {
    const yearStats = PHONE_DATA.reduce((acc, phone) => {
        const year = phone.release_date.substring(0, 4);
        if (!acc[year]) {
            acc[year] = { ram: [], storage: [] };
        }
        // ram_gb can be "6/8", parseFloat will take the first number
        const ram = parseFloat(phone.ram_gb);
        if (!isNaN(ram)) {
            acc[year].ram.push(ram);
        }
        // storage_gb_options can be "128,256", parseInt will take the first one
        const storage = parseInt(phone.storage_gb_options);
        if (!isNaN(storage)) {
            acc[year].storage.push(storage);
        }
        return acc;
    }, {} as Record<string, { ram: number[]; storage: number[] }>);
    
    return Object.entries(yearStats).map(([year, stats]) => ({
        name: year,
        '평균 RAM': stats.ram.length > 0 ? Number((stats.ram.reduce((a, b) => a + b, 0) / stats.ram.length).toFixed(1)) : 0,
        '평균 저장공간': stats.storage.length > 0 ? Number(Math.round(stats.storage.reduce((a, b) => a + b, 0) / stats.storage.length)) : 0,
    })).sort((a, b) => parseInt(a.name) - parseInt(b.name));
  }, []);

  const flagshipChartData = useMemo(() => {
    return PHONE_DATA
      .filter(phone => phone.model.includes('Ultra') || phone.model.includes('Pro Max') || phone.model.includes('Pro'))
      .map(phone => ({
        model: `${phone.brand} ${phone.model}`,
        battery: phone.battery_mAh,
        weight: phone.weight_g,
        displaySize: phone.display_size_in,
      }));
  }, []);

  const { data, insight } = useMemo(() => {
    switch (chartType) {
      case 'yearly':
        return { 
          data: yearlyChartData, 
          insight: "최근 2년간 평균 RAM은 6GB → 10GB로 증가했으며, 저장공간 옵션도 기본 128GB에서 256GB 이상으로 확대되었습니다." 
        };
      case 'flagship':
        return { 
          data: flagshipChartData, 
          insight: "갤럭시 울트라 시리즈는 배터리 용량은 크지만 무게도 무거운 편이며, 아이폰은 상대적으로 가볍지만 배터리 용량은 다소 낮습니다." 
        };
      case 'brand':
      default:
        return { 
          data: brandChartData, 
          insight: "삼성은 가장 많은 종류의 스마트폰을 출시했으며, OnePlus와 vivo는 평균적으로 가장 높은 배터리 용량을 자랑합니다." 
        };
    }
  }, [chartType, brandChartData, yearlyChartData, flagshipChartData]);

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
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-700 mb-4 sm:mb-0">📊 데이터 인포그래픽 보기</h2>
                <select 
                  onChange={(e) => setChartType(e.target.value as ChartType)} 
                  value={chartType} 
                  className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-slate-800"
                  aria-label="Select chart type"
                >
                  <option value="brand">브랜드별 기종 수/배터리</option>
                  <option value="yearly">연도별 RAM/저장공간</option>
                  <option value="flagship">대표 기종 배터리</option>
                </select>
              </div>
              <PhoneChart chartType={chartType} data={data} />
              <p className="text-center text-slate-600 mt-4 p-2 bg-slate-50 rounded-md">{insight}</p>
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