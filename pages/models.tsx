import { useState } from 'react';
import { useRouter } from 'next/router';
import { IconArrowLeft, IconRefresh, IconSettings, IconTable } from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Group,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import AppShell from '../components/Layout/AppShell';

// Types pour les documents
interface Document {
  _id: string;
  [key: string]: any;
}

function ModelsPage() {
  const router = useRouter();
  const { projectId } = router.query;
  const [_loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedField, setSelectedField] = useState<string | null>(null);

  // Données de test (à remplacer par les vraies données de l'API)
  const MOCK_DOCUMENTS: Document[] = [
    {
      _id: '1',
      name: 'User',
      fields: ['email', 'password', 'firstName', 'lastName', 'role'],
      relations: ['posts', 'comments'],
      documentCount: 1000,
    },
    {
      _id: '2',
      name: 'Post',
      fields: ['title', 'content', 'author', 'comments'],
      relations: ['users', 'comments'],
      documentCount: 500,
    },
    {
      _id: '3',
      name: 'Comment',
      fields: ['content', 'author', 'post'],
      relations: ['users', 'posts'],
      documentCount: 2000,
    },
  ];

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const filteredDocuments = MOCK_DOCUMENTS.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesField = selectedField ? doc.fields.includes(selectedField) : true;
    return matchesSearch && matchesField;
  });

  const allFields = Array.from(new Set(MOCK_DOCUMENTS.flatMap((doc) => doc.fields)));

  return (
    <AppShell>
      <Stack gap="lg">
        <Group justify="space-between">
          <Group>
            <ActionIcon
              variant="default"
              onClick={() => router.push(`/projects/${projectId}`)}
              size="lg"
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Title order={2}>Modèles du projet</Title>
          </Group>

          <Group>
            <ActionIcon variant="default" onClick={handleRefresh} size="lg">
              <IconRefresh size={20} />
            </ActionIcon>
            <ActionIcon variant="default" size="lg">
              <IconSettings size={20} />
            </ActionIcon>
          </Group>
        </Group>

        <Group>
          <TextInput
            placeholder="Rechercher un modèle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Filtrer par champ"
            value={selectedField}
            onChange={setSelectedField}
            data={[
              { value: '', label: 'Tous les champs' },
              ...allFields.map((field) => ({
                value: field,
                label: field,
              })),
            ]}
            clearable
          />
        </Group>

        <Paper p="md" withBorder>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nom du modèle</Table.Th>
                <Table.Th>Champs</Table.Th>
                <Table.Th>Relations</Table.Th>
                <Table.Th>Documents</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredDocuments.map((doc) => (
                <Table.Tr key={doc._id}>
                  <Table.Td>
                    <Text fw={500}>{doc.name}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{doc.fields.join(', ')}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" c="blue">
                      {doc.relations.join(', ')}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{doc.documentCount}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Button
                      variant="light"
                      size="xs"
                      leftSection={<IconTable size={14} />}
                      onClick={() =>
                        router.push(`/models/${doc.name.toLowerCase()}?projectId=${projectId}`)
                      }
                    >
                      Explorer
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>
    </AppShell>
  );
}

export default ModelsPage;
