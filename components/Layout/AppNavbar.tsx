import Link from 'next/link';
import { useRouter } from 'next/router';
import { IconChartBar, IconDatabase, IconHome, IconSettings } from '@tabler/icons-react';
import { Group, NavLink, Stack, Text } from '@mantine/core';

interface AppNavbarProps {
  width: { base: number };
}

export function AppNavbar({ width }: AppNavbarProps) {
  const router = useRouter();

  const links = [
    { icon: IconHome, label: 'Accueil', href: '/' },
    { icon: IconDatabase, label: 'Projets', href: '/projects' },
    { icon: IconChartBar, label: 'Statistiques', href: '/stats' },
    { icon: IconSettings, label: 'Paramètres', href: '/settings' },
  ];

  return (
    <Stack h="100%" p="xs" justify="space-between">
      <Stack gap="xs">
        {links.map((link) => (
          <NavLink
            key={link.href}
            component={Link}
            href={link.href}
            label={link.label}
            leftSection={<link.icon size={20} stroke={1.5} />}
            active={router.pathname === link.href}
          />
        ))}
      </Stack>

      <Group p="xs">
        <Text size="xs" c="dimmed">
          Version 1.0.0
        </Text>
      </Group>
    </Stack>
  );
}
