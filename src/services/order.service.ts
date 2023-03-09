import {environment} from "../environment/environment";
import {getTradingKeyPair, signMessageByOrderlyKey, signMessageByTradingKey} from "./contract.service";

export const entryOrder = async (params: any) => {
    const urlParam = '/v1/order';
    const accountId = 'neardapp-t1.testnet';
    const headers = {
        'Access-Control-Allow-Origin': '*',
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
    }

    const orderMessage = Object.keys(params)
        .sort()
        .map((key: string) => `${key}=${params[key]}`)
        .join('&',)

    const tradingKey = getTradingKeyPair();
    const tradingKeySignature = signMessageByTradingKey(orderMessage, tradingKey.keyPair);
    console.log('sign', tradingKeySignature);
    Object.assign(headers, {
        'orderly-trading-key': tradingKey?.publicKey.replace('04', ''),
    });
    params.signature = tradingKeySignature;

    const keyPair = await environment.nearWalletConfig.keyStore.getKey(environment.nearWalletConfig.networkId, accountId)
    const timestamp = new Date().getTime().toString();
    const messageStr = [
        timestamp,
        'POST',
        urlParam,
        JSON.stringify(params),
    ].join('');
    const orderlyKeySignature = signMessageByOrderlyKey(messageStr, keyPair);

    Object.assign(headers, {
        'orderly-account-id': accountId,
        'orderly-key': keyPair?.getPublicKey().toString(),
        'orderly-timestamp': timestamp,
        'orderly-signature': orderlyKeySignature,
    });
    return fetch(environment.config.apiUrl + urlParam, {
        method: 'POST',
        headers,
        body: JSON.stringify(params),
    })
        .then(response => response.json());
}