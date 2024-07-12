import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {defaultNetwork, starcoinNetwork} from "./addresses";

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
    if (value) {
        return JSON.parse(value);
    }
    return defaultValue;
}

function maybeSelectDefaultNetwork(fullUrl: string | null, selectedNetwork: string | null) {
    // @ts-ignore
    const url = new URL(fullUrl);
    if (!selectedNetwork) {
        url.hostname = `${defaultNetwork}.${url.hostname}`;
        return url.toString();
    }
    return null;
}

const redirect_url = maybeSelectDefaultNetwork(window.location.href.toString(), starcoinNetwork);
if (redirect_url) {
    console.log("new url: " + redirect_url);
    window.location.href = redirect_url;
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
