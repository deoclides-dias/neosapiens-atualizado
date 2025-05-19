import { useState, useEffect } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

type RadarGraphProps = {
  data: {
    purpose: number;
    body: number;
    mind: number;
  };
  withAnimation?: boolean;
  withTooltip?: boolean;
  highlightDimension?: string | null;
};

// Componente personalizado de tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 rounded-lg shadow-md border border-gray-200">
        <p className="font-medium text-gray-800">{data.subject}</p>
        <p className="text-indigo-600 font-semibold">
          {data.A}% <span className="text-gray-500 text-sm font-normal">/ 100</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">Clique para mais detalhes</p>
      </div>
    );
  }

  return null;
};

const RadarGraph: React.FC<RadarGraphProps> = ({ 
  data, 
  withAnimation = true,
  withTooltip = true,
  highlightDimension = null 
}) => {
  const [animatedData, setAnimatedData] = useState({
    purpose: 0,
    body: 0,
    mind: 0,
  });

  useEffect(() => {
    if (withAnimation) {
      const steps = 20;
      const duration = 1000;
      const interval = duration / steps;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        if (step <= steps) {
          const progress = step / steps;
          setAnimatedData({
            purpose: Math.round(data.purpose * progress),
            body: Math.round(data.body * progress),
            mind: Math.round(data.mind * progress),
          });
        } else {
          clearInterval(timer);
        }
      }, interval);

      return () => clearInterval(timer);
    } else {
      // Se não quiser animação, define os valores diretamente
      setAnimatedData(data);
    }
  }, [data, withAnimation]);

  const getDimensionColor = (dimension: string) => {
    switch (dimension) {
      case 'Propósito':
        return '#8B5CF6'; // Purple
      case 'Corpo':
        return '#10B981'; // Green
      case 'Mente':
        return '#3B82F6'; // Blue
      default:
        return '#6366F1'; // Indigo
    }
  };

  const chartData = [
    { 
      subject: 'Propósito', 
      A: animatedData.purpose, 
      fullMark: 100,
      fill: getDimensionColor('Propósito'),
      highlighted: highlightDimension === 'purpose'
    },
    { 
      subject: 'Corpo', 
      A: animatedData.body, 
      fullMark: 100,
      fill: getDimensionColor('Corpo'),
      highlighted: highlightDimension === 'body'
    },
    { 
      subject: 'Mente', 
      A: animatedData.mind, 
      fullMark: 100,
      fill: getDimensionColor('Mente'),
      highlighted: highlightDimension === 'mind'
    },
  ];

  return (
    <div className="w-full h-96 md:h-[28rem] flex flex-col items-center">
      <ResponsiveContainer width="100%" height="80%">
        <RadarChart 
          cx="50%" 
          cy="50%" 
          outerRadius="80%" 
          data={chartData}
        >
          <PolarGrid 
            strokeDasharray="3 3" 
            stroke="#cccccc" 
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={({ payload, x, y, cx, cy, index, ...rest }: any) => {
              const isHighlighted = highlightDimension === 
                (index === 0 ? 'purpose' : index === 1 ? 'body' : 'mind');
              
              return (
                <g>
                  <text
                    x={x}
                    y={y}
                    textAnchor={x > cx ? 'start' : x < cx ? 'end' : 'middle'}
                    fill={isHighlighted ? getDimensionColor(payload.value) : '#4b5563'}
                    fontSize={isHighlighted ? 16 : 14}
                    fontWeight={isHighlighted ? 600 : 500}
                    className="transition-all duration-300"
                  >
                    {payload.value}
                  </text>
                </g>
              );
            }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickCount={5}
            stroke="#e5e7eb"
          />
          {withTooltip && <Tooltip content={<CustomTooltip />} />}
          <Radar
            name="Perfil Atual"
            dataKey="A"
            stroke="#4f46e5"
            fill="#4f46e5"
            fillOpacity={0.5}
            animationDuration={1000}
            animationEasing="ease-out"
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* Legenda interativa */}
      <div className="flex justify-center space-x-8 mt-6">
        <LegendItem 
          color="bg-purple-600" 
          label="Propósito" 
          value={animatedData.purpose} 
          isHighlighted={highlightDimension === 'purpose'}
        />
        <LegendItem 
          color="bg-green-600" 
          label="Corpo" 
          value={animatedData.body} 
          isHighlighted={highlightDimension === 'body'}
        />
        <LegendItem 
          color="bg-blue-600" 
          label="Mente" 
          value={animatedData.mind} 
          isHighlighted={highlightDimension === 'mind'}
        />
      </div>
    </div>
  );
};

const LegendItem = ({ 
  color, 
  label, 
  value, 
  isHighlighted = false
}: { 
  color: string; 
  label: string; 
  value: number;
  isHighlighted?: boolean;
}) => (
  <div className={`
    flex items-center px-3 py-2 rounded-full transition-all duration-300
    ${isHighlighted ? 'bg-gray-100 shadow-sm transform scale-105' : ''}
  `}>
    <span className={`w-4 h-4 rounded-full mr-2 ${color}`}></span>
    <span className={`
      text-gray-700 text-sm font-medium transition-all duration-300
      ${isHighlighted ? 'text-gray-900' : ''}
    `}>
      {label}: <span className="font-bold">{value}%</span>
    </span>
  </div>
);

export default RadarGraph;