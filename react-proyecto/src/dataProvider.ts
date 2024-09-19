import jsonServerProvider from "ra-data-json-server";
import { fetchUtils } from 'react-admin';
import { Options as HttpOptions } from 'ra-core';
import axios from 'axios';

const httpClient = (url: string, options: HttpOptions = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
    }
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    (options.headers as Headers).set('Authorization', `Bearer ${auth.token}`);
    return fetchUtils.fetchJson(url, options);
};

export const dataProvider = jsonServerProvider('https://localhost:3003', httpClient);

/*
import axios from 'axios';
 
const dataProvider = {
  // Obtener una lista de recursos
  getList: async (resource, params) => {
    try {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const filter = params.filter;
 
      const response = await axios.get(`/api/${resource}`, {
        params: {
          page: page,
          perPage: perPage,
          sortField: field,
          sortOrder: order,
          filter: JSON.stringify(filter),
        }
      });
 
      // Asegúrate de que la respuesta tenga { data: [...], total: number }
      return {
        data: response.data.data,
        total: response.data.total,
      };
    } catch (error) {
      console.error('Error en getList:', error);
      throw new Error(error.message);
    }
  },
 
  // Obtener un recurso por su ID
  getOne: async (resource, params) => {
    try {
      const response = await axios.get(`/api/${resource}/${params.id}`);
      return { data: response.data };
    } catch (error) {
      console.error('Error en getOne:', error);
      throw new Error(error.message);
    }
  },
 
  // Crear un nuevo recurso
  create: async (resource, params) => {
    try {
      const response = await axios.post(`/api/${resource}`, params.data);
      return { data: { ...params.data, id: response.data.id } };
    } catch (error) {
      console.error('Error en create:', error);
      throw new Error(error.message);
    }
  },
 
  // Actualizar un recurso existente
  update: async (resource, params) => {
    try {
      const response = await axios.put(`/api/${resource}/${params.id}`, params.data);
      return { data: response.data };
    } catch (error) {
      console.error('Error en update:', error);
      throw new Error(error.message);
    }
  },
 
  // Eliminar un recurso por su ID
  delete: async (resource, params) => {
    try {
      await axios.delete(`/api/${resource}/${params.id}`);
      return { data: params.previousData };
    } catch (error) {
      console.error('Error en delete:', error);
      throw new Error(error.message);
    }
  },
 
  // Obtener una lista de recursos por sus IDs
  getMany: async (resource, params) => {
    try {
      const response = await axios.get(`/api/${resource}`, {
        params: { ids: params.ids }
      });
      return { data: response.data };
    } catch (error) {
      console.error('Error en getMany:', error);
      throw new Error(error.message);
    }
  },
 
  // Obtener una lista de recursos con referencia a otra tabla (relación de muchos a muchos)
  getManyReference: async (resource, params) => {
    try {
      const { page, perPage } = params.pagination;
      const { field, order } = params.sort;
      const filter = params.filter;
 
      const response = await axios.get(`/api/${resource}`, {
        params: {
          page: page,
          perPage: perPage,
          sortField: field,
          sortOrder: order,
          filter: JSON.stringify({ ...filter, [params.target]: params.id }),
        }
      });
 
      return {
        data: response.data.data,
        total: response.data.total,
      };
    } catch (error) {
      console.error('Error en getManyReference:', error);
      throw new Error(error.message);
    }
  },
 
  // Actualizar varios recursos a la vez
  updateMany: async (resource, params) => {
    try {
      const response = await axios.put(`/api/${resource}`, {
        ids: params.ids,
        data: params.data,
      });
      return { data: response.data };
    } catch (error) {
      console.error('Error en updateMany:', error);
      throw new Error(error.message);
    }
  },
 
  // Eliminar varios recursos a la vez
  deleteMany: async (resource, params) => {
    try {
      await axios.delete(`/api/${resource}`, {
        data: { ids: params.ids }
      });
      return { data: params.ids };
    } catch (error) {
      console.error('Error en deleteMany:', error);
      throw new Error(error.message);
    }
  }
};
 
export default dataProvider;
*/