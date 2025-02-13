'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Paper, Stack, Text } from '@mantine/core';

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

    // Nettoyer le SVG existant
    d3.select(svgRef.current).selectAll('*').remove();

    const container = svgRef.current.parentElement;
    if (!container) return;

    // Utiliser les dimensions du conteneur
    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Définir les marqueurs de flèche
    const defs = svg.append('defs');
    const markers = {
      oneToOne: 'arrow-one-to-one',
      oneToMany: 'arrow-one-to-many',
      manyToOne: 'arrow-many-to-one',
      manyToMany: 'arrow-many-to-many',
    };

    Object.entries(markers).forEach(([key, id]) => {
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

    // Convertir les liens en format compatible avec d3
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

    // Créer les liens
    const link = svg
      .append('g')
      .selectAll('line')
      .data(simLinks)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 2)
      .attr('marker-end', (d) => `url(#${markers[d.type as keyof typeof markers]})`);

    // Créer les nœuds
    const nodeGroup = svg.append('g').selectAll<SVGGElement, Node>('g').data(nodes).join('g');

    // Ajouter le comportement de drag
    nodeGroup.call(
      d3
        .drag<SVGGElement, Node>()
        .on('start', (event: d3.D3DragEvent<SVGGElement, Node, Node>) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on('drag', (event: d3.D3DragEvent<SVGGElement, Node, Node>) => {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on('end', (event: d3.D3DragEvent<SVGGElement, Node, Node>) => {
          if (!event.active) simulation.alphaTarget(0);
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

    // Mettre à jour les positions
    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as Node).x!)
        .attr('y1', (d) => (d.source as Node).y!)
        .attr('x2', (d) => (d.target as Node).x!)
        .attr('y2', (d) => (d.target as Node).y!);

      nodeGroup.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    // Nettoyage
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
      <svg
        ref={svgRef}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'visible',
        }}
      />
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
