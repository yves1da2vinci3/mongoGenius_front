import { useEffect, useState } from 'react';
import {
  IconChartBar,
  IconDatabase,
  IconMaximize,
  IconMaximizeOff,
  IconSettings,
  IconSwitch2,
} from '@tabler/icons-react';
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
import { RelationshipGraph } from '../Visualization/RelationshipGraph';

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
  const [activeTab, setActiveTab] = useState<string>('models');
  const [fullscreenContent, setFullscreenContent] = useState<'models' | 'graph' | null>(null);
  const [fullscreenOpened, { open: openFullscreen, close: closeFullscreen }] = useDisclosure(false);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [activeTab]);

  useEffect(() => {
    if (fullscreenOpened) {
      setKey((prev) => prev + 1);
    }
  }, [fullscreenOpened]);

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

  const handleFullscreen = (type: 'models' | 'graph') => {
    setFullscreenContent(type);
    openFullscreen();
  };

  const handleViewDocuments = (modelName: string) => {
    console.log('View documents for', modelName);
  };

  const handleExportJSON = (modelName: string) => {
    console.log('Export JSON for', modelName);
  };

  const handleExportCSV = (modelName: string) => {
    console.log('Export CSV for', modelName);
  };

  const toggleFullscreenContent = () => {
    setFullscreenContent((current) => {
      const newContent = current === 'models' ? 'graph' : 'models';
      setTimeout(() => setKey((prev) => prev + 1), 0);
      return newContent;
    });
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
              <Group justify="space-between">
                <Title order={3}>Modèles de données</Title>
                <ActionIcon variant="light" size="lg" onClick={() => handleFullscreen('models')}>
                  <IconMaximize size={20} />
                </ActionIcon>
              </Group>
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
            <ActionIcon
              variant="light"
              size="lg"
              pos="absolute"
              top={10}
              right={10}
              onClick={() => handleFullscreen('graph')}
              style={{ zIndex: 10 }}
            >
              <IconMaximize size={20} />
            </ActionIcon>
            <div key={`graph-${key}`} style={{ height: '100%' }}>
              <RelationshipGraph {...graphData} />
            </div>
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
          },
          body: {
            padding: 0,
          },
        }}
        title={
          <Group justify="space-between" style={{ width: '100%' }}>
            <Group>
              <Title order={3}>
                {fullscreenContent === 'models' ? 'Modèles de données' : 'Graphe des relations'}
              </Title>
            </Group>
            <Group>
              <Button
                variant="light"
                leftSection={<IconSwitch2 size={20} />}
                onClick={toggleFullscreenContent}
              >
                Basculer l'affichage
              </Button>
              <ActionIcon variant="light" onClick={closeFullscreen}>
                <IconMaximizeOff size={20} />
              </ActionIcon>
            </Group>
          </Group>
        }
      >
        <div style={{ height: 'calc(100vh - 60px)', padding: theme.spacing.md }}>
          <div key={`fullscreen-${key}`} style={{ height: '100%' }}>
            {fullscreenContent === 'models' ? (
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
            ) : (
              <RelationshipGraph {...graphData} />
            )}
          </div>
        </div>
      </Modal>
    </Stack>
  );
}
