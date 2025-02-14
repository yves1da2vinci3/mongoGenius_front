import { useState } from 'react';
import { useRouter } from 'next/router';
import { IconArrowLeft, IconDatabase, IconSeeding } from '@tabler/icons-react';
import {
  Button,
  Card,
  Group,
  JsonInput,
  NumberInput,
  Select,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import AppShell from '../../../components/Layout/AppShell';

interface SeedConfig {
  count: number;
  template: Record<string, any>;
  relationConfig: Record<string, RelationConfig>;
}

interface RelationConfig {
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
  minCount?: number;
  maxCount?: number;
}

const DEFAULT_TEMPLATE = `{
  "name": "{{faker.person.fullName}}",
  "email": "{{faker.internet.email}}",
  "age": "{{faker.number.int({ min: 18, max: 80 })}}"
}`;

export default function CollectionSeedPage() {
  const router = useRouter();
  const { name } = router.query;
  const [count, setCount] = useState(10);
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);

  // Données de test (à remplacer par les vraies données de l'API)
  const MOCK_RELATIONS = [
    { value: 'posts', label: 'Posts' },
    { value: 'comments', label: 'Comments' },
  ];

  const [relations, setRelations] = useState<
    Array<{
      collection: string;
      type: 'one-to-one' | 'one-to-many' | 'many-to-many';
      minCount?: number;
      maxCount?: number;
    }>
  >([]);

  const handleAddRelation = () => {
    setRelations([
      ...relations,
      {
        collection: '',
        type: 'one-to-many',
        minCount: 1,
        maxCount: 5,
      },
    ]);
  };

  const handleRemoveRelation = (index: number) => {
    setRelations(relations.filter((_, i) => i !== index));
  };

  const handleUpdateRelation = (index: number, field: string, value: any) => {
    const newRelations = [...relations];
    newRelations[index] = {
      ...newRelations[index],
      [field]: value,
    };
    setRelations(newRelations);
  };

  const handleGenerate = () => {
    // Ici, vous implementerez la logique de génération avec l'API
    const config: SeedConfig = {
      count,
      template: JSON.parse(template),
      relationConfig: relations.reduce(
        (acc, rel) => ({
          ...acc,
          [rel.collection]: {
            type: rel.type,
            minCount: rel.minCount,
            maxCount: rel.maxCount,
          },
        }),
        {}
      ),
    };
    console.log('Generating with config:', config);
  };

  return (
    <AppShell>
      <Stack gap="xl">
        <Group justify="space-between">
          <Group>
            <Button
              variant="default"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => router.push('/collections')}
            >
              Retour
            </Button>
            <Title order={2}>Générer des données pour {name}</Title>
          </Group>

          <Button
            variant="light"
            onClick={() => router.push('/models')}
            leftSection={<IconDatabase size={16} />}
          >
            Voir les documents
          </Button>
        </Group>

        <Card withBorder>
          <Stack gap="md">
            <Title order={3}>Configuration de base</Title>

            <NumberInput
              label="Nombre de documents à générer"
              value={count}
              onChange={(value: string | number) => setCount(Number(value) || 10)}
              min={1}
              max={1000}
            />

            <JsonInput
              label="Modèle de document (avec support Faker.js)"
              description="Utilisez {{faker.xxx.yyy}} pour les valeurs dynamiques"
              placeholder="Template JSON avec variables Faker.js"
              value={template}
              onChange={setTemplate}
              minRows={5}
              formatOnBlur
              validationError="JSON invalide"
            />
          </Stack>
        </Card>

        <Card withBorder>
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3}>Relations</Title>
              <Button variant="light" onClick={handleAddRelation}>
                Ajouter une relation
              </Button>
            </Group>

            {relations.map((relation, index) => (
              <Card key={index} withBorder>
                <Stack gap="md">
                  <Group grow>
                    <Select
                      label="Collection liée"
                      placeholder="Sélectionner une collection"
                      data={MOCK_RELATIONS}
                      value={relation.collection}
                      onChange={(value) => handleUpdateRelation(index, 'collection', value)}
                    />
                    <Select
                      label="Type de relation"
                      data={[
                        {
                          value: 'one-to-one',
                          label: 'One-to-One',
                        },
                        {
                          value: 'one-to-many',
                          label: 'One-to-Many',
                        },
                        {
                          value: 'many-to-many',
                          label: 'Many-to-Many',
                        },
                      ]}
                      value={relation.type}
                      onChange={(value) =>
                        handleUpdateRelation(
                          index,
                          'type',
                          value as 'one-to-one' | 'one-to-many' | 'many-to-many'
                        )
                      }
                    />
                  </Group>

                  {relation.type !== 'one-to-one' && (
                    <Group grow>
                      <NumberInput
                        label="Nombre minimum"
                        value={relation.minCount}
                        onChange={(value) => handleUpdateRelation(index, 'minCount', value)}
                        min={0}
                        max={relation.maxCount || 100}
                      />
                      <NumberInput
                        label="Nombre maximum"
                        value={relation.maxCount}
                        onChange={(value) => handleUpdateRelation(index, 'maxCount', value)}
                        min={relation.minCount || 0}
                        max={100}
                      />
                    </Group>
                  )}

                  <Button variant="light" color="red" onClick={() => handleRemoveRelation(index)}>
                    Supprimer
                  </Button>
                </Stack>
              </Card>
            ))}

            {relations.length === 0 && (
              <Text c="dimmed" ta="center">
                Aucune relation configurée
              </Text>
            )}
          </Stack>
        </Card>

        <Button size="lg" leftSection={<IconSeeding size={20} />} onClick={handleGenerate}>
          Générer les données
        </Button>
      </Stack>
    </AppShell>
  );
}
