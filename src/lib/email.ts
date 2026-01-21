import { Resend } from "resend";
import { VerificationEmail } from "@/components/email/verification-email";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

interface SendVerificationEmailParams {
  email: string;
  token: string;
}

/**
 * Check if email verification is required based on environment variables
 * Returns true if verification is required, false if unverified users are allowed
 */
export function isEmailVerificationRequired(): boolean {
  const allowUnverified = process.env.ALLOW_UNVERIFIED_USER;
  return allowUnverified !== "true";
}

/**
 * Check if email service is misconfigured (verification required but no API key)
 * Returns true if there's a configuration issue
 */
export function isEmailServiceMisconfigured(): boolean {
  return isEmailVerificationRequired() && !isEmailServiceConfigured();
}

/**
 * Check if Resend email service is configured
 */
export function isEmailServiceConfigured(): boolean {
  return !!process.env.RESEND_API_KEY;
}

/**
 * Check if using Resend testing domain (onboarding@resend.dev)
 * This can only send emails to the registered Resend account email
 */
export function isUsingResendTestingDomain(): boolean {
  const fromAddress = process.env.RESEND_FROM_ADDRESS || 'onboarding@resend.dev';
  return fromAddress.includes('resend.dev');
}

export async function sendVerificationEmail({
  email,
  token,
}: SendVerificationEmailParams): Promise<{ success: boolean; error?: string }> {
  // Skip sending email if verification is not required
  if (!isEmailVerificationRequired()) {
    console.log("Email verification is disabled (ALLOW_UNVERIFIED_USER=true)");
    return { success: true };
  }

  // Skip sending email if Resend is not configured
  if (!resend) {
    console.warn(
      "RESEND_API_KEY not configured. Skipping email sending. " +
        "Either set RESEND_API_KEY or set ALLOW_UNVERIFIED_USER=true to disable email verification."
    );
    return { success: true };
  }

  try {
    const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;
    const fromAddress = process.env.RESEND_FROM_ADDRESS || 'Acme <onboarding@resend.dev>';

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: 'Verify your email address - TILA',
      react: VerificationEmail({ verifyUrl }),
    });

    if (error) {
      console.error("Resend error:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    console.log("Verification email sent successfully:", data);
    return { success: true };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
