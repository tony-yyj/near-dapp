import {Account, Contract, KeyPair, providers, utils, WalletConnection} from "near-api-js";
import {AccessKeyViewRaw, AccountView, CodeResult} from "near-api-js/lib/providers/provider";
import {environment} from "../environment/environment";
import {createTransaction, functionCall, Transaction} from "near-api-js/lib/transaction";
import {serialize} from "near-api-js/lib/utils";
import keccak256 from "keccak256";

const EC = require('elliptic').ec;

const MAX_GAS = '300000000000000';
const BOATLOAD_OF_GAS = utils.format.parseNearAmount('0.00000000003')!;

export const setAnnounceKey = async (account: Account): Promise<any> => {
    return account.functionCall({
        contractId: environment.nearWalletConfig.contractName,
        methodName: 'user_announce_key',
        args: {},
        gas: MAX_GAS,
    });
}

export const callMethodByContract = (account: Account) => {
    const contract = new Contract(account, environment.nearWalletConfig.contractName, {
        viewMethods: [],
        changeMethods: ['user_announce_key'],
    });
    // @ts-ignore
    return contract.user_announce_key() as Promise;
}

export const callMethodByRequestSignTransaction = async (walletConnection: WalletConnection) => {

    const accountId = walletConnection.getAccountId();
    const provider = new providers.JsonRpcProvider({url: environment.nearWalletConfig.nodeUrl});
    const keyPair = await environment.nearWalletConfig.keyStore.getKey(environment.nearWalletConfig.networkId, accountId);

    // block_hash
    // block_height
    // nonce
    // permission: {FunctionCall: {allowance, method_names, receiver_id}}
    const publicKey = keyPair.getPublicKey();
    console.log('publickkey', publicKey.toString())
    console.log('key pair', keyPair.toString())
    const accessKey = await provider.query<AccessKeyViewRaw>(
        `access_key/${accountId}/${publicKey.toString()}`, ''
    );
    console.log(accessKey);

    const nonce = ++accessKey.nonce;
    const recentBlockHash = serialize.base_decode(accessKey.block_hash);
    const transactions: Transaction[] = [];
    transactions.push(createTransaction(
        walletConnection.getAccountId(),
        publicKey,
        environment.nearWalletConfig.contractName,
        nonce,
        [
            functionCall(
                'user_announce_key',
                {},
                MAX_GAS,
                0,
            )
        ],
        recentBlockHash,
    ))
    return walletConnection.requestSignTransactions({
        transactions,
    })


}
export const getNearBalance = async (accountId: string) => {
    const provider = new providers.JsonRpcProvider({url: environment.nearWalletConfig.nodeUrl});
    const balance = await provider.query<AccountView>({
        request_type: 'view_account',
        account_id: accountId,
        finality: 'optimistic',
    });
    return balance.amount;
};


function callViewFunction(params: { contractName: string; methodName: string; args: { [key: string]: any } }) {
    const provider = new providers.JsonRpcProvider({url: environment.nearWalletConfig.nodeUrl});
    const b64 = Buffer.from(JSON.stringify(params.args)).toString('base64');
    return provider
        .query<CodeResult>({
            request_type: 'call_function',
            account_id: params.contractName,
            method_name: params.methodName,
            args_base64: b64,
            finality: 'optimistic',
        })
        .then((res) => JSON.parse(Buffer.from(res.result).toString()));
}


export const checkUserAccountIsExist = (accountId: string) =>
    callViewFunction({
        contractName: environment.nearWalletConfig.contractName,
        methodName: 'user_account_exists',
        args: {
            user: accountId,
        },
    });

export const storageBalanceBounds = (tokenContractAddress: string, accountId: string) =>
    callViewFunction({
        contractName: tokenContractAddress,
        methodName: 'storage_balance_bounds',
        args: {
            account_id: accountId,
        },
    });


export const getAccessKeyInfo = async (accountId: string, keyPair: KeyPair): Promise<AccessKeyViewRaw> => {
    const provider = new providers.JsonRpcProvider({url: environment.nearWalletConfig.nodeUrl});

    const publicKey = keyPair.getPublicKey();
    return provider.query<AccessKeyViewRaw>(
        `access_key/${accountId}/${publicKey.toString()}`, ''
    );

}
export const storageDeposit = async (wallet: WalletConnection, depositValue: string) => {
    const accountId = wallet.getAccountId();
    const keyPair = await environment.nearWalletConfig.keyStore.getKey(environment.nearWalletConfig.networkId, accountId);
    const publicKey = keyPair.getPublicKey();

    const accessKeyInfo = await getAccessKeyInfo(accountId, keyPair);
    const nonce = ++accessKeyInfo.nonce;
    const recentBlockHash = serialize.base_decode(accessKeyInfo.block_hash);
    const transactions: Transaction[] = [];
    transactions.push(createTransaction(
        accountId,
        publicKey,
        environment.nearWalletConfig.contractName,
        nonce,
        [
            functionCall(
                'storage_deposit',
                {
                    receiver_id: environment.nearWalletConfig.contractName,
                    msg: '',

                },
                BOATLOAD_OF_GAS,
                depositValue,
            )
        ],
        recentBlockHash,
    ))
    return wallet.requestSignTransactions({
        transactions,
    })

};

export const isOrderlyKeyAnnounced = (accountId: string, orderlyKeyPair: KeyPair) =>
    callViewFunction({
        contractName: environment.nearWalletConfig.contractName,
        methodName: 'is_orderly_key_announced',
        args: {
            user: accountId,
            orderly_key: orderlyKeyPair.getPublicKey().toString(),
        },
    });
export const userStorageUsage = (accountId: string) =>
    callViewFunction({
        contractName: environment.nearWalletConfig.contractName,
        methodName: 'user_storage_usage',
        args: {
            user: accountId,
        },
    });

export const storageBalanceOf = (tokenContractAddress: string, accountId: string) =>
    callViewFunction({
        contractName: tokenContractAddress,
        methodName: 'storage_balance_of',
        args: {
            account_id: accountId,
        },
    });


export const storageCostOfAnnounceKey = () =>
    callViewFunction({
        contractName: environment.nearWalletConfig.contractName,
        methodName: 'storage_cost_of_announce_key',
        args: {},
    });

export const generateTradingKeyPair = () => {
    const ec = new EC('secp256k1');
    const keyPair = ec.genKeyPair();

    return {
        privateKey: keyPair.getPrivate().toString('hex'),
        publicKey: keyPair.getPublic().encode('hex'),
        keyPair,
    };
};

export const getTradingKeyPair = () => {
   const secretKey= localStorage.getItem('TradingKeySecret');
   if (! secretKey) {
       return generateTradingKeyPair();
   }
    const ec = new EC('secp256k1');
    const keyPair = ec.keyFromPrivate(secretKey);
    return {
        privateKey: keyPair.getPrivate().toString('hex'),
        publicKey: keyPair.getPublic().encode('hex'),
        keyPair,
    };
}

export const userRequestSetTradingKey = (account: Account, tradingKeyPair: any) => {
    const pubKeyAsHex = tradingKeyPair.publicKey.replace('04', '');
    const normalizeTradingKey = window.btoa(keccak256(pubKeyAsHex).toString('hex'));
    return account.functionCall({
        contractId: environment.nearWalletConfig.contractName,
        methodName: 'user_request_set_trading_key',
        args: {
            key: normalizeTradingKey,
        },
        gas: MAX_GAS,
        attachedDeposit: utils.format.parseNearAmount('0'),
    });

}


export const isTradingKeySet = async (accountId: string, orderlyKeyPair: KeyPair) =>
    callViewFunction({
        contractName: environment.nearWalletConfig.contractName,
        methodName: 'is_trading_key_set',
        args: {
            user: accountId,
            orderly_key: orderlyKeyPair.getPublicKey().toString(),
        },
    });