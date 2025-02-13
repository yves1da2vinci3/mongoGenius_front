import { IconFileSpreadsheet, IconJson, IconTable } from '@tabler/icons-react';
import { Badge, Button, Card, Group, Stack, Text, Tooltip } from '@mantine/core';

interface Field {
  name: string;
  type: string;
  required?: boolean;
}

interface Relation {
  from: string;
  to: string;
}

interface ModelCardProps {
  name: string;
  fields: Field[];
  relations: Relation[];
  onViewDocuments: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
}

export function ModelCard({
  name,
  fields,
  relations,
  onViewDocuments,
  onExportJSON,
  onExportCSV,
}: ModelCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section withBorder inheritPadding py="xs">
        <Group justify="space-between">
          <Text fw={500} size="lg">
            {name}
          </Text>
          <Group gap="xs">
            <Tooltip label="Voir les documents">
              <Button
                variant="light"
                color="blue"
                size="xs"
                onClick={onViewDocuments}
                leftSection={<IconTable size={16} />}
              >
                Documents
              </Button>
            </Tooltip>
            <Button.Group>
              <Tooltip label="Exporter en JSON">
                <Button
                  variant="default"
                  size="xs"
                  onClick={onExportJSON}
                  leftSection={<IconJson size={16} />}
                />
              </Tooltip>
              <Tooltip label="Exporter en CSV">
                <Button
                  variant="default"
                  size="xs"
                  onClick={onExportCSV}
                  leftSection={<IconFileSpreadsheet size={16} />}
                />
              </Tooltip>
            </Button.Group>
          </Group>
        </Group>
      </Card.Section>

      <Stack gap="md" mt="md">
        <div>
          <Text size="sm" fw={500} mb="xs">
            Champs
          </Text>
          <Stack gap="xs">
            {fields.map((field) => (
              <Group key={field.name} gap="xs">
                <Text size="sm" c="dimmed">
                  {field.name}
                </Text>
                <Badge size="sm" variant="light" color={field.required ? 'red' : 'blue'}>
                  {field.type}
                  {field.required && '*'}
                </Badge>
              </Group>
            ))}
          </Stack>
        </div>

        {relations.length > 0 && (
          <div>
            <Text size="sm" fw={500} mb="xs">
              Relations
            </Text>
            <Stack gap="xs">
              {relations.map((relation) => (
                <Group key={relation.from} gap="xs">
                  <Text size="sm" c="dimmed">
                    {relation.from}
                  </Text>
                  <Badge size="sm" variant="outline">
                    {relation.to}
                  </Badge>
                </Group>
              ))}
            </Stack>
          </div>
        )}
      </Stack>
    </Card>
  );
}
