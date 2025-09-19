import React from 'react';
import { 
  ComposedChart,
  LineChart,
  ScatterChart,
  Line, 
  Bar,
  Scatter,
  XAxis, 
  YAxis, 
  ZAxis,
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import type { ChartType } from '../types';
import { BRAND_COLORS } from '../constants';

interface PhoneChartProps {
  chartType: ChartType;
  data: any[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 bg-white border border-slate-200 rounded-lg shadow-lg">
        <p className="font-bold text-slate-800">{label}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.color }}>
            {`${pld.name}: ${pld.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const getBubbleColor = (displaySize: number) => {
    if (displaySize < 6.3) return '#8884d8';
    if (displaySize < 6.7) return '#82ca9d';
    return '#ffc658';
};

export const PhoneChart: React.FC<PhoneChartProps> = ({ chartType, data }) => {
  const renderChart = () => {
    switch (chartType) {
      case 'brand':
        return (
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: '#475569' }} />
            <YAxis yAxisId="left" orientation="left" stroke="#2563eb" label={{ value: '기종 수', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#db2777" label={{ value: '평균 배터리 (mAh)', angle: 90, position: 'insideRight' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="기종 수" yAxisId="left" barSize={30}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={BRAND_COLORS[entry.name] || BRAND_COLORS.Default} />
              ))}
            </Bar>
            <Line type="monotone" dataKey="평균 배터리" yAxisId="right" stroke="#db2777" strokeWidth={2} />
          </ComposedChart>
        );
      case 'yearly':
        return (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fill: '#475569' }} />
            <YAxis label={{ value: 'GB', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="평균 RAM" stroke="#8884d8" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="평균 저장공간" stroke="#82ca9d" strokeWidth={2} />
          </LineChart>
        );
       case 'flagship':
        return (
           <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
            <CartesianGrid />
            <XAxis 
              type="category" 
              dataKey="model" 
              name="모델"
              angle={-25}
              textAnchor="end"
              height={80}
              interval={0}
              tick={{ fontSize: 10, fill: '#475569' }}
            />
            <YAxis type="number" dataKey="battery" name="배터리 (mAh)" unit="mAh" />
            <ZAxis type="number" dataKey="weight" range={[100, 1000]} name="무게 (g)" unit="g" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Legend />
            <Scatter name="대표 기종" data={data}>
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBubbleColor(entry.displaySize)} />
                ))}
            </Scatter>
          </ScatterChart>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ width: '100%', height: 450 }}>
      <ResponsiveContainer>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};
