import {environment} from "../environment/environment";
import {signMessageByOrderlyKey} from "./contract.service";

export const getBalance = async (): Promise<any> => {
    const urlParam = '/position/balances';
    const accountId = 'neardapp-t1.testnet';
    const timestamp = new Date().getTime().toString();
    const messageStr = [timestamp, 'GET', urlParam].join('');
    const keyPair = await environment.nearWalletConfig.keyStore.getKey(environment.nearWalletConfig.networkId, accountId)
    const sign = signMessageByOrderlyKey(messageStr, keyPair);

    const headers = {
        'Access-Control-Allow-Origin': '*',
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
    }
    Object.assign(headers, {
        'orderly-account-id': accountId,
        'orderly-key': keyPair?.getPublicKey().toString(),
        'orderly-timestamp': timestamp,
        'orderly-signature': sign,
    });
    return fetch(environment.config.apiUrl + '/position/balances', {
        method: 'GET',
        headers,
    })
        .then(response => response.json())
        .then(res => {
            console.log('balance', res);
            return Promise.resolve(res);

        })
}