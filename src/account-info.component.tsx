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
import {ButtonBasic} from "./components/button.component";

export function AccountInfoComponent() {
    const {accountId, signOut} = useConnection();
    const [nearBalance, setNearBalance] = useState<string | null>(null);
    const [balance, setBalance] = useState<{ [key: string]: string }>({})

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


    const getUserBalance = () => {
        getBalance().then(res => {
            console.log('balance', res);
            if (res.success) {
                const obj: { [key: string]: string } = {}
                res.data.balances.forEach((item: any) => {
                    obj[item.token] = item.holding;
                })
                setBalance(obj);
            }
        });
    }


    return (
        <div className='w-[800px] m-auto p-[20px]'>
            <div className='flex flex-col justify-items-start justify-start items-start gap-2 border-2 p-2'>
                <div>accountId: {accountId} </div>
                <div className='flex gap-10'>
                    near balance: {nearBalance} near
                    <ButtonBasic onClick={getUserBalance}>refresh balance</ButtonBasic>
                </div>
            </div>
            <div className='flex gap-10 justify-center'>
                <div onClick={signOut}>logout</div>
            </div>
            <div>
            </div>
            <div className='border-2 border-cyan-300 w-[600px] m-auto'>
                {Object.keys(balance).map(key =>
                    <p className='w-full p-2 flex justify-items-start gap-2' key={key}>
                        <label>{key}</label>: <span>{balance[key]} </span>
                    </p>
                )}
            </div>
            <DepositComponent/>
            <WithdrawComponent/>
        </div>
    )
}