"use client";

import { useFormContext } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
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
  const { control } = useFormContext<SignupFormData>();

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="your_username"
                autoComplete="username"
                {...field}
              />
            </FormControl>
            <FormMessage />
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
