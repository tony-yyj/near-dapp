import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {Account, connect, KeyPair, WalletConnection} from "near-api-js";
import {environment} from "./environment/environment";
import {LoadingComponent} from "./loading.component";
import {NearConfig} from "near-api-js/lib/near";

interface ConnectionContextProviderProps {
    children: any;
}

interface ConnectionContextValue {
    accountId: string | null;
    account: Account | null;
    walletConnection: WalletConnection | null;
    nearConfig: NearConfig;
}


const ConnectionContext = React.createContext<ConnectionContextValue | null>(null)
export const ConnectionContextProvider = ({children}: ConnectionContextProviderProps) => {
    const [isLoading, setLoading] = useState<boolean>(true);
    const [account, setAccount] = useState<Account | null>(null)
    const [accountId, setAccountId] = useState<string | null>(null);
    const [walletConnection, setWalletConnection] = useState<WalletConnection | null>(null);
    const [walletUrl, setWalletUrl] = useState<string>('https://testnet.mynearwallet.com')
    const [nearConfig, setNearConfig] = useState<any>()

    const init = useCallback(async () => {
        try {

            const nearConfig = environment.nearWalletConfig;
            nearConfig.walletUrl = walletUrl;
            setNearConfig(nearConfig);

            const nearConnection = await connect(nearConfig);
            let appKeyPrefix = 'near_app';
            const connection = new WalletConnection(nearConnection, appKeyPrefix);
            setWalletConnection(connection);
            console.log('is sign in', connection.isSignedIn());
            if (connection.isSignedIn()) {
                const nearAccount = await nearConnection.account(connection.getAccountId());
                setAccount(nearAccount)

                setAccountId(connection.getAccountId());
            }
            setLoading(false)

        } catch (e) {
            setLoading(false);
            console.log(e);
        }
    }, []);

    useEffect(() => {
        init().then();
    }, [init])

    const providerValue = useMemo(() => ({
        accountId,
        walletConnection,
        nearConfig,
        account,
    }), [accountId, walletConnection, nearConfig, account])
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