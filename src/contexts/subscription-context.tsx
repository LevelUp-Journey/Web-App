"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useState } from "react";

interface SubscriptionContextType {
    refreshSubscriptions: () => void;
    subscriptionKey: number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(
    undefined,
);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
    const [subscriptionKey, setSubscriptionKey] = useState(0);

    const refreshSubscriptions = useCallback(() => {
        setSubscriptionKey((prev) => prev + 1);
    }, []);

    return (
        <SubscriptionContext.Provider
            value={{ refreshSubscriptions, subscriptionKey }}
        >
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscriptionContext() {
    const context = useContext(SubscriptionContext);
    if (context === undefined) {
        throw new Error(
            "useSubscriptionContext must be used within a SubscriptionProvider",
        );
    }
    return context;
}
