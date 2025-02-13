import axios from 'axios';

const API_BASE_URL = '/api';

export interface Field {
  name: string;
  type: string;
  required?: boolean;
}

export interface Relation {
  from: string;
  to: string;
}

export interface Model {
  name: string;
  fields: Field[];
  relations: Relation[];
}

export const modelService = {
  // Récupérer tous les modèles
  async getModels(): Promise<Model[]> {
    const response = await axios.get(`${API_BASE_URL}/models`);
    return response.data;
  },

  // Récupérer les documents d'une collection
  async getDocuments(
    collectionName: string,
    query: string = '',
    page: number = 1,
    perPage: number = 20
  ) {
    const response = await axios.get(`${API_BASE_URL}/collections/${collectionName}/documents`, {
      params: {
        query: query ? JSON.parse(query) : {},
        page,
        perPage,
      },
    });
    return response.data;
  },

  // Exporter en JSON
  async exportJSON(collectionName: string): Promise<Blob> {
    const response = await axios.get(`${API_BASE_URL}/collections/${collectionName}/export/json`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Exporter en CSV
  async exportCSV(collectionName: string): Promise<Blob> {
    const response = await axios.get(`${API_BASE_URL}/collections/${collectionName}/export/csv`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Rafraîchir les métadonnées d'une collection
  async refreshCollection(collectionName: string): Promise<Model> {
    const response = await axios.post(`${API_BASE_URL}/collections/${collectionName}/refresh`);
    return response.data;
  },
};
