import {ChangeEvent, useState} from "react";
import {useConnection} from "./ConnectionContext";
import {depositNear} from "./services/contract.service";

export function DepositComponent() {
    const {walletConnection} = useConnection();
    const [amount, setAmount] = useState<string>('1');

    const onDepositClick = () => {
        console.log('value', amount);
        depositNear(walletConnection!, amount).then();


    }

    const changeValue = (e: ChangeEvent) => {
        setAmount((e.target as HTMLInputElement).value);
    }
    return (
        <form className='flex justify-center gap-2 '>
            <input type='number' value={amount} onChange={changeValue}/>
            <div onClick={onDepositClick}>Deposit</div>
        </form>
    )
}