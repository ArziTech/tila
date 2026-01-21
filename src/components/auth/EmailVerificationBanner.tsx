"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { resendVerificationEmail } from "@/actions/verify-email";
import { useState, useTransition } from "react";
import { Mail, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export function EmailVerificationBanner() {
  const [isPending, startTransition] = useTransition();
  const [isSent, setIsSent] = useState(false);

  const handleResendEmail = () => {
    startTransition(async () => {
      const result = await resendVerificationEmail();

      if (result.status === "SUCCESS") {
        setIsSent(true);
        toast.success(result.success || "Verification email sent!");
      } else {
        toast.error(result.error || "Failed to send verification email");
      }
    });
  };

  return (
    <Alert variant="destructive" className="mb-6 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
      <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <AlertTitle className="text-amber-800 dark:text-amber-400">
            Email verification required
          </AlertTitle>
          <AlertDescription className="mt-2 text-amber-700 dark:text-amber-300">
            Please verify your email address to access all features. Check your
            inbox for the verification link.
          </AlertDescription>
        </div>
        <div className="flex items-center gap-2">
          {!isSent ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleResendEmail}
              disabled={isPending}
              className="shrink-0 border-amber-600 text-amber-700 hover:bg-amber-100 dark:border-amber-500 dark:text-amber-400 dark:hover:bg-amber-950"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Resend email
                </>
              )}
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              disabled
              className="shrink-0 border-green-600 text-green-700 dark:border-green-500 dark:text-green-400"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Email sent!
            </Button>
          )}
        </div>
      </div>
    </Alert>
  );
}
