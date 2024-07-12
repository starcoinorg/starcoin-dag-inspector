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

const resovedSupprotedNetworks = (environmentVariableName: string): string[] => {
    const arrayString = process.env[environmentVariableName] || '';
    // @ts-ignore
    const supportedNetworks = arrayString.split(',');
    if (!supportedNetworks) {
        throw new Error("The REACT_APP_SUPPORT_STARCOIN_NETWORK environment variable is required");
    }
    return supportedNetworks
}
function isValidIpAddress(input: string): boolean {
    const parts = input.split('.');
    if (parts.length !== 4) {
        return false;
    }
    for (const part of parts) {
        if (!/^\d+$/.test(part)) {
            return false;
        }
        const num = parseInt(part, 10);
        if (num < 0 || num > 255) {
            return false;
        }

        if (part.length > 1 && part[0] === '0') {
            return false;
        }
    }
    return true;
}

function resolveNetworkFromFullURL(fullUrl: string, inputSupportedNetworks: string[], defaultNetwork: string): string | null {
    const url = new URL(fullUrl);
    if (isValidIpAddress(url.hostname)) {
        return defaultNetwork;
    }
    const hostnameParts = url.hostname.split('.');
    // Assuming the first part of the hostname is the network
    const network = hostnameParts[0];
    return inputSupportedNetworks.includes(network) ? network : null;
}

const defaultNetwork : string = "vega";

const apiAddress = resolveAddress("REACT_APP_API_ADDRESS");
const explorerAddress = resolveAddress("REACT_APP_EXPLORER_ADDRESS");
// @ts-ignore
const starcoinNetwork = resolveNetworkFromFullURL(
    window.location.href,
    resovedSupprotedNetworks("REACT_APP_SUPPORT_STARCOIN_NETWORK"),
    defaultNetwork,
);

export {
    apiAddress,
    explorerAddress,
    starcoinNetwork,
    defaultNetwork,
};
