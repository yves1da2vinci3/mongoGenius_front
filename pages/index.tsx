import { IconPlus } from '@tabler/icons-react';
import { Button, Grid, Group, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AppShell } from '../components/Layout/AppShell';
import { CreateProjectModal } from '../components/Projects/CreateProjectModal';
import { ProjectCard } from '../components/Projects/ProjectCard';
import { useProjectStore } from '../store/useProjectStore';

export default function HomePage() {
  const [opened, { open, close }] = useDisclosure(false);
  const projects = useProjectStore((state) => state.projects);

  return (
    <AppShell>
      <Group justify="space-between" mb="xl">
        <Title order={2}>Mes Projets</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={open}>
          Nouveau Projet
        </Button>
      </Group>

      <Grid>
        {projects.map((project) => (
          <Grid.Col key={project.id} span={4}>
            <ProjectCard
              title={project.title}
              description={project.description}
              documentsCount={project.documentsCount}
              successRate={project.successRate}
              status={project.status}
            />
          </Grid.Col>
        ))}
      </Grid>

      <CreateProjectModal opened={opened} onClose={close} />
    </AppShell>
  );
}
