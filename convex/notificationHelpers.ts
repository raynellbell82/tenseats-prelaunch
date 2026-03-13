import type { MutationCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";

const DEDUP_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Create a notification with built-in self-suppression (TRIG-05) and
 * deduplication within a 5-minute window (TRIG-06).
 *
 * Plain async function -- runs in the caller's transaction (not a separate mutation).
 * This matches the authHelpers.ts pattern used across the codebase.
 */
export async function createNotification(
  ctx: MutationCtx,
  {
    userId,
    actorId,
    type,
    targetType,
    targetId,
    message,
  }: {
    userId: Id<"users">;
    actorId?: Id<"users">; // optional -- absent for system/event_reminder
    type: "like" | "comment" | "follow" | "mention" | "comment_reply" | "event_reminder" | "system" |
          "booking_request" | "booking_approved" | "booking_declined" |
          "booking_confirmed" | "booking_cancelled" | "booking_completed" |
          "booking_expired" | "review_request" | "review_published" | "payout_processed" | "refund_issued" |
          "new_message" | "pin_note_rejected";
    targetType?: string;
    targetId?: string;
    message: string;
  }
): Promise<void> {
  // TRIG-05: Never notify users about their own actions
  // Only apply when actorId is defined (system notifications skip this)
  if (actorId && String(userId) === String(actorId)) return;

  // TRIG-06: Prevent duplicates within deduplication window
  if (actorId) {
    const windowStart = Date.now() - DEDUP_WINDOW_MS;
    const existing = await ctx.db
      .query("notifications")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) =>
        q.and(
          q.eq(q.field("actorId"), actorId),
          q.eq(q.field("type"), type),
          q.eq(q.field("targetId"), targetId ?? null),
          q.gt(q.field("createdAt"), windowStart)
        )
      )
      .first();

    if (existing) return;
  }

  await ctx.db.insert("notifications", {
    userId,
    actorId,
    type,
    targetType,
    targetId,
    message,
    isRead: false,
    createdAt: Date.now(),
  });
}
