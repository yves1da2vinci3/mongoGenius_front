import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  IconArrowLeft,
  IconDatabase,
  IconFilter,
  IconPlayerPlay,
  IconRefresh,
  IconSeeding,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Card,
  Group,
  JsonInput,
  LoadingOverlay,
  Paper,
  SegmentedControl,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import AppShell from '../../components/Layout/AppShell';

interface Document {
  _id: string;
  [key: string]: any;
}

export default function ModelDetailPage() {
  const router = useRouter();
  const { name } = router.query;
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'documents' | 'schema'>('documents');
  const [filterQuery, setFilterQuery] = useState('{}');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  // Données de test (à remplacer par les vraies données de l'API)
  const MOCK_SCHEMA = {
    name: { type: 'String', required: true },
    email: { type: 'String', required: true, unique: true },
    age: { type: 'Number', min: 0 },
    posts: [{ type: 'ObjectId', ref: 'Post' }],
    comments: [{ type: 'ObjectId', ref: 'Comment' }],
  };

  const MOCK_DOCUMENTS: Document[] = [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      posts: ['post1', 'post2'],
      comments: ['comment1'],
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 25,
      posts: ['post3'],
      comments: ['comment2', 'comment3'],
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleFilter = () => {
    console.log('Filtering with:', JSON.parse(filterQuery));
  };

  const handleGenerateData = () => {
    router.push(`/collections/${name}/seed?filter=${encodeURIComponent(filterQuery)}`);
  };

  const handleGenerateRelatedData = () => {
    const schema = MOCK_SCHEMA;
    const relations = Object.entries(schema)
      .filter(([_, value]) => Array.isArray(value) && value[0].ref)
      .map(([key, value]) => ({
        collection: Array.isArray(value) ? value[0].ref : '',
        sourceField: key,
      }));

    router.push({
      pathname: `/collections/${name}/seed`,
      query: {
        filter: filterQuery,
        relations: JSON.stringify(relations),
      },
    });
  };

  return (
    <AppShell>
      <Stack gap="xl">
        <Group justify="space-between">
          <Group>
            <ActionIcon variant="default" onClick={() => router.push('/models')} size="lg">
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Title order={2}>Modèle: {name}</Title>
          </Group>

          <Group>
            <Button
              variant="light"
              onClick={() => router.push(`/models/${name}/seed`)}
              leftSection={<IconSeeding size={16} />}
            >
              Générer des données
            </Button>
            <ActionIcon variant="default" onClick={handleRefresh} size="lg">
              <IconRefresh size={20} />
            </ActionIcon>
          </Group>
        </Group>

        <Card withBorder>
          <Stack gap="md">
            <Group justify="apart">
              <SegmentedControl
                value={view}
                onChange={(value) => setView(value as 'documents' | 'schema')}
                data={[
                  { label: 'Documents', value: 'documents' },
                  { label: 'Schéma', value: 'schema' },
                ]}
              />
            </Group>

            <JsonInput
              label="Filtre MongoDB"
              placeholder='{ "field": "value" }'
              value={filterQuery}
              onChange={setFilterQuery}
              minRows={2}
              formatOnBlur
              validationError="JSON invalide"
            />

            <Group>
              <Button
                leftSection={<IconFilter size={16} />}
                onClick={handleFilter}
                style={{ flex: 1 }}
              >
                Appliquer le filtre
              </Button>
              <Button
                variant="light"
                onClick={handleGenerateRelatedData}
                leftSection={<IconDatabase size={16} />}
              >
                Inclure les relations
              </Button>
            </Group>
          </Stack>
        </Card>

        <Paper pos="relative" withBorder p="md">
          <LoadingOverlay visible={loading} />
          {view === 'documents' ? (
            <Stack gap="md">
              <Group justify="apart">
                <Text fw={500}>Documents ({MOCK_DOCUMENTS.length})</Text>
                {selectedDocuments.length > 0 && (
                  <Text size="sm">{selectedDocuments.length} document(s) sélectionné(s)</Text>
                )}
              </Group>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    {Object.keys(MOCK_DOCUMENTS[0] || {}).map((key) => (
                      <Table.Th key={key}>{key}</Table.Th>
                    ))}
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {MOCK_DOCUMENTS.map((doc) => (
                    <Table.Tr
                      key={doc._id}
                      style={{ cursor: 'pointer' }}
                      onClick={() =>
                        setSelectedDocuments((prev) =>
                          prev.includes(doc._id)
                            ? prev.filter((id) => id !== doc._id)
                            : [...prev, doc._id]
                        )
                      }
                      bg={
                        selectedDocuments.includes(doc._id)
                          ? 'var(--mantine-color-blue-light)'
                          : undefined
                      }
                    >
                      {Object.entries(doc).map(([key, value]) => (
                        <Table.Td key={key}>
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </Table.Td>
                      ))}
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>
          ) : (
            <Stack gap="md">
              <Text fw={500}>Structure du modèle</Text>
              {Object.entries(MOCK_SCHEMA).map(([field, schema]) => (
                <Card key={field} withBorder>
                  <Group justify="apart">
                    <Stack gap={0}>
                      <Text fw={500}>{field}</Text>
                      <Text size="sm" c="dimmed">
                        {Array.isArray(schema)
                          ? `[${schema[0].type}] (ref: ${schema[0].ref})`
                          : `${schema.type}${
                              'required' in schema && schema.required ? ' (required)' : ''
                            }${'unique' in schema && schema.unique ? ' (unique)' : ''}`}
                      </Text>
                    </Stack>
                    {'ref' in schema && schema.ref && (
                      <Button
                        variant="light"
                        size="xs"
                        onClick={() => router.push(`/models/${schema.ref}`)}
                      >
                        Voir {schema.ref}
                      </Button>
                    )}
                  </Group>
                </Card>
              ))}
            </Stack>
          )}
        </Paper>

        {selectedDocuments.length > 0 && (
          <Button
            size="lg"
            leftSection={<IconPlayerPlay size={20} />}
            onClick={() =>
              router.push(`/models/${name}/seed?documents=${selectedDocuments.join(',')}`)
            }
          >
            Générer à partir de la sélection ({selectedDocuments.length})
          </Button>
        )}
      </Stack>
    </AppShell>
  );
}
