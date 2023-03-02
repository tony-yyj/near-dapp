import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {Account, connect, WalletConnection} from "near-api-js";
import {environment} from "./environment/environment";
import {LoadingComponent} from "./loading.component";
import {NearConfig} from "near-api-js/lib/near";
import {
    checkUserAccountIsExist, getTradingKeyPair,
    isOrderlyKeyAnnounced, isTradingKeySet, setAnnounceKey,
    storageBalanceBounds, storageBalanceOf, storageCostOfAnnounceKey,
    storageDeposit, userRequestSetTradingKey, userStorageUsage
} from "./services/contract.service";
import BigNumber from "bignumber.js";

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
                const accountId = connection.getAccountId();
                const isExist = await checkUserAccountIsExist(accountId);
                console.log('is exist', isExist);
                console.log('accountid', accountId)
                const orderlyKeyPair = await environment.nearWalletConfig.keyStore.getKey(environment.nearWalletConfig.networkId, accountId);
                if (!isExist) {
                    const bounds = await storageBalanceBounds(environment.nearWalletConfig.contractName, accountId);
                    console.log('bounds', bounds)
                    const storageDepositRes = await storageDeposit(connection, bounds.min);
                    console.log('storagedeposit', storageDepositRes)
                }
                const isAnnounced = await isOrderlyKeyAnnounced(accountId, orderlyKeyPair!);
                console.log('is announced', isAnnounced)
                const storageUsage = await userStorageUsage(accountId);
                console.log('storageusage', storageUsage);
                const balanceOf = await storageBalanceOf(environment.nearWalletConfig.contractName, accountId);
                console.log('storage balance', balanceOf);
                const storageCost = await storageCostOfAnnounceKey()
                console.log('storage coast', storageCost)
                const value = new BigNumber(storageUsage).plus(new BigNumber(storageCost)).minus(new BigNumber(balanceOf.total));
                console.log('value', value.shiftedBy(-24).toString())
                if (value.isGreaterThan(0)) {
                    const storageDepositRes = await storageDeposit(connection, value.toFixed());
                }
                if (!isAnnounced) {
                    const setOrderlyKeyRes = await setAnnounceKey(nearAccount!);
                    console.log('set orderlyKey res', setOrderlyKeyRes);
                }
                // if (localStorage.getItem('TradingKeySecret')) {
                const tradingKeyPair = getTradingKeyPair();
                const isSet = await isTradingKeySet(accountId, orderlyKeyPair);
                console.log('isset', isSet);
                if (!isSet) {
                    const setTradingKeyRes = await userRequestSetTradingKey(nearAccount, tradingKeyPair);
                    console.log('set tradingKey res', setTradingKeyRes);
                    localStorage.setItem('TradingKeySecret', tradingKeyPair.privateKey);
                }




                // const setTradingKeyRes = await userRequestSetTradingKey(nearAccount, tradingKeyPair);


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