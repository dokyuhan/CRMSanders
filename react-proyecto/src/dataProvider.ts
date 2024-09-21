import jsonServerProvider from "ra-data-json-server";
import { fetchUtils } from 'react-admin';
import { Options as HttpOptions } from 'ra-core';

const httpClient = (url: string, options: HttpOptions = {}) => {
  console.log("httpClient");
  console.log("Fetching with options:", options);
  console.log("url: ", url);
    if (!options.headers) {
        options.headers = new Headers({ Accept: 'application/json' });
        console.log("options.headers: ", options.headers);
    }
    const auth = JSON.parse(localStorage.getItem('auth') || '{}');
    (options.headers as Headers).set('Authorization', `Bearer ${auth.token}`);
    console.log("options.headers: ", options.headers);
    return fetchUtils.fetchJson(url, options);
};

export const dataProvider = jsonServerProvider('https://localhost:3003', httpClient);
