import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IconArrowLeft, IconFilter, IconRefresh, IconSeeding } from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Card,
  Group,
  JsonInput,
  LoadingOverlay,
  NumberInput,
  Paper,
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

export default function ModelGenerationPage() {
  const router = useRouter();
  const { name, projectId } = router.query;

  useEffect(() => {
    if (router.isReady) {
      if (!projectId) {
        router.push('/projects');
        return;
      }

      if (typeof projectId === 'string') {
        setLoading(true);
        // Ici, vous chargeriez les données du modèle depuis l'API
        setTimeout(() => setLoading(false), 1000);
      }
    }
  }, [projectId, router, router.isReady]);

  const [loading, setLoading] = useState(false);
  const [filterQuery, setFilterQuery] = useState('{}');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [count, setCount] = useState(10);

  // Données de test pour le modèle sélectionné
  const MOCK_DOCUMENTS: Document[] = [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      createdAt: '2024-02-14T10:00:00',
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 25,
      createdAt: '2024-02-14T11:30:00',
    },
    {
      _id: '3',
      name: 'Bob Wilson',
      email: 'bob@example.com',
      age: 45,
      createdAt: '2024-02-14T12:15:00',
    },
  ];

  const handleRefresh = () => {
    if (!projectId) {
      return;
    }
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleFilter = () => {
    try {
      const filter = JSON.parse(filterQuery);
      setLoading(true);
      // Ici, vous implémenteriez l'appel API pour filtrer les documents
      console.log('Filtering with:', filter);
      setTimeout(() => setLoading(false), 1000);
    } catch (error) {
      console.error('Invalid JSON filter:', error);
    }
  };

  const handleGenerate = async () => {
    if (!projectId || !name) {
      return;
    }

    setLoading(true);
    try {
      const config = {
        filter: filterQuery,
        selectedDocuments,
        count,
        modelName: name,
        projectId,
      };

      // Ici, vous implémenteriez l'appel API pour générer les données
      console.log('Generating data with:', config);

      // Simuler un délai
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Rediriger vers la page du projet
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.error('Error generating data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!projectId || !name) {
    return null;
  }

  return (
    <AppShell>
      <Stack gap="xl">
        <Group justify="space-between">
          <Group>
            <ActionIcon
              variant="default"
              onClick={() => router.push(`/projects/${projectId}`)}
              size="lg"
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Title order={2}>
              Générer des données pour{' '}
              {typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1) : ''}
            </Title>
          </Group>

          <Group>
            <ActionIcon variant="default" onClick={handleRefresh} size="lg" loading={loading}>
              <IconRefresh size={20} />
            </ActionIcon>
          </Group>
        </Group>

        <Card withBorder>
          <Stack gap="md">
            <Title order={3}>Configuration de la génération</Title>

            <NumberInput
              label="Nombre de documents à générer"
              description="Combien de documents souhaitez-vous générer ?"
              value={count}
              onChange={(value) => setCount(Number(value) || 10)}
              min={1}
              max={1000}
            />

            <JsonInput
              label="Filtre MongoDB"
              placeholder='{ "field": "value" }'
              value={filterQuery}
              onChange={setFilterQuery}
              minRows={3}
              formatOnBlur
              validationError="JSON invalide"
            />

            <Button
              leftSection={<IconFilter size={16} />}
              onClick={handleFilter}
              style={{ alignSelf: 'flex-start' }}
            >
              Appliquer le filtre
            </Button>
          </Stack>
        </Card>

        <Paper pos="relative" withBorder p="md">
          <LoadingOverlay visible={loading} />
          <Stack gap="md">
            <Group justify="apart">
              <Text fw={500}>Documents de référence ({MOCK_DOCUMENTS.length})</Text>
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
        </Paper>

        <Button
          size="lg"
          leftSection={<IconSeeding size={20} />}
          onClick={handleGenerate}
          loading={loading}
        >
          Lancer la génération
        </Button>
      </Stack>
    </AppShell>
  );
}
