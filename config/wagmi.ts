import { getDefaultConfig } from "connectkit";
import { createConfig, http } from "wagmi";
import { arbitrumSepolia } from "wagmi/chains";

export const config = createConfig(
  getDefaultConfig({
    appName: "Stream Scholar",
    appDescription: "Decentralized Scholarship Platform",
    chains: [arbitrumSepolia],
    transports: {
      [arbitrumSepolia.id]: http(),
    },
    walletConnectProjectId:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  })
);
