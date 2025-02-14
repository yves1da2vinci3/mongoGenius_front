import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { IconFile, IconUpload, IconX } from '@tabler/icons-react';
import {
  Button,
  Container,
  Grid,
  Group,
  Paper,
  PasswordInput,
  Radio,
  rem,
  Select,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import AppShell from '../../components/Layout/AppShell';
import { useProjectStore } from '../../store/useProjectStore';

export default function CreateProjectPage() {
  const router = useRouter();
  const openRef = useRef<() => void>(null);
  const [file, setFile] = useState<FileWithPath | null>(null);
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
      sourceType: 'zip',
    },
    validate: {
      title: (value) => (value.length < 2 ? 'Le titre est trop court' : null),
      database: (value) => (!value ? 'Le nom de la base est requis' : null),
      uri: (value) => (!value ? "L'URI est requise" : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    if (values.sourceType === 'zip' && !file) {
      notifications.show({
        title: 'Erreur',
        message: 'Veuillez sélectionner un fichier ZIP',
        color: 'red',
      });
      return;
    }

    const newProject = {
      id: Math.random().toString(36).substr(2, 9),
      title: values.title,
      description: values.description,
      documentsCount: 0,
      successRate: 0,
      status: 'active' as const,
    };

    addProject(newProject);
    notifications.show({
      title: 'Succès',
      message: 'Le projet a été créé avec succès',
      color: 'green',
    });
    router.push('/projects');
  });

  return (
    <AppShell>
      <Container size="md">
        <Stack gap="xl">
          <Title order={2}>Nouveau Projet</Title>

          <form onSubmit={handleSubmit}>
            <Stack gap="xl">
              {/* Informations de base */}
              <Paper withBorder radius="md">
                <Stack gap="md" p="md">
                  <Title order={3}>Informations de base</Title>
                  <TextInput
                    required
                    label="Nom du projet"
                    placeholder="Mon super projet"
                    {...form.getInputProps('title')}
                  />
                  <Textarea
                    label="Description"
                    placeholder="Description de votre projet"
                    autosize
                    minRows={3}
                    {...form.getInputProps('description')}
                  />
                </Stack>
              </Paper>

              {/* Base de données */}
              <Paper withBorder radius="md">
                <Stack gap="md" p="md">
                  <Title order={3}>Base de données</Title>

                  <TextInput
                    required
                    label="URI MongoDB"
                    placeholder="mongodb://localhost:27017"
                    {...form.getInputProps('uri')}
                  />

                  <Grid>
                    <Grid.Col span={6}>
                      <TextInput
                        required
                        label="Nom de la base"
                        placeholder="ma_base"
                        {...form.getInputProps('database')}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <Select
                        label="Source d'authentification"
                        placeholder="Choisir"
                        data={[
                          { value: 'admin', label: 'admin' },
                          { value: 'local', label: 'local' },
                        ]}
                        {...form.getInputProps('authSource')}
                      />
                    </Grid.Col>
                  </Grid>

                  <Grid>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Nom d'utilisateur"
                        placeholder="root"
                        {...form.getInputProps('username')}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <PasswordInput
                        label="Mot de passe"
                        placeholder="••••••••"
                        {...form.getInputProps('password')}
                      />
                    </Grid.Col>
                  </Grid>

                  <Grid>
                    <Grid.Col span={6}>
                      <Select
                        label="Mécanisme d'authentification"
                        placeholder="Choisir"
                        data={[
                          { value: 'SCRAM-SHA-256', label: 'SCRAM-SHA-256' },
                          { value: 'SCRAM-SHA-1', label: 'SCRAM-SHA-1' },
                        ]}
                        {...form.getInputProps('authMechanism')}
                      />
                    </Grid.Col>
                    <Grid.Col span={6}>
                      <TextInput
                        label="Replica Set (optionnel)"
                        placeholder="rs0"
                        {...form.getInputProps('replicaSet')}
                      />
                    </Grid.Col>
                  </Grid>
                </Stack>
              </Paper>

              {/* Source des modèles */}
              <Paper withBorder radius="md">
                <Stack gap="md" p="md">
                  <Title order={3}>Source des modèles</Title>

                  <Radio.Group {...form.getInputProps('sourceType')} name="sourceType">
                    <Stack gap="xs">
                      <Radio value="zip" label="Fichier ZIP" />
                      <Radio value="github" label="GitHub" />
                    </Stack>
                  </Radio.Group>

                  {form.values.sourceType === 'zip' && (
                    <Dropzone
                      openRef={openRef}
                      onDrop={(files) => setFile(files[0])}
                      maxFiles={1}
                      maxSize={10 * 1024 ** 2} // 10MB
                      accept={['.zip']}
                      h={rem(200)}
                    >
                      <Stack
                        gap="xl"
                        justify="center"
                        align="center"
                        h="100%"
                        style={{ pointerEvents: 'none' }}
                      >
                        {!file ? (
                          <>
                            <Dropzone.Accept>
                              <IconUpload
                                style={{
                                  width: rem(52),
                                  height: rem(52),
                                  color: 'var(--mantine-color-blue-6)',
                                }}
                                stroke={1.5}
                              />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                              <IconX
                                style={{
                                  width: rem(52),
                                  height: rem(52),
                                  color: 'var(--mantine-color-red-6)',
                                }}
                                stroke={1.5}
                              />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                              <IconFile
                                style={{
                                  width: rem(52),
                                  height: rem(52),
                                  color: 'var(--mantine-color-dimmed)',
                                }}
                                stroke={1.5}
                              />
                            </Dropzone.Idle>

                            <div>
                              <Text ta="center">Glissez votre fichier ZIP ici ou</Text>
                              <Text ta="center">
                                <Text
                                  span
                                  c="blue"
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => openRef.current?.()}
                                >
                                  Parcourir
                                </Text>
                              </Text>
                              <Text size="sm" ta="center" c="dimmed" mt="xs">
                                ZIP contenant vos modèles Mongoose (max. 10MB)
                              </Text>
                            </div>
                          </>
                        ) : (
                          <Stack gap="md" justify="center" align="center">
                            <IconFile
                              style={{
                                width: rem(52),
                                height: rem(52),
                                color: 'var(--mantine-color-blue-6)',
                              }}
                              stroke={1.5}
                            />
                            <div>
                              <Text size="sm" inline>
                                {file.name}
                              </Text>
                              <Button
                                variant="subtle"
                                color="red"
                                size="xs"
                                ml="md"
                                onClick={() => setFile(null)}
                              >
                                Supprimer
                              </Button>
                            </div>
                          </Stack>
                        )}
                      </Stack>
                    </Dropzone>
                  )}

                  {form.values.sourceType === 'github' && (
                    <TextInput
                      placeholder="https://github.com/username/repository"
                      label="URL du dépôt"
                      disabled
                      description="Fonctionnalité à venir"
                    />
                  )}
                </Stack>
              </Paper>

              <Group justify="space-between">
                <Button variant="default" onClick={() => router.push('/projects')}>
                  ← Retour
                </Button>
                <Button type="submit" color="blue">
                  Créer le projet →
                </Button>
              </Group>
            </Stack>
          </form>
        </Stack>
      </Container>
    </AppShell>
  );
}
