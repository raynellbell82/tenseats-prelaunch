import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import { components, internal } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import authConfig from "./auth.config";
import {
  otpVerificationEmailHtml,
  passwordResetEmailHtml,
} from "./emailTemplates";
import { signWebhookPayload } from "./webhookSigning";

// Use SITE_URL from Convex env vars (NEXT_PUBLIC_ vars are for client-side only)
const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

/**
 * Send an email via the n8n webhook with HMAC-SHA256 signing.
 * Used by auth callbacks that can't access Convex scheduler.
 */
async function sendViaWebhook(payload: {
  emailType: string;
  toEmail: string;
  toName: string;
  htmlBody: string;
  subject: string;
}): Promise<void> {
  const webhookUrl = process.env.N8N_EMAIL_WEBHOOK_URL;
  const webhookSecret = process.env.N8N_EMAIL_WEBHOOK_SECRET;

  if (!webhookUrl || !webhookSecret) {
    console.log(`[DEV] Email (${payload.emailType}) to ${payload.toEmail} — webhook not configured`);
    return;
  }

  const body = JSON.stringify(payload);
  const { signature, timestamp } = await signWebhookPayload(body, webhookSecret);

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...payload,
      _signature: signature,
      _timestamp: timestamp,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`n8n email webhook error (${payload.emailType}):`, response.status, errorText);
    throw new Error(`Failed to send ${payload.emailType} email via n8n: ${response.status}`);
  }
}

// Build trusted origins list - always include localhost for development
const trustedOriginsList = [siteUrl];
if (!trustedOriginsList.includes("http://localhost:3000")) {
  trustedOriginsList.push("http://localhost:3000");
}
trustedOriginsList.push("http://localhost:3001");
// Allow local network IPs for mobile dev testing (wildcard patterns)
trustedOriginsList.push("http://192.168.*");
trustedOriginsList.push("http://10.*");

export const authComponent = createClient<DataModel>(components.betterAuth, {
  verbose: true,
});

/**
 * Extended user type including additionalFields defined in user config.
 * Better Auth callbacks receive the base user type but additional fields are present at runtime.
 */
type UserWithAdditionalFields = {
  id: string;
  email: string;
  name: string;
  username?: string;
  firstName?: string;
  lastName?: string;
};

export const createAuth = (ctx: GenericCtx<DataModel>) =>
  betterAuth({
    baseURL: siteUrl,
    database: authComponent.adapter(ctx),
    plugins: [
      convex({ authConfig }),
      emailOTP({
        otpLength: 6,
        expiresIn: 300, // 5 minutes
        overrideDefaultEmailVerification: true,
        sendVerificationOnSignUp: true, // Send OTP automatically when user signs up
        async sendVerificationOTP({ email, otp, type }) {
          // Generate verification URL for magic link (one-click verification)
          const verifyUrl = type === "email-verification"
            ? `${siteUrl}/verify-email?code=${otp}&email=${encodeURIComponent(email)}`
            : undefined;

          const html = otpVerificationEmailHtml(email, otp, type, verifyUrl);

          if (!process.env.N8N_EMAIL_WEBHOOK_URL) {
            console.log(`[DEV] OTP for ${email}: ${otp}`);
            return;
          }

          try {
            await sendViaWebhook({
              emailType: "email-verification",
              toEmail: email,
              toName: "",
              htmlBody: html,
              subject: "Your Tenseats verification code",
            });
          } catch (error) {
            console.error("Failed to send OTP email:", error);
            throw error;
          }
        },
      }),
    ],
    trustedOrigins: trustedOriginsList,
    logger: {
      disabled: false,
      level: "debug",
    },

    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      sendResetPassword: async ({ user: baseUser, url }) => {
        const user = baseUser as UserWithAdditionalFields;
        const html = passwordResetEmailHtml(
          user.username || user.name || "",
          url
        );

        try {
          await sendViaWebhook({
            emailType: "password-reset",
            toEmail: user.email,
            toName: user.name || "",
            htmlBody: html,
            subject: "Password reset request",
          });
        } catch (error) {
          console.error("Failed to send password reset email:", error);
          throw error;
        }
      },
      resetPasswordTokenExpiresIn: 900, // 15 minutes
    },

    emailVerification: {
      sendOnSignUp: true,
      sendOnSignIn: false,
      autoSignInAfterVerification: true,
      expiresIn: 900, // 15 minutes
      // sendVerificationEmail is replaced by the emailOTP plugin
      // (overrideDefaultEmailVerification: true in emailOTP config)
    },

    // NOTE: Custom user fields (username, firstName, lastName, etc.) are stored
    // in the app's `users` table, not in Better Auth's user table.
    // After signup, create a user profile record linked by auth user ID.
  });
