import { AlertTriangle } from "lucide-react";

export function EmailMisconfiguredBanner() {
  return (
    <div className="bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-amber-700 dark:text-amber-300 text-sm font-medium">
              <AlertTriangle className="h-4 w-4" />
              Email service is not configured
            </span>
            <span className="text-amber-600 dark:text-amber-400 text-sm">
              Email verification is required but RESEND_API_KEY is not set.
              Either set the API key or set ALLOW_UNVERIFIED_USER=true.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
