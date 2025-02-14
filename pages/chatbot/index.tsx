import { useState } from 'react';
import { Container, Paper, Tabs, Text, Title } from '@mantine/core';
import ChatInterface from '../../components/ChatBot/ChatInterface';
import PromptLibrary from '../../components/ChatBot/PromptLibrary';
import AppShell from '../../components/Layout/AppShell';

export default function ChatBot() {
  const [activeTab, setActiveTab] = useState<string | null>('chat');

  return (
    <AppShell>
      <Container size="xl">
        <Title order={1} mb="lg">
          Assistant IA
        </Title>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <Tabs.List>
            <Tabs.Tab value="chat">Chat</Tabs.Tab>
            <Tabs.Tab value="prompts">Bibliothèque de Prompts</Tabs.Tab>
            <Tabs.Tab value="history">Historique</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="chat" pt="md">
            <ChatInterface />
          </Tabs.Panel>

          <Tabs.Panel value="prompts" pt="md">
            <PromptLibrary />
          </Tabs.Panel>

          <Tabs.Panel value="history" pt="md">
            <Paper p="md">
              <Text>Historique des conversations à implémenter</Text>
            </Paper>
          </Tabs.Panel>
        </Tabs>
      </Container>
    </AppShell>
  );
}
