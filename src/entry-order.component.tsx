import {ChangeEvent, useState} from "react";
import {entryOrder} from "./services/order.service";
import {ButtonBasic} from "./components/button.component";
import Wrapper from "./components/wrapper.component";
import {InputComponent} from "./components/input.component";
import {Select} from "./components/select.component";

enum OrderSideEnum {
    BUY = 'BUY',
    SELL = 'SELL',
}

enum OrderTypeEnum {
    LIMIT = 'LIMIT',
    MARKET = 'MARKET',
    BID = 'BID',
    ASK = 'ASK',
}

export function EntryOrderComponent() {
    const [price, setPrice] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [orderType, setOrderType] = useState<string>(OrderTypeEnum.LIMIT);
    const [side, setSideType] = useState<string>(OrderSideEnum.BUY);

    const onChangePrice = (event: ChangeEvent) =>
        setPrice((event.target as HTMLInputElement).value);

    const onChangeAmount = (event: ChangeEvent) =>
        setAmount((event.target as HTMLInputElement).value);

    const placeOrder = () => {
        // order message broker_id=woofi_dex&order_price=2.23&order_quantity=1&order_type=LIMIT&side=BUY&symbol=SPOT_NEAR_USDC
        const params: { [key: string]: any } = {
            order_price: price,
            order_quantity: amount,
            order_type: orderType,
            side: side,
            symbol: 'SPOT_NEAR_USDC',
        }
        console.log(params);
        entryOrder(params).then(res => {
            console.log('place order res', res);
        })


    }

    return (
        <Wrapper width={'400px'}>
            <Wrapper.Title title={'Place Order'}/>
            <div className='flex flex-col gap-2 justify-center justify-items-center'>
                <div className='flex gap-2 justify-center'>
                    <label onClick={() => setSideType(OrderSideEnum.SELL)}>{OrderSideEnum.SELL}</label>
                    <label onClick={() => setSideType(OrderSideEnum.BUY)}>{OrderSideEnum.BUY}</label>
                </div>
                <div className='flex justify-center justify-items-center  gap-2 w-1/2 m-auto'>
                    <label>order type:</label>
                    <Select value={orderType} onChange={e => setOrderType(e.target.value)}>
                        {Object.keys(OrderTypeEnum).map(key =>
                            <option value={key} key={key} >{key}</option>
                        )}
                    </Select>
                </div>
                <div className='flex justify-items-center  gap-2 w-1/2 m-auto'>
                    <label className='w-1/3 shrink-0'>price:</label>
                    <InputComponent placeholder='price' value={price}
                           onChange={onChangePrice}/>
                </div>
                <div className='flex justify-items-center  gap-2 w-1/2 m-auto'>
                    <label className='w-1/3 shrink-0'>amount:</label>
                    <InputComponent placeholder='amount' value={amount}
                           onChange={onChangeAmount}/>
                </div>
                <div>
                    <ButtonBasic onClick={placeOrder}>{side}</ButtonBasic>
                </div>
            </div>
        </Wrapper>
    )
}