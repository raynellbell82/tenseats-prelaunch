"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
import { signUp } from "@/lib/auth-client";
import { CredentialsStep } from "./signup-step-credentials";
import { ProfileStep } from "./signup-step-profile";
import { UsernameStep } from "./signup-step-username";
import { MetroStep } from "./signup-step-metro";

const STEP_FIELDS: Record<number, (keyof SignupFormData)[]> = {
  1: ["email", "password", "confirmPassword"],
  2: ["firstName", "lastName", "dateOfBirth"],
  3: ["username"],
  4: ["metro"],
};

const STEP_LABELS = ["Credentials", "Profile", "Username", "Location"];

export function SignupWizard() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const router = useRouter();

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      username: "",
      metro: "",
    },
  });

  const { formState, trigger, setError, handleSubmit } = form;

  const nextStep = async () => {
    const fields = STEP_FIELDS[currentStep];
    const isValid = await trigger(fields);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      // Convert dateOfBirth string to timestamp
      const dobTimestamp = new Date(data.dateOfBirth).getTime();

      // Store profile data in sessionStorage for post-verification profile creation
      // The profile will be created when user signs in after email verification
      sessionStorage.setItem(
        "pendingProfile",
        JSON.stringify({
          username: data.username.toLowerCase(),
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: dobTimestamp,
          city: data.metro,
        })
      );

      // Create Better Auth user with basic fields only
      // Profile data (username, firstName, etc.) stored in our users table after verification
      const { error } = await signUp.email({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.lastName}`,
        callbackURL: "/feed", // Where to redirect after email verification
      });

      if (error) {
        setError("root", { message: error.message });
        return;
      }

      // Store email for verify page (session may not be immediately available)
      sessionStorage.setItem("otp-verify-email", data.email);
      // Store OTP sent timestamp for countdown timer
      sessionStorage.setItem("otp-sent-ts", Date.now().toString());

      router.push("/verify-email");
    } catch (err) {
      setError("root", {
        message: err instanceof Error ? err.message : "An error occurred",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                step < currentStep
                  ? "bg-primary text-primary-foreground"
                  : step === currentStep
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                step
              )}
            </div>
            {step < 4 && (
              <div
                className={`h-0.5 w-8 transition-colors ${
                  step < currentStep ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step label */}
      <p className="text-center text-sm text-muted-foreground">
        Step {currentStep} of 4: {STEP_LABELS[currentStep - 1]}
      </p>

      <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Root error message */}
          {formState.errors.root && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {formState.errors.root.message}
            </div>
          )}

          {/* Step content */}
          {currentStep === 1 && <CredentialsStep onNext={nextStep} />}
          {currentStep === 2 && (
            <ProfileStep onNext={nextStep} onBack={prevStep} />
          )}
          {currentStep === 3 && (
            <UsernameStep onNext={nextStep} onBack={prevStep} />
          )}
          {currentStep === 4 && (
            <MetroStep onBack={prevStep} isSubmitting={formState.isSubmitting} />
          )}
        </form>
      </FormProvider>
    </div>
  );
}