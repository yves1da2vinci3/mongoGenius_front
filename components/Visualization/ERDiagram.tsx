'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface Model {
  name: string;
  fields: {
    name: string;
    type: string;
    required?: boolean;
  }[];
  relations: {
    from: string;
    to: string;
    type: string;
  }[];
}

interface ERDiagramProps {
  models: Model[];
}

export function ERDiagram({ models }: ERDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Configuration de Mermaid avec un thème personnalisé
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      er: {
        diagramPadding: 20,
        layoutDirection: 'TB',
        minEntityWidth: 150,
        minEntityHeight: 75,
        entityPadding: 15,
        stroke: 'gray',
        fill: 'white',
        fontSize: 12,
        useMaxWidth: true,
      },
      themeVariables: {
        erprimaryColor: '#4C6EF5',
        ersecondaryColor: '#40C057',
        tertiaryColor: '#FA5252',
        mainBkg: '#FFFFFF',
        textColor: '#333333',
        lineColor: '#666666',
      },
    });

    const generateERDiagram = (models: Model[]) => {
      let diagram = 'erDiagram\n\n';

      // Définir les entités avec leurs attributs
      models.forEach((model) => {
        diagram += `    ${model.name} {\n`;

        // Trier les champs : d'abord les champs requis, puis les optionnels
        const sortedFields = [...model.fields].sort((a, b) => {
          if (a.required === b.required) return a.name.localeCompare(b.name);
          return a.required ? -1 : 1;
        });

        sortedFields.forEach((field) => {
          // Formater le type et les contraintes
          let typeWithConstraints = field.type;
          const constraints = [];

          // Ajouter les marqueurs PK/FK
          if (field.name === 'id') {
            constraints.push('PK');
          }
          if (field.name.endsWith('Id')) {
            constraints.push('FK');
          }
          if (field.required) {
            constraints.push('NOT_NULL');
          }

          // Si il y a des contraintes, les ajouter entre parenthèses
          if (constraints.length > 0) {
            typeWithConstraints += ` (${constraints.join(',')})`;
          }

          // Ajouter l'attribut avec le type et les contraintes
          diagram += `        ${typeWithConstraints} ${field.name}\n`;
        });
        diagram += '    }\n\n';
      });

      // Définir les relations
      models.forEach((model) => {
        model.relations.forEach((relation) => {
          const relationSymbol = getRelationshipSymbol(relation.type);
          const relationLabel = getRelationshipLabel(relation.type);
          diagram += `    ${relation.from} ${relationSymbol} ${relation.to} : "${relationLabel}"\n`;
        });
      });

      return diagram;
    };

    const getRelationshipSymbol = (type: string) => {
      switch (type) {
        case 'oneToOne':
          return '||--||';
        case 'oneToMany':
          return '||--o{';
        case 'manyToOne':
          return '}o--||';
        case 'manyToMany':
          return '}o--o{';
        default:
          return '||--||';
      }
    };

    const getRelationshipLabel = (type: string) => {
      switch (type) {
        case 'oneToOne':
          return 'has one';
        case 'oneToMany':
          return 'has many';
        case 'manyToOne':
          return 'belongs to';
        case 'manyToMany':
          return 'has and belongs to many';
        default:
          return '';
      }
    };

    try {
      const diagram = generateERDiagram(models);
      console.log('Generated diagram:', diagram); // Pour le débogage

      // Nettoyer le conteneur avant de rendre le nouveau diagramme
      containerRef.current.innerHTML = '';

      mermaid.render('er-diagram', diagram).then((result) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = result.svg;

          // Ajouter des styles CSS pour améliorer l'apparence
          const style = document.createElement('style');
          style.textContent = `
            #er-diagram {
              width: 100%;
              height: 100%;
            }
            .entityBox {
              fill: #ffffff;
              stroke: #4C6EF5;
              stroke-width: 2px;
            }
            .relationshipLine {
              stroke: #666666;
              stroke-width: 2px;
            }
            .entityLabel {
              font-weight: bold;
              font-size: 14px;
            }
            .attributeLabel {
              font-size: 12px;
            }
            .relationshipLabel {
              font-size: 12px;
              fill: #666666;
            }
          `;
          containerRef.current.appendChild(style);
        }
      });
    } catch (error) {
      console.error('Erreur lors de la génération du diagramme ER:', error);
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <div style="color: red; padding: 20px; text-align: center;">
            Erreur lors de la génération du diagramme
          </div>
        `;
      }
    }
  }, [models]);

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
        background: '#FFFFFF',
        padding: '20px',
      }}
    />
  );
}
