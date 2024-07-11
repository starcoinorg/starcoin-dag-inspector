import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {starcoinNetwork, supportedNetworks} from "./addresses";

function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
    if (value) {
        return JSON.parse(value);
    }
    return defaultValue;
}

if (!supportedNetworks) {
    throw new Error("The REACT_APP_SUPPORT_STARCOIN_NETWORK environment variable is required");
}

function maybeUpdateNetwork(currentUrl: string, network: string | null, inputSupporteNets: string[]): string | null {
    const url = new URL(currentUrl);
    // Checkin network and redirect
    if (!network) {
        // Add the `network` as subdomain into the URL
        url.hostname = `main.${url.hostname}`;
        console.log("url host name: " +  url.hostname);
    } else if (!inputSupporteNets.includes(starcoinNetwork)) {
        // Replace the `network` as subdomain into the URL
        const hostParts = url.hostname.split('.');
        if (hostParts.length === 1) {
            // Push to front of hostParts
            hostParts.unshift('main');
        } else {
            hostParts[0] = 'main';
        }
        url.hostname = hostParts.join('.');
        console.log("!inputSupporteNets.includes(starcoinNetwork), url host name: " + url.hostname + ", " + JSON.stringify(hostParts));
    } else {
        return null;
    }
    return url.toString();
}

const redirect_url = maybeUpdateNetwork(window.location.href.toString(), starcoinNetwork, supportedNetworks);
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
