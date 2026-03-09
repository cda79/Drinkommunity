import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";

// create the Context object to be consumed by other components
export const AuthContext = createContext();

export function AuthProvider({children}) {
    //initialize state from localstorage
    //on refresh: the 'token' is NOT null
    //prevents protectedroute from redirecting to login

    const [token,setToken] = useState(localStorage.getItem("token") || null);
    const [user, setUser] = useState(null);

    useEffect(()=> {
        if (token){
            try {
                //decode JWT to get user details like username or password
                const decoded = jwtDecode(token);
                setUser(decoded);
            } catch (err) {
                console.error("Token is invalid or corrupted", err);
                logout();
            }
        } else {
            setUser(null);
        }
    }, [token]);

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
    }

    return (
        //provide 'token' and 'user' data
        //and 'login' and 'logout' functions to the whole app

        <AuthContext.Provider value={{token, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}