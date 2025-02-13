'use client';

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { Box, LoadingOverlay } from '@mantine/core';

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

// Fonction utilitaire pour nettoyer les types
const cleanType = (type: string): string => {
  // Convertir les types complexes en types simples pour Mermaid
  const typeMap: { [key: string]: string } = {
    String: 'string',
    Number: 'number',
    Boolean: 'boolean',
    Date: 'date',
    ObjectId: 'string',
    Array: 'array',
    Object: 'object',
  };

  // Nettoyer le type en enlevant les caractères spéciaux et parenthèses
  const cleanedType = type
    .replace(/\(.*?\)/g, '') // Enlever tout ce qui est entre parenthèses
    .replace(/[^a-zA-Z0-9_]/g, '_') // Remplacer les caractères spéciaux par des underscores
    .toLowerCase();

  return typeMap[type] || typeMap[cleanedType] || 'string';
};

// Fonction utilitaire pour nettoyer les noms
const cleanName = (name: string): string => {
  return name.replace(/[^a-zA-Z0-9_]/g, '_').toLowerCase();
};

export function MermaidGraph({ nodes, links }: MermaidGraphProps) {
  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!graphRef.current) {
      console.error("Le conteneur du graphe n'est pas disponible");
      return;
    }

    try {
      // Générer le code Mermaid
      let mermaidCode = 'erDiagram\n';

      // Vérifier la validité des données
      if (!Array.isArray(nodes) || !Array.isArray(links)) {
        throw new Error('Les données des nœuds ou des liens sont invalides');
      }

      // Ajouter les entités et leurs attributs
      nodes.forEach((node) => {
        if (!node.id || !node.name || !node.type) {
          console.warn('Nœud invalide détecté:', node);
          return;
        }

        const entityName = cleanName(`${node.type}_${node.id}`);
        mermaidCode += `    ${entityName} {\n`;

        if (node.fields && node.fields.length > 0) {
          node.fields.forEach((field) => {
            if (!field.name || !field.type) {
              console.warn('Champ invalide détecté:', field);
              return;
            }

            const fieldType = cleanType(field.type);
            const fieldName = cleanName(field.name);
            mermaidCode += `        ${fieldType} ${fieldName}${field.required ? ' PK' : ''}\n`;
          });
        } else {
          // Ajouter un champ par défaut si aucun champ n'est défini
          mermaidCode += `        string name\n`;
        }

        mermaidCode += `    }\n`;
      });

      // Ajouter les relations avec une meilleure gestion des erreurs
      links.forEach((link) => {
        const sourceNode = nodes.find((n) => n.id === link.source);
        const targetNode = nodes.find((n) => n.id === link.target);

        if (!sourceNode || !targetNode) {
          console.warn('Relation invalide détectée:', link);
          return;
        }

        const sourceName = cleanName(`${sourceNode.type}_${sourceNode.id}`);
        const targetName = cleanName(`${targetNode.type}_${targetNode.id}`);

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
      });

      // Nettoyer et préparer le conteneur
      const container = graphRef.current;
      container.innerHTML = `<pre class="mermaid bg-white flex justify-center">${mermaidCode}</pre>`;
    } catch (error: unknown) {
      console.error('Erreur lors de la génération du diagramme:', error);

      // Afficher un message d'erreur convivial
      if (graphRef.current) {
        graphRef.current.innerHTML = `
          <div style="padding: 1rem; color: #c92a2a; background: #fff5f5; border: 1px solid #ffc9c9; border-radius: 4px;">
            <h3>Erreur de génération du diagramme</h3>
            <p>Une erreur inattendue est survenue lors de la génération du diagramme.</p>
            <p style="margin-top: 0.5rem; color: #666;">${error instanceof Error ? error.message : 'Erreur inconnue'}</p>
          </div>
        `;
      }
    }
  }, [nodes, links]);

  return (
    <Box
      ref={graphRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        position: 'relative',
        overflow: 'auto',
        padding: '1rem',
      }}
    >
      <LoadingOverlay visible={!graphRef.current} overlayProps={{ blur: 2 }} />
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
