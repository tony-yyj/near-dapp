import {providers} from "near-api-js";
import {AccountView} from "near-api-js/lib/providers/provider";
import {environment} from "../environment/environment";

export const AnnounceKey = () => {

}
export const getNearBalance = async (accountId: string) => {
    const provider = new providers.JsonRpcProvider({ url: environment.nearWalletConfig.connect.nodeUrl });
    const balance = await provider.query<AccountView>({
        request_type: 'view_account',
        account_id: accountId,
        finality: 'optimistic',
    });
    return balance.amount;
};