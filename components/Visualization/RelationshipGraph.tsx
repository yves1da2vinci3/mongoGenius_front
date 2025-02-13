'use client';

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Paper } from '@mantine/core';

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
  scale?: number;
}

interface TooltipState {
  visible: boolean;
  content: React.ReactNode;
  x: number;
  y: number;
}

export function RelationshipGraph({ nodes, links, scale = 1 }: RelationshipGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    content: null,
    x: 0,
    y: 0,
  });

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

    // Créer le SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height]);

    // Ajouter le groupe principal
    const g = svg.append('g');

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
            <div>
              <div style={{ fontWeight: 500 }}>{d.name}</div>
              <div style={{ color: 'gray', fontSize: '0.9em' }}>Type: {d.type}</div>
              {d.fields && d.fields.length > 0 && (
                <>
                  <div style={{ fontWeight: 500, marginTop: '0.5em' }}>Champs:</div>
                  {d.fields.map((field) => (
                    <div key={field.name} style={{ fontSize: '0.9em' }}>
                      {field.name}: {field.type}
                      {field.required && ' (requis)'}
                    </div>
                  ))}
                </>
              )}
            </div>
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

    // Appliquer l'échelle
    g.attr('transform', `scale(${scale})`);

    return () => {
      simulation.stop();
    };
  }, [nodes, links, scale]);

  const getNodeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      collection: '#4C6EF5',
      model: '#40C057',
      field: '#FA5252',
    };
    return colors[type] || '#868E96';
  };

  return (
    <>
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
    </>
  );
}
