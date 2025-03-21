import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { getDefaultConfig } from 'connectkit'

export const config = createConfig(
  getDefaultConfig({
    // Your dApp's info
    appName: 'Stream Scholar',
    // Optional app description
    appDescription: 'Decentralized Scholarship Platform',
    // Optional app icon
    appIcon: 'https://family.co/logo.png',
    // Wagmi config
    chains: [mainnet, sepolia],
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
    // Add your alchemy or infura project id here
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  }),
) 