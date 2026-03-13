"use node";

import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import crypto from "crypto";

// ---------------------------------------------------------------------------
// Internal Action: sendVerificationEmail (QUEU-01)
// Generates HMAC-SHA256 token and sends verification email via
// sendEmailWithLogging. Runs in Node.js runtime for crypto access.
// ---------------------------------------------------------------------------

export const sendVerificationEmail = internalAction({
  args: { preRegistrationId: v.id("preRegistrations") },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Read pre-registration via internal query
    const reg = await ctx.runQuery(
      internal.launch.queueInternal.getPreRegistrationById,
      { preRegistrationId: args.preRegistrationId },
    );

    if (!reg) return null;

    // Generate HMAC-SHA256 verification token
    const secret =
      process.env.HMAC_SECRET ?? "launch-queue-verification-secret";
    const token = crypto
      .createHmac("sha256", secret)
      .update(String(args.preRegistrationId))
      .digest("hex");

    // Build verification URL
    const baseUrl =
      process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";
    const verifyUrl = `${baseUrl}/launch/verify?id=${args.preRegistrationId}&token=${token}`;

    // Build email content
    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a;">Verify your Tenseats queue registration</h2>
        <p style="color: #4a4a4a; line-height: 1.6;">
          Thanks for joining the Tenseats launch queue! Please verify your email to secure your spot.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verifyUrl}" style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
            Verify My Email
          </a>
        </div>
        <p style="color: #888; font-size: 14px; line-height: 1.5;">
          Or copy and paste this link into your browser:<br/>
          <a href="${verifyUrl}" style="color: #666; word-break: break-all;">${verifyUrl}</a>
        </p>
        <p style="color: #888; font-size: 13px; margin-top: 32px;">
          If you didn't sign up for Tenseats, you can safely ignore this email.
        </p>
      </div>
    `;

    const textBody = `Verify your Tenseats queue registration\n\nThanks for joining the Tenseats launch queue! Please verify your email to secure your spot.\n\nVerify here: ${verifyUrl}\n\nIf you didn't sign up for Tenseats, you can safely ignore this email.`;

    // Send via existing sendEmailWithLogging internalAction
    await ctx.runAction(internal.emailUtilities.sendEmailWithLogging, {
      to: reg.email,
      toName: reg.email,
      subject: "Verify your Tenseats queue registration",
      html: htmlBody,
      plainText: textBody,
      emailType: "launch_verification",
    });

    return null;
  },
});

// ---------------------------------------------------------------------------
// Internal Action: sendInviteEmail (HOME-03)
// Sends invite notification email when a user's queue status transitions
// to "invited". Follows the sendVerificationEmail pattern.
// ---------------------------------------------------------------------------

export const sendInviteEmail = internalAction({
  args: { preRegistrationId: v.id("preRegistrations") },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Read pre-registration via internal query
    const reg = await ctx.runQuery(
      internal.launch.queueInternal.getPreRegistrationById,
      { preRegistrationId: args.preRegistrationId },
    );

    if (!reg || reg.status !== "invited") return null;

    // Build queue URL
    const baseUrl =
      process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";
    const queueUrl = `${baseUrl}/launch/queue?id=${args.preRegistrationId}`;

    // Build email content
    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a1a;">You've been invited to join Tenseats!</h2>
        <p style="color: #4a4a4a; line-height: 1.6;">
          Great news -- your spot in the Tenseats launch queue is ready! You have <strong>10 minutes</strong> to complete your membership signup before your invite expires.
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${queueUrl}" style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
            Complete Your Signup
          </a>
        </div>
        <p style="color: #e74c3c; font-size: 14px; font-weight: 600; text-align: center;">
          This invite expires in 10 minutes. Act now!
        </p>
        <p style="color: #888; font-size: 14px; line-height: 1.5;">
          Or copy and paste this link into your browser:<br/>
          <a href="${queueUrl}" style="color: #666; word-break: break-all;">${queueUrl}</a>
        </p>
        <p style="color: #888; font-size: 13px; margin-top: 32px;">
          If you didn't sign up for Tenseats, you can safely ignore this email.
        </p>
      </div>
    `;

    const textBody = `You've been invited to join Tenseats!\n\nGreat news -- your spot in the Tenseats launch queue is ready! You have 10 minutes to complete your membership signup before your invite expires.\n\nComplete your signup here: ${queueUrl}\n\nThis invite expires in 10 minutes. Act now!\n\nIf you didn't sign up for Tenseats, you can safely ignore this email.`;

    // Send via existing sendEmailWithLogging internalAction
    await ctx.runAction(internal.emailUtilities.sendEmailWithLogging, {
      to: reg.email,
      toName: reg.email,
      subject: "You've been invited to join Tenseats!",
      html: htmlBody,
      plainText: textBody,
      emailType: "launch_invite",
    });

    return null;
  },
});
