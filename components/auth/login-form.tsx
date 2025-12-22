"use client";
import { useRouter } from "next/navigation";
import { getCsrfToken, signIn } from "next-auth/react";
import { type FormEvent, useState } from "react";
import loginAction from "@/actions/login";
import FormButton from "@/components/form/form-button";
import FormCheckbox from "@/components/form/form-checkbox";
import FormInput from "@/components/form/form-input";
import FormLabel from "@/components/form/form-label";
//TODO WE NEED TO REDO THE LOGIN FORM SO IT HANDLES ERRORS PROPERLY
export default function LoginForm() {
  const [verificationSent, setVerificationSent] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const csrfToken = await getCsrfToken();
    const formData = new FormData(e.target as HTMLFormElement);
    formData.append("csrfToken", csrfToken || "");
    if (verificationSent) {
      const result = await signIn("credentials", {
        redirect: false,
        csrfToken,
        email: formData.get("email"),
        verificationCode: formData.get("verificationCode"),
        keepMeLoggedIn: formData.get("remember") ? "true" : "false",
      });

      if (result?.ok) {
        router.push("/");
      } else {
        console.error("Login failed", result);
      }

      return;
    }
    loginAction(formData)
      .then(() => {
        setVerificationSent(true);
      })
      .catch((e) => {
        console.error(e);
        setVerificationSent(false);
      });
  };
  return (
    <form
      onSubmit={onSubmit}
      className="border border-indigo-400 rounded-md p-4 min-w-xs"
    >
      <h1 className="mb-2 text-2xl font-bold">Login</h1>
      <div className="mb-4">
        {!verificationSent && (
          <FormLabel htmlFor="email" className="mb-2">
            Email address
          </FormLabel>
        )}
        <FormInput
          hidden={verificationSent}
          id="email"
          name="email"
          type="email"
          required
        />
        {verificationSent && (
          <>
            <FormLabel htmlFor="code" className="mb-2">
              Verification Code
            </FormLabel>
            <FormInput
              id="verificationCode"
              name="verificationCode"
              type="text"
              required
            />
          </>
        )}
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
  );
}
