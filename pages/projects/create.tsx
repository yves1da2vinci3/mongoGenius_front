import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { IconFile, IconUpload, IconX } from '@tabler/icons-react';
import { Button, Group, Paper, rem, Stack, Text, Textarea, TextInput, Title } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { AppShell } from '../../components/Layout/AppShell';
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
    },
    validate: {
      title: (value) => (value.length < 2 ? 'Le titre est trop court' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    if (!file) {
      notifications.show({
        title: 'Erreur',
        message: 'Veuillez sélectionner un fichier',
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
      <Stack gap="xl">
        <Title order={2}>Créer un nouveau projet</Title>

        <form onSubmit={handleSubmit}>
          <Stack gap="lg">
            <Paper withBorder radius="md" p="md">
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
                  autosize
                  minRows={3}
                  {...form.getInputProps('description')}
                />
              </Stack>
            </Paper>

            <Paper withBorder radius="md" p="md">
              <Stack gap="md">
                <Text fw={500}>Fichier du projet</Text>
                <Dropzone
                  openRef={openRef}
                  onDrop={(files) => setFile(files[0])}
                  maxFiles={1}
                  accept={['.zip']}
                  h={rem(200)}
                >
                  <Stack gap="xl" justify="center" align="center" h="100%">
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
                          <Text size="xl" inline ta="center">
                            Glissez votre fichier ici ou cliquez pour sélectionner
                          </Text>
                          <Text size="sm" c="dimmed" inline mt={7} ta="center">
                            Seuls les fichiers .zip sont acceptés
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
                            variant="light"
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
              </Stack>
            </Paper>

            <Group justify="flex-end">
              <Button variant="default" onClick={() => router.push('/projects')}>
                Annuler
              </Button>
              <Button type="submit">Créer le projet</Button>
            </Group>
          </Stack>
        </form>
      </Stack>
    </AppShell>
  );
}
