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

    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      er: {
        diagramPadding: 20,
        layoutDirection: 'TB',
        minEntityWidth: 100,
        minEntityHeight: 75,
        entityPadding: 15,
        stroke: 'gray',
        fill: 'white',
        fontSize: 12,
      },
    });

    const generateERDiagram = (models: Model[]) => {
      let diagram = 'erDiagram\n';

      // Définir les entités avec leurs attributs
      models.forEach((model) => {
        diagram += `    ${model.name} {\n`;
        model.fields.forEach((field) => {
          diagram += `        ${field.type} ${field.name}${field.required ? ' "required"' : ''}\n`;
        });
        diagram += '    }\n';
      });

      // Définir les relations
      models.forEach((model) => {
        model.relations.forEach((relation) => {
          const relationSymbol = getRelationshipSymbol(relation.type);
          diagram += `    ${relation.from} ${relationSymbol} ${relation.to} : ""\n`;
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

    try {
      const diagram = generateERDiagram(models);
      mermaid.render('er-diagram', diagram).then((result) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = result.svg;
        }
      });
    } catch (error) {
      console.error('Erreur lors de la génération du diagramme ER:', error);
      if (containerRef.current) {
        containerRef.current.innerHTML = '<div>Erreur lors de la génération du diagramme</div>';
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
      }}
    />
  );
}
