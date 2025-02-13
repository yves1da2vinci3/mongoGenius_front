import { useState } from 'react';
import {
  Avatar,
  Button,
  Divider,
  Grid,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Switch,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { AppShell } from '../components/Layout/AppShell';

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    initialValues: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      notifications: true,
      newsletter: false,
      darkMode: true,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email invalide'),
      newPassword: (value) =>
        value && value.length < 8 ? 'Le mot de passe doit contenir au moins 8 caractères' : null,
      confirmPassword: (value, values) =>
        value !== values.newPassword ? 'Les mots de passe ne correspondent pas' : null,
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    setLoading(true);
    console.log(values);
    setTimeout(() => setLoading(false), 1000);
  });

  return (
    <AppShell>
      <Stack gap="lg">
        <Title order={2}>Paramètres</Title>

        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            <Paper withBorder radius="md" p="md">
              <Title order={3} mb="md">
                Profil
              </Title>

              <Stack gap="md">
                <Group>
                  <Avatar size={100} radius="md" />
                  <Button variant="light">Changer l'avatar</Button>
                </Group>

                <Grid>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput label="Prénom" {...form.getInputProps('firstName')} />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput label="Nom" {...form.getInputProps('lastName')} />
                  </Grid.Col>
                </Grid>

                <TextInput label="Email" {...form.getInputProps('email')} />
              </Stack>
            </Paper>

            <Paper withBorder radius="md" p="md">
              <Title order={3} mb="md">
                Sécurité
              </Title>

              <Stack gap="md">
                <PasswordInput
                  label="Mot de passe actuel"
                  {...form.getInputProps('currentPassword')}
                />
                <PasswordInput
                  label="Nouveau mot de passe"
                  {...form.getInputProps('newPassword')}
                />
                <PasswordInput
                  label="Confirmer le mot de passe"
                  {...form.getInputProps('confirmPassword')}
                />
              </Stack>
            </Paper>

            <Paper withBorder radius="md" p="md">
              <Title order={3} mb="md">
                Préférences
              </Title>

              <Stack gap="xs">
                <Group justify="space-between">
                  <div>
                    <Text>Notifications</Text>
                    <Text size="sm" c="dimmed">
                      Recevoir des notifications sur l'activité de vos projets
                    </Text>
                  </div>
                  <Switch {...form.getInputProps('notifications', { type: 'checkbox' })} />
                </Group>

                <Divider />

                <Group justify="space-between">
                  <div>
                    <Text>Newsletter</Text>
                    <Text size="sm" c="dimmed">
                      Recevoir des mises à jour sur les nouvelles fonctionnalités
                    </Text>
                  </div>
                  <Switch {...form.getInputProps('newsletter', { type: 'checkbox' })} />
                </Group>

                <Divider />

                <Group justify="space-between">
                  <div>
                    <Text>Mode sombre</Text>
                    <Text size="sm" c="dimmed">
                      Basculer entre le mode clair et sombre
                    </Text>
                  </div>
                  <Switch {...form.getInputProps('darkMode', { type: 'checkbox' })} />
                </Group>
              </Stack>
            </Paper>

            <Group justify="flex-end">
              <Button type="submit" loading={loading}>
                Enregistrer les modifications
              </Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </AppShell>
  );
}
