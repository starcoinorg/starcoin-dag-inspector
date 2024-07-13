import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {combinendNetworkIntoFullURL, defaultNetwork, starcoinNetwork} from "./addresses";

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
    if (value) {
        return JSON.parse(value);
    }
    return defaultValue;
}


if (!starcoinNetwork) {
    window.location.href = combinendNetworkIntoFullURL(window.location.href.toString(), defaultNetwork);
}

const target = document.getElementById('kgi-root') as HTMLDivElement | null;
if (target) {
    const interactive = parseBoolean(target.dataset["interactive"], false);
    const root = ReactDOM.createRoot(target!);
    root.render(
        <React.StrictMode>
            <App interactive={interactive}/>
        </React.StrictMode>
    );
}
