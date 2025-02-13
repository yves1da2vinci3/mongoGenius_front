import { useRouter } from 'next/router';
import { IconDots, IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { ActionIcon, Badge, Card, Group, Menu, Progress, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { notifications } from '@mantine/notifications';
import { useProjectStore } from '../../store/useProjectStore';

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  documentsCount: number;
  successRate: number;
  status: 'active' | 'inactive';
}

export function ProjectCard({
  id,
  title,
  description,
  documentsCount,
  successRate,
  status,
}: ProjectCardProps) {
  const router = useRouter();
  const deleteProject = useProjectStore((state) => state.deleteProject);

  const handleView = () => {
    router.push(`/projects/${id}`);
  };

  const handleEdit = () => {
    notifications.show({
      title: 'Modification',
      message: 'Fonctionnalité à venir',
      color: 'blue',
    });
  };

  const handleDelete = () => {
    modals.openConfirmModal({
      title: 'Supprimer le projet',
      children: (
        <Text size="sm">
          Êtes-vous sûr de vouloir supprimer le projet{' '}
          <Text span fw={700}>
            {title}
          </Text>{' '}
          ? Cette action est irréversible.
        </Text>
      ),
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteProject(id);
        notifications.show({
          title: 'Succès',
          message: 'Le projet a été supprimé',
          color: 'green',
        });
      },
    });
  };

  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Group justify="space-between" mb="xs">
        <Text fw={500}>{title}</Text>
        <Group gap={0}>
          <Badge color={status === 'active' ? 'green' : 'gray'} variant="light" size="sm">
            {status === 'active' ? 'actif' : 'inactif'}
          </Badge>
          <Menu position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon variant="subtle">
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item leftSection={<IconEye size={14} />} onClick={handleView}>
                Voir
              </Menu.Item>
              <Menu.Item leftSection={<IconEdit size={14} />} onClick={handleEdit}>
                Modifier
              </Menu.Item>
              <Menu.Item leftSection={<IconTrash size={14} />} color="red" onClick={handleDelete}>
                Supprimer
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      <Text size="sm" c="dimmed" mb="md">
        {description}
      </Text>

      <Text size="sm" fw={500} mb={5}>
        Progression
      </Text>
      <Progress
        value={successRate}
        mb="md"
        size="sm"
        color={successRate === 100 ? 'green' : 'blue'}
      />

      <Group justify="space-between" mt="md">
        <Text size="sm">Documents générés</Text>
        <Text size="sm" fw={500}>
          {documentsCount}
        </Text>
      </Group>

      <Group justify="space-between">
        <Text size="sm">Taux de succès</Text>
        <Text size="sm" fw={500}>
          {successRate}%
        </Text>
      </Group>
    </Card>
  );
}
