'use client';

import { useEffect, useState } from 'react';
import { Box, LoadingOverlay } from '@mantine/core';

// Déclaration de type pour window.mermaid
declare global {
  interface Window {
    mermaid: any;
  }
}

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
  const [isLoading, setIsLoading] = useState(true);
  const [mermaidCode, setMermaidCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Générer le code Mermaid quand les nodes ou links changent
  useEffect(() => {
    try {
      setIsLoading(true);
      setError(null);

      // Générer le code Mermaid
      let code = 'erDiagram\n';

      // Ajouter les entités et leurs attributs
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

      // Ajouter les relations
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

      setMermaidCode(code);
    } catch (err) {
      console.error('Erreur lors de la génération du diagramme ER:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
    } finally {
      setIsLoading(false);
    }
  }, [nodes, links]);

  // Initialiser et mettre à jour Mermaid quand le code change
  useEffect(() => {
    const initMermaid = async () => {
      try {
        if (!mermaidCode) {
          return;
        }

        // Charger Mermaid dynamiquement
        if (typeof window.mermaid === 'undefined') {
          const mermaid = (await import('mermaid')).default;
          window.mermaid = mermaid;
        }

        // Initialiser Mermaid avec les options
        window.mermaid.initialize({
          startOnLoad: false,
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

        // Nettoyer les anciens diagrammes et rendre le nouveau
        const elements = document.getElementsByClassName('mermaid');
        if (elements.length > 0) {
          await window.mermaid.run({
            nodes: {
              useMaxWidth: true,
            },
          });
        }
      } catch (err) {
        console.error("Erreur lors de l'initialisation de Mermaid:", err);
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      }
    };

    initMermaid();
  }, [mermaidCode]);

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
      <pre className="mermaid bg-white flex justify-center">{mermaidCode}</pre>
    </Box>
  );
}
