import jsonServerProvider from "ra-data-json-server";

// Aquí aseguramos que la URL de la API esté correctamente configurada a través de la variable de entorno.
export const dataProvider = jsonServerProvider(import.meta.env.VITE_JSON_SERVER_URL);
