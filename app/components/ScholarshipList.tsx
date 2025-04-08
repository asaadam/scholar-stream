import { ScholarshipCard } from "./ScholarshipCard";

interface FormattedScholarship {
  id: number;
  name: string;
  donor: string;
  payer: string;
  monthlyAmount: string;
  nextPayment: string;
  totalReceived: string;
  unclaimedAmount: string;
  status: string;
  amountPerSec: number;
  baseUnclaimedAmount: number;
}

interface ScholarshipListProps {
  scholarships: FormattedScholarship[];
  isLoading: boolean;
}

export function ScholarshipList({
  scholarships,
  isLoading,
}: ScholarshipListProps) {
  if (isLoading) {
    return <div className="text-center py-8">Loading your scholarships...</div>;
  }

  if (!scholarships || scholarships.length === 0) {
    return (
      <div className="text-center py-8">
        You don&apos;t have any active scholarships yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {scholarships.map((scholarship) => (
        <ScholarshipCard
          unclaimedAmount={scholarship.unclaimedAmount}
          key={scholarship.id}
          name={scholarship.name}
          donor={scholarship.donor}
          monthlyAmount={scholarship.monthlyAmount}
          nextPayment={scholarship.nextPayment}
          totalReceived={scholarship.totalReceived}
          amountPerSec={scholarship.amountPerSec}
          baseUnclaimedAmount={scholarship.baseUnclaimedAmount}
        />
      ))}
    </div>
  );
}
