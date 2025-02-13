import { Paper, Stack, Table, Title } from '@mantine/core';

interface TableGraphProps {
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

export function TableGraph({ nodes, links }: TableGraphProps) {
  return (
    <Stack gap="xl" p="md" style={{ height: '100%', overflow: 'auto' }}>
      {nodes.map((node) => {
        // Trouver toutes les relations pour ce nœud
        const nodeRelations = links
          .filter((link) => link.source === node.id || link.target === node.id)
          .map((link) => {
            const isSource = link.source === node.id;
            const relatedNode = nodes.find((n) => n.id === (isSource ? link.target : link.source));
            return {
              from: isSource ? node.name : relatedNode?.name || '',
              to: isSource ? relatedNode?.name || '' : node.name,
              type: link.type,
            };
          });

        return (
          <Paper key={node.id} shadow="sm" p="md" withBorder>
            <Title order={3} mb="md">
              {node.name}
            </Title>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Champ</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Requis</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {node.fields?.map((field) => (
                  <Table.Tr key={field.name}>
                    <Table.Td>{field.name}</Table.Td>
                    <Table.Td>{field.type}</Table.Td>
                    <Table.Td>{field.required ? 'Oui' : 'Non'}</Table.Td>
                  </Table.Tr>
                )) || (
                  <Table.Tr>
                    <Table.Td colSpan={3} align="center">
                      Aucun champ défini
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>

            {nodeRelations.length > 0 && (
              <>
                <Title order={4} mt="xl" mb="md">
                  Relations
                </Title>
                <Table striped highlightOnHover withTableBorder withColumnBorders>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>De</Table.Th>
                      <Table.Th>Vers</Table.Th>
                      <Table.Th>Type</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {nodeRelations.map((relation, index) => (
                      <Table.Tr key={index}>
                        <Table.Td>{relation.from}</Table.Td>
                        <Table.Td>{relation.to}</Table.Td>
                        <Table.Td>{relation.type}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </>
            )}
          </Paper>
        );
      })}
    </Stack>
  );
}
