import FormButton from "@/components/form/form-button";
import FormCheckbox from "@/components/form/form-checkbox";
import FormInput from "@/components/form/form-input";
import FormLabel from "@/components/form/form-label";
import Logo from "@/components/logo";

export default function Login() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <Logo />
      <form className="border border-indigo-400 rounded-md p-4 min-w-xs">
        <h1 className="mb-2 text-2xl font-bold">Login</h1>
        <div>
          <FormLabel htmlFor="email" className="mb-2">
            Email address
          </FormLabel>
          <FormInput id="email" name="email" type="email" required />
        </div>
        <div className="flex my-2">
          <FormLabel htmlFor="remember">Remember me</FormLabel>
          <div className="flex ml-2">
            <FormCheckbox id="remember" name="remember" />
          </div>
        </div>
        <div>
          <FormButton className="w-full">Send login code</FormButton>
        </div>
      </form>
    </div>
  );
}
