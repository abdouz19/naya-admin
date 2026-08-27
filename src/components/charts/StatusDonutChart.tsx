import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { formatNumber } from '@/lib/format';

interface DonutDatum {
  name: string;
  value: number;
  color: string;
}

interface StatusDonutChartProps {
  data: DonutDatum[];
  size?: number;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: DonutDatum }[];
}) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="radius-sm bg-white px-3 py-2 shadow-card-hover">
      <p className="text-sm font-medium text-brown">{item.name}</p>
      <p className="text-sm text-muted">{formatNumber(item.value)}</p>
    </div>
  );
}

export function StatusDonutChart({ data, size = 200 }: StatusDonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const innerRadius = size * 0.3;
  const outerRadius = size * 0.4;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <PieChart width={size} height={size}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            dataKey="value"
            stroke="none"
            paddingAngle={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>

        {/* Center total */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-3xl font-semibold text-brown">
            {formatNumber(total)}
          </span>
          <span className="text-xs text-muted">Total</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-muted">
              {entry.name}{' '}
              <span className="font-medium text-brown">
                {formatNumber(entry.value)}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
