import Link from 'next/link';
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { AuthLayout } from '../../components/Auth/AuthLayout';

export default function RegisterPage() {
  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      acceptTerms: false,
    },

    validate: {
      firstName: (value) => (value.length < 2 ? 'Le prénom est trop court' : null),
      lastName: (value) => (value.length < 2 ? 'Le nom est trop court' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email invalide'),
      password: (value) =>
        value.length < 8 ? 'Le mot de passe doit contenir au moins 8 caractères' : null,
      acceptTerms: (value) => (!value ? 'Vous devez accepter les conditions' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    console.log(values);
  });

  return (
    <AuthLayout
      title="Créer un compte"
      subtitle="Rejoignez-nous pour commencer à générer vos données de test."
    >
      <Stack>
        <Text size="xl" fw={600}>
          Inscription
        </Text>
        <Text size="sm" c="dimmed">
          Créez votre compte en quelques étapes
        </Text>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <Grid gutter="md">
              <Grid.Col span={6}>
                <TextInput
                  required
                  label="Prénom"
                  placeholder="Votre prénom"
                  {...form.getInputProps('firstName')}
                />
              </Grid.Col>
              <Grid.Col span={6}>
                <TextInput
                  required
                  label="Nom"
                  placeholder="Votre nom"
                  {...form.getInputProps('lastName')}
                />
              </Grid.Col>
            </Grid>

            <TextInput
              required
              label="Email"
              placeholder="Votre email"
              {...form.getInputProps('email')}
            />

            <PasswordInput
              required
              label="Mot de passe"
              placeholder="Créez un mot de passe"
              {...form.getInputProps('password')}
            />

            <Checkbox
              label={
                <Text size="sm">
                  J'accepte les{' '}
                  <Button component={Link} href="/terms" variant="transparent" size="sm" p={0}>
                    conditions d'utilisation
                  </Button>
                </Text>
              }
              {...form.getInputProps('acceptTerms', { type: 'checkbox' })}
            />

            <Button type="submit" fullWidth>
              Créer mon compte
            </Button>
          </Stack>
        </form>

        <Divider label="Ou s'inscrire avec" labelPosition="center" />

        <Group grow>
          <Button variant="default" leftSection={<img src="/google.svg" alt="Google" width={16} />}>
            Google
          </Button>
          <Button variant="default" leftSection={<img src="/apple.svg" alt="Apple" width={16} />}>
            Apple
          </Button>
        </Group>

        <Text ta="center" size="sm">
          Déjà un compte ?{' '}
          <Button component={Link} href="/auth/login" variant="transparent" size="sm" p={0}>
            Se connecter
          </Button>
        </Text>
      </Stack>
    </AuthLayout>
  );
}
