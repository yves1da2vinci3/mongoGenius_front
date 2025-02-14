import { useState } from 'react';
import {
  IconBell,
  IconCamera,
  IconCheck,
  IconLanguage,
  IconLock,
  IconPalette,
  IconUser,
} from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  Button,
  ColorSwatch,
  Divider,
  Grid,
  Group,
  Paper,
  PasswordInput,
  rem,
  Select,
  Stack,
  Switch,
  Tabs,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import AppShell from '../components/Layout/AppShell';

const AVAILABLE_THEMES = [
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
  { value: 'auto', label: 'Automatique' },
];

const AVAILABLE_LANGUAGES = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
];

const ACCENT_COLORS = [
  { name: 'Bleu', color: '#228be6' },
  { name: 'Indigo', color: '#4263eb' },
  { name: 'Violet', color: '#7048e8' },
  { name: 'Rose', color: '#e64980' },
  { name: 'Cyan', color: '#15aabf' },
  { name: 'Vert', color: '#37b24d' },
  { name: 'Orange', color: '#f76707' },
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>('profile');
  const [selectedColor, setSelectedColor] = useState(ACCENT_COLORS[0].color);

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
      theme: 'light',
      language: 'fr',
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: true,
      securityAlerts: true,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email invalide'),
      newPassword: (value) =>
        value && value.length < 8 ? 'Le mot de passe doit contenir au moins 8 caractères' : null,
      confirmPassword: (value, values) =>
        value !== values.newPassword ? 'Les mots de passe ne correspondent pas' : null,
    },
  });

  const saveSettings = async (values: typeof form.values) => {
    try {
      setLoading(true);
      // Simuler une requête API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('Saving settings:', values);
      notifications.show({
        title: 'Succès',
        message: 'Vos paramètres ont été mis à jour avec succès',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    } catch (error) {
      notifications.show({
        title: 'Erreur',
        message: 'Une erreur est survenue lors de la sauvegarde',
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Title order={2}>Paramètres</Title>
          <Button type="submit" loading={loading} onClick={() => form.onSubmit(saveSettings)()}>
            Enregistrer les modifications
          </Button>
        </Group>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>
              Profil
            </Tabs.Tab>
            <Tabs.Tab value="security" leftSection={<IconLock size={16} />}>
              Sécurité
            </Tabs.Tab>
            <Tabs.Tab value="notifications" leftSection={<IconBell size={16} />}>
              Notifications
            </Tabs.Tab>
            <Tabs.Tab value="appearance" leftSection={<IconPalette size={16} />}>
              Apparence
            </Tabs.Tab>
          </Tabs.List>

          <form onSubmit={form.onSubmit(saveSettings)}>
            <Tabs.Panel value="profile" pt="xl">
              <Paper withBorder radius="md" p="md">
                <Stack gap="md">
                  <Group align="flex-start">
                    <Stack>
                      <Avatar size={120} radius="md" />
                      <Button variant="light" leftSection={<IconCamera size={16} />} fullWidth>
                        Changer l'avatar
                      </Button>
                    </Stack>
                    <Stack style={{ flex: 1 }}>
                      <Grid>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Prénom"
                            placeholder="Votre prénom"
                            {...form.getInputProps('firstName')}
                          />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, sm: 6 }}>
                          <TextInput
                            label="Nom"
                            placeholder="Votre nom"
                            {...form.getInputProps('lastName')}
                          />
                        </Grid.Col>
                      </Grid>
                      <TextInput
                        label="Email"
                        placeholder="votre.email@exemple.com"
                        {...form.getInputProps('email')}
                      />
                      <Select
                        label="Langue"
                        placeholder="Sélectionnez votre langue"
                        data={AVAILABLE_LANGUAGES}
                        leftSection={<IconLanguage size={16} />}
                        {...form.getInputProps('language')}
                      />
                    </Stack>
                  </Group>
                </Stack>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="security" pt="xl">
              <Paper withBorder radius="md" p="md">
                <Stack gap="md">
                  <Title order={3}>Changer le mot de passe</Title>
                  <PasswordInput
                    label="Mot de passe actuel"
                    placeholder="Votre mot de passe actuel"
                    {...form.getInputProps('currentPassword')}
                  />
                  <PasswordInput
                    label="Nouveau mot de passe"
                    placeholder="Votre nouveau mot de passe"
                    {...form.getInputProps('newPassword')}
                  />
                  <PasswordInput
                    label="Confirmer le mot de passe"
                    placeholder="Confirmez votre nouveau mot de passe"
                    {...form.getInputProps('confirmPassword')}
                  />
                </Stack>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="notifications" pt="xl">
              <Paper withBorder radius="md" p="md">
                <Stack gap="md">
                  <Title order={3}>Préférences de notification</Title>

                  <Stack gap="xs">
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Notifications par email</Text>
                        <Text size="sm" c="dimmed">
                          Recevoir des notifications par email
                        </Text>
                      </div>
                      <Switch {...form.getInputProps('emailNotifications', { type: 'checkbox' })} />
                    </Group>

                    <Divider />

                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Notifications push</Text>
                        <Text size="sm" c="dimmed">
                          Recevoir des notifications sur votre navigateur
                        </Text>
                      </div>
                      <Switch {...form.getInputProps('pushNotifications', { type: 'checkbox' })} />
                    </Group>

                    <Divider />

                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Résumé hebdomadaire</Text>
                        <Text size="sm" c="dimmed">
                          Recevoir un résumé hebdomadaire de vos activités
                        </Text>
                      </div>
                      <Switch {...form.getInputProps('weeklyDigest', { type: 'checkbox' })} />
                    </Group>

                    <Divider />

                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Alertes de sécurité</Text>
                        <Text size="sm" c="dimmed">
                          Être notifié des activités suspectes
                        </Text>
                      </div>
                      <Switch {...form.getInputProps('securityAlerts', { type: 'checkbox' })} />
                    </Group>
                  </Stack>
                </Stack>
              </Paper>
            </Tabs.Panel>

            <Tabs.Panel value="appearance" pt="xl">
              <Paper withBorder radius="md" p="md">
                <Stack gap="md">
                  <Title order={3}>Personnalisation</Title>

                  <div>
                    <Text fw={500} mb="xs">
                      Thème
                    </Text>
                    <Select
                      data={AVAILABLE_THEMES}
                      {...form.getInputProps('theme')}
                      leftSection={<IconPalette size={16} />}
                    />
                  </div>

                  <div>
                    <Text fw={500} mb="xs">
                      Couleur d'accent
                    </Text>
                    <Group gap="xs">
                      {ACCENT_COLORS.map((color) => (
                        <Tooltip key={color.color} label={color.name}>
                          <ActionIcon
                            variant={selectedColor === color.color ? 'filled' : 'light'}
                            color={selectedColor === color.color ? 'blue' : 'gray'}
                            onClick={() => setSelectedColor(color.color)}
                            size="lg"
                          >
                            <ColorSwatch color={color.color} size={rem(22)} />
                          </ActionIcon>
                        </Tooltip>
                      ))}
                    </Group>
                  </div>
                </Stack>
              </Paper>
            </Tabs.Panel>
          </form>
        </Tabs>
      </Stack>
    </AppShell>
  );
}
