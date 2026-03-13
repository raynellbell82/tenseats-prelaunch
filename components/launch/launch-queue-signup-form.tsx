"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { signUp } from "@/lib/auth-client";
import {
  Loader2,
  ChefHat,
  Wine,
  Camera,
  Building2,
  Users,
  ArrowLeft,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const ROLES = [
  {
    value: "chef",
    label: "Chef",
    description: "Host pop-ups, supper clubs, and tasting events",
    icon: ChefHat,
  },
  {
    value: "mixologist",
    label: "Mixologist",
    description: "Craft cocktail experiences and beverage-led events",
    icon: Wine,
  },
  {
    value: "creator",
    label: "Creator",
    description: "Curate food content and share community discoveries",
    icon: Camera,
  },
  {
    value: "venueHost",
    label: "Venue Host",
    description: "List your space for pop-ups, tastings, and gatherings",
    icon: Building2,
  },
  {
    value: "guest",
    label: "Guest",
    description: "Discover and attend curated food events near you",
    icon: Users,
  },
] as const;

const formSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  metroId: z.string().min(1, "Select a metro area"),
  category: z.enum(["chef", "mixologist", "creator", "venueHost", "guest"], {
    message: "Select a role",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface LaunchQueueSignupFormProps {
  preselectedMetroId: string;
  preselectedCategory: string;
}

export function LaunchQueueSignupForm({
  preselectedMetroId,
  preselectedCategory,
}: LaunchQueueSignupFormProps) {
  const router = useRouter();
  const [step, setStep] = useState<"role" | "account">(
    preselectedCategory ? "account" : "role"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const joinQueue = useMutation(api.launch.queue.joinQueue);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      metroId: preselectedMetroId,
      category: preselectedCategory as FormValues["category"],
    },
  });

  const selectedRole = ROLES.find((r) => r.value === form.watch("category"));

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await signUp.email({
        email: values.email,
        password: values.password,
        name: values.email.split("@")[0],
      });

      const preRegistrationId = await joinQueue({
        email: values.email,
        metroId: values.metroId as Id<"metros">,
        category: values.category,
      });

      sessionStorage.setItem("preRegistrationId", preRegistrationId);
      router.push("/launch/queue");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : String(error);

      if (
        message.toLowerCase().includes("already") &&
        message.toLowerCase().includes("exist")
      ) {
        toast.error("Account already exists. Try signing in instead.");
      } else if (message.toLowerCase().includes("already registered")) {
        toast.error("You are already registered for this slot.");
      } else {
        toast.error(message || "Something went wrong. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-border bg-background p-6 shadow-sm max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {step === "role" && (
            <div>
              <p className="text-sm text-muted-foreground text-center mb-4">
                How will you use Tenseats?
              </p>
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-1 gap-2">
                      {ROLES.map((role) => {
                        const Icon = role.icon;
                        const selected = field.value === role.value;
                        return (
                          <button
                            key={role.value}
                            type="button"
                            onClick={() => {
                              field.onChange(role.value);
                              setStep("account");
                            }}
                            className={cn(
                              "flex items-start gap-3 rounded-lg border p-3 text-left transition-colors",
                              selected
                                ? "border-foreground bg-foreground/5"
                                : "border-border hover:border-foreground/30 hover:bg-muted/50"
                            )}
                          >
                            <Icon
                              className={cn(
                                "mt-0.5 h-4 w-4 shrink-0",
                                selected
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              )}
                            />
                            <div className="min-w-0">
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  selected
                                    ? "text-foreground"
                                    : "text-foreground/80"
                                )}
                              >
                                {role.label}
                              </p>
                              <p className="text-xs text-muted-foreground leading-snug">
                                {role.description}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {step === "account" && (
            <div className="space-y-4">
              {/* Selected role summary */}
              {selectedRole && (
                <button
                  type="button"
                  onClick={() => setStep("role")}
                  className="flex items-center gap-2 w-full rounded-lg border border-border px-3 py-2 text-left hover:bg-muted/50 transition-colors group"
                >
                  <Check className="h-3.5 w-3.5 text-foreground" />
                  <selectedRole.icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-sm text-foreground/80">
                    {selectedRole.label}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                    Change
                  </span>
                </button>
              )}

              <p className="text-sm text-muted-foreground text-center">
                Create your account
              </p>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        className="rounded-lg border-border h-11"
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Min 8 characters"
                        className="rounded-lg border-border h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("role")}
                  className="flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-8 py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
                  {isSubmitting ? "Joining..." : "Join the Queue"}
                </button>
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
