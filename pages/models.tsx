import { useState } from 'react';
import { useRouter } from 'next/router';
import { IconArrowLeft, IconRefresh, IconSettings } from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Group,
  LoadingOverlay,
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
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  addresses: { street: string; city: string }[];
}

// Données factices
const FAKE_DOCUMENTS: Document[] = [
  {
    email: 'Misael63@hotmail.com',
    password: 'RmF5rkmErXLKcSh',
    firstName: 'Jesus',
    lastName: 'Bauch',
    role: 'customer',
    addresses: [{ street: 'cras omnis ab', city: 'rerum constans t' }],
  },
  {
    email: 'Mckenzie.Casper@hotmail.com',
    password: '8tqwzzJPwCpUbKG',
    firstName: 'Tricia',
    lastName: 'Dietrich',
    role: 'admin',
    addresses: [{ street: 'theologus victoria comitatus', city: 'co' }],
  },
  {
    email: 'Gertrude64@gmail.com',
    password: 'srBqMT8weP2Lkpv',
    firstName: 'Maxine',
    lastName: 'Graham',
    role: 'customer',
    addresses: [{ street: 'atqui arma vere', city: 'cultura cotidie' }],
  },
  {
    email: 'Kenya93@yahoo.com',
    password: 'fAJtam0Txcns3XM',
    firstName: 'Patty',
    lastName: 'Walsh DVM',
    role: 'admin',
    addresses: [{ street: 'tribuo adficio caute', city: 'soluta aetas' }],
  },
  {
    email: 'Kyra_Kunde@gmail.com',
    password: 'uNUergVdkPVylIW',
    firstName: 'Lorene',
    lastName: 'Dr. Kristi Reilly',
    role: 'admin',
    addresses: [{ street: 'suppono deinde architecto', city: 'blan' }],
  },
  {
    email: 'Keara12@yahoo.com',
    password: 'GaYzpAwCMBXVuyy',
    firstName: 'Joshua',
    lastName: 'Kunze-Hackett IV',
    role: 'admin',
    addresses: [{ street: 'suffoco unus accommodo', city: 'collig' }],
  },
  {
    email: 'Zora_Bergstrom26@yahoo.com',
    password: 'Qz7u4F7q4ulzDs4',
    firstName: 'Bertha',
    lastName: 'Lemke',
    role: 'admin',
    addresses: [{ street: 'torqueo vero canonicus', city: 'at vere' }],
  },
  {
    email: 'Ahmed_Dickens@gmail.com',
    password: '2Q0QGrw3uzku0G8',
    firstName: 'Perry',
    lastName: 'Hessel',
    role: 'customer',
    addresses: [{ street: 'tot ullam trado', city: 'ipsa porro dolor' }],
  },
  {
    email: 'Sheldon_Cummerata@gmail.com',
    password: 'PY18BVC9tCZ9x_g',
    firstName: 'Anna',
    lastName: 'Parisian',
    role: 'admin',
    addresses: [{ street: 'blandior statua sursum', city: 'officia t' }],
  },
];

function ModelsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [_currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <AppShell>
      <Stack gap="lg">
        <Group justify="space-between">
          <Group>
            <ActionIcon variant="default" onClick={() => router.push('/projects')} size="lg">
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Title order={2}>Documents générés</Title>
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
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            placeholder="Filtrer par rôle"
            value={selectedRole}
            onChange={setSelectedRole}
            data={[
              { value: 'admin', label: 'Admin' },
              { value: 'customer', label: 'Client' },
            ]}
            clearable
          />
        </Group>

        <Paper pos="relative" p="md" withBorder>
          <LoadingOverlay visible={loading} />
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Email</Table.Th>
                <Table.Th>Prénom</Table.Th>
                <Table.Th>Nom</Table.Th>
                <Table.Th>Rôle</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {FAKE_DOCUMENTS.map((doc) => (
                <Table.Tr key={doc.email}>
                  <Table.Td>{doc.email}</Table.Td>
                  <Table.Td>{doc.firstName}</Table.Td>
                  <Table.Td>{doc.lastName}</Table.Td>
                  <Table.Td>{doc.role}</Table.Td>
                  <Table.Td>
                    <Button variant="light" size="xs">
                      Voir
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>

        <Group justify="space-between">
          <Text size="sm" c="dimmed">
            Affichage de {FAKE_DOCUMENTS.length} documents
          </Text>
          <Group>
            <Button variant="default" onClick={handlePreviousPage}>
              Précédent
            </Button>
            <Button variant="default" onClick={handleNextPage}>
              Suivant
            </Button>
          </Group>
        </Group>
      </Stack>
    </AppShell>
  );
}

export default ModelsPage;
