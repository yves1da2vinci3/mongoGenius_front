import { ReactNode } from 'react';
import { AppShell as MantineAppShell } from '@mantine/core';
import { AppHeader } from './AppHeader';
import { AppNavbar } from './AppNavbar';

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <MantineAppShell
      header={{ height: 60 }}
      navbar={{ width: { base: 300 }, breakpoint: 'sm' }}
      padding="md"
    >
      <MantineAppShell.Header>
        <AppHeader height={60} />
      </MantineAppShell.Header>

      <MantineAppShell.Navbar>
        <AppNavbar width={{ base: 300 }} />
      </MantineAppShell.Navbar>

      <MantineAppShell.Main>{children}</MantineAppShell.Main>
    </MantineAppShell>
  );
}
