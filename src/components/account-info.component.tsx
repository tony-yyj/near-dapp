import {useConnection} from "../ConnectionContext";
import {getUSDCFaucet,} from "../services/contract.service";
import {DepositComponent} from "../deposit.component";
import {WithdrawComponent} from "../withdraw.component";
import {ButtonBasic} from "./button.component";
import Wrapper from "./wrapper.component";

export function AccountInfoComponent() {
    const {accountId, signOut, walletConnection: wallet} = useConnection();

    const getUSDC = () => {
        getUSDCFaucet(wallet!).then();
    }


    return (
        <Wrapper width={'800px'}>
            <Wrapper.Title title={'accountInfo'}/>
            <div className='flex flex-col justify-items-start justify-start items-start gap-2 border-2 p-2'>
                <div>accountId: {accountId} </div>

                <ButtonBasic onClick={getUSDC}>GET 1000 USDC</ButtonBasic>
            </div>
            <div className='flex gap-10 justify-center'>
                <div onClick={signOut}>logout</div>
            </div>

            <Wrapper>
                <Wrapper.Title title={'deposit and withdraw'}/>


                <DepositComponent/>
                <WithdrawComponent/>
            </Wrapper>
        </Wrapper>
    )
}