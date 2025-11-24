import LoginForm from "@/components/auth/login-form";
import Logo from "@/components/logo";

export default async function Login() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Logo />
      <LoginForm />
    </div>
  );
}
