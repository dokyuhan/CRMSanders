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
                const userData = { role: json.tipo_usuario };
                console.log("Setting cookie with user data:", JSON.stringify(userData));
                Cookies.set('user_data', JSON.stringify(userData), { expires: 1, secure: true, sameSite: 'Strict' });
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
        Cookies.remove('user_data');
        //localStorage.removeItem('auth');
        console.log('Logout successful');
        return Promise.resolve();
    },
    checkAuth: () => { // Obtiene el token de local storage
        return Cookies.get('user_data') ? Promise.resolve() : Promise.reject();
        //return localStorage.getItem('auth') ? Promise.resolve() : Promise.reject();
    },
    checkError: ({ status }: { status: number }) => {
        if (status === 401 || status === 403) {
            Cookies.remove('user_data');
            //localStorage.removeItem('auth');
            return Promise.reject();
        }
        return Promise.resolve();
    },
    getPermissions: () => { // obtiene el rol de localstorage
        //const auth = JSON.parse(localStorage.getItem('auth') || '{}');
        const userData = Cookies.get('user_data');
        if (!userData) {
            return Promise.reject(new Error("No user data found"));
        }
        const { role } = JSON.parse(userData);
        return Promise.resolve(role);
    },
};
