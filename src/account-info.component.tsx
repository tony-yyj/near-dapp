import {useConnection} from "./ConnectionContext";
import {useEffect, useState} from "react";
import {
    getNearBalance,
    getUserTradingKey
} from "./services/contract.service";
import BigNumber from "bignumber.js";
import {getBalance} from "./services/asset.service";
import {DepositComponent} from "./deposit.component";
import {WithdrawComponent} from "./withdraw.component";
import {environment} from "./environment/environment";

export function AccountInfoComponent() {
    const {accountId, signOut} = useConnection();
    const [nearBalance, setNearBalance] = useState<string | null>(null);
    const [balance, setBalance] = useState<{[key: string]: string}>({})

    useEffect(() => {
        getNearBalance(accountId!).then(res => {
            setNearBalance(new BigNumber(res).shiftedBy(-24).toFixed(8))
        })
        getUserBalance();

        getTradingKey().then();


    }, [accountId])

    const getTradingKey = async () => {
        const orderlyKeyPair = await environment.nearWalletConfig.keyStore.getKey(environment.nearWalletConfig.networkId, accountId!);
        const pubKey = orderlyKeyPair.getPublicKey().toString();

        getUserTradingKey(accountId!, pubKey!).then(res => {
            console.log('already set tradingKey', res);
        })
    }


    const getUserBalance = () =>{
        getBalance().then(res => {
            console.log('balance', res);
            if (res.success) {
                const obj: {[key: string]: string} = {}
                res.data.balances.forEach((item: any) => {
                    obj[item.token] = item.holding;
                })
                setBalance(obj);
            }
        });
    }



    return (
        <div>
            <p>accountId: {accountId} </p>
            <p>near balance: {nearBalance} near</p>
            <div>
                {Object.keys(balance).map(key => <p key={key}>
                    {key}: {balance[key]}
                </p>)}
            </div>
            <div className='flex gap-10 justify-center'>
                <button onClick={signOut}>logout</button>
                <button onClick={getUserBalance}>refresh balance</button>

            </div>
            <DepositComponent/>
            <WithdrawComponent/>
        </div>
    )
}