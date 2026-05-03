import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Footer } from './components/Footer';
import type { CityInputRow } from './components/InputPanel';
import { InputPanel } from './components/InputPanel';
import { MainPanels } from './components/MainPanels';
import { ReportPanel } from './components/ReportPanel';
import { StatusBar } from './components/StatusBar';
import { VizPanel } from './components/VizPanel';
import type { DimKey } from './model/constants';
import { analyzeCity, type CityResult } from './model/rci';

const STORAGE_KEY = 'rci_panel_analyzed_city_total';

type FieldErrors = Partial<Record<DimKey | 'name', string>>;

function parseNum(s: string): number | null {
  const t = s.trim();
  if (t === '') return null;
  const n = Number(t);
  if (Number.isNaN(n)) return null;
  return n;
}

function validateRow(row: CityInputRow): FieldErrors {
  const e: FieldErrors = {};
  if (!row.name.trim()) e.name = '请填写城市名称';

  if (row.tsc.trim() === '') e.tsc = '必填：旅游服务承载力 TSC';
  else {
    const n = parseNum(row.tsc);
    if (n === null) e.tsc = '请输入有效数字';
    else if (n < 0 || n > 1) e.tsc = '有效范围 0.00 – 1.00';
  }

  if (row.transport.trim() === '') e.transport = '必填：交通可达性（班次/日）';
  else if (!/^-?\d+$/.test(row.transport.trim())) e.transport = '请输入整数（0–200）';
  else {
    const n = parseInt(row.transport.trim(), 10);
    if (n < 0 || n > 200) e.transport = '有效范围 0 – 200';
  }

  if (row.tertiary.trim() === '') e.tertiary = '必填：第三产业占比（%）';
  else {
    const n = parseNum(row.tertiary);
    if (n === null) e.tertiary = '请输入有效数字';
    else if (n < 0 || n > 100) e.tertiary = '有效范围 0.0 – 100.0';
  }

  if (row.entropy.trim() === '') e.entropy = '必填：商业生态熵值 H';
  else {
    const n = parseNum(row.entropy);
    if (n === null) e.entropy = '请输入有效数字';
    else if (n < 0 || n > 5) e.entropy = '有效范围 0.00 – 5.00';
  }

  return e;
}

function rowToRaw(row: CityInputRow) {
  return {
    tsc: parseNum(row.tsc)!,
    transport: parseInt(row.transport.trim(), 10),
    tertiary: parseNum(row.tertiary)!,
    entropy: parseNum(row.entropy)!,
  };
}

let nextCityId = 1;

export default function App() {
  const [cities, setCities] = useState<CityInputRow[]>([
    { id: 0, name: '', tsc: '', transport: '', tertiary: '', entropy: '' },
  ]);
  const [errors, setErrors] = useState<Record<number, FieldErrors>>({});
  const [results, setResults] = useState<CityResult[] | null>(null);
  const [running, setRunning] = useState(false);
  const [runTick, setRunTick] = useState(0);
  const [vizEpoch, setVizEpoch] = useState(0);
  const [displayEpoch, setDisplayEpoch] = useState(0);
  const [analyzedCount, setAnalyzedCount] = useState(0);

  useEffect(() => {
    try {
      const v = sessionStorage.getItem(STORAGE_KEY);
      setAnalyzedCount(v ? parseInt(v, 10) || 0 : 0);
    } catch {
      setAnalyzedCount(0);
    }
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setRunTick((x) => x + 1), 220);
    return () => clearInterval(t);
  }, [running]);

  const ranked = useMemo(() => {
    if (!results?.length) return null;
    return [...results].sort((a, b) => b.rci - a.rci);
  }, [results]);

  const vizCities = useMemo(() => {
    if (!ranked?.length) return null;
    return ranked.map((c) => ({ name: c.name, normalized: c.normalized }));
  }, [ranked]);

  const updateCity = useCallback((id: number, patch: Partial<CityInputRow>) => {
    setCities((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    setErrors((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      return next;
    });
  }, []);

  const addCity = useCallback(() => {
    setCities((prev) => {
      if (prev.length >= 8) return prev;
      const id = nextCityId++;
      return [...prev, { id, name: '', tsc: '', transport: '', tertiary: '', entropy: '' }];
    });
  }, []);

  const removeCity = useCallback((id: number) => {
    setCities((prev) => {
      if (prev.length <= 1) {
        return [{ id: prev[0].id, name: '', tsc: '', transport: '', tertiary: '', entropy: '' }];
      }
      return prev.filter((c) => c.id !== id);
    });
    setErrors((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const run = useCallback(() => {
    const nextErrors: Record<number, FieldErrors> = {};
    let ok = true;
    for (const c of cities) {
      const e = validateRow(c);
      if (Object.keys(e).length > 0) {
        nextErrors[c.id] = e;
        ok = false;
      }
    }
    setErrors(nextErrors);
    if (!ok) return;

    setRunning(true);
    window.setTimeout(() => {
      const out: CityResult[] = cities.map((row) =>
        analyzeCity(row.name.trim(), rowToRaw(row)),
      );
      setResults(out);
      setVizEpoch((x) => x + 1);
      setDisplayEpoch((x) => x + 1);
      setRunning(false);
      try {
        const prev = parseInt(sessionStorage.getItem(STORAGE_KEY) || '0', 10) || 0;
        const n = prev + cities.length;
        sessionStorage.setItem(STORAGE_KEY, String(n));
        setAnalyzedCount(n);
      } catch {
        setAnalyzedCount((x) => x + cities.length);
      }
    }, 420);
  }, [cities]);

  return (
    <div className="flex h-screen max-h-screen flex-col overflow-hidden bg-terminal-bg text-terminal-text">
      <StatusBar analyzedCount={analyzedCount} />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <MainPanels
          left={
            <InputPanel
              cities={cities}
              errors={errors}
              onChange={updateCity}
              onAdd={addCity}
              onRemove={removeCity}
              onRun={run}
              running={running}
              runTick={runTick}
            />
          }
          center={<VizPanel cities={vizCities} animationEpoch={vizEpoch} />}
          right={<ReportPanel ranked={ranked} displayEpoch={displayEpoch} />}
        />
      </main>
      <Footer />
    </div>
  );
}
