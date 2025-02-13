import { useEffect, useState } from 'react';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Grid, LoadingOverlay, Stack, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { AppShell } from '../components/Layout/AppShell';
import { CollectionTable } from '../components/Models/CollectionTable';
import { ModelCard } from '../components/Models/ModelCard';
import { RelationshipGraph } from '../components/Visualization/RelationshipGraph';
import { Model, modelService } from '../services/modelService';

// Types pour les modèles
interface Field {
  name: string;
  type: string;
  required?: boolean;
}

interface Relation {
  from: string;
  to: string;
}

interface Model {
  name: string;
  fields: Field[];
  relations: Relation[];
}

// Exemple de données (à remplacer par les vraies données de l'API)
const SAMPLE_MODELS: Model[] = [
  {
    name: 'User',
    fields: [
      { name: 'email', type: 'String', required: true },
      { name: 'password', type: 'String', required: true },
      { name: 'firstName', type: 'String' },
      { name: 'lastName', type: 'String' },
      { name: 'role', type: 'String' },
      { name: 'addresses', type: 'Array' },
    ],
    relations: [
      { from: 'orders', to: 'Order' },
      { from: 'profile', to: 'Profile' },
    ],
  },
  {
    name: 'Order',
    fields: [
      { name: 'reference', type: 'String', required: true },
      { name: 'total', type: 'Number' },
      { name: 'status', type: 'String' },
      { name: 'items', type: 'Array' },
      { name: 'createdAt', type: 'Date' },
    ],
    relations: [
      { from: 'user', to: 'User' },
      { from: 'products', to: 'Product' },
    ],
  },
];

export default function ModelsPage() {
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');

  // Charger les modèles au démarrage
  useEffect(() => {
    loadModels();
  }, []);

  // Charger les documents lorsque le modèle sélectionné change
  useEffect(() => {
    if (selectedModel) {
      loadDocuments(selectedModel, searchQuery, currentPage, perPage);
    }
  }, [selectedModel, currentPage, perPage, searchQuery]);

  const loadModels = async () => {
    try {
      setLoading(true);
      const data = await modelService.getModels();
      setModels(data);
    } catch (error) {
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de charger les modèles',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const loadDocuments = async (
    modelName: string,
    query: string = '',
    page: number = 1,
    itemsPerPage: number = 20
  ) => {
    try {
      setDocumentsLoading(true);
      const response = await modelService.getDocuments(modelName, query, page, itemsPerPage);
      setDocuments(response.documents);
      setTotalDocuments(response.total);
    } catch (error) {
      notifications.show({
        title: 'Erreur',
        message: 'Impossible de charger les documents',
        color: 'red',
        icon: <IconX size={16} />,
      });
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handleViewDocuments = async (modelName: string) => {
    setSelectedModel(modelName);
    setCurrentPage(1);
    setSearchQuery('');
  };

  const handleExportJSON = async (modelName: string) => {
    try {
      const blob = await modelService.exportJSON(modelName);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${modelName}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      notifications.show({
        title: 'Succès',
        message: 'Export JSON téléchargé avec succès',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    } catch (error) {
      notifications.show({
        title: 'Erreur',
        message: "Erreur lors de l'export JSON",
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  const handleExportCSV = async (modelName: string) => {
    try {
      const blob = await modelService.exportCSV(modelName);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${modelName}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      notifications.show({
        title: 'Succès',
        message: 'Export CSV téléchargé avec succès',
        color: 'green',
        icon: <IconCheck size={16} />,
      });
    } catch (error) {
      notifications.show({
        title: 'Erreur',
        message: "Erreur lors de l'export CSV",
        color: 'red',
        icon: <IconX size={16} />,
      });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleRefresh = async () => {
    if (selectedModel) {
      try {
        await modelService.refreshCollection(selectedModel);
        await loadModels();
        await loadDocuments(selectedModel, searchQuery, currentPage, perPage);
        notifications.show({
          title: 'Succès',
          message: 'Collection rafraîchie avec succès',
          color: 'green',
          icon: <IconCheck size={16} />,
        });
      } catch (error) {
        notifications.show({
          title: 'Erreur',
          message: 'Impossible de rafraîchir la collection',
          color: 'red',
          icon: <IconX size={16} />,
        });
      }
    }
  };

  // Convertir les modèles en format compatible avec le graphe
  const graphData = {
    nodes: models.map((model) => ({
      id: model.name,
      name: model.name,
      type: 'collection',
      fields: model.fields,
    })),
    links: models.flatMap((model) =>
      model.relations.map((relation) => ({
        source: model.name,
        target: relation.to,
        type: 'oneToMany',
      }))
    ),
  };

  return (
    <AppShell>
      <Stack gap="xl" pos="relative">
        <LoadingOverlay visible={loading} />

        <Title order={2}>Modèles de Données</Title>

        <Grid>
          <Grid.Col span={12}>
            <RelationshipGraph {...graphData} />
          </Grid.Col>
        </Grid>

        <Grid>
          {models.map((model) => (
            <Grid.Col key={model.name} span={{ base: 12, md: 6, lg: 4 }}>
              <ModelCard
                name={model.name}
                fields={model.fields}
                relations={model.relations}
                onViewDocuments={() => handleViewDocuments(model.name)}
                onExportJSON={() => handleExportJSON(model.name)}
                onExportCSV={() => handleExportCSV(model.name)}
              />
            </Grid.Col>
          ))}
        </Grid>

        {selectedModel && (
          <CollectionTable
            collectionName={selectedModel}
            fields={models.find((m) => m.name === selectedModel)?.fields || []}
            documents={documents}
            totalDocuments={totalDocuments}
            currentPage={currentPage}
            perPage={perPage}
            loading={documentsLoading}
            onRefresh={handleRefresh}
            onSearch={handleSearch}
            onPageChange={setCurrentPage}
            onPerPageChange={setPerPage}
          />
        )}
      </Stack>
    </AppShell>
  );
}
