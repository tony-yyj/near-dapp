import React, {useEffect, useState} from "react";
import {connect, WalletConnection} from "near-api-js";
import {environment} from "./environment/environment";
import {AccountInfoComponent} from "./account-info.component";
import {useConnection} from "./ConnectionContext";

export const ConnectComponent = () => {
    const {accountId, walletConnection, nearConfig} = useConnection();

    const onConnect = () => {
        walletConnection?.requestSignIn(nearConfig)
    }

    return (
        <div>
            {accountId?
                <AccountInfoComponent/>
                :
                <button onClick={onConnect}>connect</button>
            }

        </div>
    )
}