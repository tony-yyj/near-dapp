import {keyStores} from "near-api-js";

export const environment = {
    nearWalletConfig: {
        connect: {
            keyStore: new keyStores.BrowserLocalStorageKeyStore(),
            contractName: 'asset-manager.orderly-dev.testnet',
            // contractName: 'asset-manager.orderly-network.near',
            faucetContractName: 'faucet.orderly-dev.testnet',
            methodNames: ['user_announce_key', 'user_request_set_trading_key', 'create_user_account'],
            networkId: process.env.NODE_ENV === 'development' ? 'testnet' : 'NEAR_NETWORK_ENV',
            nodeUrl: 'https://rpc.testnet.near.org',
            walletUrl: 'https://wallet.testnet.near.org',
            helperUrl: 'https://helper.testnet.near.org',
            explorerUrl: 'https://explorer.testnet.near.org',
            appWallet: ['sender', 'coin98-wallet', 'nightly', 'wallet-connect', 'here-wallet'],
            headers: {},
        },
        connectCallback: {
            success: '',
            failure: '',
        },
    },
}