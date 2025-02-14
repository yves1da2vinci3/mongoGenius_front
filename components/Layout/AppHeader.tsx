import { default as NextLink } from 'next/link';
import { IconMoonStars, IconSun } from '@tabler/icons-react';
import { ActionIcon, Button, Group, Text, useMantineColorScheme } from '@mantine/core';

interface AppHeaderProps {
  height: number;
}

const AppHeader = ({ height }: AppHeaderProps) => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const dark = colorScheme === 'dark';

  const toggleColorScheme = () => {
    setColorScheme(dark ? 'light' : 'dark');
  };

  return (
    <Group h={height} px="md" py="xs" justify="space-between">
      <Group>
        <NextLink href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Text size="xl" fw={700}>
            MongoGenius
          </Text>
        </NextLink>
      </Group>

      <Group>
        <ActionIcon
          variant="outline"
          color={dark ? 'yellow' : 'blue'}
          onClick={toggleColorScheme}
          title="Toggle color scheme"
          size="lg"
        >
          {dark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
        </ActionIcon>
        <Button component={NextLink} href="/auth/login" variant="default">
          Se connecter
        </Button>
        <Button component={NextLink} href="/auth/register">
          S'inscrire
        </Button>
      </Group>
    </Group>
  );
};

export default AppHeader;
