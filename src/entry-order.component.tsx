import {ChangeEvent, useState} from "react";
import {entryOrder} from "./services/order.service";

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
        <div>
            <h2>Place Order</h2>

            <div>
                <label onClick={() => setSideType(OrderSideEnum.SELL)}>{OrderSideEnum.SELL}</label>
                <label onClick={() => setSideType(OrderSideEnum.BUY)}>{OrderSideEnum.BUY}</label>
                <div>
                    order type:{Object.keys(OrderTypeEnum).map(key => <label key={key} onClick={() => setOrderType(key)}>{key}</label>)}

                    <br/>
                    current type: {orderType}

                </div>
                <div className='flex justify-items-center flex-col gap-2 w-2/6 m-auto'>
                    <input placeholder='price' value={price} onChange={onChangePrice}/>
                    <input placeholder='amount' value={amount} onChange={onChangeAmount}/>
                    <div className='cursor-pointer bg-green-400' onClick={placeOrder}>{side}</div>
                </div>
            </div>
        </div>
    )
}