import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the application data structure
export interface ApplicationData {
  scholarshipId: string;
  scholarshipTitle: string;
  organizationName: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    walletAddress: string;
  };
  academicInfo: {
    university: string;
    major: string;
    gpa: string;
    yearOfStudy: string;
    expectedGraduation: string;
  };
  financialInfo: {
    receivesFinancialAid: boolean;
    financialNeedDescription: string;
  };
  statementOfPurpose: string;
  submittedAt: string;
}

// Define the store state and actions
interface ApplicationStore {
  // State
  applications: ApplicationData[];
  
  // Actions
  submitApplication: (application: ApplicationData) => void;
  getApplications: () => ApplicationData[];
  getApplicationById: (id: string) => ApplicationData | undefined;
  getApplicationsByScholarship: (scholarshipId: string) => ApplicationData[];
  clearApplications: () => void;
}

// Create the store with persistence
export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set, get) => ({
      applications: [],
      
      submitApplication: (application) => {
        set((state) => ({
          applications: [...state.applications, application]
        }));
      },
      
      getApplications: () => {
        return get().applications;
      },
      
      getApplicationById: (scholarshipId) => {
        return get().applications.find(app => app.scholarshipId === scholarshipId);
      },
      
      getApplicationsByScholarship: (scholarshipId) => {
        return get().applications.filter(app => app.scholarshipId === scholarshipId);
      },
      
      clearApplications: () => {
        set({ applications: [] });
      }
    }),
    {
      name: 'scholarship-applications',
    }
  )
); 