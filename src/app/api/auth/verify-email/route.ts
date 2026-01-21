import { redirect } from "next/navigation";
import { verifyEmailToken } from "@/actions/verify-email";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    redirect(
      "/login?error=Invalid verification link. Please request a new one.",
    );
  }

  const result = await verifyEmailToken(token);

  if (result.status === "SUCCESS") {
    redirect("/login?verified=true");
  }

  if (result.error?.includes("expired")) {
    redirect(
      "/login?error=Verification link expired. Please request a new one.",
    );
  }

  redirect(
    `/login?error=${encodeURIComponent(result.error || "Verification failed")}`,
  );
}
