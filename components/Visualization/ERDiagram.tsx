'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface ERDiagramProps {
  nodes: {
    id: string;
    name: string;
    type: string;
    fields?: { name: string; type: string; required?: boolean }[];
  }[];
  links: {
    source: string;
    target: string;
    type: string;
  }[];
}

export function ERDiagram({ nodes, links }: ERDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const generateDiagram = async () => {
      try {
        // Configuration de Mermaid
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

        // Génération du code Mermaid
        let mermaidCode = 'erDiagram\n';

        // Ajout des entités et leurs attributs
        nodes.forEach((node) => {
          const entityName = node.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
          mermaidCode += `    ${entityName} {\n`;

          if (node.fields && node.fields.length > 0) {
            node.fields.forEach((field) => {
              const fieldType = field.type.toLowerCase().replace(/[^a-z0-9]/g, '_');
              mermaidCode += `        ${fieldType} ${field.name}${field.required ? ' PK' : ''}\n`;
            });
          } else {
            mermaidCode += '        string id PK\n';
          }

          mermaidCode += '    }\n';
        });

        // Ajout des relations
        links.forEach((link) => {
          const sourceName =
            nodes
              .find((n) => n.id === link.source)
              ?.name.toLowerCase()
              .replace(/[^a-z0-9]/g, '_') || '';
          const targetName =
            nodes
              .find((n) => n.id === link.target)
              ?.name.toLowerCase()
              .replace(/[^a-z0-9]/g, '_') || '';

          if (sourceName && targetName) {
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
            mermaidCode += `    ${sourceName} ${relationSymbol} ${targetName} : "relation"\n`;
          }
        });

        // Nettoyer le conteneur
        if (containerRef.current) {
          containerRef.current.innerHTML = `<pre class="mermaid">${mermaidCode}</pre>`;

          // Rendre le diagramme
          await mermaid.run();
        }
      } catch (error) {
        console.error('Erreur lors de la génération du diagramme ER:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `
            <div style="padding: 1rem; color: #c92a2a; background: #fff5f5; border: 1px solid #ffc9c9; border-radius: 4px;">
              <h3>Erreur de génération du diagramme</h3>
              <p>Une erreur est survenue lors de la génération du diagramme ER.</p>
              <pre style="margin-top: 0.5rem; color: #666;">${
                error instanceof Error ? error.message : 'Erreur inconnue'
              }</pre>
            </div>
          `;
        }
      }
    };

    generateDiagram();
  }, [nodes, links]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '1rem',
      }}
    />
  );
}
