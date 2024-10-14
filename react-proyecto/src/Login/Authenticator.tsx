// Authenticator.ts
import axiosInstance from "./axiosConfig";
import Cookies from 'js-cookie';

interface AuthProvider {
    login: (params: { username: string; password: string }) => Promise<void>;
    logout: () => Promise<void>;
}

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
            console.log("json importante: ", json);

            if (response.status === 200 && json) {
                const role = { role: json.tipo_usuario };
                const user_id = { userId: json.user_id };
                
                console.log("mi user id: ", user_id);
                console.log("Setting cookie with user data:", JSON.stringify(role));
                
                Cookies.set('user_role', JSON.stringify(role), { expires: 1, secure: true, sameSite: 'Strict' });
                
                console.log("Setting cookie with user data:", user_id);
                Cookies.set('user_ID', JSON.stringify(user_id), { expires: 1, secure: true, sameSite: 'Strict' });
                window.dispatchEvent(new CustomEvent('login-success'));
            } else {
                throw new Error("Token not provided by the backend");
            }
        } catch (error) {
            console.error('Error en el inicio de sesión:', error);
            return Promise.reject(error);
        }
    },
    logout: () => {
        // Eliminar las cookies de autenticación
        Cookies.remove('user_role');
        Cookies.remove('user_ID');
        // Eliminar cualquier dato adicional del almacenamiento local o de sesión
        localStorage.clear();
        sessionStorage.clear();
        console.log('Logout successful and credentials cleared');
        return Promise.resolve();
    },
};
