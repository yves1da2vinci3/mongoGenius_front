import { useState } from 'react';
import { IconRobot, IconSend, IconUser } from '@tabler/icons-react';
import { Avatar, Button, Group, Paper, ScrollArea, Stack, Text, Textarea } from '@mantine/core';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // TODO: Implement API call to chat service
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Je suis en train d'analyser votre demande...",
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Stack h="calc(100vh - 200px)">
      <ScrollArea h="calc(100% - 100px)" p="md">
        <Stack gap="md">
          {messages.map((message) => (
            <Group
              key={message.id}
              style={{ alignSelf: message.sender === 'bot' ? 'flex-start' : 'flex-end' }}
              align="flex-start"
              gap="sm"
            >
              <Avatar color={message.sender === 'bot' ? 'blue' : 'gray'} radius="xl">
                {message.sender === 'bot' ? <IconRobot size={20} /> : <IconUser size={20} />}
              </Avatar>
              <Paper
                p="sm"
                style={{
                  backgroundColor:
                    message.sender === 'bot' ? 'var(--mantine-color-blue-0)' : 'white',
                  maxWidth: '80%',
                }}
              >
                <Text>{message.content}</Text>
                <Text size="xs" c="dimmed" mt={4}>
                  {message.timestamp.toLocaleTimeString()}
                </Text>
              </Paper>
            </Group>
          ))}
        </Stack>
      </ScrollArea>

      <Paper p="md" style={{ borderTop: '1px solid var(--mantine-color-gray-3)' }}>
        <Group>
          <Textarea
            placeholder="Tapez votre message..."
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            style={{ flex: 1 }}
            autosize
            maxRows={4}
          />
          <Button
            onClick={handleSendMessage}
            loading={isLoading}
            disabled={!input.trim() || isLoading}
            variant="filled"
          >
            <IconSend size={20} />
          </Button>
        </Group>
      </Paper>
    </Stack>
  );
}
