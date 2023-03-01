import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {connect, WalletConnection} from "near-api-js";
import {environment} from "./environment/environment";
import {LoadingComponent} from "./loading.component";

interface ConnectionContextProviderProps {
    children: any;
}

interface ConnectionContextValue {
    accountId: string | null;
    walletConnection: WalletConnection | null;
    nearConfig: typeof environment.nearWalletConfig.connect;
}


const ConnectionContext = React.createContext<ConnectionContextValue | null>(null)
export const ConnectionContextProvider = ({children}: ConnectionContextProviderProps) => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [accountId, setAccountId] = useState<string | null>(null);
    const [walletConnection, setWalletConnection] = useState<WalletConnection | null>(null);
    const [walletUrl, setWalletUrl] = useState<string>('https://testnet.mynearwallet.com')
    const [nearConfig, setNearConfig] = useState<any>()

    const init = useCallback(async () => {
        const nearConfig = environment.nearWalletConfig.connect;
        nearConfig.walletUrl = walletUrl;
        setNearConfig(nearConfig);

        const nearConnection = await connect(nearConfig);
        let apiKeyPrefix = 'near-app';
        const connection = new WalletConnection(nearConnection, apiKeyPrefix);
        setWalletConnection(connection);
        console.log('is sign in', connection.isSignedIn());
        if (connection.isSignedIn()) {
            setAccountId(connection.getAccountId());
        }
        setLoading(false)

    }, []);

    useEffect(() => {
        init().then();
    }, [init])

    const providerValue = useMemo(() => ({
        accountId,
        walletConnection,
        nearConfig,
    }), [accountId, walletConnection, nearConfig])
    return (
        <ConnectionContext.Provider value={providerValue}>
            {isLoading ? <LoadingComponent/>
                :
                children
            }
        </ConnectionContext.Provider>
    )

}

export function useConnection() {
    const context = useContext(ConnectionContext);
    if (!context) {
        throw new Error('useConnection must be used within a ConnectionContextProvider');
    }
    return context;
}