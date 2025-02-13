import { useRouter } from 'next/router';
import { AppShell } from '../../components/Layout/AppShell';
import { ProjectDetails } from '../../components/Projects/ProjectDetails';
import { useProjectStore } from '../../store/useProjectStore';

export default function ProjectPage() {
  const router = useRouter();
  const { id } = router.query;
  const projects = useProjectStore((state) => state.projects);
  const project = projects.find((p) => p.id === id);

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
