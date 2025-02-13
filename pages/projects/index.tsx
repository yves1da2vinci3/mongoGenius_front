import { useRouter } from 'next/router';
import { IconPlus } from '@tabler/icons-react';
import { Button, Grid, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { AppShell } from '../../components/Layout/AppShell';
import { ProjectCard } from '../../components/Projects/ProjectCard';
import { useProjectStore } from '../../store/useProjectStore';

export default function ProjectsPage() {
  const router = useRouter();
  const projects = useProjectStore((state) => state.projects);

  return (
    <AppShell>
      <Stack gap="xl">
        <Group justify="space-between">
          <Title order={2}>Mes Projets</Title>
          <Button
            leftSection={<IconPlus size={16} />}
            onClick={() => router.push('/projects/create')}
          >
            Nouveau Projet
          </Button>
        </Group>

        {projects.length === 0 ? (
          <Paper withBorder p="xl" radius="md">
            <Stack align="center" gap="md">
              <Text size="lg" fw={500}>
                Aucun projet
              </Text>
              <Text c="dimmed" ta="center" maw={400}>
                Vous n'avez pas encore créé de projet. Commencez par créer un nouveau projet pour
                générer des données.
              </Text>
              <Button
                variant="light"
                leftSection={<IconPlus size={16} />}
                onClick={() => router.push('/projects/create')}
              >
                Créer mon premier projet
              </Button>
            </Stack>
          </Paper>
        ) : (
          <Grid>
            {projects.map((project) => (
              <Grid.Col key={project.id} span={{ base: 12, sm: 6, lg: 4 }}>
                <ProjectCard
                  id={project.id}
                  title={project.title}
                  description={project.description}
                  documentsCount={project.documentsCount}
                  successRate={project.successRate}
                  status={project.status}
                />
              </Grid.Col>
            ))}
          </Grid>
        )}
      </Stack>
    </AppShell>
  );
}
