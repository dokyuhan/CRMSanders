import { AuthProvider } from "react-admin";
import axiosInstance from "./axiosConfig";
import Cookies from 'js-cookie';

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

            if (response.status === 200) {
                // Asegúrate de usar 'tipo_usuario', no 'role'
                const role = { role: json.tipo_usuario };
                const user_id = { userId: json.id };
                console.log("Setting cookie with user data:", JSON.stringify(role));
                console.log("Setting cookie with user data:", JSON.stringify(user_id));
                window.dispatchEvent(new CustomEvent('login-success'));
            } else {
                throw new Error("Token not provided by the backend");
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            return Promise.reject(error);
        }
    },
    logout: () => { // Elimina el token de autenticación al cerrar sesión
        // Eliminar las cookies de autenticación
        Cookies.remove('user_role', { path: '/' });
        Cookies.remove('user_ID', { path: '/' });
        //localStorage.removeItem('auth');
        console.log('Logout successful');
        return Promise.resolve();
    },
    checkAuth: () => { // Obtiene el token de local storage
        if (Cookies.get('user_role') && Cookies.get('user_ID')) {
            return Promise.resolve();
        } else {
            return Promise.reject();
        }
        //return localStorage.getItem('auth') ? Promise.resolve() : Promise.reject();
    },
    checkError: ({ status }: { status: number }) => {
        if (status === 401 || status === 403) {
            Cookies.remove('user_role', { path: '/' });
            Cookies.remove('user_ID', { path: '/' });
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getPermissions: () => {
        const role = Cookies.get('user_role');
        if (role) {
            return Promise.resolve(role);
        } else {
            return Promise.reject(new Error("No user role found"));
        }
    },
    getUserId: () => {
        const userId = Cookies.get('user_ID');
        if (userId) {
            return Promise.resolve(userId);
        } else {
            return Promise.reject(new Error("No user ID found"));
        }
    },
};
