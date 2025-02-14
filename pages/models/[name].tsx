import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  IconArrowLeft,
  IconFilter,
  IconLink,
  IconRefresh,
  IconSeeding,
  IconUnlink,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Card,
  Checkbox,
  Divider,
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

interface RelatedModel {
  name: string;
  description: string;
  fields: string[];
  isDependent: boolean;
  selected: boolean;
  count: number;
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

  const [relatedModels, setRelatedModels] = useState<RelatedModel[]>([
    {
      name: 'Comment',
      description: 'Commentaires liés à ce modèle',
      fields: ['_id', 'content', 'userId', 'createdAt'],
      isDependent: true,
      selected: false,
      count: 5,
    },
    {
      name: 'Profile',
      description: 'Profil utilisateur associé',
      fields: ['_id', 'userId', 'avatar', 'bio'],
      isDependent: true,
      selected: false,
      count: 1,
    },
    {
      name: 'Post',
      description: "Publications de l'utilisateur",
      fields: ['_id', 'title', 'content', 'userId'],
      isDependent: false,
      selected: false,
      count: 3,
    },
  ]);

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
        relatedModels: relatedModels
          .filter((model) => model.selected)
          .map((model) => ({
            name: model.name,
            isDependent: model.isDependent,
            count: model.count,
          })),
      };

      console.log('Generating data with:', config);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.error('Error generating data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRelatedModel = (index: number) => {
    setRelatedModels((prev) =>
      prev.map((model, i) => (i === index ? { ...model, selected: !model.selected } : model))
    );
  };

  const updateRelatedModelCount = (index: number, newCount: number) => {
    setRelatedModels((prev) =>
      prev.map((model, i) => (i === index ? { ...model, count: newCount } : model))
    );
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

            <Divider my="sm" />

            <Title order={4}>Modèles associés</Title>
            <Text size="sm" c="dimmed">
              Sélectionnez les modèles à inclure dans la génération
            </Text>

            <Stack gap="md">
              {relatedModels.map((model, index) => (
                <Card key={index} withBorder>
                  <Group justify="space-between" align="flex-start">
                    <Stack gap="xs">
                      <Group>
                        <Checkbox
                          checked={model.selected}
                          onChange={() => toggleRelatedModel(index)}
                        />
                        <Stack gap={0}>
                          <Text fw={500}>{model.name}</Text>
                          <Text size="sm" c="dimmed">
                            {model.description}
                          </Text>
                        </Stack>
                      </Group>
                      <Text size="sm" c="dimmed" ml={30}>
                        Champs: {model.fields.join(', ')}
                      </Text>
                    </Stack>
                    <Stack gap="xs" align="flex-end">
                      {model.isDependent && model.selected && (
                        <NumberInput
                          label="Nombre"
                          value={model.count}
                          onChange={(value) => updateRelatedModelCount(index, Number(value) || 1)}
                          min={1}
                          max={100}
                          size="xs"
                          w={100}
                        />
                      )}
                      <Group>
                        {model.isDependent && (
                          <Text size="xs" c="blue">
                            Dépendant
                          </Text>
                        )}
                        {model.selected ? (
                          <IconLink size={16} style={{ opacity: 0.5 }} />
                        ) : (
                          <IconUnlink size={16} style={{ opacity: 0.5 }} />
                        )}
                      </Group>
                    </Stack>
                  </Group>
                </Card>
              ))}
            </Stack>

            {relatedModels.some((m) => m.selected) && (
              <Text size="sm" c="dimmed">
                Les données seront générées pour {name} ({count} documents) et{' '}
                {relatedModels.filter((m) => m.selected).length} modèle(s) associé(s)
                {relatedModels.filter((m) => m.selected && m.isDependent).length > 0 && (
                  <>
                    {' '}
                    avec{' '}
                    {relatedModels
                      .filter((m) => m.selected && m.isDependent)
                      .map((m) => `${m.count} ${m.name.toLowerCase()}`)
                      .join(', ')}
                  </>
                )}
              </Text>
            )}
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
