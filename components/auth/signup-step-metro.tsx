"use client";

import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { useQuery } from "convex/react";
import { Combobox, ComboboxInput, ComboboxOption, ComboboxOptions, ComboboxButton } from "@headlessui/react";
import { ArrowLeft, Check, ChevronDown, Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import { useDebounce } from "@/lib/hooks/use-debounce";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import type { SignupFormData } from "@/lib/validations/auth";

interface MetroStepProps {
  onBack: () => void;
  isSubmitting: boolean;
}

interface Metro {
  _id: string;
  name: string;
  displayName: string;
  cities: string[];
}

export function MetroStep({ onBack, isSubmitting }: MetroStepProps) {
  const { control, setValue, watch } = useFormContext<SignupFormData>();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  const selectedMetroName = watch("metro");

  // Search metros when there's a query
  const metros = useQuery(
    api.metros.searchMetros,
    debouncedQuery.length > 0 ? { search: debouncedQuery } : "skip"
  );

  // List all metros when no query
  const allMetros = useQuery(
    api.metros.listActiveMetros,
    debouncedQuery.length === 0 ? {} : "skip"
  );

  const displayMetros = debouncedQuery.length > 0 ? metros : allMetros;
  const isLoading = displayMetros === undefined && (debouncedQuery.length > 0 || query.length === 0);

  // Find the selected metro object for display
  const selectedMetro = displayMetros?.find((m: Metro) => m.name === selectedMetroName);

  return (
    <div className="space-y-4">
      <FormField
        control={control}
        name="metro"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Metro Area</FormLabel>
            <FormControl>
              <Combobox
                value={selectedMetro || null}
                onChange={(metro: Metro | null) => {
                  if (metro) {
                    setValue("metro", metro.name, { shouldValidate: true });
                  }
                }}
              >
                <div className="relative">
                  <ComboboxInput
                    className="flex h-11 w-full rounded-lg border border-input bg-background px-4 py-2 pr-10 text-base transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="Search for your city..."
                    displayValue={(metro: Metro | null) =>
                      metro?.displayName || ""
                    }
                    onChange={(event) => setQuery(event.target.value)}
                  />
                  <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </ComboboxButton>
                </div>

                <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border bg-popover py-1 shadow-lg focus:outline-none">
                  {isLoading && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  )}

                  {!isLoading && displayMetros?.length === 0 && query.length > 0 && (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      No metros found
                    </div>
                  )}

                  {!isLoading && displayMetros?.length === 0 && query.length === 0 && (
                    <div className="px-4 py-2 text-sm text-muted-foreground">
                      Start typing to search metros
                    </div>
                  )}

                  {displayMetros?.map((metro: Metro) => (
                    <ComboboxOption
                      key={metro._id}
                      value={metro}
                      className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-sm data-[focus]:bg-accent data-[focus]:text-accent-foreground"
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {metro.displayName}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
                              <Check className="h-4 w-4" />
                            </span>
                          )}
                        </>
                      )}
                    </ComboboxOption>
                  ))}
                </ComboboxOptions>
              </Combobox>
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
          disabled={isSubmitting}
          className="flex-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>
      </div>
    </div>
  );
}
