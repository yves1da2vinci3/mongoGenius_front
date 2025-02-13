import { useState } from 'react';
import { useRouter } from 'next/router';
import { IconChartBar, IconDatabase, IconMaximizeOff, IconSettings } from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Grid,
  Group,
  Modal,
  Paper,
  Stack,
  Tabs,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ModelCard } from '../Models/ModelCard';
import { GraphView } from '../Visualization/GraphView';

interface ProjectDetailsProps {
  project: {
    id: string;
    title: string;
    description: string;
    documentsCount: number;
    successRate: number;
    status: 'active' | 'inactive';
  };
}

export function ProjectDetails({ project }: ProjectDetailsProps) {
  const theme = useMantineTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('models');
  const [fullscreenOpened, { open: openFullscreen, close: closeFullscreen }] = useDisclosure(false);

  const mockModels = [
    {
      name: 'User',
      fields: [
        { name: 'id', type: 'ObjectId', required: true },
        { name: 'email', type: 'String', required: true },
        { name: 'name', type: 'String', required: true },
        { name: 'password', type: 'String', required: true },
        { name: 'role', type: 'String' },
      ],
      relations: [
        { from: 'posts', to: 'Post' },
        { from: 'comments', to: 'Comment' },
      ],
    },
    {
      name: 'Post',
      fields: [
        { name: 'id', type: 'ObjectId', required: true },
        { name: 'title', type: 'String', required: true },
        { name: 'content', type: 'String', required: true },
        { name: 'authorId', type: 'ObjectId', required: true },
        { name: 'createdAt', type: 'Date', required: true },
      ],
      relations: [
        { from: 'author', to: 'User' },
        { from: 'comments', to: 'Comment' },
      ],
    },
    {
      name: 'Comment',
      fields: [
        { name: 'id', type: 'ObjectId', required: true },
        { name: 'content', type: 'String', required: true },
        { name: 'authorId', type: 'ObjectId', required: true },
        { name: 'postId', type: 'ObjectId', required: true },
        { name: 'createdAt', type: 'Date', required: true },
      ],
      relations: [
        { from: 'author', to: 'User' },
        { from: 'post', to: 'Post' },
      ],
    },
  ];

  // Convertir les modèles en format compatible avec le graphe
  const graphData = {
    nodes: mockModels.map((model) => ({
      id: model.name,
      name: model.name,
      type: 'collection',
      fields: model.fields,
    })),
    links: mockModels.flatMap((model) =>
      model.relations.map((relation) => ({
        source: model.name,
        target: relation.to,
        type: 'oneToMany',
      }))
    ),
  };

  const handleViewDocuments = (modelName: string) => {
    router.push(`/models?collection=${modelName}`);
  };

  const handleExportJSON = (modelName: string) => {
    console.log('Export JSON for', modelName);
  };

  const handleExportCSV = (modelName: string) => {
    console.log('Export CSV for', modelName);
  };

  return (
    <Stack gap="xl">
      <Group justify="space-between">
        <div>
          <Title order={2}>{project.title}</Title>
          <Text c="dimmed" size="sm">
            {project.description}
          </Text>
        </div>
        <Button>Exécuter la génération</Button>
      </Group>

      <Paper p="md" radius="md" withBorder>
        <Group grow>
          <div>
            <Text size="lg" fw={500}>
              Documents générés
            </Text>
            <Text size="xl" fw={700}>
              {project.documentsCount}
            </Text>
          </div>
          <div>
            <Text size="lg" fw={500}>
              Taux de succès
            </Text>
            <Text size="xl" fw={700} c={project.successRate === 100 ? 'green' : 'blue'}>
              {project.successRate}%
            </Text>
          </div>
        </Group>
      </Paper>

      <Tabs value={activeTab} onChange={(value) => setActiveTab(value as string)}>
        <Tabs.List>
          <Tabs.Tab value="models" leftSection={<IconDatabase size={14} />}>
            Modèles
          </Tabs.Tab>
          <Tabs.Tab value="relations" leftSection={<IconChartBar size={14} />}>
            Relations
          </Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={14} />}>
            Paramètres
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="models" pt="xl">
          <Paper p="md" withBorder>
            <Stack gap="md">
              <Grid>
                {mockModels.map((model) => (
                  <Grid.Col key={model.name} span={{ base: 12, md: 6, lg: 4 }}>
                    <ModelCard
                      name={model.name}
                      fields={model.fields}
                      relations={model.relations}
                      onViewDocuments={() => handleViewDocuments(model.name)}
                      onExportJSON={() => handleExportJSON(model.name)}
                      onExportCSV={() => handleExportCSV(model.name)}
                    />
                  </Grid.Col>
                ))}
              </Grid>
            </Stack>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="relations" pt="xl">
          <Paper p="md" withBorder h={500} pos="relative">
            <GraphView {...graphData} onFullscreen={openFullscreen} />
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="settings" pt="xl">
          <Paper p="md" withBorder>
            <Text>Paramètres du projet à implémenter...</Text>
          </Paper>
        </Tabs.Panel>
      </Tabs>

      <Modal
        opened={fullscreenOpened}
        onClose={closeFullscreen}
        size="100%"
        fullScreen
        styles={{
          content: {
            backgroundColor: theme.colors.gray[0],
          },
          header: {
            backgroundColor: theme.white,
            borderBottom: `1px solid ${theme.colors.gray[2]}`,
            padding: theme.spacing.md,
            marginBottom: 0,
          },
          body: {
            padding: 0,
          },
          inner: {
            padding: 0,
          },
        }}
        title={
          <Group justify="space-between" style={{ width: '100%' }}>
            <Title order={3}>Graphe des relations</Title>
            <ActionIcon variant="light" onClick={closeFullscreen}>
              <IconMaximizeOff size={20} />
            </ActionIcon>
          </Group>
        }
      >
        <div style={{ height: 'calc(100vh - 60px)' }}>
          <GraphView {...graphData} isFullscreen />
        </div>
      </Modal>
    </Stack>
  );
}
