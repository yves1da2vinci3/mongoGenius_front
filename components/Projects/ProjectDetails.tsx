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
import { ERDiagram } from '../Visualization/ERDiagram';
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
  const [fullscreenContent, setFullscreenContent] = useState<'er' | 'graph' | null>(null);
  const [fullscreenOpened, { open: openFullscreen, close: closeFullscreen }] = useDisclosure(false);
  const [key, setKey] = useState(0); // Pour forcer le rendu des composants

  // Force le rendu des composants lors du changement d'onglet
  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [activeTab]);

  // Force le rendu lors de l'ouverture du mode plein écran
  useEffect(() => {
    if (fullscreenOpened) {
      setKey((prev) => prev + 1);
    }
  }, [fullscreenOpened]);

  const mockNodes = [
    { id: '1', name: 'User', type: 'collection' },
    { id: '2', name: 'Post', type: 'collection' },
    { id: '3', name: 'Comment', type: 'collection' },
  ];

  const mockLinks = [
    { source: '1', target: '2', type: 'oneToMany' },
    { source: '2', target: '3', type: 'oneToMany' },
  ];

  const mockModels = [
    {
      name: 'User',
      fields: [
        { name: 'id', type: 'ObjectId', required: true },
        { name: 'email', type: 'String', required: true },
        { name: 'name', type: 'String', required: true },
      ],
      relations: [{ from: 'User', to: 'Post', type: 'oneToMany' }],
    },
    {
      name: 'Post',
      fields: [
        { name: 'id', type: 'ObjectId', required: true },
        { name: 'title', type: 'String', required: true },
        { name: 'content', type: 'String', required: true },
        { name: 'authorId', type: 'ObjectId', required: true },
      ],
      relations: [{ from: 'Post', to: 'Comment', type: 'oneToMany' }],
    },
  ];

  const handleFullscreen = (type: 'er' | 'graph') => {
    setFullscreenContent(type);
    openFullscreen();
  };

  const toggleFullscreenContent = () => {
    setFullscreenContent((current) => {
      const newContent = current === 'er' ? 'graph' : 'er';
      // Force le rendu après le changement
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
          <Paper p="md" withBorder h={500} pos="relative">
            <ActionIcon
              variant="light"
              size="lg"
              pos="absolute"
              top={10}
              right={10}
              onClick={() => handleFullscreen('er')}
              style={{ zIndex: 10 }}
            >
              <IconMaximize size={20} />
            </ActionIcon>
            <div key={`er-${key}`} style={{ height: '100%' }}>
              <ERDiagram models={mockModels} />
            </div>
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
              <RelationshipGraph nodes={mockNodes} links={mockLinks} />
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
                {fullscreenContent === 'er' ? 'Diagramme ER' : 'Graphe des relations'}
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
            {fullscreenContent === 'er' ? (
              <ERDiagram models={mockModels} />
            ) : (
              <RelationshipGraph nodes={mockNodes} links={mockLinks} />
            )}
          </div>
        </div>
      </Modal>
    </Stack>
  );
}
