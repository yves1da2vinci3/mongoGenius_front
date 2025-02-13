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
import { AppShell } from '../components/Layout/AppShell';

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

export default function ModelsPage() {
  const router = useRouter();
  const { collection } = router.query;
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);

  const totalDocuments = FAKE_DOCUMENTS.length;
  const totalPages = Math.ceil(totalDocuments / perPage);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handleRefresh = () => {
    setLoading(true);
    // Simuler un chargement
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  return (
    <AppShell>
      <Paper p="md" pos="relative">
        <LoadingOverlay visible={loading} />

        <Stack gap="md">
          <Group justify="space-between">
            <Group>
              <ActionIcon variant="light" onClick={() => router.back()}>
                <IconArrowLeft size={16} />
              </ActionIcon>
              <Title order={3}>Collection: {collection || 'User'}</Title>
              <Text size="sm" c="dimmed">
                {totalDocuments} documents
              </Text>
            </Group>
          </Group>

          <Group>
            <TextInput
              placeholder='{ "field": "value" }'
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.currentTarget.value)}
              style={{ flex: 1 }}
            />
            <Button variant="light" leftSection={<IconRefresh size={16} />} onClick={handleRefresh}>
              Actualiser
            </Button>
            <Button variant="light" leftSection={<IconSettings size={16} />}>
              Options
            </Button>
          </Group>

          <Group justify="space-between">
            <Select
              value={String(perPage)}
              onChange={(value) => value && setPerPage(parseInt(value, 10))}
              data={[
                { value: '10', label: '10 par page' },
                { value: '20', label: '20 par page' },
                { value: '50', label: '50 par page' },
                { value: '100', label: '100 par page' },
              ]}
              style={{ width: 130 }}
            />

            <Group>
              <ActionIcon variant="light" disabled={currentPage === 1} onClick={handlePreviousPage}>
                <IconArrowLeft size={16} />
              </ActionIcon>
              <Text size="sm">
                Page {currentPage} sur {totalPages}
              </Text>
              <ActionIcon
                variant="light"
                disabled={currentPage === totalPages}
                onClick={handleNextPage}
              >
                <IconArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
              </ActionIcon>
            </Group>
          </Group>

          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>EMAIL (STRING)</Table.Th>
                <Table.Th>PASSWORD (STRING)</Table.Th>
                <Table.Th>FIRSTNAME (STRING)</Table.Th>
                <Table.Th>LASTNAME (STRING)</Table.Th>
                <Table.Th>ROLE (STRING)</Table.Th>
                <Table.Th>ADDRESSES (ARRAY)</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {FAKE_DOCUMENTS.map((doc, index) => (
                <Table.Tr key={index}>
                  <Table.Td>{doc.email}</Table.Td>
                  <Table.Td>{doc.password}</Table.Td>
                  <Table.Td>{doc.firstName}</Table.Td>
                  <Table.Td>{doc.lastName}</Table.Td>
                  <Table.Td>{doc.role}</Table.Td>
                  <Table.Td>{JSON.stringify(doc.addresses)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Stack>
      </Paper>
    </AppShell>
  );
}
