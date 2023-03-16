import {useConnection} from "./ConnectionContext";
import {ConnectComponent} from "./connect.component";
import {AccountInfoComponent} from "./components/account-info.component";
import {EntryOrderComponent} from "./entry-order.component";
import {OrderbookComponent} from "./orderbook.component";
import {OrderListComponent} from "./components/order-list.component";
import {Color} from "./theme/color";

export function HomePage() {
    const {accountId} = useConnection();
    return (
        <div style={{
            background: Color.BG,
        }}>
            {
                accountId ?
                    <>
                        <AccountInfoComponent/>
                        <OrderbookComponent/>
                        <EntryOrderComponent/>
                        <OrderListComponent/>
                    </>
                    : <ConnectComponent/>
            }
        </div>
    )
}