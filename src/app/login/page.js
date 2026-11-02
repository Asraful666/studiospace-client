import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Log In",
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;

  return (
    <AuthForm
      mode="login"
      next={typeof params.next === "string" ? params.next : "/"}
    />
  );
}