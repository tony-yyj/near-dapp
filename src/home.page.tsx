import {useConnection} from "./ConnectionContext";
import {ConnectComponent} from "./connect.component";
import {AccountInfoComponent} from "./account-info.component";
import {EntryOrderComponent} from "./entry-order.component";
import {OrderbookComponent} from "./orderbook.component";

export function HomePage() {
    const {accountId} = useConnection();
    return (
        <div>
            {
                accountId ?
                    <>
                        <AccountInfoComponent/>
                        <OrderbookComponent/>
                        <EntryOrderComponent/>
                    </>
                    : <ConnectComponent/>
            }
        </div>
    )
}