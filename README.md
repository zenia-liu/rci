<div align="center">

# 从"流量"到"留量"：网红城市承接力评估与转化机制研究

**基于多源数据与 DID 因果识别的实证分析**

[![GitHub license](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Live Demo](https://img.shields.io/badge/Live-Demo-ff69b4)](https://zenia-liu.github.io/internet-famous-city-rci/)
[![Paper](https://img.shields.io/badge/Paper-PDF-green)](https://github.com/zenia-liu/internet-famous-city-rci/blob/main/%E8%AE%BA%E6%96%87.pdf)
[![Competition](https://img.shields.io/badge/2026-%E7%BB%9F%E8%AE%A1%E5%BB%BA%E6%A8%A1%E5%A4%A7%E8%B5%9B-orange)]()

**[刘乐乐](https://github.com/zenia-liu)** · **康妤冉** · **林霖**

第十二届全国大学生统计建模大赛参赛作品

</div>

---

## 📖 项目简介

短视频与社交媒体重塑了城市传播路径，淄博、哈尔滨、天水等城市依托单一事件在短时间内获得高度关注，但热度消退后的长期效果却呈现出显著分化——部分城市成功将"流量"转化为"留量"，而另一些则迅速回落。

本项目以 **2023—2025 年间淄博、哈尔滨、天水、开封、景德镇** 五座典型网红城市为研究对象，围绕 **"流量能否转化为留量"** 这一核心命题，从人口留存、经济活力与商业生态三个维度构建了系统化的分析框架，并开发了 **城市承接力诊断面板（RCI）** ，将研究视角从事后结果解释拓展至事前能力评估。

> 💡 **核心发现**：流量本身并不构成城市增长的充分条件，业态多样性与空间集聚程度的协同交互才是留量转化的关键机制。只有在"多元业态"与"紧凑空间"同时具备时，流量才更有可能沉淀为持续的城市活力。

---

## ✨ 研究亮点

### 🔬 多源异构数据融合

| 数据类型 | 来源 | 用途 |
|----------|------|------|
| 抖音搜索指数 | 巨量算数 | 短视频端用户主动关注行为 |
| 百度资讯指数 | 百度指数 | 主流媒体传播强度 |
| 百度迁徙数据 | 百度迁徙 | 日度人口流动规模 |
| NPP-VIIRS 夜间灯光 | 卫星遥感 | 城市经济活力代理变量 |
| 高德地图 POI | 高德 API | 商业业态与空间结构 |

### 📐 严谨的因果识别框架

采用 **双重差分模型（DID）** 进行因果识别，为每座网红城市匹配同省/邻近对照城市，构建"实验组—对照组"准实验设计，剥离宏观趋势与季节性因素，逼近反事实情形。

### 🏗️ 原创性概念：城市承接力（RCI）

提出 **城市承接力指数（Reception Capacity Index, RCI）** ，通过灰色关联分析（GRA）确定指标权重，结合 TOPSIS 方法构建综合评价模型，量化城市在流量冲击发生前所具备的静态承接能力。

### 🛠️ 工具化落地：自动化诊断面板

将 RCI 模型开发为 **交互式 Web 诊断面板** ，输入目标城市的基础数据即可自动生成承接力评分、雷达图诊断与政策建议。

---

## 🧭 研究框架

```
┌─────────────────────────────────────────────────────────────┐
│                     核心研究问题                              │
│          流量能否转化为留量？为何城市间呈现分化？              │
└──────────────────────────┬──────────────────────────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐    ┌──────────┐
    │ 人口维度  │    │ 经济维度  │    │ 商业维度  │
    │          │    │          │    │          │
    │ DID 回归  │    │ DID 回归  │    │ POI 分析  │
    │ PRR 指标  │    │ EVS 指标  │    │ 香农熵   │
    │ 百度迁徙  │    │ 夜间灯光  │    │ 空间分散度│
    └────┬─────┘    └────┬─────┘    └────┬─────┘
         │               │               │
         └───────────────┼───────────────┘
                         ▼
              ┌──────────────────┐
              │   城市承接力诊断  │
              │   GRA + TOPSIS   │
              │   RCI 指数构建    │
              │   雷达图可视化    │
              └──────────────────┘
```

---

## 📊 核心指标体系

### 流量指标：综合热门指数（CPI）

基于抖音搜索指数与百度资讯指数，提取 6 个特征变量（峰值强度、持续时长、累积动能），通过 **PCA 降维合成** 为单一数值化指标。

| 特征维度 | 变量 | 含义 |
|----------|------|------|
| 爆发力 | X₁: 百度资讯峰值强度 | AHI 在爆发期的最大值 |
| 爆发力 | X₂: 抖音搜索峰值强度 | AHI 在爆发期的最大值 |
| 韧性时长 | X₃: 百度资讯高频天数 | AHI > 0.5 的持续天数 |
| 韧性时长 | X₄: 网红事件存活天数 | 爆发期持续时间 |
| 累计热度 | X₅: 百度资讯累积动能 | 正向异常热度累计 |
| 累计热度 | X₆: 抖音总脉冲面积 | 热度脉冲积分近似 |

### 留量指标：三维度量体系

| 维度 | 指标 | 方法 | 含义 |
|------|------|------|------|
| 人口留存 | PRR（人口留存率） | DID + 标准化 | 城市净迁入水平的相对提升 |
| 经济活力 | EVS（经济活力留存得分） | DID + 夜间灯光 | 经济活动强度的超额变化 |
| 商业生态 | H（香农熵）× D（空间分散度） | POI + 信息熵 | 业态多样性与空间集聚交互 |

---

## 📈 核心发现

### 三种留量转化模式

| 模式 | 特征 | 代表城市 | 表现 |
|------|------|----------|------|
| 🟢 **协同提升型** | 人口与经济同步改善 | 淄博、天水 | PRR > 7%, EVS > 3% |
| 🟡 **错位型** | 经济强但人口未留 | 哈尔滨 | EVS = 8.77%, PRR = 1.60% |
| 🔴 **负向型** | 流量未被有效承接 | 开封 | PRR = -8.20%, EVS = -12.07% |

### 城市承接力诊断

基于 **商业生态完备度、旅游服务承载力、交通可达性、经济与产业基础** 四个维度，构建 RCI 指数，通过雷达图直观展示城市各维度的优势与短板。

**标杆基准**（高转化组均值）：淄博 + 天水

---

## 🚀 在线诊断面板

> 📌 **访问地址**：[https://zenia-liu.github.io/internet-famous-city-rci/](https://zenia-liu.github.io/internet-famous-city-rci/)

### 功能模块

| 模块 | 功能 |
|------|------|
| **INPUT** | 输入目标城市的 TSC、交通可达性、第三产业占比、商业熵值 |
| **VIZ** | 自动生成雷达图，与标杆城市对比 |
| **RPT** | RCI 排名与各维度差距诊断 |
| **POLICY** | 基于短板维度的针对性政策建议 |

### GRA 权重（固化）

| 维度 | 权重 |
|------|------|
| 旅游服务承载力（TSC） | 29.56% |
| 商业生态完备度（ENTROPY） | 25.39% |
| 经济与产业基础（TERTIARY） | 24.03% |
| 交通可达性（TRANSPORT） | 21.02% |

---

## 📁 项目结构

```
internet-famous-city-rci/
├── index.html              # 在线诊断面板（单页应用）
├── assets/                 # 静态资源
├── 论文.pdf                # 完整论文
├── CITATION.cff            # 引用信息
├── README.md               # 项目说明
└── .gitignore
```

---

## 📄 论文信息

> **从"流量"到"留量"：网红城市承接力评估与转化机制研究——基于多源数据与 DID 因果识别的实证分析**

**关键词**：网红城市；流量转化；双重差分模型；城市承接力；多源数据

📄 [点击阅读完整论文](https://github.com/zenia-liu/internet-famous-city-rci/blob/main/%E8%AE%BA%E6%96%87.pdf)

---

## 👥 团队成员

| 成员 | 主要贡献 |
|------|----------|
| **[刘乐乐](https://github.com/zenia-liu)** | 数据搜集与处理、建模分析、编程开发、诊断面板实现 |
| **康妤冉** | 模型构建、数据搜集与分析 |
| **林霖** | 论文撰写与润色 |

**指导老师**：**刘彬**
---

## 📚 主要参考文献

- Henderson J V, Storeygard A, Weil D N. Measuring Economic Growth from Outer Space[J]. *American Economic Review*, 2012, 102(2): 994-1028.
- Goodman-Bacon A. Difference-in-Differences with Variation in Treatment Timing[J]. *Journal of Econometrics*, 2021, 225(2): 254-277.
- Card D, Krueger A. Minimum Wages and Employment: A Case Study of the Fast-Food Industry in New Jersey and Pennsylvania[J]. *American Economic Review*, 1994, 84(4): 772-793.
- Elvidge C D, Zhizhin M, Ghosh T, et al. Annual Time Series of Global VIIRS Nighttime Lights Derived from Monthly Averages: 2012 to 2019[J]. *Remote Sensing*, 2021, 13(5): 922.
- Deng J. Introduction to grey system theory[J]. *The Journal of Grey System*, 1989, 1(1): 1-24.

---

## 📜 许可证

本项目基于 [MIT License](https://opensource.org/licenses/MIT) 开源。

---

<div align="center">

**第十二届全国大学生统计建模大赛** | 2026

Made with ❤️ by Team RCI

</div>
