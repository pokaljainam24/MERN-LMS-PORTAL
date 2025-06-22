import React, { createContext, useState, useEffect } from "react";
import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) return;                    // already have a user
        const accessToken = localStorage.getItem("token");
        if (!accessToken) {
            setLoading(false);
            return;
        }

        const fetchUser = async () => {
            try {
                const res = await axiosInstance.get(API_PATHS.AUTH.GET_PROFILE);
                setUser(res.data);
            } catch (err) {
                console.error("User not authenticated", err);
                clearUser();
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [user]);

    /** Put/replace user in context */
    const updateUser = (userData) => {
        setUser(userData);
        setLoading(false);
    };

    /** Remove user and token (logout) */
    const clearUser = () => {
        setUser(null);
        localStorage.removeItem("token");
    };

    return (
        <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
