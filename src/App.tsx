import React from 'react';
import './App.css';
import {ConnectComponent} from "./connect.component";
import {ConnectionContextProvider} from "./ConnectionContext";

function App() {
  return (
    <div className="App">
        <ConnectionContextProvider>
            <ConnectComponent/>
        </ConnectionContextProvider>
    </div>
  );
}

export default App;
