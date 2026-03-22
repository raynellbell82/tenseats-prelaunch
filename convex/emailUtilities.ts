"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import crypto from "crypto";

/**
 * HMAC-SHA256 signing using Node.js crypto (not Web Crypto API).
 * webhookSigning.ts uses crypto.subtle which isn't available in
 * the self-hosted Convex Node.js runtime.
 */
async function signWebhookPayload(
  body: string,
  secret: string
): Promise<{ signature: string; timestamp: string }> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signaturePayload = `${timestamp}.${body}`;
  const hex = crypto
    .createHmac("sha256", secret)
    .update(signaturePayload)
    .digest("hex");
  return { signature: `sha256=${hex}`, timestamp };
}

// ---------------------------------------------------------------------------
// Internal Action: sendEmailWithLogging
// Sends an email via the N8N webhook with HMAC-SHA256 signing.
// Falls back to console.log in development when webhook is not configured.
// Called by queueEmail.ts for launch verification and invite emails.
// ---------------------------------------------------------------------------

export const sendEmailWithLogging = internalAction({
  args: {
    to: v.string(),
    toName: v.string(),
    subject: v.string(),
    html: v.string(),
    plainText: v.optional(v.string()),
    emailType: v.string(),
  },
  returns: v.null(),
  handler: async (_ctx, { to, toName, subject, html, plainText, emailType }) => {
    const webhookUrl = process.env.N8N_EMAIL_WEBHOOK_URL;
    const webhookSecret = process.env.N8N_EMAIL_WEBHOOK_SECRET;

    if (!webhookUrl || !webhookSecret) {
      console.log(
        `[DEV] Email (${emailType}) to ${to} — webhook not configured`,
      );
      return null;
    }

    const payload = {
      emailType,
      toEmail: to,
      toName,
      subject,
      htmlBody: html,
      plainText: plainText ?? "",
    };

    const body = JSON.stringify(payload);
    const { signature, timestamp } = await signWebhookPayload(
      body,
      webhookSecret,
    );

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
      console.error(
        `n8n email webhook error (${emailType}):`,
        response.status,
        errorText,
      );
      throw new Error(
        `Failed to send ${emailType} email via n8n: ${response.status}`,
      );
    }

    console.log(`Email (${emailType}) sent to ${to}`);
    return null;
  },
});
