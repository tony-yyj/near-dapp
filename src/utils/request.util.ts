import {environment} from "../environment/environment";
import {getTradingKeyPair, signMessageByOrderlyKey, signMessageByTradingKey} from "../services/contract.service";

enum MethodTypeEnum {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
}

async function get(url: string, params?: Object) {
    const accountId = 'neardapp-t1.testnet';

    const headers = await getOrderlySignature(url, accountId);
    return requestMethod(url, MethodTypeEnum.GET, params, headers);

}

async function post(url: string, params?:object) {

}

const getOrderlySignature = async (url: string, accountId: string, params?: null | Object): Promise<{ [key: string]: string }> => {
    const urlParam = url.split(environment.config.apiUrl)[1];
    const timestamp = new Date().getTime().toString();
    let messageStr = [timestamp, 'GET', urlParam].join('');
    if (params && Object.keys(params).length) {
        messageStr += JSON.stringify(params);
    }
    const keyPair = await environment.nearWalletConfig.keyStore.getKey(environment.nearWalletConfig.networkId, accountId)
    const sign = signMessageByOrderlyKey(messageStr, keyPair);

    return {
        'orderly-account-id': accountId,
        'orderly-key': keyPair?.getPublicKey().toString(),
        'orderly-timestamp': timestamp,
        'orderly-signature': sign,
    };

}

const getTradingKeySignature = async (params: { [key: string]: string }, accountId: string) => {
    const orderMessage = Object.keys(params)
        .sort()
        .map((key: string) => `${key}=${params[key]}`)
        .join('&',)

    const tradingKey = getTradingKeyPair();
    const tradingKeySignature = signMessageByTradingKey(orderMessage, tradingKey.keyPair);
    return {
        'orderly-trading-key': tradingKey?.publicKey.replace('04', ''),
        sign: tradingKeySignature,
    }

}

const requestMethod = (url: string, method: MethodTypeEnum, params: any, headers: { [key: string]: string } = {}) => {
    Object.assign({}, headers, {
        'Access-Control-Allow-Origin': '*',
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
    });

    return fetch(url, {
        method,
        headers,
        body: method === MethodTypeEnum.GET ? null : (params ? JSON.stringify(params) : null),

    })
        .then(response => response.json());

}

const requestUtil = {
    get,
}
export default requestUtil;