import { Modal } from '@mantine/core';
import { CreateProjectForm } from './CreateProjectForm';

interface CreateProjectModalProps {
  opened: boolean;
  onClose: () => void;
}

export function CreateProjectModal({ opened, onClose }: CreateProjectModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title="Nouveau Projet" size="lg">
      <CreateProjectForm onClose={onClose} />
    </Modal>
  );
}
