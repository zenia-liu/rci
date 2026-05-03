import { BENCHMARK_CITIES, BENCHMARK_RAW, DIM_KEYS, TOOLTIPS, type DimKey } from '../model/constants';
import { FieldTooltip } from './FieldTooltip';

export type CityInputRow = {
  id: number;
  name: string;
  tsc: string;
  transport: string;
  tertiary: string;
  entropy: string;
};

type FieldErrors = Partial<Record<DimKey | 'name', string>>;

type Props = {
  cities: CityInputRow[];
  errors: Record<number, FieldErrors>;
  onChange: (id: number, patch: Partial<CityInputRow>) => void;
  onAdd: () => void;
  onRemove: (id: number) => void;
  onRun: () => void;
  running: boolean;
  runTick: number;
};

const LIMIT = 8;

export function InputPanel({
  cities,
  errors,
  onChange,
  onAdd,
  onRemove,
  onRun,
  running,
  runTick,
}: Props) {
  return (
    <aside className="flex h-full min-h-0 w-full flex-col border-r border-terminal-border bg-terminal-panel">
      <div className="border-b border-terminal-border px-2 py-1.5 font-mono-data text-xs uppercase tracking-wider text-terminal-amber">
        INPUT / 数据输入
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-2">
        {cities.map((c) => (
          <div
            key={c.id}
            className="relative mb-2 border border-terminal-border bg-black p-2 text-[11px]"
          >
            {cities.length > 1 && (
              <button
                type="button"
                className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center border border-terminal-border font-mono-data text-terminal-red hover:bg-[rgba(255,49,49,0.12)]"
                onClick={() => onRemove(c.id)}
                aria-label="删除城市"
              >
                ×
              </button>
            )}
            <div className="mb-1.5 pr-6">
              <label className="font-mono-data text-[10px] text-[#888]">城市名称</label>
              <input
                className="mt-0.5 w-full border border-terminal-border bg-[#0d0d0d] px-1.5 py-1 font-sans text-xs text-terminal-text outline-none focus:border-terminal-amber"
                value={c.name}
                onChange={(e) => onChange(c.id, { name: e.target.value })}
                placeholder="例：淄博"
              />
              {errors[c.id]?.name && (
                <p className="mt-0.5 font-mono-data text-[10px] text-terminal-red">{errors[c.id].name}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <MetricField
                label="TSC"
                hint="综合指标，详见说明"
                value={c.tsc}
                onChange={(v) => onChange(c.id, { tsc: v })}
                err={errors[c.id]?.tsc}
                tooltip={TOOLTIPS.tsc}
              />
              <MetricField
                label="T"
                hint="上海方向高铁+航班日班次"
                value={c.transport}
                onChange={(v) => onChange(c.id, { transport: v })}
                err={errors[c.id]?.transport}
                tooltip={TOOLTIPS.transport}
                integer
              />
              <MetricField
                label="S %"
                hint="查统计公报，如 45.9"
                value={c.tertiary}
                onChange={(v) => onChange(c.id, { tertiary: v })}
                err={errors[c.id]?.tertiary}
                tooltip={TOOLTIPS.tertiary}
              />
              <MetricField
                label="H"
                hint="POI Shannon熵，如 3.15"
                value={c.entropy}
                onChange={(v) => onChange(c.id, { entropy: v })}
                err={errors[c.id]?.entropy}
                tooltip={TOOLTIPS.entropy}
              />
            </div>
          </div>
        ))}
        <div className="mt-1 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={cities.length >= LIMIT}
            onClick={onAdd}
            className="border border-terminal-border bg-black px-2 py-1 font-mono-data text-[11px] text-terminal-amber hover:bg-[rgba(255,140,0,0.08)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            + 添加城市
          </button>
          <button
            type="button"
            onClick={onRun}
            disabled={running}
            className="border border-terminal-amber bg-[rgba(255,140,0,0.08)] px-2 py-1 font-mono-data text-[11px] text-terminal-amber hover:bg-[rgba(255,140,0,0.15)] disabled:opacity-60"
          >
            {running ? (
              <span>
                计算中 <span className="text-terminal-green">{runTick % 2 === 0 ? '█' : '░'}</span>
              </span>
            ) : (
              '▶ 运行分析'
            )}
          </button>
        </div>
        <BenchmarkDisplay />
      </div>
    </aside>
  );
}

function MetricField({
  label,
  hint,
  value,
  onChange,
  err,
  tooltip,
  integer,
}: {
  label: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  err?: string;
  tooltip: string;
  integer?: boolean;
}) {
  return (
    <div className="border-t border-dashed border-[#222] pt-1 first:border-t-0 first:pt-0">
      <div className="mb-0.5 font-mono-data text-[10px] text-[#aaa]">
        <span className="text-terminal-text">{label}</span>
        <FieldTooltip text={tooltip} />
      </div>
      <input
        type="text"
        inputMode={integer ? 'numeric' : 'decimal'}
        className="w-full border border-terminal-border bg-[#0d0d0d] px-1.5 py-0.5 font-mono-data text-[11px] text-terminal-text outline-none focus:border-terminal-amber"
        placeholder={hint}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {err && <p className="mt-0.5 font-mono-data text-[10px] text-terminal-red">{err}</p>}
    </div>
  );
}

function BenchmarkDisplay() {
  return (
    <div className="mt-3 border border-terminal-border bg-black p-2">
      <div className="mb-1 font-mono-data text-[10px] uppercase text-terminal-amber">标杆基准（只读）</div>
      <p className="mb-2 text-[10px] leading-relaxed text-[#999]">
        高转化组均值：{BENCHMARK_CITIES.map((x) => x.name).join('、')}；以下为原始量纲均值（标准化前）。
      </p>
      <table className="w-full border-collapse font-mono-data text-[10px]">
        <thead>
          <tr className="border-b border-terminal-border text-[#888]">
            <th className="py-0.5 text-left font-normal">维度</th>
            <th className="py-0.5 text-right font-normal">值</th>
          </tr>
        </thead>
        <tbody>
          {DIM_KEYS.map((k) => (
            <tr key={k} className="border-b border-[#222]">
              <td className="py-0.5 text-terminal-text">{k.toUpperCase()}</td>
              <td className="py-0.5 text-right text-terminal-green">
                {k === 'tsc' || k === 'entropy'
                  ? (BENCHMARK_RAW[k] as number).toFixed(k === 'tsc' ? 5 : 4)
                  : k === 'transport'
                    ? BENCHMARK_RAW.transport.toFixed(1)
                    : BENCHMARK_RAW.tertiary.toFixed(1)}
                {k === 'tertiary' ? '%' : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
