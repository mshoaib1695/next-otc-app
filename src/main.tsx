import { darkTheme, getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from '@wagmi/core';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DefaultToastOptions, Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { WagmiProvider } from 'wagmi';
import { bsc, bscTestnet, goerli, mainnet } from 'wagmi/chains';
import WalletHOC from './components/WalletHOC';
import { APP_NAME, PROJECT_ID } from './constants';
import './index.css';
import './providers/i18n';
import { routes } from './providers/routes';
import { persistor, store } from './state/store';

const vitruveoMainnet = {
    id: 1490,
    name: 'Vitruveo Mainnet',
    network: 'vitruveo',
    iconUrl: '/v-icon.png',
    iconBackground: '#000',
    nativeCurrency: {
        decimals: 18,
        name: 'Vitruveo',
        symbol: 'VTRU',
    },
    rpcUrls: {
        public: { http: ['https://rpc.vitruveo.xyz/'] },
        default: { http: ['https://rpc.vitruveo.xyz/'] },
    },
    blockExplorers: {
        default: { name: 'VitruveoScan', url: 'https://explorer.vitruveo.xyz' },
        etherscan: { name: 'VitruveoScan', url: 'https://explorer.vitruveo.xyz' },
    },
    testnet: false,
};

const vitruveoTestnet = {
    id: 14333,
    name: 'Vitruveo Testnet',
    network: 'vitruveo-testnet',
    iconUrl: '/v-icon.png',
    iconBackground: '#000',
    nativeCurrency: {
        decimals: 18,
        name: 'Vitruveo Testnet',
        symbol: 'tVTRU',
    },
    rpcUrls: {
        public: { http: ['https://test-rpc.vitruveo.xyz/'] },
        default: { http: ['https://test-rpc.vitruveo.xyz/'] },
    },
    blockExplorers: {
        default: { name: 'VitruveoScan', url: 'https://test-explorer.vitruveo.xyz' },
        etherscan: { name: 'VitruveoScan', url: 'https://test-explorer.vitruveo.xyz' },
    },
    testnet: false,
};

const toastOptions: DefaultToastOptions = {
    loading: {
        style: {
            padding: '16px',
            color: '#000',
            fontWeight: '500',
        },
        iconTheme: {
            primary: '#000',
            secondary: '#FFF',
        },
    },
    success: {
        style: {
            padding: '16px',
            color: '#000',
            fontWeight: '500',
        },
    },
    error: {
        style: {
            padding: '16px',
            color: '#000',
            fontWeight: '500',
        },
    },
};

export const config = getDefaultConfig({
    appName: APP_NAME,
    projectId: PROJECT_ID,
    chains:
        import.meta.env.VITE_PUBLIC_ENV == 'mainnet'
            ? [mainnet, bsc, vitruveoMainnet]
            : [goerli, bscTestnet, vitruveoTestnet],
    ssr: false,
    transports:
        import.meta.env.VITE_PUBLIC_ENV == 'mainnet'
            ? { [mainnet.id]: http(), [bsc.id]: http(), [vitruveoMainnet.id]: http() }
            : { [goerli.id]: http(), [bscTestnet.id]: http(), [vitruveoTestnet.id]: http() },
});

const queryClient = new QueryClient();

const rootElement = document.getElementById('root');
if (rootElement && !rootElement?.innerHTML) {
    const root = createRoot(rootElement);
    root.render(
        <StrictMode>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <WagmiProvider config={config}>
                        <QueryClientProvider client={queryClient}>
                            <RainbowKitProvider theme={darkTheme()}>
                                <WalletHOC />
                                <Toaster position='top-center' toastOptions={toastOptions} />
                                <RouterProvider router={routes} />
                            </RainbowKitProvider>
                        </QueryClientProvider>
                    </WagmiProvider>
                </PersistGate>
            </Provider>
        </StrictMode>,
    );
}
