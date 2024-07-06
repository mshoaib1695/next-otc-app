import { PropsWithChildren, createContext, useContext, useState } from 'react';

type Wallet = {
    connected: boolean;
};

const AuthContext = createContext<Wallet | null>(null);

type AuthProviderProps = PropsWithChildren & {
    isConnected?: boolean;
};

export default function AuthProvider({ children, isConnected }: AuthProviderProps) {
    const [wallet] = useState<Wallet | null>(isConnected ? { connected: true } : null);

    return <AuthContext.Provider value={wallet}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
