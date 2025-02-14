import { useRouter } from 'next/router';
import {
  IconBrandDiscord,
  IconBrandGithub,
  IconCheck,
  IconDatabase,
  IconRocket,
} from '@tabler/icons-react';
import {
  Button,
  Container,
  Grid,
  Group,
  List,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import AppShell from '../components/Layout/AppShell';

function HomePage() {
  const router = useRouter();

  const features = [
    'Détection automatique des modèles Mongoose',
    'Gestion intelligente des relations',
    'Génération de données réalistes',
    'Validation des contraintes',
    'Support multi-bases de données',
    'Visualisation des relations',
  ];

  return (
    <AppShell>
      <Container size="lg">
        <Stack gap="xl">
          <Grid gutter="xl" align="center">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Stack gap="lg">
                <Title order={1} size={48}>
                  Générez des données{' '}
                  <Text span variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>
                    intelligentes
                  </Text>{' '}
                  pour MongoDB
                </Title>

                <Text size="xl" c="dimmed">
                  MongoGenius simplifie la génération de données de test pour vos applications
                  MongoDB
                </Text>

                <Group>
                  <Button size="lg" onClick={() => router.push('/projects/create')}>
                    Commencer gratuitement
                  </Button>
                  <Button
                    size="lg"
                    variant="default"
                    leftSection={<IconBrandGithub size={20} />}
                    component="a"
                    href="https://github.com/votre-username/MongoGenius"
                    target="_blank"
                  >
                    Code source
                  </Button>
                </Group>

                <Group gap="xs" wrap="nowrap">
                  <ThemeIcon size="lg" radius="xl" color="blue" variant="light">
                    <IconRocket size={20} />
                  </ThemeIcon>
                  <Text size="sm" c="dimmed">
                    Déjà plus de 1000+ développeurs utilisent MongoGenius
                  </Text>
                </Group>
              </Stack>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 5 }}>
              <Paper withBorder p="xl" radius="md" shadow="md">
                <Stack gap="lg">
                  <Title order={3}>Fonctionnalités principales</Title>

                  <List
                    spacing="sm"
                    size="sm"
                    center
                    icon={
                      <ThemeIcon color="blue" size={24} radius="xl">
                        <IconCheck size={14} />
                      </ThemeIcon>
                    }
                  >
                    {features.map((feature) => (
                      <List.Item key={feature}>{feature}</List.Item>
                    ))}
                  </List>

                  <Button
                    variant="light"
                    fullWidth
                    leftSection={<IconDatabase size={20} />}
                    onClick={() => router.push('/projects')}
                  >
                    Voir les projets
                  </Button>
                </Stack>
              </Paper>
            </Grid.Col>
          </Grid>

          <Paper withBorder p="xl" radius="md" mt="xl">
            <Grid>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="md">
                  <Title order={3}>Rejoignez notre communauté</Title>
                  <Text c="dimmed">
                    Échangez avec d'autres développeurs, partagez vos retours et restez informé des
                    dernières mises à jour.
                  </Text>
                  <Button
                    variant="light"
                    leftSection={<IconBrandDiscord size={20} />}
                    component="a"
                    href="https://discord.gg/votre-serveur"
                    target="_blank"
                  >
                    Rejoindre le Discord
                  </Button>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="md">
                  <Title order={3}>Contribuez au projet</Title>
                  <Text c="dimmed">
                    MongoGenius est open source. Vous pouvez contribuer au projet en proposant des
                    améliorations ou en signalant des bugs.
                  </Text>
                  <Button
                    variant="light"
                    leftSection={<IconBrandGithub size={20} />}
                    component="a"
                    href="https://github.com/votre-username/MongoGenius"
                    target="_blank"
                  >
                    Voir sur GitHub
                  </Button>
                </Stack>
              </Grid.Col>
            </Grid>
          </Paper>
        </Stack>
      </Container>
    </AppShell>
  );
}

export default HomePage;
