import axios from "axios";

// validate the user token on app load and user is already authenticated
export const validateUser = async (token: string) => {
            try {
                const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/validate`,
                    {
                        token: token
                    }
                );
                return res.data;
            } catch (error) {
                console.error('Token validation error:', error);
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('token');
            }
        };