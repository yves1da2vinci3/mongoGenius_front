import { useCallback } from 'react';
import { Button, Group, useMantineColorScheme } from '@mantine/core';

const ColorSchemeToggle = () => {
  const { setColorScheme } = useMantineColorScheme();

  const setLightTheme = useCallback(() => setColorScheme('light'), [setColorScheme]);
  const setDarkTheme = useCallback(() => setColorScheme('dark'), [setColorScheme]);
  const setAutoTheme = useCallback(() => setColorScheme('auto'), [setColorScheme]);

  return (
    <Group justify="center" mt="xl">
      <Button onClick={setLightTheme}>Light</Button>
      <Button onClick={setDarkTheme}>Dark</Button>
      <Button onClick={setAutoTheme}>Auto</Button>
    </Group>
  );
};

export default ColorSchemeToggle;
