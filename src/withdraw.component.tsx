import {useConnection} from "./ConnectionContext";
import {ChangeEvent, useEffect, useState} from "react";
import {withdrawNear} from "./services/contract.service";
import {getTokenList} from "./services/asset.service";

interface TokenConfigInterface{
    token: string;
    token_account_id: string;
}

export function WithdrawComponent() {
    const [amount, setAmount] = useState<string>('');
    const [tokenList, setTokenList] = useState<TokenConfigInterface[]>([])
    const {walletConnection} = useConnection();
    useEffect(() => {
        getTokenList().then(list=> {
            setTokenList(list);

        })
    }, [])
    const onWithdraw = () => {
        const tokenData = tokenList.find(item => item.token === 'NEAR');
        console.log('token data', tokenData);
        if (!tokenData) {
           return false;
        }
        withdrawNear(walletConnection!, tokenData.token_account_id, amount).then();

    }
    const onChange = (e: ChangeEvent) => {
        setAmount((e.target as HTMLInputElement).value);
    }
    return (
        <form className='flex justify-center gap-2 mt-2'>
            <input type='number' value={amount} onChange={onChange}/>
            <div  onClick={onWithdraw}>Withdraw</div>
        </form>
    )
}