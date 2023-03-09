import React from "react";
import {useEffect} from "react";
import {orderbook} from "./services/trade.service";

export function OrderbookComponent() {
    useEffect(() => {
        getOrderbook()

    })

    const getOrderbook = () => {
        orderbook().then(res => {
            console.log('orderbook', res);
        })
    }
    return (
        <div>

            <h2>Orderbook</h2>

        </div>
    )
}