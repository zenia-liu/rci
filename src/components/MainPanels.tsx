import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import type { ReactNode } from 'react';

type Props = {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
};

function ResizeHandle() {
  return (
    <PanelResizeHandle className="group relative flex w-3 shrink-0 cursor-col-resize items-stretch justify-center border-0 bg-transparent p-0 outline-none focus-visible:ring-1 focus-visible:ring-terminal-amber hover:bg-[rgba(255,140,0,0.06)] active:bg-[rgba(255,140,0,0.12)]">
      <span
        className="pointer-events-none my-1 w-px self-stretch bg-terminal-border group-hover:bg-terminal-amber"
        aria-hidden
      />
    </PanelResizeHandle>
  );
}

export function MainPanels({ left, center, right }: Props) {
  return (
    <PanelGroup
      direction="horizontal"
      autoSaveId="city-rci-main-panels-v1"
      className="h-full min-h-0 w-full flex-1"
    >
      <Panel defaultSize={26} minSize={16} maxSize={48} className="min-h-0 min-w-0">
        <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">{left}</div>
      </Panel>
      <ResizeHandle />
      <Panel defaultSize={48} minSize={28} className="min-h-0 min-w-0">
        <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">{center}</div>
      </Panel>
      <ResizeHandle />
      <Panel defaultSize={26} minSize={18} maxSize={52} className="min-h-0 min-w-0">
        <div className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">{right}</div>
      </Panel>
    </PanelGroup>
  );
}
