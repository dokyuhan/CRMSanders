// src/authProvider.ts
import { AuthProvider } from "react-admin";

export const authProvider: AuthProvider = {
    login: (params: { username: string; password: string }) => {
        const { username, password } = params;
        // Aquí deberías verificar el username y password contra tu base de datos o API
        const role = username === 'admin' ? 'admin' : 'user'; // Simple simulación de roles
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);
        window.dispatchEvent(new CustomEvent('login-success'));
        return Promise.resolve();
    },
    logout: () => {
        localStorage.removeItem("username");
        localStorage.removeItem("role");
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
        console.log("Current role from localStorage:", role);  // Debugging output
        return role ? (console.log("done"), Promise.resolve(role)) : Promise.reject("No role found");

    },
};

