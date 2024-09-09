import { AuthProvider } from "react-admin";
import axios from "axios";

export const authProvider: AuthProvider = {
    login: async (params: { username: string; password: string }) => {
        const { username, password } = params;

        try {
            const response = await axios.post("http://localhost:3003/login", {
                email: username,
                password: password,
            });

            const { tipo_usuario } = response.data;

            localStorage.setItem("username", username);
            localStorage.setItem("role", tipo_usuario);

            window.dispatchEvent(new CustomEvent('login-success'));

            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    },
    logout: () => {
        localStorage.clear();
        return Promise.resolve();
    },
    checkError: (error: any) => {
        const { status } = error;
        if (status === 401 || status === 403) {
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            return Promise.reject();
        }
        return Promise.resolve();
    },
    checkAuth: () => {
        return localStorage.getItem("username") ? Promise.resolve() : Promise.reject();
    },
    getPermissions: () => {
        const role = localStorage.getItem("role");
        return role ? Promise.resolve(role) : Promise.reject("No role found");
    },
};
