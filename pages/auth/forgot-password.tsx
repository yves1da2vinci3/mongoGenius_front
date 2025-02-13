import Link from 'next/link';
import { Button, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { AuthLayout } from '../../components/Auth/AuthLayout';

export default function ForgotPasswordPage() {
  const form = useForm({
    initialValues: {
      email: '',
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email invalide'),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    console.log(values);
  });

  return (
    <AuthLayout
      title="Réinitialisation du mot de passe"
      subtitle="Nous vous enverrons un lien pour réinitialiser votre mot de passe."
    >
      <Stack>
        <Text size="xl" fw={600}>
          Mot de passe oublié ?
        </Text>
        <Text size="sm" c="dimmed">
          Entrez votre email pour recevoir les instructions de réinitialisation
        </Text>

        <form onSubmit={handleSubmit}>
          <Stack gap="md">
            <TextInput
              required
              label="Email"
              placeholder="Votre email"
              {...form.getInputProps('email')}
            />

            <Button type="submit" fullWidth>
              Envoyer les instructions
            </Button>
          </Stack>
        </form>

        <Text ta="center" size="sm">
          Vous vous souvenez de votre mot de passe ?{' '}
          <Button component={Link} href="/auth/login" variant="transparent" size="sm" p={0}>
            Se connecter
          </Button>
        </Text>
      </Stack>
    </AuthLayout>
  );
}
