import { HelmetProvider } from 'react-helmet-async';
import App from './App';

import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.css';

import merge from 'lodash.merge';

import {
  AvatarComponent,
  darkTheme,
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
  Theme,
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { optimismGoerli, lineaTestnet, mainnet } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import AddressAvatar from '../components/AddressAvatar';
import { useMediaQuery } from '@mui/material';
import { useMemo, useState } from 'react';
import { AppSettings } from '../types/AppSettingsType';
import { ToastContainer } from 'react-toastify';

const { chains, provider, webSocketProvider } = configureChains(
  [lineaTestnet, optimismGoerli, mainnet],
  [
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_API_KEY }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Secret Party',
  chains,
});

const CustomAvatar: AvatarComponent = ({ address, ensImage, size }) => {
  return ensImage ? (
    <img
      src={ensImage}
      width={size}
      height={size}
      style={{ borderRadius: 999 }}
    />
  ) : (
    <AddressAvatar
      address={address}
      scale={size < 30 ? 3 : 10}
      sx={{ width: size, height: size }}
    />
  );
};

const customLightTheme = merge(lightTheme({ overlayBlur: 'small' }), {
  fonts: { body: 'fantasy' },
} as Theme);

const customDarkTheme = merge(darkTheme({ overlayBlur: 'small' }), {
  colors: {
    modalBackground: '#242424',
    connectButtonBackground: '#1e1e1e',
  },
  fonts: { body: 'fantasy' },
} as Theme);

const appSettingsStorageItem = localStorage.getItem('appSettings');
const appSettingsStored = appSettingsStorageItem
  ? (JSON.parse(appSettingsStorageItem) as AppSettings)
  : null;

export default function AppWithProviders() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [appSettings, setAppSettings] = useState<AppSettings>(
    appSettingsStored
      ? appSettingsStored
      : {
          autoConnect: import.meta.env.VITE_INIT_CONNECT === 'true',
          darkMode: prefersDarkMode,
        }
  );

  useMemo(() => {
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
  }, [appSettings]);

  const wagmiClient = createClient({
    autoConnect: appSettings.autoConnect,
    connectors,
    provider,
    webSocketProvider,
  });
  return (
    <HelmetProvider>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          theme={appSettings.darkMode ? customDarkTheme : customLightTheme}
          avatar={CustomAvatar}
          modalSize="compact"
          chains={chains}
          initialChain={
            chains.find(
              (chain) => chain.network === import.meta.env.VITE_DEFAULT_NETWORK
            )?.id
          }
          showRecentTransactions={true}>
          <App appSettings={appSettings} setAppSettings={setAppSettings} />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            limit={5}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </RainbowKitProvider>
      </WagmiConfig>
    </HelmetProvider>
  );
}
