import { IconChartBar, IconDatabase, IconSettings } from '@tabler/icons-react';
import { Button, Group, Paper, Stack, Tabs, Text, Title } from '@mantine/core';
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

      <Tabs defaultValue="models">
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
          <Paper p="md" withBorder h={500}>
            <ERDiagram models={mockModels} />
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="relations" pt="xl">
          <Paper p="md" withBorder h={500}>
            <RelationshipGraph nodes={mockNodes} links={mockLinks} />
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="settings" pt="xl">
          <Paper p="md" withBorder>
            <Text>Paramètres du projet à implémenter...</Text>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
