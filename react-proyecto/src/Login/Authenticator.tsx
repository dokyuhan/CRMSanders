import { AuthProvider } from "react-admin";
import axios from "./axiosConfig";

export const authProvider: AuthProvider = {
    login: async (params: { username: string; password: string }) => {
        const { username, password } = params;
    
        try {
            const response = await axios.post("login", {
                email: username,
                password: password,
            });
            
            console.log("Full response from backend:", response);
            const { token, tipo_usuario } = response.data;
            
            console.log("Token from backend: ", token);
            console.log("Role from backend: ", tipo_usuario);
            console.log("Username from frontend: ", username);

            if (token) {
                localStorage.setItem("token", token);
                console.log("Stored token:", localStorage.getItem('token'));
                localStorage.setItem("username", username);
                localStorage.setItem("role", tipo_usuario);
                window.dispatchEvent(new CustomEvent('login-success'));
            } else {
                throw new Error("Token not provided by the backend");
            }
        } catch (error) {
            return Promise.reject(error);
        }
    },
    logout: () => {
        localStorage.removeItem("username");
        localStorage.removeItem("role");
        localStorage.removeItem("token");
        return Promise.resolve();
    },
    checkError: (error: any) => {
        const { status } = error;
        if (status === 401 || status === 403) {
            localStorage.removeItem("username");
            localStorage.removeItem("role");
            localStorage.removeItem("token");
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
