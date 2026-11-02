import AuthForm from "@/components/AuthForm";

export const metadata = {
  title: "Create Account",
};

export default async function RegisterPage({ searchParams }) {
  const params = await searchParams;

  return (
    <AuthForm
      mode="register"
      next={typeof params.next === "string" ? params.next : "/"}
    />
  );
}