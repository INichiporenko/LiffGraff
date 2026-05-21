import {axiosInstance} from "./index.ts";

export const checkJWTToken = async () => {
    try {
        const result = await axiosInstance.get('/auth/check-access-token');
        return result.data.message === 'Token is valid';
    } catch(error) {
        console.error('Unexpected error during auth check:', error);
    }
};