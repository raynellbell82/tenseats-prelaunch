"use node";

import { action } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import crypto from "crypto";

// ---------------------------------------------------------------------------
// Public Action: verifyEmail (QUEU-02)
// Validates HMAC-SHA256 token from verification email link.
// On success, calls confirmVerification to transition status and trigger
// processQueue. Runs in Node.js runtime for crypto access.
// ---------------------------------------------------------------------------

export const verifyEmail = action({
  args: {
    preRegistrationId: v.id("preRegistrations"),
    token: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // Read pre-registration
    const reg = await ctx.runQuery(
      internal.launch.queueInternal.getPreRegistrationById,
      { preRegistrationId: args.preRegistrationId },
    );

    if (!reg) {
      return { success: false, message: "Registration not found" };
    }

    // Guard: only verify if status is "registered"
    if (reg.status !== "registered") {
      return { success: false, message: "Already verified or expired" };
    }

    // Recompute HMAC token and compare
    const secret =
      process.env.HMAC_SECRET ?? "launch-queue-verification-secret";
    const expectedToken = crypto
      .createHmac("sha256", secret)
      .update(String(args.preRegistrationId))
      .digest("hex");

    if (args.token !== expectedToken) {
      return { success: false, message: "Invalid verification token" };
    }

    // Token valid -- transition status and trigger queue processing
    await ctx.runMutation(
      internal.launch.queueInternal.confirmVerification,
      { preRegistrationId: args.preRegistrationId },
    );

    return { success: true };
  },
});
