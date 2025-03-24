import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  amount: string;
  tokenAddress: string; // Address of the token being used for payment
  tokenSymbol: string;
  duration: string;
  maxAwardees: string;
  streamRate: string;
  createdAt: number;
  payContractAddress: string; // Address of the payment contract
  donorAddress?: string;
  isActive: boolean;
}

export interface Awardee {
  id: string;
  name: string;
  wallet: string;
  scholarshipId: string;
  streamId?: string;
  amountPerSec: string;
  createdAt: number;
  status: "Active" | "Paused";
}

interface ScholarshipState {
  scholarships: Scholarship[];
  addScholarship: (scholarship: Scholarship) => void;
  updateScholarship: (id: string, updatedScholarship: Partial<Scholarship>) => void;
  getScholarships: () => Scholarship[];
  getScholarshipById: (id: string) => Scholarship | undefined;
  hasActiveScholarship: (address: string) => boolean;
  getActiveScholarship: (address: string) => Scholarship | undefined;
}

interface AwardeeState {
  awardees: Awardee[];
  addAwardee: (awardee: Awardee) => void;
  updateAwardee: (id: string, updatedAwardee: Partial<Awardee>) => void;
  removeAwardee: (id: string) => void;
  getAwardees: () => Awardee[];
  getAwardeesByScholarship: (scholarshipId: string) => Awardee[];
  getAwardeeByWallet: (scholarshipId: string, wallet: string) => Awardee | undefined;
}

export const useScholarshipStore = create<ScholarshipState>()(
  persist(
    (set, get) => ({
      scholarships: [],
      
      addScholarship: (scholarship: Scholarship) => {
        set((state) => ({
          scholarships: [...state.scholarships, scholarship]
        }));
      },
      
      updateScholarship: (id: string, updatedScholarship: Partial<Scholarship>) => {
        set((state) => ({
          scholarships: state.scholarships.map(scholarship => 
            scholarship.id === id ? { ...scholarship, ...updatedScholarship } : scholarship
          )
        }));
      },
      
      getScholarships: () => {
        return get().scholarships;
      },
      
      getScholarshipById: (id: string) => {
        return get().scholarships.find(scholarship => scholarship.id === id);
      },
      
      hasActiveScholarship: (address: string) => {
        return get().scholarships.some(scholarship => 
          scholarship.donorAddress?.toLowerCase() === address.toLowerCase() && 
          scholarship.isActive
        );
      },
      
      getActiveScholarship: (address: string) => {
        return get().scholarships.find(scholarship => 
          scholarship.donorAddress?.toLowerCase() === address.toLowerCase() && 
          scholarship.isActive
        );
      }
    }),
    {
      name: 'scholarship-storage',
    }
  )
)

export const useAwardeeStore = create<AwardeeState>()(
  persist(
    (set, get) => ({
      awardees: [],
      
      addAwardee: (awardee: Awardee) => {
        set((state) => ({
          awardees: [...state.awardees, awardee]
        }));
      },
      
      updateAwardee: (id: string, updatedAwardee: Partial<Awardee>) => {
        set((state) => ({
          awardees: state.awardees.map(awardee => 
            awardee.id === id ? { ...awardee, ...updatedAwardee } : awardee
          )
        }));
      },
      
      removeAwardee: (id: string) => {
        set((state) => ({
          awardees: state.awardees.filter(awardee => awardee.id !== id)
        }));
      },
      
      getAwardees: () => {
        return get().awardees;
      },
      
      getAwardeesByScholarship: (scholarshipId: string) => {
        return get().awardees.filter(awardee => awardee.scholarshipId === scholarshipId);
      },
      
      getAwardeeByWallet: (scholarshipId: string, wallet: string) => {
        return get().awardees.find(awardee => 
          awardee.scholarshipId === scholarshipId && 
          awardee.wallet.toLowerCase() === wallet.toLowerCase()
        );
      }
    }),
    {
      name: 'awardee-storage',
    }
  )
) 