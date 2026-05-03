import { useEffect, useState } from 'react';

type Props = {
  analyzedCount: number;
};

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

export function StatusBar({ analyzedCount }: Props) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const ts = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  return (
    <header className="flex h-9 shrink-0 items-center justify-between border-b border-terminal-border bg-terminal-panel px-3 font-mono-data text-xs text-terminal-text">
      <span className="text-terminal-amber">●</span>
      <span className="tracking-wide">
        SYS_TIME <span className="text-terminal-green">{ts}</span>
      </span>
      <span className="text-[#888]">|</span>
      <span>
        已分析城市: <span className="text-terminal-amber">{analyzedCount}</span>
      </span>
      <span className="text-[#888]">|</span>
      <span>
        模型版本: <span className="text-terminal-text">RCI v1.0</span>
      </span>
    </header>
  );
}
