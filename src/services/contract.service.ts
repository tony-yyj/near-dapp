import {Account, Contract, providers, WalletConnection} from "near-api-js";
import {AccessKeyViewRaw, AccountView} from "near-api-js/lib/providers/provider";
import {environment} from "../environment/environment";
import {createTransaction, functionCall, Transaction} from "near-api-js/lib/transaction";
import {serialize} from "near-api-js/lib/utils";

const MAX_GAS = '300000000000000';

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