'use client';

import { DAppKitProvider } from '@vechain/dapp-kit-react';
import { ThemeProvider } from '@vechain/dapp-kit-ui';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DAppKitProvider
      nodeUrl="https://testnet.vechain.org"
      genesis="test"
      walletConnectOptions={{
        projectId: 'your-walletconnect-project-id', // Replace with your WalletConnect project ID
        metadata: {
          name: 'CycleBuddy',
          description: 'Period tracking app that rewards you with crypto',
          url: 'https://cyclebuddy.app',
          icons: ['https://cyclebuddy.app/icon.png'],
        },
      }}
    >
      <ThemeProvider mode="light">
        {children}
      </ThemeProvider>
    </DAppKitProvider>
  );
}
