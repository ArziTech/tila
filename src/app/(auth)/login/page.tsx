import { LoginForm } from "./_components/login-form";

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const error = searchParams?.error as string | undefined;
  return <LoginForm error={error} />;
}
