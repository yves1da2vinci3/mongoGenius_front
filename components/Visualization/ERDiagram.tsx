'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Box, LoadingOverlay } from '@mantine/core';

interface Field {
  name: string;
  type: string;
  required?: boolean;
}

interface Node {
  id: string;
  name: string;
  type: string;
  fields?: Field[];
}

interface Link {
  source: string;
  target: string;
  type: 'oneToOne' | 'oneToMany' | 'manyToOne' | 'manyToMany' | string;
}

interface ERDiagramProps {
  nodes: Node[];
  links: Link[];
}

export function ERDiagram({ nodes, links }: ERDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);

      if (!containerRef.current) {
        return;
      }

      let code = 'erDiagram\n';

      nodes.forEach((node) => {
        const entityName = node.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
        code += `    ${entityName} {\n`;

        if (node.fields && node.fields.length > 0) {
          node.fields.forEach((field) => {
            const fieldType = field.type.toLowerCase().replace(/[^a-z0-9]/g, '_');
            const fieldName = field.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
            code += `        ${fieldType} ${fieldName}${field.required ? ' PK' : ''}\n`;
          });
        } else {
          code += '        string id PK\n';
        }

        code += '    }\n';
      });

      links.forEach((link) => {
        const sourceNode = nodes.find((n) => n.id === link.source);
        const targetNode = nodes.find((n) => n.id === link.target);

        if (sourceNode && targetNode) {
          const sourceName = sourceNode.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
          const targetName = targetNode.name.toLowerCase().replace(/[^a-z0-9]/g, '_');

          let relationSymbol = '';
          switch (link.type) {
            case 'oneToOne':
              relationSymbol = '||--||';
              break;
            case 'oneToMany':
              relationSymbol = '||--o{';
              break;
            case 'manyToOne':
              relationSymbol = '}o--||';
              break;
            case 'manyToMany':
              relationSymbol = '}o--o{';
              break;
            default:
              relationSymbol = '--';
          }

          code += `    ${sourceName} ${relationSymbol} ${targetName} : "relation"\n`;
        }
      });

      containerRef.current.innerHTML = `<pre class="mermaid bg-white flex justify-center">${code}</pre>`;
      setIsLoading(false);
    } catch (err) {
      console.error('Erreur lors de la génération du diagramme ER:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      setIsLoading(false);
    }
  }, [nodes, links]);

  if (error) {
    return (
      <Box
        style={{
          padding: '1rem',
          color: '#c92a2a',
          background: '#fff5f5',
          border: '1px solid #ffc9c9',
          borderRadius: '4px',
        }}
      >
        <h3>Erreur de génération du diagramme</h3>
        <p>Une erreur est survenue lors de la génération du diagramme ER.</p>
        <pre style={{ marginTop: '0.5rem', color: '#666' }}>{error}</pre>
      </Box>
    );
  }

  return (
    <Box
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        position: 'relative',
        overflow: 'auto',
        padding: '1rem',
        backgroundColor: 'white',
      }}
    >
      <LoadingOverlay visible={isLoading} />
      <Script
        type="module"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
            mermaid.initialize({ 
              startOnLoad: true,
              theme: 'default',
              er: {
                diagramPadding: 20,
                entityPadding: 15,
                useMaxWidth: true,
                layoutDirection: 'TB',
                minEntityWidth: 100,
                minEntityHeight: 75,
                fontSize: 12,
              },
              securityLevel: 'loose',
            });
            mermaid.contentLoaded();
          `,
        }}
      />
    </Box>
  );
}
