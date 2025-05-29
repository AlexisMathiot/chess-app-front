// services/authService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_PUBLIC_API_URL // Ajustez selon votre config

// Configuration axios
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercepteur pour ajouter le token aux requêtes
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer l'expiration du token
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Token expiré, essayer de le rafraîchir ou rediriger vers login
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    // Connexion
    async login(email, password) {
        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('password', password);

            const response = await axios.post(`${API_BASE_URL}/token`, formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            const { access_token, token_type } = response.data;

            // Stocker le token
            localStorage.setItem('access_token', access_token);

            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Erreur de connexion' };
        }
    },

    // Inscription
    async register(userData) {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth`, userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Erreur d\'inscription' };
        }
    },

    // Déconnexion
    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    },

    // Vérifier si l'utilisateur est connecté
    isAuthenticated() {
        const token = localStorage.getItem('access_token');
        if (!token) return false;

        try {
            // Vérifier si le token n'est pas expiré (optionnel)
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000;
        } catch {
            return false;
        }
    },

    // Obtenir les infos utilisateur
    async getCurrentUser() {
        try {
            const response = await apiClient.get('/users/me');
            return response.data;
        } catch (error) {
            throw error.response?.data || { detail: 'Erreur lors de la récupération des données utilisateur' };
        }
    }
};

export default apiClient;
