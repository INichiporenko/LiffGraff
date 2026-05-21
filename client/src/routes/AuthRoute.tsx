import {ReactNode, useEffect, useMemo, useState} from "react";
import {Navigate} from "react-router";
import {checkJWTToken} from "../utils/apiCalls/authApi.ts";

export const AuthRoute = ({ children }: { children: ReactNode }) => {
    const [isNotAuthenticated, setIsNotAuthenticated] = useState<boolean | null>(null);

    // Memoize the authentication check to prevent redundant calls
    const authCheck = useMemo(() => {
        let cachedValue: boolean | null = null;

        return async () => {
            if (cachedValue !== null) {
                return cachedValue; // Return cached value if available
            }
            const response = await checkJWTToken();
            cachedValue = !response; // Cache the result (inverted)
            return cachedValue;
        };
    }, []);

    useEffect(() => {
        const handleCheck = async () => {
            const result = await authCheck();
            setIsNotAuthenticated(result);
        };
        handleCheck();
    }, [authCheck]);

    if (isNotAuthenticated === null) {
        return null; // Optionally, return a loading spinner
    }

    return isNotAuthenticated ? children : <Navigate to="/" replace />;
};
