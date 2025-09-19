
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartData {
  name: string;
  count: number;
}

interface PhoneChartProps {
  data: ChartData[];
}

export const PhoneChart: React.FC<PhoneChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
          barSize={40}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
          <XAxis dataKey="name" tick={{ fill: '#475569' }} />
          <YAxis allowDecimals={false} tick={{ fill: '#475569' }} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0',
              borderRadius: '0.5rem' 
            }}
            cursor={{fill: '#f1f5f9'}}
          />
          <Legend wrapperStyle={{ color: '#475569' }} />
          <Bar dataKey="count" name="모델 수" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
