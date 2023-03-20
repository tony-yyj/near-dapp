import {useConnection} from "./ConnectionContext";
import {ConnectComponent} from "./connect.component";
import {AccountInfoComponent} from "./components/account-info.component";
import {EntryOrderComponent} from "./entry-order.component";
import {OrderbookComponent} from "./orderbook.component";
import {OrderListComponent} from "./components/order-list.component";
import {Color} from "./theme/color";
import {BalanceComponent} from "./components/balance.component";

export function HomePage() {
    const {accountId} = useConnection();
    return (
        <div style={{
            background: Color.BG,
            minWidth: '800px',
        }}>
            {
                accountId ?
                    <>
                        <AccountInfoComponent/>
                        <BalanceComponent/>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            height: '400px',
                            margin: '0 auto',
                        }}>
                            <OrderbookComponent/>
                            <EntryOrderComponent/>
                        </div>
                        <OrderListComponent/>
                    </>
                    : <ConnectComponent/>
            }
        </div>
    )
}