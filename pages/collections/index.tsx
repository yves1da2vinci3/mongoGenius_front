import { useState } from 'react';
import { useRouter } from 'next/router';
import { IconArrowLeft, IconDatabase, IconFilter, IconSeeding } from '@tabler/icons-react';
import { Button, Card, Grid, Group, Input, Select, Stack, Text, Title } from '@mantine/core';
import AppShell from '../../components/Layout/AppShell';

interface Collection {
  name: string;
  documentCount: number;
  relationships: string[];
}

// Données de test (à remplacer par les vraies données de l'API)
const MOCK_COLLECTIONS: Collection[] = [
  {
    name: 'users',
    documentCount: 1000,
    relationships: ['posts', 'comments'],
  },
  {
    name: 'posts',
    documentCount: 500,
    relationships: ['users', 'comments'],
  },
  {
    name: 'comments',
    documentCount: 2000,
    relationships: ['users', 'posts'],
  },
];

export default function CollectionsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRelation, setSelectedRelation] = useState<string | null>(null);

  const allRelationships = Array.from(
    new Set(MOCK_COLLECTIONS.flatMap((col) => col.relationships))
  );

  const filteredCollections = MOCK_COLLECTIONS.filter((collection) => {
    const matchesSearch = collection.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRelation = selectedRelation
      ? collection.relationships.includes(selectedRelation)
      : true;
    return matchesSearch && matchesRelation;
  });

  return (
    <AppShell>
      <Stack gap="xl">
        <Group justify="space-between">
          <Group>
            <Button
              variant="default"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => router.push('/models')}
            >
              Retour aux modèles
            </Button>
            <Title order={2}>Collections MongoDB</Title>
          </Group>

          <Button
            variant="light"
            onClick={() => router.push('/models')}
            leftSection={<IconDatabase size={16} />}
          >
            Voir les documents
          </Button>
        </Group>

        <Card withBorder p="md">
          <Group gap="md">
            <Input
              placeholder="Rechercher une collection..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.currentTarget.value)}
              style={{ flex: 1 }}
              leftSection={<IconFilter size={16} />}
            />
            <Select
              placeholder="Filtrer par relation"
              value={selectedRelation}
              onChange={setSelectedRelation}
              data={[
                { value: '', label: 'Toutes les relations' },
                ...allRelationships.map((rel) => ({
                  value: rel,
                  label: rel.charAt(0).toUpperCase() + rel.slice(1),
                })),
              ]}
              style={{ minWidth: 200 }}
            />
          </Group>
        </Card>

        <Grid>
          {filteredCollections.map((collection) => (
            <Grid.Col key={collection.name} span={{ base: 12, sm: 6, lg: 4 }}>
              <Card withBorder>
                <Stack gap="md">
                  <Group>
                    <IconDatabase size={24} />
                    <Title order={3}>{collection.name}</Title>
                  </Group>

                  <Text size="sm" c="dimmed">
                    {collection.documentCount} documents
                  </Text>

                  <Text size="sm">
                    Relations :{' '}
                    {collection.relationships.map((rel, index) => (
                      <span key={rel}>
                        {index > 0 && ', '}
                        {rel}
                      </span>
                    ))}
                  </Text>

                  <Group>
                    <Button
                      variant="light"
                      onClick={() => router.push(`/collections/${collection.name}/filter`)}
                      leftSection={<IconFilter size={16} />}
                    >
                      Filtrer
                    </Button>
                    <Button
                      variant="light"
                      color="green"
                      onClick={() => router.push(`/collections/${collection.name}/seed`)}
                      leftSection={<IconSeeding size={16} />}
                    >
                      Générer des données
                    </Button>
                  </Group>
                </Stack>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Stack>
    </AppShell>
  );
}
