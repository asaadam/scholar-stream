import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface YieldSimulation {
  id: string;
  principal: string;
  apy: string;
  duration: string; // in months
  compoundingPeriod: string;
  finalAmount: string;
  createdAt: number;
  walletAddress?: string;
}

interface YieldState {
  simulations: YieldSimulation[];
  currentSimulation: YieldSimulation | null;
  addSimulation: (simulation: YieldSimulation) => void;
  setCurrentSimulation: (simulation: YieldSimulation | null) => void;
  getSimulations: () => YieldSimulation[];
  getSimulationsByWallet: (walletAddress: string) => YieldSimulation[];
  clearSimulations: () => void;
}

export const useYieldStore = create<YieldState>()(
  persist(
    (set, get) => ({
      simulations: [],
      currentSimulation: null,

      addSimulation: (simulation: YieldSimulation) => {
        set((state) => ({
          simulations: [...state.simulations, simulation],
          currentSimulation: simulation,
        }));
      },

      setCurrentSimulation: (simulation: YieldSimulation | null) => {
        set({ currentSimulation: simulation });
      },

      getSimulations: () => {
        return get().simulations;
      },

      getSimulationsByWallet: (walletAddress: string) => {
        return get().simulations.filter(
          (simulation) => simulation.walletAddress?.toLowerCase() === walletAddress.toLowerCase()
        );
      },

      clearSimulations: () => {
        set({ simulations: [], currentSimulation: null });
      },
    }),
    {
      name: "yield-simulations",
    }
  )
); 