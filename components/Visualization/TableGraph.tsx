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
    <Stack spacing="xl" p="md">
      {/* Tables */}
      {nodes.map((node) => (
        <Paper key={node.id} shadow="sm" p="md">
          <Title order={3} mb="md">
            {node.name} ({node.type})
          </Title>
          <Table>
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
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      ))}

      {/* Relations */}
      <Paper shadow="sm" p="md">
        <Title order={3} mb="md">
          Relations
        </Title>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Source</Table.Th>
              <Table.Th>Type</Table.Th>
              <Table.Th>Destination</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {links.map((link, index) => {
              const sourceNode = nodes.find((n) => n.id === link.source);
              const targetNode = nodes.find((n) => n.id === link.target);
              return (
                <Table.Tr key={index}>
                  <Table.Td>{sourceNode?.name || link.source}</Table.Td>
                  <Table.Td>{link.type}</Table.Td>
                  <Table.Td>{targetNode?.name || link.target}</Table.Td>
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
}
