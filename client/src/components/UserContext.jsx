import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        async function fetchUser() {
            try {
                const {data} = await axios.get('/profile');
                setUser(data);
            } catch (error) {
                console.error('Failed to fetch user:', error);
            } finally {
                setReady(true);  // İstek başarılı olsun ya da olmasın "ready"yi true yapıyoruz
            }
        }

        if (!user) {
            fetchUser();
        }
    }, [user]);

    return (
        <UserContext.Provider value={{user, setUser, ready}}>
            {children}
        </UserContext.Provider>
    );
}
