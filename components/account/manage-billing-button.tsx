"use client";

import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);
  const createPortalSession = useAction(api.billing.subscriptions.createBillingPortalSession);

  const handleClick = async () => {
    setLoading(true);
    try {
      const { url } = await createPortalSession({
        returnUrl: window.location.href,
      });
      window.location.href = url;
    } catch {
      toast.error("Could not open billing portal. Try again.");
      setLoading(false);
    }
  };

  return (
    <Button
      variant="default"
      onClick={handleClick}
      disabled={loading}
      className="min-h-[44px]"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Opening...
        </>
      ) : (
        <>
          Manage Billing
          <ExternalLink className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}
