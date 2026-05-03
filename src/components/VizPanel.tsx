import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { BENCHMARK_NORM, DIM_KEYS, DIM_LABELS, WEIGHTS, type DimKey } from '../model/constants';
import type { CityNormalized } from '../model/rci';

const CITY_COLORS = ['#FF8C00', '#00CED1', '#FF00FF', '#ADFF2F', '#FFD700', '#FF69B4', '#40E0D0', '#BA55D3'];

type CitySeries = {
  name: string;
  normalized: CityNormalized;
};

type RadarRow = {
  subject: string;
  dim: DimKey;
  benchmark: number;
  [cityKey: string]: string | number | DimKey;
};

function buildRadarData(cities: CitySeries[]): RadarRow[] {
  return DIM_KEYS.map((dim) => {
    const row: RadarRow = {
      subject: DIM_LABELS[dim],
      dim,
      benchmark: BENCHMARK_NORM[dim],
    };
    cities.forEach((c, i) => {
      row[`city${i}`] = c.normalized[dim];
    });
    return row;
  });
}

type Props = {
  cities: CitySeries[] | null;
  animationEpoch: number;
};

export function VizPanel({ cities, animationEpoch }: Props) {
  const hasCities = Boolean(cities && cities.length > 0);
  const data = hasCities && cities ? buildRadarData(cities) : [];

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col border-r border-terminal-border bg-black">
      <div className="border-b border-terminal-border px-2 py-1.5 font-mono-data text-xs uppercase tracking-wider text-terminal-amber">
        VIZ / 可视化
      </div>
      <div className="flex min-h-0 flex-[3] flex-col p-2">
        <div className="min-h-[220px] flex-1 font-mono-data">
          {hasCities && cities ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                key={animationEpoch}
                cx="50%"
                cy="52%"
                outerRadius="68%"
                data={data}
                margin={{ top: 28, right: 56, bottom: 8, left: 8 }}
              >
                <PolarGrid stroke="#333" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#E0E0E0', fontSize: 9, fontFamily: 'Noto Sans SC, sans-serif' }}
                />
                <PolarRadiusAxis angle={38} domain={[0, 1]} tickCount={6} stroke="#444" />
                <Tooltip
                  contentStyle={{
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: 11,
                    color: '#E0E0E0',
                  }}
                  formatter={(value: number | string, name: string | number) => [
                    typeof value === 'number' ? value.toFixed(4) : value,
                    name,
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}
                  align="right"
                  verticalAlign="top"
                />
                <Radar
                  name="标杆基准线"
                  dataKey="benchmark"
                  stroke="#888888"
                  fill="rgba(136,136,136,0.18)"
                  fillOpacity={1}
                  strokeWidth={1}
                  strokeDasharray="4 3"
                  dot={{ r: 1.5, fill: '#888' }}
                  isAnimationActive
                  animationDuration={500}
                  animationBegin={0}
                />
                {cities.map((c, i) => (
                  <Radar
                    key={`${c.name}-${i}`}
                    name={c.name || `城市${i + 1}`}
                    dataKey={`city${i}`}
                    stroke={CITY_COLORS[i % CITY_COLORS.length]}
                    fill="transparent"
                    strokeWidth={1.5}
                    dot={{ r: 2.5, fill: CITY_COLORS[i % CITY_COLORS.length] }}
                    isAnimationActive
                    animationDuration={500}
                    animationBegin={400 + i * 500}
                  />
                ))}
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-[11px] text-[#666]">
              运行分析后显示雷达图（0–1 标准化刻度）
            </div>
          )}
        </div>
      </div>
      <div className="min-h-0 shrink-0 border-t border-terminal-border p-2">
        <div className="mb-1 font-mono-data text-[10px] uppercase text-terminal-amber">GRA 权重（固化）</div>
        <WeightBars />
      </div>
    </section>
  );
}

function WeightBars() {
  const entries = DIM_KEYS.map((k) => ({
    key: k,
    label: DIM_LABELS[k],
    pct: WEIGHTS[k] * 100,
  }));
  return (
    <div className="space-y-1.5">
      {entries.map((e) => (
        <div key={e.key} className="flex items-center gap-2 text-[10px]">
          <span className="w-24 shrink-0 truncate font-sans text-[#bbb]" title={e.label}>
            {e.label}
          </span>
          <div className="relative h-4 min-w-0 flex-1 border border-terminal-border bg-[#0a0a0a]">
            <div
              className="absolute left-0 top-0 h-full"
              style={{
                width: `${e.pct}%`,
                background: 'linear-gradient(90deg, #553300 0%, #FF8C00 55%, #ffc266 100%)',
              }}
            />
          </div>
          <span className="w-12 shrink-0 text-right font-mono-data text-terminal-text">
            {e.pct.toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}
