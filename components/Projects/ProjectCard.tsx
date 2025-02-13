import { ActionIcon, Badge, Card, Group, Menu, Progress, Text } from '@mantine/core';
import { IconDots, IconEdit, IconEye, IconTrash } from '@tabler/icons-react';

interface ProjectCardProps {
  title: string;
  description: string;
  documentsCount: number;
  successRate: number;
  status: 'active' | 'inactive';
}

export function ProjectCard({
  title,
  description,
  documentsCount,
  successRate,
  status,
}: ProjectCardProps) {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Group position="apart" mb="xs">
        <Text weight={500}>{title}</Text>
        <Group spacing={0}>
          <Badge
            color={status === 'active' ? 'green' : 'gray'}
            variant="light"
            size="sm"
          >
            {status === 'active' ? 'actif' : 'inactif'}
          </Badge>
          <Menu withinPortal position="bottom-end" shadow="sm">
            <Menu.Target>
              <ActionIcon>
                <IconDots size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item icon={<IconEye size={14} />}>Voir</Menu.Item>
              <Menu.Item icon={<IconEdit size={14} />}>Modifier</Menu.Item>
              <Menu.Item icon={<IconTrash size={14} />} color="red">
                Supprimer
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      <Text size="sm" color="dimmed" mb="md">
        {description}
      </Text>

      <Text size="sm" weight={500} mb={5}>
        Progression
      </Text>
      <Progress
        value={successRate}
        mb="md"
        size="sm"
        color={successRate === 100 ? 'green' : 'blue'}
      />

      <Group position="apart" mt="md">
        <Text size="sm">Documents générés</Text>
        <Text size="sm" weight={500}>
          {documentsCount}
        </Text>
      </Group>

      <Group position="apart">
        <Text size="sm">Taux de succès</Text>
        <Text size="sm" weight={500}>
          {successRate}%
        </Text>
      </Group>
    </Card>
  );
} 