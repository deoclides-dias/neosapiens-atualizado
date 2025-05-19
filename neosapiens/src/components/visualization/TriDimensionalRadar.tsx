import React from 'react';

export type RadarDimension = {
  id: string;
  name: string;
  value: number;
  color: string;
};

type RadarChartProps = {
  dimensions: RadarDimension[];
  size?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  showScales?: boolean;
  className?: string;
};

const calculateCoordinates = (
  center: number,
  radius: number,
  angle: number,
  value: number
) => {
  // O ângulo 0 aponta para cima, no sentido horário
  const radians = (Math.PI / 180) * angle;
  const x = center + radius * value * Math.sin(radians);
  const y = center - radius * value * Math.cos(radians);
  return { x, y };
};

const TriDimensionalRadar: React.FC<RadarChartProps> = ({
  dimensions,
  size = 400,
  showLabels = true,
  showLegend = true,
  showScales = true,
  className = ''
}) => {
  const center = size / 2;
  const radius = size * 0.4; // 40% do tamanho para dar margem aos rótulos
  const numberOfDimensions = dimensions.length;
  
  // Criar os pontos do polígono para o gráfico radar
  const createRadarPoints = () => {
    let points = '';
    
    dimensions.forEach((dimension, index) => {
      const angle = (360 / numberOfDimensions) * index;
      const normalizedValue = dimension.value / 100; // Assume valores de 0-100
      const coord = calculateCoordinates(center, radius, angle, normalizedValue);
      
      points += `${coord.x},${coord.y} `;
    });
    
    return points.trim();
  };
  
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Círculos de escala */}
        {showScales && [0.25, 0.5, 0.75, 1].map((scale) => (
          <circle
            key={scale}
            cx={center}
            cy={center}
            r={radius * scale}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="1"
            strokeDasharray={scale < 1 ? "2 2" : ""}
          />
        ))}
        
        {/* Linhas dos eixos */}
        {dimensions.map((dimension, index) => {
          const angle = (360 / numberOfDimensions) * index;
          const outerCoord = calculateCoordinates(center, radius, angle, 1);
          
          return (
            <line
              key={dimension.id}
              x1={center}
              y1={center}
              x2={outerCoord.x}
              y2={outerCoord.y}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Polígono de dados */}
        <polygon
          points={createRadarPoints()}
          fill="rgba(99, 102, 241, 0.2)"
          stroke="#6366f1"
          strokeWidth="2"
          className="transition-all duration-1000 ease-out"
        />
        
        {/* Pontos de dados */}
        {dimensions.map((dimension, index) => {
          const angle = (360 / numberOfDimensions) * index;
          const normalizedValue = dimension.value / 100;
          const coord = calculateCoordinates(center, radius, angle, normalizedValue);
          
          return (
            <circle
              key={dimension.id}
              cx={coord.x}
              cy={coord.y}
              r="5"
              fill={dimension.color}
              stroke="white"
              strokeWidth="2"
              className="transition-all duration-1000 ease-out"
            />
          );
        })}
        
        {/* Rótulos */}
        {showLabels && dimensions.map((dimension, index) => {
          const angle = (360 / numberOfDimensions) * index;
          const coord = calculateCoordinates(center, radius * 1.2, angle, 1);
          
          // Ajuste de posicionamento do texto
          const textAnchor = 
            angle === 0 ? "middle" :
            angle < 90 ? "start" :
            angle === 90 ? "middle" :
            angle < 270 ? "end" : "start";
          
          const dy = 
            angle === 0 ? "-0.5em" :
            angle === 180 ? "1em" : "0.35em";
          
          return (
            <text
              key={dimension.id}
              x={coord.x}
              y={coord.y}
              dy={dy}
              textAnchor={textAnchor}
              fontSize="14"
              fontWeight="500"
              fill={dimension.color}
            >
              {dimension.name}
            </text>
          );
        })}
      </svg>
      
      {/* Legenda */}
      {showLegend && (
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {dimensions.map((dimension) => (
            <div key={dimension.id} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: dimension.color }}
              ></div>
              <span className="text-sm font-medium">{dimension.name}: {dimension.value}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Componente exemplo de uso
export const ProfileRadar: React.FC<{
  purposeValue: number;
  bodyValue: number;
  mindValue: number;
}> = ({ purposeValue, bodyValue, mindValue }) => {
  const dimensions: RadarDimension[] = [
    {
      id: 'purpose',
      name: 'Propósito',
      value: purposeValue,
      color: '#9333ea' // purple-600
    },
    {
      id: 'body',
      name: 'Corpo',
      value: bodyValue,
      color: '#10b981' // emerald-500
    },
    {
      id: 'mind',
      name: 'Mente',
      value: mindValue,
      color: '#3b82f6' // blue-500
    }
  ];
  
  return (
    <TriDimensionalRadar
      dimensions={dimensions}
      size={320}
      className="mx-auto"
    />
  );
};

export default TriDimensionalRadar;