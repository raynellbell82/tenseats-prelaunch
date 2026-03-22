"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface PaymentHistoryListProps {
  payments: Array<{
    _id: string;
    created?: number;
    description?: string;
    amount?: number;
    currency?: string;
    status?: string;
  }>;
  isLoading: boolean;
  error: boolean;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp * 1000));
}

export function PaymentHistoryList({ payments, isLoading, error }: PaymentHistoryListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-muted-foreground">
        Could not load payment history. Refresh the page to try again.
      </p>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="space-y-1">
        <h3 className="text-sm font-semibold">No payments yet</h3>
        <p className="text-sm text-muted-foreground">
          Your payment history will appear here after your first charge.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right font-mono">Amount</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {payments.map((payment) => (
          <TableRow key={payment._id}>
            <TableCell className="text-sm">
              {payment.created ? formatDate(payment.created) : "—"}
            </TableCell>
            <TableCell className="text-sm">
              {payment.description ?? "Payment"}
            </TableCell>
            <TableCell className="text-right text-sm font-mono">
              {payment.amount != null && payment.currency
                ? formatCurrency(payment.amount, payment.currency)
                : "—"}
            </TableCell>
            <TableCell className="text-sm capitalize">
              {payment.status ?? "—"}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
