import { createContext, useEffect, useState, useCallback } from "react";

// create the Context object to be consumed by other components
export const AuthContext = createContext();

export function AuthProvider({children}) {
    //initialize state from localstorage
    //on refresh: the 'token' is NOT null
    //prevents protectedroute from redirecting to login

    const [token, setToken] = useState(localStorage.getItem("token") || null);
    const [user, setUser] = useState(null);

    const loadUser = useCallback(async () => {
        if (!token) {
            setUser(null);
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/api/auth/me", {
                headers: { Authorization: token },
            });

            if (!res.ok) {
                // token invalid/expired or user not found
                logout();
                return;
            }

            const data = await res.json();
            setUser(data);
        } catch (err) {
            console.error("Failed to load user from server", err);
            logout();
        }
    }, [token]);


    useEffect(()=> {
        loadUser();
    }, [loadUser]);

    function login(newToken) {
        //save token to browser memory
        localStorage.setItem("token", newToken);
        //update state to trigger re-render
        setToken(newToken);
    }

    //handle Logout function
    function logout() {
        localStorage.removeItem("token"); //remove from browser memory
        setToken(null); //reset state
        setUser(null);
    };

    return (
        //provide 'token' and 'user' data
        //and 'login' and 'logout' functions to the whole app

        <AuthContext.Provider value={{token, user, login, logout, loadUser}}>
            {children}
        </AuthContext.Provider>
    );
}