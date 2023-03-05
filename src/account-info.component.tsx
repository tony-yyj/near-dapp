import {useConnection} from "./ConnectionContext";
import {useEffect, useState} from "react";
import {getNearBalance} from "./services/contract.service";
import BigNumber from "bignumber.js";
import {getBalance} from "./services/asset.service";
import {DepositComponent} from "./deposit.component";

export function AccountInfoComponent() {
    const {accountId, signOut} = useConnection();
    const [nearBalance, setNearBalance] = useState<string | null>(null);

    useEffect(() => {
        getNearBalance(accountId!).then(res => {
            setNearBalance(new BigNumber(res).shiftedBy(-24).toFixed(8))
        })
        getUserBalance();

    }, [accountId])


    const getUserBalance = () =>{
        getBalance().then(res => {
            console.log('res', res);
        });
    }



    return (
        <div>
            <p>accountId: {accountId} </p>
            <p>near balance: {nearBalance} near</p>
            <div>
                <button onClick={signOut}>logout</button>
                <button onClick={getUserBalance}>refresh balance</button>

            </div>
            <DepositComponent/>
            <div>
                <button>Withdraw</button>
            </div>
        </div>
    )
}