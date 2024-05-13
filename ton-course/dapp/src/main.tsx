import { createRoot } from 'react-dom/client';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { App } from './App';

// this manifest is used temporarily for development purposes
const manifestUrl = 'https://raw.githubusercontent.com/cryoland/ton-learn/master/ton-course/dapp/manifest.json';

const root = createRoot(document.getElementById('app') as HTMLElement);

root.render(
  <TonConnectUIProvider manifestUrl={manifestUrl}>
    <App />
  </TonConnectUIProvider>
);