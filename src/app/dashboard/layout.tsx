import { auth } from "@/auth";
import {
  isEmailVerificationRequired,
  isEmailServiceMisconfigured,
  isUsingResendTestingDomain,
} from "@/lib/email";
import { EmailVerificationBanner } from "@/components/auth/EmailVerificationBanner";
import { EmailMisconfiguredBanner } from "@/components/auth/EmailMisconfiguredBanner";
import { ResendTestingDomainBanner } from "@/components/auth/ResendTestingDomainBanner";
import Sidebar from "./_components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const verificationRequired = isEmailVerificationRequired();
  const emailMisconfigured = isEmailServiceMisconfigured();
  const usingTestingDomain = isUsingResendTestingDomain();

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto max-h-screen p-6 md:p-10 relative">
        {usingTestingDomain && verificationRequired && (
          <ResendTestingDomainBanner />
        )}
        {emailMisconfigured && <EmailMisconfiguredBanner />}
        {session?.user &&
          !session.user.emailVerified &&
          verificationRequired && <EmailVerificationBanner />}
        {children}
      </main>
    </div>
  );
}
