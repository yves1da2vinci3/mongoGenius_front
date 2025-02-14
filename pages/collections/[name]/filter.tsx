import { useState } from 'react';
import { useRouter } from 'next/router';
import { IconArrowLeft, IconDatabase, IconFilter } from '@tabler/icons-react';
import {
  Button,
  Card,
  Chip,
  Group,
  JsonInput,
  MultiSelect,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import AppShell from '../../../components/Layout/AppShell';

interface MockData {
  _id: string;
  name: string;
  email: string;
  age: number;
  posts: string[];
  comments: string[];
  [key: string]: string | number | string[];
}

export default function CollectionFilterPage() {
  const router = useRouter();
  const { name } = router.query;
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [filterQuery, setFilterQuery] = useState('{}');
  const [showRelatedData, setShowRelatedData] = useState<string[]>([]);

  // Données de test (à remplacer par les vraies données de l'API)
  const MOCK_FIELDS = ['name', 'email', 'age', 'createdAt', 'posts', 'comments'];

  const MOCK_RELATIONS = ['posts', 'comments'];

  const MOCK_DATA: MockData[] = [
    {
      _id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      posts: ['post1', 'post2'],
      comments: ['comment1'],
    },
    {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 25,
      posts: ['post3'],
      comments: ['comment2', 'comment3'],
    },
  ];

  const handleFilter = () => {
    // Ici, vous implementerez la logique de filtrage avec l'API
    console.log('Filtering with:', {
      fields: selectedFields,
      filter: JSON.parse(filterQuery),
      includeRelations: showRelatedData,
    });
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
            <Title order={2}>Filtrer {name}</Title>
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
            <Title order={3}>Configuration du filtre</Title>

            <MultiSelect
              label="Champs à afficher"
              placeholder="Sélectionnez les champs"
              data={MOCK_FIELDS}
              value={selectedFields}
              onChange={setSelectedFields}
            />

            <JsonInput
              label="Filtre MongoDB"
              placeholder='{ "field": "value" }'
              value={filterQuery}
              onChange={setFilterQuery}
              minRows={3}
              formatOnBlur
              validationError="JSON invalide"
            />

            <Stack gap="xs">
              <Text size="sm" fw={500}>
                Inclure les données liées
              </Text>
              <Chip.Group multiple value={showRelatedData} onChange={setShowRelatedData}>
                {MOCK_RELATIONS.map((relation) => (
                  <Chip key={relation} value={relation}>
                    {relation}
                  </Chip>
                ))}
              </Chip.Group>
            </Stack>

            <Button leftSection={<IconFilter size={16} />} onClick={handleFilter}>
              Appliquer le filtre
            </Button>
          </Stack>
        </Card>

        <Card withBorder>
          <Stack gap="md">
            <Title order={3}>Résultats</Title>

            <Table>
              <Table.Thead>
                <Table.Tr>
                  {selectedFields.length > 0
                    ? selectedFields.map((field) => <Table.Th key={field}>{field}</Table.Th>)
                    : MOCK_FIELDS.map((field) => <Table.Th key={field}>{field}</Table.Th>)}
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {MOCK_DATA.map((item) => (
                  <Table.Tr key={item._id}>
                    {(selectedFields.length > 0 ? selectedFields : MOCK_FIELDS).map((field) => (
                      <Table.Td key={field}>
                        {Array.isArray(item[field]) ? item[field].join(', ') : String(item[field])}
                      </Table.Td>
                    ))}
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Stack>
        </Card>
      </Stack>
    </AppShell>
  );
}
