'use client';

import { useEffect, useRef, useState } from 'react';
import { IconArrowsMaximize, IconHome, IconZoomIn, IconZoomOut } from '@tabler/icons-react';
import * as d3 from 'd3';
import { ActionIcon, Group, Paper, SegmentedControl, Stack, Text } from '@mantine/core';
import { MermaidGraph } from './MermaidGraph';
import { TableGraph } from './TableGraph';

interface Node extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  type: string;
  fields?: { name: string; type: string; required?: boolean }[];
}

interface Link {
  source: string;
  target: string;
  type: string;
}

interface SimLink extends d3.SimulationLinkDatum<Node> {
  type: string;
}

interface RelationshipGraphProps {
  nodes: Node[];
  links: Link[];
}

interface TooltipState {
  visible: boolean;
  content: React.ReactNode;
  x: number;
  y: number;
}

type DisplayMode = 'force' | 'mermaid' | 'table';

export function RelationshipGraph({ nodes, links }: RelationshipGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [displayMode, setDisplayMode] = useState<DisplayMode>('force');
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    content: null,
    x: 0,
    y: 0,
  });

  const handleZoomIn = () => {
    if (!svgRef.current) {
      return;
    }
    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom<SVGSVGElement, unknown>();
    const transition = svg.transition().duration(300) as unknown as d3.Selection<
      SVGSVGElement,
      unknown,
      null,
      undefined
    >;
    zoom.scaleBy(transition as any, 1.2);
  };

  const handleZoomOut = () => {
    if (!svgRef.current) {
      return;
    }
    const svg = d3.select(svgRef.current);
    const zoom = d3.zoom<SVGSVGElement, unknown>();
    const transition = svg.transition().duration(300) as unknown as d3.Selection<
      SVGSVGElement,
      unknown,
      null,
      undefined
    >;
    zoom.scaleBy(transition as any, 0.8);
  };

  const handleResetZoom = () => {
    if (!svgRef.current) {
      return;
    }
    const svg = d3.select(svgRef.current);
    const container = svgRef.current.parentElement;
    if (!container) {
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;
    const zoom = d3.zoom<SVGSVGElement, unknown>();
    const transition = svg.transition().duration(300) as unknown as d3.Selection<
      SVGSVGElement,
      unknown,
      null,
      undefined
    >;
    zoom.transform(transition as any, d3.zoomIdentity.translate(width / 2, height / 2).scale(1));
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    if (!svgRef.current || !nodes.length) {
      return;
    }

    // Nettoyer le SVG existant
    d3.select(svgRef.current).selectAll('*').remove();

    const container = svgRef.current.parentElement;
    if (!container) {
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Créer le SVG avec support du zoom
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Ajouter le groupe principal pour le zoom
    const g = svg.append('g');

    // Configurer le zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    // Définir les marqueurs de flèche
    const defs = svg.append('defs');
    const markers = {
      oneToOne: 'arrow-one-to-one',
      oneToMany: 'arrow-one-to-many',
      manyToOne: 'arrow-many-to-one',
      manyToMany: 'arrow-many-to-many',
    };

    Object.entries(markers).forEach(([_, id]) => {
      defs
        .append('marker')
        .attr('id', id)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 25)
        .attr('refY', 0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('fill', '#999')
        .attr('d', 'M0,-5L10,0L0,5');
    });

    // Convertir les liens
    const simLinks: SimLink[] = links.map((l) => ({
      source: nodes.find((n) => n.id === l.source)!,
      target: nodes.find((n) => n.id === l.target)!,
      type: l.type,
    }));

    // Créer la simulation
    const simulation = d3
      .forceSimulation<Node>(nodes)
      .force(
        'link',
        d3
          .forceLink<Node, SimLink>(simLinks)
          .id((d) => d.id)
          .distance(150)
      )
      .force('charge', d3.forceManyBody().strength(-800))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(60));

    // Créer les liens avec des courbes
    const link = g
      .append('g')
      .selectAll('path')
      .data(simLinks)
      .join('path')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('marker-end', (d) => `url(#${markers[d.type as keyof typeof markers]})`);

    // Créer les nœuds
    const nodeGroup = g.append('g').selectAll<SVGGElement, Node>('g').data(nodes).join('g');

    // Ajouter le comportement de drag
    nodeGroup.call(
      d3
        .drag<SVGGElement, Node>()
        .on('start', (event) => {
          if (!event.active) {
            simulation.alphaTarget(0.3).restart();
          }
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on('drag', (event) => {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on('end', (event) => {
          if (!event.active) {
            simulation.alphaTarget(0);
          }
          event.subject.fx = null;
          event.subject.fy = null;
        })
    );

    // Ajouter les cercles pour les nœuds
    nodeGroup
      .append('circle')
      .attr('r', 30)
      .attr('fill', (d) => getNodeColor(d.type))
      .on('mouseover', (event, d: Node) => {
        const [x, y] = d3.pointer(event, document.body);
        setTooltip({
          visible: true,
          content: (
            <Stack gap="xs">
              <Text fw={500}>{d.name}</Text>
              <Text size="sm" c="dimmed">
                Type: {d.type}
              </Text>
              {d.fields && d.fields.length > 0 && (
                <>
                  <Text size="sm" fw={500}>
                    Champs:
                  </Text>
                  {d.fields.map((field) => (
                    <Text key={field.name} size="sm">
                      {field.name}: {field.type}
                      {field.required && ' (requis)'}
                    </Text>
                  ))}
                </>
              )}
            </Stack>
          ),
          x,
          y,
        });
      })
      .on('mouseout', () => {
        setTooltip((prev) => ({ ...prev, visible: false }));
      });

    // Ajouter les labels pour les nœuds
    nodeGroup
      .append('text')
      .text((d) => d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', 45)
      .attr('fill', '#333')
      .attr('font-size', '12px');

    // Mettre à jour les positions avec des liens courbes
    simulation.on('tick', () => {
      link.attr('d', (d) => {
        const dx = (d.target as Node).x! - (d.source as Node).x!;
        const dy = (d.target as Node).y! - (d.source as Node).y!;
        const dr = Math.sqrt(dx * dx + dy * dy);
        return `M${(d.source as Node).x},${(d.source as Node).y}A${dr},${dr} 0 0,1 ${
          (d.target as Node).x
        },${(d.target as Node).y}`;
      });

      nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [nodes, links]);

  const getNodeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      collection: '#4C6EF5',
      model: '#40C057',
      field: '#FA5252',
    };
    return colors[type] || '#868E96';
  };

  const renderContent = () => {
    switch (displayMode) {
      case 'force':
        return (
          <svg
            ref={svgRef}
            style={{
              width: '100%',
              height: '100%',
              overflow: 'visible',
            }}
          />
        );
      case 'mermaid':
        return <MermaidGraph nodes={nodes} links={links} />;
      case 'table':
        return <TableGraph nodes={nodes} links={links} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        ...(isFullscreen && {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          background: 'white',
        }),
      }}
    >
      <Group
        style={{
          position: 'absolute',
          top: 10,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1001,
        }}
      >
        <SegmentedControl
          value={displayMode}
          onChange={(value) => setDisplayMode(value as DisplayMode)}
          data={[
            { label: 'Graphe', value: 'force' },
            { label: 'Diagramme ER', value: 'mermaid' },
            { label: 'Tables', value: 'table' },
          ]}
        />
      </Group>

      <Group
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          zIndex: 1001,
        }}
      >
        {displayMode === 'force' && (
          <>
            <ActionIcon onClick={handleZoomIn} variant="filled" color="blue">
              <IconZoomIn size={18} />
            </ActionIcon>
            <ActionIcon onClick={handleZoomOut} variant="filled" color="blue">
              <IconZoomOut size={18} />
            </ActionIcon>
            <ActionIcon onClick={handleResetZoom} variant="filled" color="blue">
              <IconHome size={18} />
            </ActionIcon>
          </>
        )}
        <ActionIcon onClick={toggleFullscreen} variant="filled" color="blue">
          <IconArrowsMaximize size={18} />
        </ActionIcon>
      </Group>

      {renderContent()}

      {tooltip.visible && displayMode === 'force' && (
        <Paper
          shadow="md"
          p="sm"
          style={{
            position: 'fixed',
            top: tooltip.y + 10,
            left: tooltip.x + 10,
            zIndex: 1000,
            pointerEvents: 'none',
            maxWidth: '300px',
          }}
        >
          {tooltip.content}
        </Paper>
      )}
    </div>
  );
}
