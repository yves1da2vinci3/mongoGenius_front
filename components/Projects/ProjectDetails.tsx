import { useState } from 'react';
import { IconChartBar, IconDatabase, IconMaximize, IconSettings } from '@tabler/icons-react';
import { ActionIcon, Button, Group, Modal, Paper, Stack, Tabs, Text, Title } from '@mantine/core';
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
  const [fullscreenOpened, { open: openFullscreen, close: closeFullscreen }] = useDisclosure(false);
  const [activeTab, setActiveTab] = useState<string>('models');
  const [fullscreenContent, setFullscreenContent] = useState<React.ReactNode | null>(null);

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

  const handleFullscreen = (content: React.ReactNode) => {
    setFullscreenContent(content);
    openFullscreen();
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
              onClick={() => handleFullscreen(<ERDiagram models={mockModels} />)}
            >
              <IconMaximize size={20} />
            </ActionIcon>
            <ERDiagram models={mockModels} />
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
              onClick={() =>
                handleFullscreen(<RelationshipGraph nodes={mockNodes} links={mockLinks} />)
              }
            >
              <IconMaximize size={20} />
            </ActionIcon>
            <RelationshipGraph nodes={mockNodes} links={mockLinks} />
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
        transitionProps={{ transition: 'fade', duration: 200 }}
      >
        <div style={{ height: 'calc(100vh - 80px)' }}>{fullscreenContent}</div>
      </Modal>
    </Stack>
  );
}
