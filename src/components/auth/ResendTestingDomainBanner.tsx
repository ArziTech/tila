import { AlertCircle } from "lucide-react";

export function ResendTestingDomainBanner() {
  return (
    <div className="bg-blue-50 dark:bg-blue-950 border-b border-blue-200 dark:border-blue-800">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  Using Resend Testing Domain
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  You can only send emails to your registered Resend account email
                  while using the testing domain. To send emails to any recipient:
                </p>
                <ol className="text-sm text-blue-700 dark:text-blue-300 mt-2 list-decimal list-inside space-y-1">
                  <li>
                    Verify your domain at{" "}
                    <a
                      href="https://resend.com/domains"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium hover:text-blue-900 dark:hover:text-blue-100"
                    >
                      resend.com/domains
                    </a>
                  </li>
                  <li>
                    Set <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900 rounded text-xs font-mono">
                      RESEND_FROM_ADDRESS
                    </code>{" "}
                    in your .env file (e.g.,{" "}
                    <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900 rounded text-xs font-mono">
                      noreply@yourdomain.com
                    </code>
                    )
                  </li>
                  <li>
                    Or set{" "}
                    <code className="px-1 py-0.5 bg-blue-100 dark:bg-blue-900 rounded text-xs font-mono">
                      ALLOW_UNVERIFIED_USER=true
                    </code>{" "}
                    to disable email verification
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
