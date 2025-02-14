import { Grid, Group, Paper, RingProgress, Stack, Text, Title } from '@mantine/core';
import AppShell from '../components/Layout/AppShell';

export default function StatsPage() {
  return (
    <AppShell>
      <Stack gap="lg">
        <Title order={2}>Statistiques</Title>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Paper p="md" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">
                  Projets créés
                </Text>
                <RingProgress
                  size={80}
                  roundCaps
                  thickness={8}
                  sections={[{ value: 65, color: 'brand.6' }]}
                  label={
                    <Text ta="center" size="lg" fw={700}>
                      65%
                    </Text>
                  }
                />
              </Group>
              <Text size="xl" fw={700}>
                24
              </Text>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Paper p="md" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">
                  Collections
                </Text>
                <RingProgress
                  size={80}
                  roundCaps
                  thickness={8}
                  sections={[{ value: 40, color: 'brand.6' }]}
                  label={
                    <Text ta="center" size="lg" fw={700}>
                      40%
                    </Text>
                  }
                />
              </Group>
              <Text size="xl" fw={700}>
                156
              </Text>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Paper p="md" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">
                  Documents générés
                </Text>
                <RingProgress
                  size={80}
                  roundCaps
                  thickness={8}
                  sections={[{ value: 85, color: 'brand.6' }]}
                  label={
                    <Text ta="center" size="lg" fw={700}>
                      85%
                    </Text>
                  }
                />
              </Group>
              <Text size="xl" fw={700}>
                1,204
              </Text>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6, lg: 3 }}>
            <Paper p="md" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Text size="sm" c="dimmed">
                  Espace utilisé
                </Text>
                <RingProgress
                  size={80}
                  roundCaps
                  thickness={8}
                  sections={[{ value: 25, color: 'brand.6' }]}
                  label={
                    <Text ta="center" size="lg" fw={700}>
                      25%
                    </Text>
                  }
                />
              </Group>
              <Text size="xl" fw={700}>
                2.5 GB
              </Text>
            </Paper>
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={12}>
            <Paper p="md" radius="md" withBorder>
              <Title order={3} mb="md">
                Activité récente
              </Title>
              <Text c="dimmed">Aucune activité récente à afficher</Text>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </AppShell>
  );
}
