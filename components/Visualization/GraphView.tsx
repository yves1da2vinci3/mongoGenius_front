import { useEffect, useRef, useState } from 'react';
import { IconHome, IconMaximize, IconZoomIn, IconZoomOut } from '@tabler/icons-react';
import { ActionIcon, Group, Paper, SegmentedControl } from '@mantine/core';
import { ERDiagram } from './ERDiagram';
import { RelationshipGraph } from './RelationshipGraph';
import { TableGraph } from './TableGraph';

interface GraphViewProps {
  nodes: any[];
  links: any[];
  onFullscreen?: () => void;
  isFullscreen?: boolean;
}

type ViewMode = 'graph' | 'er' | 'table';

export function GraphView({ nodes, links, onFullscreen, isFullscreen }: GraphViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('graph');
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev * 1.2, 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev * 0.8, 0.1));
  };

  const handleResetZoom = () => {
    setScale(1);
  };

  // Réinitialiser le zoom lors du changement de mode ou de l'état plein écran
  useEffect(() => {
    setScale(1);
  }, [viewMode, isFullscreen]);

  const renderContent = () => {
    const contentStyle = {
      transform: `scale(${scale})`,
      transformOrigin: 'center center',
      transition: 'transform 0.2s ease-out',
      height: '100%',
      width: '100%',
      position: 'absolute' as const,
      top: 0,
      left: 0,
    };

    switch (viewMode) {
      case 'graph':
        return (
          <div style={contentStyle}>
            <RelationshipGraph nodes={nodes} links={links} scale={scale} />
          </div>
        );
      case 'er':
        return (
          <div style={contentStyle}>
            <ERDiagram nodes={nodes} links={links} />
          </div>
        );
      case 'table':
        return (
          <div style={contentStyle}>
            <TableGraph nodes={nodes} links={links} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Paper
        style={{
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
        shadow="sm"
      >
        <SegmentedControl
          value={viewMode}
          onChange={(value) => setViewMode(value as ViewMode)}
          data={[
            { label: 'Graphe', value: 'graph' },
            { label: 'Diagramme ER', value: 'er' },
            { label: 'Tables', value: 'table' },
          ]}
        />
      </Paper>

      <Paper
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 10,
        }}
        shadow="sm"
      >
        <Group p={4}>
          <ActionIcon variant="light" onClick={handleZoomIn}>
            <IconZoomIn size={18} />
          </ActionIcon>
          <ActionIcon variant="light" onClick={handleZoomOut}>
            <IconZoomOut size={18} />
          </ActionIcon>
          <ActionIcon variant="light" onClick={handleResetZoom}>
            <IconHome size={18} />
          </ActionIcon>
          {onFullscreen && !isFullscreen && (
            <ActionIcon variant="light" onClick={onFullscreen}>
              <IconMaximize size={18} />
            </ActionIcon>
          )}
        </Group>
      </Paper>

      <div
        style={{
          position: 'relative',
          height: '100%',
          width: '100%',
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
}
