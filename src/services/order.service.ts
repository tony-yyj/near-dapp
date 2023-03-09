import {environment} from "../environment/environment";
import requestUtil from "../utils/request.util";

export const entryOrder = async (params: any) => {
    return requestUtil.post(environment.config.apiUrl + '/v1/order', params);
}