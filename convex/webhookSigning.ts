/**
 * HMAC-SHA256 webhook signing for n8n webhook authentication.
 * Uses Web Crypto API (available in Convex runtime).
 *
 * Signing protocol (matches n8n "Validate Webhook Signature" Code node):
 * 1. Build payload object (emailType, toEmail, toName, htmlBody, subject)
 * 2. JSON.stringify the payload
 * 3. Create signing input: `${timestamp}.${stringifiedPayload}`
 * 4. HMAC-SHA256 sign → hex digest
 * 5. Format signature as `sha256=${hexDigest}`
 * 6. Include `_signature` and `_timestamp` in the POST body
 */

export async function signWebhookPayload(
  body: string,
  secret: string
): Promise<{ signature: string; timestamp: string }> {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signaturePayload = `${timestamp}.${body}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(signaturePayload)
  );

  const hex = Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return {
    signature: `sha256=${hex}`,
    timestamp,
  };
}
