import { IconChartBar, IconDatabase, IconHome, IconSettings } from '@tabler/icons-react';
import { Group, NavLink, Stack, Text } from '@mantine/core';

interface AppNavbarProps {
  width: { base: number };
}

export function AppNavbar({ width }: AppNavbarProps) {
  return (
    <Stack h="100%" p="xs" justify="space-between">
      <Stack gap="xs">
        <NavLink label="Tableau de bord" leftSection={<IconHome size={16} />} active />
        <NavLink label="Projets" leftSection={<IconDatabase size={16} />} />
        <NavLink label="Statistiques" leftSection={<IconChartBar size={16} />} />
        <NavLink label="Paramètres" leftSection={<IconSettings size={16} />} />
      </Stack>

      <Group p="xs">
        <Text size="xs" c="dimmed">
          Version 1.0.0
        </Text>
      </Group>
    </Stack>
  );
}
