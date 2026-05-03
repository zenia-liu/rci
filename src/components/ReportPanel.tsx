import { useEffect, useMemo, useState } from 'react';
import type { CityResult } from '../model/rci';

type Props = {
  ranked: CityResult[] | null;
  displayEpoch: number;
};

function gradeLabel(rci: number) {
  if (rci >= 0.7) return '强';
  if (rci >= 0.5) return '中等';
  return '弱';
}

function rciColor(rci: number) {
  if (rci >= 0.7) return 'text-terminal-green';
  if (rci >= 0.5) return 'text-terminal-amber';
  return 'text-terminal-red';
}

function AnimatedRci({ value, epoch }: { value: number; epoch: number }) {
  const [v, setV] = useState(0);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const dur = 650;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const ease = 1 - (1 - p) * (1 - p);
      setV(value * ease);
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, epoch]);

  return <span className="tabular-nums">{v.toFixed(4)}</span>;
}

const HIGHLIGHT_TERMS = [
  '旅游服务承载力',
  '交通可达性',
  '经济与产业基础',
  '经济产业基础',
  '商业生态完备度',
  '商业生态多样性',
  '承接力评级',
  '结构性短板',
  '基础设施',
  '突发流量',
  '精细化治理',
  '服务型管理',
  '政府快速响应',
  'PRR',
  'RCI',
  '淄博',
  '人口留存率',
  '硬件短板',
  '流量转化',
];

function escapeReg(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightLine(line: string) {
  const sorted = [...HIGHLIGHT_TERMS].sort((a, b) => b.length - a.length);
  if (sorted.length === 0) return line;
  const re = new RegExp(`(${sorted.map(escapeReg).join('|')})`);
  const parts = line.split(re);
  return parts.map((part, i) => {
    if (sorted.includes(part)) {
      return (
        <span key={i} className="text-terminal-amber">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function ReportPanel({ ranked, displayEpoch }: Props) {
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (ranked && ranked.length > 0) {
      setOpenId('0');
    } else {
      setOpenId(null);
    }
  }, [displayEpoch, ranked]);

  const adviceBlocks = useMemo(() => {
    if (!ranked?.length) return [];
    return ranked.map((c) => ({
      title: c.name || '未命名城市',
      lines: c.advices,
    }));
  }, [ranked]);

  return (
    <aside className="flex h-full min-h-0 min-w-0 flex-col bg-terminal-panel">
      <div className="border-b border-terminal-border px-2 py-1.5 font-mono-data text-xs uppercase tracking-wider text-terminal-amber">
        RPT / 诊断报告
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-2">
        <RankTable ranked={ranked} displayEpoch={displayEpoch} />
        <DiagnosisAccordion ranked={ranked} openId={openId} setOpenId={setOpenId} />
        <AdviceTerminal blocks={adviceBlocks} displayEpoch={displayEpoch} />
      </div>
    </aside>
  );
}

function RankTable({ ranked, displayEpoch }: { ranked: CityResult[] | null; displayEpoch: number }) {
  return (
    <div className="mb-3 border border-terminal-border bg-black">
      <div className="border-b border-terminal-border px-2 py-1 font-mono-data text-[10px] text-terminal-amber">
        RCI 排名
      </div>
      {!ranked?.length ? (
        <p className="p-2 text-[10px] text-[#666]">等待分析…</p>
      ) : (
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-terminal-border font-mono-data text-[10px] text-[#888]">
              <th className="px-1.5 py-1 text-left font-normal">#</th>
              <th className="px-1.5 py-1 text-left font-normal">城市</th>
              <th className="px-1.5 py-1 text-right font-normal">RCI</th>
              <th className="px-1.5 py-1 text-left font-normal">等级</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((c, idx) => (
              <tr
                key={c.name + idx}
                className="border-b border-[#222] hover:bg-[rgba(255,140,0,0.1)]"
              >
                <td className="px-1.5 py-1 font-mono-data text-[#888]">{idx + 1}</td>
                <td className="px-1.5 py-1 font-sans text-terminal-text">{c.name}</td>
                <td className={`px-1.5 py-1 text-right font-mono-data ${rciColor(c.rci)}`}>
                  <AnimatedRci value={c.rci} epoch={displayEpoch} />
                </td>
                <td className={`px-1.5 py-1 font-mono-data ${rciColor(c.rci)}`}>{gradeLabel(c.rci)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function DiagnosisAccordion({
  ranked,
  openId,
  setOpenId,
}: {
  ranked: CityResult[] | null;
  openId: string | null;
  setOpenId: (id: string | null) => void;
}) {
  if (!ranked?.length) {
    return (
      <div className="mb-3 border border-terminal-border bg-black p-2 text-[10px] text-[#666]">
        维度差距诊断（运行后展开）
      </div>
    );
  }

  return (
    <div className="mb-3 space-y-1">
      <div className="font-mono-data text-[10px] uppercase text-terminal-amber">维度差距</div>
      {ranked.map((c, i) => {
        const id = String(i);
        const open = openId === id;
        return (
          <div key={id + c.name} className="border border-terminal-border bg-black">
            <button
              type="button"
              className="flex w-full items-center gap-2 border-b border-transparent px-2 py-1.5 text-left font-mono-data text-[11px] hover:bg-[rgba(255,140,0,0.08)]"
              onClick={() => setOpenId(open ? null : id)}
            >
              <span className="inline-block h-2 w-2 shrink-0 bg-terminal-amber" aria-hidden />
              <span className="font-sans text-terminal-text">{c.name}</span>
              <span className={`ml-auto font-mono-data ${rciColor(c.rci)}`}>RCI {c.rci.toFixed(4)}</span>
              <span className="text-[#666]">{open ? '[-]' : '[+]'}</span>
            </button>
            {open && (
              <div className="border-t border-terminal-border p-2">
                <table className="w-full border-collapse text-[10px]">
                  <thead>
                    <tr className="text-[#888]">
                      <th className="py-0.5 text-left font-normal">维度</th>
                      <th className="py-0.5 text-right font-normal">得分</th>
                      <th className="py-0.5 text-right font-normal">标杆</th>
                      <th className="py-0.5 text-right font-normal">差距</th>
                      <th className="py-0.5 text-left font-normal">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {c.diagnosis.results.map((r) => (
                      <tr key={r.label} className="border-t border-[#222] font-mono-data">
                        <td className="py-1 font-sans text-[#ccc]">{r.label}</td>
                        <td className="py-1 text-right tabular-nums">{r.score.toFixed(4)}</td>
                        <td className="py-1 text-right tabular-nums text-[#888]">{r.bench.toFixed(4)}</td>
                        <td className="py-1 text-right tabular-nums">{r.gap.toFixed(4)}</td>
                        <td className="py-1">
                          {r.pass ? (
                            <span className="text-terminal-green">[PASS]</span>
                          ) : (
                            <span className="text-terminal-red">
                              [GAP {r.gap >= 0 ? '+' : ''}
                              {r.gap.toFixed(2)}]
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="mt-2 font-sans text-[11px] font-bold text-terminal-amber">
                  ⚡ 优先补齐维度：{c.diagnosis.worstGap.label || '—'}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AdviceTerminal({
  blocks,
  displayEpoch,
}: {
  blocks: { title: string; lines: string[] }[];
  displayEpoch: number;
}) {
  const [visibleCount, setVisibleCount] = useState(0);

  const flatLines = useMemo(() => {
    const out: string[] = [];
    for (const b of blocks) {
      out.push(`:: ${b.title} ::`);
      for (const ln of b.lines) out.push(ln);
    }
    return out;
  }, [blocks]);

  useEffect(() => {
    setVisibleCount(0);
    if (!flatLines.length) return;
    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setVisibleCount(i);
      if (i >= flatLines.length) clearInterval(t);
    }, 380);
    return () => clearInterval(t);
  }, [displayEpoch, flatLines]);

  if (!blocks.length) {
    return (
      <div className="border border-terminal-border bg-black p-2 font-mono-data text-[10px] text-[#666]">
        POLICY / 政策建议（运行后逐行输出）
      </div>
    );
  }

  const linesToShow = flatLines.slice(0, visibleCount);

  return (
    <div className="border border-terminal-border bg-black">
      <div className="border-b border-terminal-border px-2 py-1 font-mono-data text-[10px] text-terminal-amber">
        POLICY / 政策建议
      </div>
      <div className="max-h-56 overflow-y-auto p-2 font-mono-data text-[10px] leading-relaxed text-terminal-text">
        {linesToShow.map((line, idx) => {
          if (line.startsWith(':: ')) {
            return (
              <div key={idx} className="mb-1 mt-2 first:mt-0 text-terminal-green">
                {line}
              </div>
            );
          }
          return (
            <div key={idx} className="mb-1.5 pl-0">
              <span className="text-terminal-amber">&gt; </span>
              {highlightLine(line)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
