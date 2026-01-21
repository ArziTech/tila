import { LoginForm } from "./_components/login-form";


export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const error = params?.error as string | undefined;
  const verified = params?.verified === "true";

  return (
    <LoginForm error={error} verified={verified} />
  )
}
