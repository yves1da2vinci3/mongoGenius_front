import Link from 'next/link';
import {
  Button,
  Checkbox,
  Divider,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { AuthLayout } from '../../components/Auth/AuthLayout';

export default function LoginPage() {
  const form = useForm({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email invalide'),
      password: (value) => (value.length < 1 ? 'Le mot de passe est requis' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    console.log(values);
  });

  return (
    <AuthLayout
      title="Bienvenue !"
      subtitle="Connectez-vous pour accéder à votre espace de génération de données."
    >
      <Stack>
        <Text size="xl" fw={600}>
          Connexion
        </Text>
        <Text size="sm" c="dimmed">
          Veuillez entrer vos identifiants
        </Text>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              required
              label="Email"
              placeholder="Votre email"
              {...form.getInputProps('email')}
            />

            <PasswordInput
              required
              label="Mot de passe"
              placeholder="Votre mot de passe"
              {...form.getInputProps('password')}
            />

            <Group justify="space-between">
              <Checkbox
                label="Se souvenir de moi"
                {...form.getInputProps('rememberMe', { type: 'checkbox' })}
              />
              <Button
                component={Link}
                href="/auth/forgot-password"
                variant="transparent"
                size="sm"
                p={0}
              >
                Mot de passe oublié ?
              </Button>
            </Group>

            <Button type="submit" fullWidth>
              Se connecter
            </Button>
          </Stack>
        </form>

        <Divider label="Ou continuer avec" labelPosition="center" />

        <Group grow>
          <Button variant="default" leftSection={<img src="/google.svg" alt="Google" width={16} />}>
            Google
          </Button>
          <Button variant="default" leftSection={<img src="/apple.svg" alt="Apple" width={16} />}>
            Apple
          </Button>
        </Group>

        <Text ta="center" size="sm">
          Pas encore de compte ?{' '}
          <Button component={Link} href="/auth/register" variant="transparent" size="sm" p={0}>
            S'inscrire
          </Button>
        </Text>
      </Stack>
    </AuthLayout>
  );
}
