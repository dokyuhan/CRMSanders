import { AuthProvider } from "react-admin";
import axiosInstance from "./axiosConfig";

export const authProvider: AuthProvider = {
    login: async (params: { username: string; password: string }) => {
        const { username, password } = params;
    
        try {
            const response = await axiosInstance.post("login", {
                email: username,
                password: password,
            });
            
            console.log("Full response from backend:", response);
            const json = response.data;
            console.log("json: ", json);

            if (json.token) {
                localStorage.setItem('auth', JSON.stringify({ ...json }));
                window.dispatchEvent(new CustomEvent('login-success'));
            } else {
                throw new Error("Token not provided by the backend");
            }
        } catch (error) {
            return Promise.reject(error);
        }
    },
    logout: () => { // Elimina el token de autenticación al cerrar sesión
        localStorage.removeItem('auth');
        return Promise.resolve();
    },
    checkAuth: () => { // Obtiene el token de local storage
        return localStorage.getItem('auth') ? Promise.resolve() : Promise.reject();
    },
    checkError: ({ status }: { status: number }) => {
        if (status === 401 || status === 403) {
            localStorage.removeItem('auth');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getPermissions: () => { // obtiene el rol de localstorage
        const auth = JSON.parse(localStorage.getItem('auth') || '{}');
        return auth ? Promise.resolve(auth.role) : Promise.reject();
    },
};
