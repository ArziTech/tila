import { CheckCircle2 } from "lucide-react";

export function VerificationSuccessBanner() {
  return (
    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
      <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
      <div>
        <h3 className="font-semibold text-green-900">
          Email Verified Successfully!
        </h3>
        <p className="text-sm text-green-700 mt-1">
          Your account has been verified. You can now sign in and start your
          learning journey.
        </p>
      </div>
    </div>
  );
}
