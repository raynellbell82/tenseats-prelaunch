"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

export function LaunchQueueDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="gap-2 text-muted-foreground">
          <HelpCircle className="h-4 w-4" />
          How does this work?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            How the Queue Works
          </DialogTitle>
          <DialogDescription>
            Membership slots are limited per city and category.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-3">
            <Step number={1} title="Choose your city and category">
              Browse the slot grid below and pick the membership that fits you
              best.
            </Step>
            <Step number={2} title="Join the queue and verify your email">
              Enter your email address to reserve your spot. You will receive a
              verification link to confirm.
            </Step>
            <Step number={3} title="Wait for your turn">
              Once verified, you are in the queue. When a spot opens, you will
              be auto-invited to complete your membership.
            </Step>
            <Step number={4} title="Complete checkout within 10 minutes">
              When invited, you have 10 minutes to finish checkout. If you miss
              it, your spot cycles to the next person in line.
            </Step>
            <Step number={5} title="Lifetime member perks">
              Early Bird and Founding members enjoy waived platform fees on all
              transactions -- forever.
            </Step>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">
        {number}
      </div>
      <div>
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}
