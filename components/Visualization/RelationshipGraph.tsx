import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface Node {
  id: string;
  name: string;
  type: string;
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

export function RelationshipGraph({ nodes, links }: RelationshipGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

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
      .attr('stroke-width', 1);

    const node = svg.append('g').selectAll('g').data(nodes).join('g');

    node
      .append('circle')
      .attr('r', 20)
      .attr('fill', (d) => getNodeColor(d.type));

    node
      .append('text')
      .text((d) => d.name)
      .attr('x', 0)
      .attr('y', 30)
      .attr('text-anchor', 'middle');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag behavior
    node.call(
      d3.drag<SVGGElement, Node>().on('start', dragstarted).on('drag', dragged).on('end', dragended)
    );

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

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

  return <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />;
}
