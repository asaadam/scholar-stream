import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  amount: string;
  token: string;
  tokenSymbol: string;
  duration: string;
  maxAwardees: string;
  streamRate: string;
  createdAt: number;
  contractAddress?: string;
}

interface ScholarshipState {
  scholarships: Scholarship[];
  addScholarship: (scholarship: Scholarship) => void;
  getScholarships: () => Scholarship[];
  getScholarshipById: (id: string) => Scholarship | undefined;
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
      
      getScholarships: () => {
        return get().scholarships;
      },
      
      getScholarshipById: (id: string) => {
        return get().scholarships.find(scholarship => scholarship.id === id);
      }
    }),
    {
      name: 'scholarship-storage',
    }
  )
) 