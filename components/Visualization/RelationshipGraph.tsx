import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Paper, Stack, Text } from '@mantine/core';

interface Node {
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

export function RelationshipGraph({ nodes, links }: RelationshipGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    content: null,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;

    const width = 800;
    const height = 600;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current).attr('width', width).attr('height', height);

    const simulation = d3
      .forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(100)
      )
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = svg
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1)
      .attr('marker-end', (d) => `url(#arrow-${d.type})`);

    // Ajout des marqueurs de flèche pour les relations
    svg
      .append('defs')
      .selectAll('marker')
      .data(['oneToOne', 'oneToMany', 'manyToOne', 'manyToMany'])
      .join('marker')
      .attr('id', (d) => `arrow-${d}`)
      .attr('viewBox', '0 -5 10 10')
      .attr('refX', 30)
      .attr('refY', 0)
      .attr('markerWidth', 6)
      .attr('markerHeight', 6)
      .attr('orient', 'auto')
      .append('path')
      .attr('fill', '#999')
      .attr('d', 'M0,-5L10,0L0,5');

    const node = svg.append('g').selectAll('g').data(nodes).join('g');

    node
      .append('circle')
      .attr('r', 20)
      .attr('fill', (d) => getNodeColor(d.type))
      .on('mouseover', (event, d: Node) => {
        const [x, y] = d3.pointer(event);
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
          x: event.pageX,
          y: event.pageY,
        });
      })
      .on('mouseout', () => {
        setTooltip((prev) => ({ ...prev, visible: false }));
      });

    node
      .append('text')
      .text((d) => d.name)
      .attr('x', 0)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('fill', '#333')
      .attr('font-size', '12px');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag behavior
    const drag = d3
      .drag<SVGGElement, Node>()
      .on('start', (event: any) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      })
      .on('drag', (event: any) => {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      })
      .on('end', (event: any) => {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      });

    node.call(drag as any);

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

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
      {tooltip.visible && (
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
