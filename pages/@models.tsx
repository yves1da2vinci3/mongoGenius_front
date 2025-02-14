import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IconArrowLeft, IconRefresh, IconSeeding } from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import AppShell from '../components/Layout/AppShell';

interface Model {
  name: string;
  fields: string[];
  documentCount: number;
  lastGenerated?: string;
}

export default function ModelsPage() {
  const router = useRouter();
  const { projectId } = router.query;

  useEffect(() => {
    if (router.isReady) {
      if (!projectId) {
        router.push('/projects');
        return;
      }

      if (typeof projectId === 'string') {
        setLoading(true);
        // Simuler le chargement des données
        setTimeout(() => setLoading(false), 1000);
      }
    }
  }, [projectId, router, router.isReady]);

  const [loading, setLoading] = useState(false);

  // Données fictives des modèles
  const MOCK_MODELS: Model[] = [
    {
      name: 'User',
      fields: ['_id', 'email', 'name', 'age', 'createdAt'],
      documentCount: 1000,
      lastGenerated: '2024-02-14T15:30:00',
    },
    {
      name: 'Product',
      fields: ['_id', 'name', 'price', 'category', 'stock'],
      documentCount: 500,
      lastGenerated: '2024-02-14T14:00:00',
    },
    {
      name: 'Order',
      fields: ['_id', 'userId', 'products', 'total', 'status'],
      documentCount: 2000,
      lastGenerated: '2024-02-14T16:45:00',
    },
    {
      name: 'Category',
      fields: ['_id', 'name', 'description', 'parentId'],
      documentCount: 50,
    },
  ];

  const handleRefresh = () => {
    if (!projectId) {
      return;
    }
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  if (!projectId) {
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
            <Title order={2}>Modèles disponibles</Title>
          </Group>

          <Group>
            <ActionIcon variant="default" onClick={handleRefresh} size="lg" loading={loading}>
              <IconRefresh size={20} />
            </ActionIcon>
          </Group>
        </Group>

        <Paper pos="relative" withBorder p="md">
          <LoadingOverlay visible={loading} />
          <Stack gap="md">
            <Text size="sm" c="dimmed">
              Sélectionnez un modèle pour générer des données
            </Text>

            <Table highlightOnHover>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Nom du modèle</Table.Th>
                  <Table.Th>Champs</Table.Th>
                  <Table.Th>Documents existants</Table.Th>
                  <Table.Th>Dernière génération</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {MOCK_MODELS.map((model) => (
                  <Table.Tr key={model.name}>
                    <Table.Td>
                      <Text fw={500}>{model.name}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {model.fields.join(', ')}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm">{model.documentCount.toLocaleString()}</Text>
                    </Table.Td>
                    <Table.Td>
                      {model.lastGenerated ? (
                        <Text size="sm">
                          {new Date(model.lastGenerated).toLocaleString('fr-FR')}
                        </Text>
                      ) : (
                        <Text size="sm" c="dimmed">
                          Jamais
                        </Text>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <Button
                        variant="light"
                        leftSection={<IconSeeding size={16} />}
                        onClick={() =>
                          router.push({
                            pathname: `/models/${model.name.toLowerCase()}`,
                            query: { projectId },
                          })
                        }
                      >
                        Générer
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Stack>
        </Paper>
      </Stack>
    </AppShell>
  );
}
