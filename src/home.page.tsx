import {useConnection} from "./ConnectionContext";
import {ConnectComponent} from "./connect.component";
import {AccountInfoComponent} from "./account-info.component";

export function HomePage() {
    const {accountId} = useConnection();
    return (
        <div>
            {
                accountId ? <AccountInfoComponent/> : <ConnectComponent/>
            }
        </div>
    )
}