import {useConnection} from "./ConnectionContext";
import {useEffect, useState} from "react";
import {getNearBalance} from "./services/contract.service";
import BigNumber from "bignumber.js";
export function AccountInfoComponent() {
    const {accountId} = useConnection();
    const [nearBalance, setNearBalance] = useState<string | null>(null);

    useEffect(() => {
        getNearBalance(accountId!).then(res => {
            setNearBalance(new BigNumber(res).shiftedBy(-24).toFixed(8))
        })

    }, [])


    return (
        <div>
            <p>accountId: {accountId} </p>
            <p>near balance: {nearBalance} near</p>
        </div>
    )
}