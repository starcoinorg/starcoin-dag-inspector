// Environment variables are used for configuring the application.
// They define the addresses of the 3 components that are targets of queries.
// A variable must contain a host and optionally a port and/or a protocol.

const resolveAddress = (environmentVariableName: string): string => {
    const address = process.env[environmentVariableName];
    if (!address) {
        throw new Error(`The ${environmentVariableName} environment variable is required`);
    }
    const prefix = address.includes("//") ? "" : `${window.location.protocol}//`;
    return `${prefix}${address}`;
};

function getNetworkFromURL(): string {
    const url = new URL(window.location.href);
    const hostnameParts = url.hostname.split('.');
    // Assuming the first part of the hostname is the network
    return hostnameParts[0];
}

const apiAddress = resolveAddress("REACT_APP_API_ADDRESS");
const explorerAddress = resolveAddress("REACT_APP_EXPLORER_ADDRESS");
const starcoinLiveAddress = resolveAddress("REACT_APP_STARCOIN_LIVE_ADDRESS");
const starcoinNetwork = getNetworkFromURL();
const supportedNetworks = (process.env["REACT_APP_SUPPORT_STARCOIN_NETWORK"] || '').split(',');

export {
    apiAddress,
    explorerAddress,
    starcoinLiveAddress,
    starcoinNetwork,
    supportedNetworks,
};
