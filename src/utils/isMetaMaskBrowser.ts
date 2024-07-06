export function isMetaMaskBrowser() {
    return !!window.ethereum?.isMetaMask;
}
