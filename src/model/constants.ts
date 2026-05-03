export const WEIGHTS = {
  tsc: 0.2956,
  transport: 0.2102,
  tertiary: 0.2403,
  entropy: 0.2539,
} as const;

export const BENCHMARK_RAW = {
  tsc: 0.54355,
  transport: 8.0,
  tertiary: 50.2,
  entropy: 3.1509,
} as const;

export const NORM_PARAMS = {
  tsc: { min: 0.382, max: 0.5651 },
  transport: { min: 4, max: 21 },
  tertiary: { min: 45.9, max: 65.5 },
  entropy: { min: 3.0205, max: 3.2307 },
} as const;

export const BENCHMARK_NORM = {
  tsc: 0.8823,
  transport: 0.2353,
  tertiary: 0.2194,
  entropy: 0.6204,
} as const;

export type DimKey = keyof typeof WEIGHTS;

export const DIM_KEYS: DimKey[] = ['tsc', 'transport', 'tertiary', 'entropy'];

export const DIM_LABELS: Record<DimKey, string> = {
  tsc: '旅游服务承载力',
  transport: '交通可达性',
  tertiary: '经济与产业基础',
  entropy: '商业生态完备度',
};

export const RADAR_AXIS_LABELS: Record<DimKey, string> = {
  tsc: 'TSC\n旅游服务',
  transport: 'T\n交通可达',
  tertiary: 'S\n三产占比',
  entropy: 'H\n商业熵',
};

export const TOOLTIPS: Record<DimKey, string> = {
  tsc:
    '旅游服务承载力综合指标，由 POI 密度、餐饮占比、空间分散度加权合成。取值 0-1，值越大表示旅游接待能力越强。详细计算方式见论文第五章。',
  transport:
    '从上海出发，到达该城市的高铁班次与航班班次之和。可在 12306 和携程 APP 查询任意非节假日工作日数据。',
  tertiary:
    '第三产业增加值占 GDP 比重。可在各市《国民经济和社会发展统计公报》中查到，使用走红前一年数据。',
  entropy:
    '基于高德地图 POI 数据计算的 Shannon 熵。H = -Σ(p_k × ln(p_k))，其中 p_k 为第 k 类 POI 占比。值越大表示商业业态越丰富均衡。通常取值范围 2.5-3.5。',
};

export const BENCHMARK_CITIES = [
  { name: '淄博', raw: { tsc: 0.5561, transport: 4, tertiary: 45.9, entropy: 3.1464 } },
  { name: '天水', raw: { tsc: 0.531, transport: 12, tertiary: 54.5, entropy: 3.1554 } },
] as const;
