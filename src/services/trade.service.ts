import {environment} from "../environment/environment";
import requestUtil from "../utils/request.util";

export const orderbook = async() => {
    const urlParam = '/v1/orderbook/SPOT_NEAR_USDC';
    return requestUtil.get(environment.config.apiUrl + urlParam)
}