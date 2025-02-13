import { Button, Group, Select, Stack, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useProjectStore } from '../../store/useProjectStore';

interface CreateProjectFormProps {
  onClose: () => void;
}

export function CreateProjectForm({ onClose }: CreateProjectFormProps) {
  const addProject = useProjectStore((state) => state.addProject);

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      uri: 'mongodb://localhost:27017',
      database: '',
      authSource: 'admin',
      username: 'root',
      password: '',
      authMechanism: 'SCRAM-SHA-256',
      replicaSet: '',
    },

    validate: {
      title: (value) => (value.length < 2 ? 'Le titre est trop court' : null),
      database: (value) => (!value ? 'La base de données est requise' : null),
      uri: (value) => (!value ? "L'URI est requise" : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    try {
      addProject({
        id: Math.random().toString(36).substr(2, 9),
        title: values.title,
        description: values.description,
        documentsCount: 0,
        successRate: 0,
        status: 'active',
      });

      notifications.show({
        title: 'Succès',
        message: 'Le projet a été créé avec succès',
        color: 'green',
      });

      onClose();
    } catch (error) {
      notifications.show({
        title: 'Erreur',
        message: "Une erreur s'est produite lors de la création du projet",
        color: 'red',
      });
    }
  });

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          required
          label="Nom du projet"
          placeholder="Mon super projet"
          {...form.getInputProps('title')}
        />

        <Textarea
          label="Description"
          placeholder="Description de votre projet"
          {...form.getInputProps('description')}
        />

        <TextInput
          required
          label="URI MongoDB"
          placeholder="mongodb://localhost:27017"
          {...form.getInputProps('uri')}
        />

        <TextInput
          required
          label="Nom de la base"
          placeholder="ma_base"
          {...form.getInputProps('database')}
        />

        <Select
          label="Source d'authentification"
          data={[
            { value: 'admin', label: 'admin' },
            { value: 'local', label: 'local' },
          ]}
          {...form.getInputProps('authSource')}
        />

        <TextInput
          label="Nom d'utilisateur"
          placeholder="root"
          {...form.getInputProps('username')}
        />

        <TextInput type="password" label="Mot de passe" {...form.getInputProps('password')} />

        <Select
          label="Mécanisme d'authentification"
          data={[
            { value: 'SCRAM-SHA-256', label: 'SCRAM-SHA-256' },
            { value: 'SCRAM-SHA-1', label: 'SCRAM-SHA-1' },
          ]}
          {...form.getInputProps('authMechanism')}
        />

        <TextInput
          label="Replica Set (optionnel)"
          placeholder="rs0"
          {...form.getInputProps('replicaSet')}
        />

        <Group justify="right" mt="md">
          <Button variant="default" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">Créer</Button>
        </Group>
      </Stack>
    </form>
  );
}
