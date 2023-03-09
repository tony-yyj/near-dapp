import {ChangeEvent, useState} from "react";
import {entryOrder} from "./services/order.service";

enum OrderSideEnum {
    BUY = 'BUY',
    SELL = 'SELL',
}

export function EntryOrderComponent() {
    const [price, setPrice] = useState<string>('')
    const [amount, setAmount] = useState<string>('')
    const [type, setType] = useState<string>(OrderSideEnum.BUY);

    const onChangePrice = (event: ChangeEvent) =>
        setPrice((event.target as HTMLInputElement).value);

    const onChangeAmount = (event: ChangeEvent) =>
        setAmount((event.target as HTMLInputElement).value);

    const placeOrder = () => {
        // order message broker_id=woofi_dex&order_price=2.23&order_quantity=1&order_type=LIMIT&side=BUY&symbol=SPOT_NEAR_USDC
        const params: {[key: string]: any} = {
            order_price: price,
            order_quantity: amount,
            order_type: 'LIMIT',
            side: type,
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
                <label onClick={() => setType(OrderSideEnum.SELL)}>{OrderSideEnum.SELL}</label>
                <label onClick={() => setType(OrderSideEnum.BUY)}>{OrderSideEnum.BUY}</label>
                <div className='flex justify-items-center flex-col gap-2 w-2/6 m-auto'>
                    <input placeholder='price' value={price} onChange={onChangePrice}/>
                    <input placeholder='amount' value={amount} onChange={onChangeAmount}/>
                    <div className='cursor-pointer bg-green-400' onClick={placeOrder}>{type}</div>
                </div>
            </div>
        </div>
    )
}