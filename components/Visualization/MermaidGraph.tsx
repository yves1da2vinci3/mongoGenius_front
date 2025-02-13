'use client ';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Box } from '@mantine/core';

interface MermaidGraphProps {
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

export function MermaidGraph({ nodes, links }: MermaidGraphProps) {
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!graphRef.current) {
      return;
    }

    // Configuration de Mermaid
    mermaid.initialize({
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

    // Générer le code Mermaid
    let mermaidCode = 'erDiagram\n';

    // Ajouter les entités et leurs attributs
    nodes.forEach((node) => {
      const entityName = `${node.type}_${node.id}`;
      mermaidCode += `    ${entityName} {\n`;

      if (node.fields && node.fields.length > 0) {
        node.fields.forEach((field) => {
          const fieldType = field.type.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
          const fieldName = field.name.replace(/[^a-zA-Z0-9_]/g, '_');
          mermaidCode += `        ${fieldType} ${fieldName}${field.required ? ' PK' : ''}\n`;
        });
      } else {
        // Ajouter un champ par défaut si aucun champ n'est défini
        mermaidCode += `        string name\n`;
      }

      mermaidCode += `    }\n`;
    });

    // Ajouter les relations
    links.forEach((link) => {
      const sourceNode = nodes.find((n) => n.id === link.source);
      const targetNode = nodes.find((n) => n.id === link.target);

      if (sourceNode && targetNode) {
        const sourceName = `${sourceNode.type}_${sourceNode.id}`;
        const targetName = `${targetNode.type}_${targetNode.id}`;

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

        mermaidCode += `    ${sourceName} ${relationSymbol} ${targetName} : "${sourceNode.name} -> ${targetNode.name}"\n`;
      }
    });

    // Nettoyer et préparer le conteneur
    const container = graphRef.current;
    container.innerHTML = `<pre class="mermaid">${mermaidCode}</pre>`;

    // Rendre le diagramme
    try {
      mermaid
        .run({
          nodes: [container],
        })
        .catch((error) => {
          console.error('Erreur lors du rendu Mermaid:', error);
          console.log('Code Mermaid généré:', mermaidCode);

          // Afficher le code brut en cas d'erreur
          container.innerHTML = `<pre style="white-space: pre-wrap; word-break: break-all;">${mermaidCode}</pre>`;
        });
    } catch (error) {
      console.error('Erreur lors du rendu Mermaid:', error);
      console.log('Code Mermaid généré:', mermaidCode);

      // Afficher le code brut en cas d'erreur
      container.innerHTML = `<pre style="white-space: pre-wrap; word-break: break-all;">${mermaidCode}</pre>`;
    }
  }, [nodes, links]);

  return (
    <Box
      ref={graphRef}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
        padding: '1rem',
      }}
    />
  );
}
