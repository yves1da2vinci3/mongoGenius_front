import { useState } from 'react';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';

interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
}

export default function PromptLibrary() {
  const [prompts, setPrompts] = useState<Prompt[]>([
    {
      id: '1',
      title: 'Générateur ERD',
      content: 'Générer un diagramme entité-relation basé sur les règles suivantes...',
      category: 'Modélisation',
    },
    {
      id: '2',
      title: 'Générateur de Données',
      content: 'Créer un jeu de données de test avec les caractéristiques suivantes...',
      category: 'Données',
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newPrompt, setNewPrompt] = useState<Partial<Prompt>>({});

  const handleAddPrompt = () => {
    if (!newPrompt.title || !newPrompt.content) {
      return;
    }

    const prompt: Prompt = {
      id: Date.now().toString(),
      title: newPrompt.title,
      content: newPrompt.content,
      category: newPrompt.category || 'Général',
    };

    setPrompts((prev) => [...prev, prompt]);
    setNewPrompt({});
    setIsAdding(false);
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <Stack>
      <Group justify="space-between" mb="md">
        <Title order={2}>Bibliothèque de Prompts</Title>
        <Button
          leftSection={<IconPlus size={20} />}
          onClick={() => setIsAdding(true)}
          variant="light"
        >
          Nouveau Prompt
        </Button>
      </Group>

      {isAdding && (
        <Paper p="md" mb="md" withBorder>
          <Stack>
            <TextInput
              label="Titre"
              placeholder="Nom du prompt"
              value={newPrompt.title || ''}
              onChange={(e) => setNewPrompt({ ...newPrompt, title: e.currentTarget.value })}
            />
            <TextInput
              label="Catégorie"
              placeholder="Catégorie (optionnel)"
              value={newPrompt.category || ''}
              onChange={(e) => setNewPrompt({ ...newPrompt, category: e.currentTarget.value })}
            />
            <Textarea
              label="Contenu"
              placeholder="Contenu du prompt"
              minRows={3}
              value={newPrompt.content || ''}
              onChange={(e) => setNewPrompt({ ...newPrompt, content: e.currentTarget.value })}
            />
            <Group justify="flex-end">
              <Button variant="subtle" onClick={() => setIsAdding(false)}>
                Annuler
              </Button>
              <Button onClick={handleAddPrompt}>Sauvegarder</Button>
            </Group>
          </Stack>
        </Paper>
      )}

      <Stack>
        {prompts.map((prompt) => (
          <Card key={prompt.id} withBorder>
            <Group justify="space-between" mb="xs">
              <div>
                <Text fw={500} size="lg">
                  {prompt.title}
                </Text>
                <Text size="sm" c="dimmed">
                  {prompt.category}
                </Text>
              </div>
              <Group>
                <ActionIcon variant="subtle" color="blue">
                  <IconEdit size={20} />
                </ActionIcon>
                <ActionIcon
                  variant="subtle"
                  color="red"
                  onClick={() => handleDeletePrompt(prompt.id)}
                >
                  <IconTrash size={20} />
                </ActionIcon>
              </Group>
            </Group>
            <Text>{prompt.content}</Text>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
}
