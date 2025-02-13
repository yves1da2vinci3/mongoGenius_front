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
      },
    });

    const diagram = generateERDiagram(models);

    mermaid.render('er-diagram', diagram).then((result) => {
      if (containerRef.current) {
        containerRef.current.innerHTML = result.svg;
      }
    });
  }, [models]);

  const generateERDiagram = (models: Model[]) => {
    let diagram = 'erDiagram\n';

    models.forEach((model) => {
      // Add entity definition
      diagram += `    ${model.name} {\n`;
      model.fields.forEach((field) => {
        const required = field.required ? ' required' : '';
        diagram += `        ${field.type} ${field.name}${required}\n`;
      });
      diagram += '    }\n';

      // Add relationships
      model.relations.forEach((relation) => {
        const relationshipType = getRelationshipType(relation.type);
        diagram += `    ${relation.from} ${relationshipType} ${relation.to}\n`;
      });
    });

    return diagram;
  };

  const getRelationshipType = (type: string) => {
    const types: { [key: string]: string } = {
      oneToOne: '||--||',
      oneToMany: '||--o{',
      manyToOne: '}o--||',
      manyToMany: '}o--o{',
    };
    return types[type] || '||--||';
  };

  return <div ref={containerRef} style={{ width: '100%', height: '100%', overflow: 'auto' }} />;
}
