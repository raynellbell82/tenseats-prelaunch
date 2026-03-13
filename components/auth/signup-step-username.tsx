"use client";

import { useFormContext } from "react-hook-form";
import { useQuery } from "convex/react";
import { ArrowLeft, Check, X, Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useDebounce } from "@/lib/hooks/use-debounce";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { SignupFormData } from "@/lib/validations/auth";

interface UsernameStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function UsernameStep({ onNext, onBack }: UsernameStepProps) {
  const { control, watch } = useFormContext<SignupFormData>();
  const username = watch("username");
  const debouncedUsername = useDebounce(username, 500);

  // Skip query if username is empty or too short
  const shouldCheck = debouncedUsername && debouncedUsername.length >= 3;

  const availabilityResult = useQuery(
    api.users.checkUsernameAvailability,
    shouldCheck ? { username: debouncedUsername } : "skip"
  );

  // Determine availability status
  const isChecking = shouldCheck && availabilityResult === undefined;
  const isAvailable = availabilityResult?.available === true;
  const isUnavailable = availabilityResult?.available === false;

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="your_username"
                  autoComplete="username"
                  {...field}
                />
                {shouldCheck && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isChecking && (
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    )}
                    {isAvailable && (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                    {isUnavailable && (
                      <X className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
            {/* Availability feedback */}
            {shouldCheck && !isChecking && (
              <p
                className={`text-sm ${
                  isAvailable ? "text-green-600" : "text-destructive"
                }`}
              >
                {isAvailable
                  ? "Username is available"
                  : "Username is already taken"}
              </p>
            )}
          </FormItem>
        )}
      />

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          className="flex-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button type="button" onClick={onNext} className="flex-1">
          Next
        </Button>
      </div>
    </div>
  );
}
