export function Footer() {
  return (
    <footer className="shrink-0 border-t border-terminal-border bg-terminal-panel px-3 py-1.5 text-[11px] leading-relaxed text-[#aaa]">
      <span className="font-mono-data text-terminal-amber">SRC</span>{' '}
      数据来源：统计公报、12306/携程班次、高德 POI（TSC/H 需自行按论文方法计算）|
      <span className="ml-2 font-mono-data text-terminal-amber">MDL</span>{' '}
      模型原理：极差标准化 → 灰色关联权重（固化）→ TOPSIS 相对贴近度得到 RCI；标杆为高转化组（淄博+天水）标准化均值。
    </footer>
  );
}
