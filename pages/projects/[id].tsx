import { useRouter } from 'next/router';
import { AppShell } from '../../components/Layout/AppShell';
import { ProjectDetails } from '../../components/Projects/ProjectDetails';
import { useProjectStore } from '../../store/useProjectStore';

const FAKE_PROJECT = {
  id: '1',
  title: 'Projet Alpha',
  description: 'Description du projet Alpha',
  documentsCount: 5,
  successRate: 80,
  status: 'active',
};

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;
  const projects = useProjectStore((state) => state.projects);
  const project = projects.find((p) => p.id === id) || FAKE_PROJECT;

  if (!project) {
    return (
      <AppShell>
        <div>Projet non trouvé</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ProjectDetails project={project} />
    </AppShell>
  );
}
