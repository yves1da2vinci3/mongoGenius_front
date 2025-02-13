import { useState } from 'react';
import { IconChevronLeft, IconChevronRight, IconRefresh, IconSettings } from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Group,
  LoadingOverlay,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';

interface CollectionTableProps {
  collectionName: string;
  fields: { name: string; type: string }[];
  documents: any[];
  totalDocuments: number;
  currentPage: number;
  perPage: number;
  loading: boolean;
  onRefresh: () => void;
  onSearch: (query: string) => void;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
}

export function CollectionTable({
  collectionName,
  fields,
  documents,
  totalDocuments,
  currentPage,
  perPage,
  loading,
  onRefresh,
  onSearch,
  onPageChange,
  onPerPageChange,
}: CollectionTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const totalPages = Math.ceil(totalDocuments / perPage);

  return (
    <Paper p="md" pos="relative">
      <LoadingOverlay visible={loading} />

      <Stack gap="md">
        <Group justify="space-between">
          <Title order={3}>Collection: {collectionName}</Title>
          <Group>
            <TextInput
              placeholder='{ "field": "value" }'
              value={searchQuery}
              onChange={(event) => handleSearch(event.currentTarget.value)}
            />
            <Button variant="light" leftSection={<IconRefresh size={16} />} onClick={onRefresh}>
              Actualiser
            </Button>
            <Button variant="light" leftSection={<IconSettings size={16} />}>
              Options
            </Button>
          </Group>
        </Group>

        <Group justify="space-between">
          <Group>
            <Select
              value={String(perPage)}
              onChange={(value) => value && onPerPageChange(parseInt(value, 10))}
              data={[
                { value: '10', label: '10 par page' },
                { value: '20', label: '20 par page' },
                { value: '50', label: '50 par page' },
                { value: '100', label: '100 par page' },
              ]}
              style={{ width: 130 }}
            />
            <Text size="sm" c="dimmed">
              Total: {totalDocuments} documents
            </Text>
          </Group>

          <Group>
            <Tooltip label="Page précédente">
              <ActionIcon
                variant="light"
                disabled={currentPage === 1}
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              >
                <IconChevronLeft size={16} />
              </ActionIcon>
            </Tooltip>
            <Text size="sm">
              Page {currentPage} sur {totalPages}
            </Text>
            <Tooltip label="Page suivante">
              <ActionIcon
                variant="light"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              >
                <IconChevronRight size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>

        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              {fields.map((field) => (
                <Table.Th key={field.name}>
                  {field.name} ({field.type})
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {documents.length === 0 ? (
              <Table.Tr>
                <Table.Td colSpan={fields.length} align="center">
                  {loading ? 'Chargement...' : 'Aucun document trouvé'}
                </Table.Td>
              </Table.Tr>
            ) : (
              documents.map((doc, index) => (
                <Table.Tr key={index}>
                  {fields.map((field) => (
                    <Table.Td key={field.name}>{formatValue(doc[field.name], field.type)}</Table.Td>
                  ))}
                </Table.Tr>
              ))
            )}
          </Table.Tbody>
        </Table>
      </Stack>
    </Paper>
  );
}

function formatValue(value: any, type: string): string {
  if (value === null || value === undefined) {
    return '';
  }

  switch (type.toLowerCase()) {
    case 'array':
      return JSON.stringify(value);
    case 'object':
      return JSON.stringify(value);
    case 'date':
      return new Date(value).toLocaleString();
    case 'boolean':
      return value ? 'Oui' : 'Non';
    default:
      return String(value);
  }
}
