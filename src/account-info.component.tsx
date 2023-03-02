import {useConnection} from "./ConnectionContext";
import {useEffect, useState} from "react";
import {getNearBalance, setAnnounceKey} from "./services/contract.service";
import BigNumber from "bignumber.js";
export function AccountInfoComponent() {
    const {accountId, account, walletConnection} = useConnection();
    const [nearBalance, setNearBalance] = useState<string | null>(null);

    useEffect(() => {
        getNearBalance(accountId!).then(res => {
            setNearBalance(new BigNumber(res).shiftedBy(-24).toFixed(8))
        })

    }, [])

    const onAnnounceKey = () => {
        console.log('wallet connection', walletConnection)
        setAnnounceKey(account!).then((res: any) => {
            console.log('announce key', res);
        });

    }


    return (
        <div>
            <p>accountId: {accountId} </p>
            <p>near balance: {nearBalance} near</p>
            <button onClick={onAnnounceKey}>announce key</button>
        </div>
    )
}