import { firestore } from "@/config/firebase";
import { AppActionType, AppContextType } from "@/utils/types";
import { collection, limit, onSnapshot, query, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode}> = function({ children }) {
    const [appActions, setAppActions] = useState<AppActionType | null>(null);

    useEffect(function () {
        const collectionRef = collection(firestore, "app_actions");
        const q = query(collectionRef, where("accessTo", "==", "user-app"), limit(1));

        const unsub = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const data = snapshot.docs[0].data();
                setAppActions(data as any);
            }
        });

        return () => unsub();
    }, []);

    const contextValue: AppContextType = {
        actions: appActions,
    }

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if(!context) {
        throw new Error("useAppContext must be wrapped inside AppProvider");
    }
    return context;
}