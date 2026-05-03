import {
  BENCHMARK_NORM,
  DIM_KEYS,
  DIM_LABELS,
  type DimKey,
  NORM_PARAMS,
  WEIGHTS,
} from './constants';

export type CityRaw = Record<DimKey, number>;
export type CityNormalized = Record<DimKey, number>;

export function normalize(value: number, min: number, max: number): number {
  const z = (value - min) / (max - min);
  return Math.max(0, Math.min(1, z));
}

export function normalizeCity(raw: CityRaw): CityNormalized {
  return {
    tsc: normalize(raw.tsc, NORM_PARAMS.tsc.min, NORM_PARAMS.tsc.max),
    transport: normalize(raw.transport, NORM_PARAMS.transport.min, NORM_PARAMS.transport.max),
    tertiary: normalize(raw.tertiary, NORM_PARAMS.tertiary.min, NORM_PARAMS.tertiary.max),
    entropy: normalize(raw.entropy, NORM_PARAMS.entropy.min, NORM_PARAMS.entropy.max),
  };
}

export function computeRCI(cityNormalized: CityNormalized) {
  const v = {
    tsc: cityNormalized.tsc * WEIGHTS.tsc,
    transport: cityNormalized.transport * WEIGHTS.transport,
    tertiary: cityNormalized.tertiary * WEIGHTS.tertiary,
    entropy: cityNormalized.entropy * WEIGHTS.entropy,
  };

  const vPlus = {
    tsc: WEIGHTS.tsc,
    transport: WEIGHTS.transport,
    tertiary: WEIGHTS.tertiary,
    entropy: WEIGHTS.entropy,
  };

  const vMinus = { tsc: 0, transport: 0, tertiary: 0, entropy: 0 };

  let dPlus = 0;
  let dMinus = 0;
  for (const key of DIM_KEYS) {
    dPlus += (v[key] - vPlus[key]) ** 2;
    dMinus += (v[key] - vMinus[key]) ** 2;
  }
  dPlus = Math.sqrt(dPlus);
  dMinus = Math.sqrt(dMinus);

  const rci = dMinus / (dPlus + dMinus);

  return { rci, dPlus, dMinus, v };
}

export type DiagnosisRow = {
  label: string;
  score: number;
  bench: number;
  gap: number;
  pass: boolean;
};

export type Diagnosis = {
  results: DiagnosisRow[];
  worstGap: { dim: DimKey | ''; gap: number; label: string };
};

export function diagnose(cityNormalized: CityNormalized): Diagnosis {
  const results: DiagnosisRow[] = [];
  let worstGap: Diagnosis['worstGap'] = { dim: '', gap: 0, label: '' };

  for (const key of DIM_KEYS) {
    const score = cityNormalized[key];
    const bench = BENCHMARK_NORM[key];
    const gap = score - bench;
    const pass = gap >= 0;
    results.push({ label: DIM_LABELS[key], score, bench, gap, pass });
    if (gap < worstGap.gap) {
      worstGap = { dim: key, gap, label: DIM_LABELS[key] };
    }
  }

  return { results, worstGap };
}

export function generateAdvice(cityName: string, diagnosis: Diagnosis, rci: number): string[] {
  const advices: string[] = [];

  if (rci >= 0.7) {
    advices.push(
      `${cityName} 承接力评级：强 (RCI=${rci.toFixed(4)})。` +
        `城市基础设施和产业结构已具备承接突发流量的条件。` +
        `建议重点维护现有优势，关注商业生态多样性的持续优化。`,
    );
  } else if (rci >= 0.5) {
    advices.push(
      `${cityName} 承接力评级：中等 (RCI=${rci.toFixed(4)})。` +
        `城市具备一定承接基础，但存在结构性短板。` +
        `建议优先补齐最弱维度，以提升整体流量转化效率。`,
    );
  } else {
    advices.push(
      `${cityName} 承接力评级：较弱 (RCI=${rci.toFixed(4)})。` +
        `城市在多个维度上与标杆城市存在显著差距。` +
        `建议系统性提升基础设施和服务能力，` +
        `可参考淄博案例——通过精细化治理弥补硬件短板。`,
    );
  }

  for (const d of diagnosis.results) {
    if (d.gap < -0.15) {
      switch (d.label) {
        case '旅游服务承载力':
          advices.push(
            `⚡ 旅游服务承载力不足（差标杆 ${Math.abs(d.gap).toFixed(2)}）：` +
              `建议增加酒店客房供给、引导餐饮业态集聚、` +
              `完善景区配套设施，提升短期大客流接待能力。`,
          );
          break;
        case '交通可达性':
          advices.push(
            `⚡ 交通可达性不足（差标杆 ${Math.abs(d.gap).toFixed(2)}）：` +
              `建议争取增开核心客源城市的高铁班次、` +
              `优化机场到市区的接驳效率、` +
              `开设旅游直通车专线。`,
          );
          break;
        case '经济与产业基础':
          advices.push(
            `⚡ 经济产业基础偏弱（差标杆 ${Math.abs(d.gap).toFixed(2)}）：` +
              `建议推动第三产业升级，丰富消费场景，` +
              `引导夜间经济和文创产业发展，` +
              `提升游客人均消费额。`,
          );
          break;
        case '商业生态完备度':
          advices.push(
            `⚡ 商业生态完备度不足（差标杆 ${Math.abs(d.gap).toFixed(2)}）：` +
              `建议推动业态多元化，避免单一业态过热。` +
              `引入购物、娱乐、文创等多类型商业，` +
              `降低季节性和事件性波动风险。`,
          );
          break;
      }
    }
  }

  if (rci < 0.5) {
    advices.push(
      `📌 参考案例：淄博（RCI=0.49）通过精细化城市治理实现了` +
        `PRR=9.49% 的最高人口留存率，说明"底子弱"并不意味着` +
        `"接不住流量"——服务型管理思维和政府快速响应能力` +
        `可以有效弥补硬件短板。`,
    );
  }

  return advices;
}

export type CityResult = {
  name: string;
  raw: CityRaw;
  normalized: CityNormalized;
  rci: number;
  dPlus: number;
  dMinus: number;
  diagnosis: Diagnosis;
  advices: string[];
};

export function analyzeCity(name: string, raw: CityRaw): CityResult {
  const normalized = normalizeCity(raw);
  const { rci, dPlus, dMinus } = computeRCI(normalized);
  const diagnosis = diagnose(normalized);
  const advices = generateAdvice(name || '未命名城市', diagnosis, rci);
  return { name, raw, normalized, rci, dPlus, dMinus, diagnosis, advices };
}
