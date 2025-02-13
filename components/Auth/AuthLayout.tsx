import { ReactNode } from 'react';
import { Box, Container, Flex, Image, Paper } from '@mantine/core';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <Flex mih="100vh" bg="gray.0">
      <Container size="lg" py="xl" w="100%">
        <Flex gap={0} style={{ overflow: 'hidden', borderRadius: 'md' }}>
          <Box bg="brand.6" p="xl" style={{ flex: '1', color: 'white', minHeight: '600px' }}>
            <Image src="/logo.svg" alt="Logo" w={40} h={40} mb="xl" />
            <Box mb="xl">
              <Box fz={32} fw={700} mb="md">
                {title}
              </Box>
              <Box fz="lg" maw={400}>
                {subtitle}
              </Box>
            </Box>
          </Box>

          <Paper p="xl" style={{ flex: '1', minHeight: '600px' }}>
            {children}
          </Paper>
        </Flex>
      </Container>
    </Flex>
  );
}
