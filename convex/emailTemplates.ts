/**
 * Legacy email templates for Better Auth callbacks.
 *
 * These string-based templates are used ONLY by auth.ts callbacks (sendVerificationOTP,
 * sendResetPassword) which cannot access Convex Node actions or React Email render().
 *
 * All other email templates have been migrated to React Email components in convex/emails/.
 * See convex/emails/otpVerification.tsx and convex/emails/passwordReset.tsx for the
 * canonical React Email versions of the auth templates.
 */

const LOGO_URL = "https://tenseats.io/logo.png";
const PRIVACY_URL = "https://tenseats.io/privacy";
const TERMS_URL = "https://tenseats.io/terms";
const SUPPORT_EMAIL = "support@tenseats.io";

// Primary brand color (oklch(0.205 0 0) converted to hex)
const BRAND_COLOR = "#181818";

// Dark mode meta tags
const DARK_MODE_META = `
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
`;

/**
 * Email header with logo and wordmark
 */
export function emailHeader(): string {
  return `
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0; padding: 0 0 24px 0;">
      <tr>
        <td style="vertical-align: middle;">
          <img src="${LOGO_URL}" alt="Tenseats Logo" style="height: 40px; vertical-align: middle; display: inline-block;">
          <span style="font-size: 24px; font-weight: 600; color: #000000; margin-left: 12px; vertical-align: middle; display: inline-block;">Tenseats</span>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Email button with dark mode support and 44px+ touch targets
 */
export function emailButton(url: string, text: string): string {
  return `
    <!--[if mso]>
    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:52px;v-text-anchor:middle;width:200px;" arcsize="15%" stroke="f" fillcolor="#000000">
      <w:anchorlock/>
      <center style="color:#ffffff;font-family:sans-serif;font-size:16px;font-weight:500;">${text}</center>
    </v:roundrect>
    <![endif]-->
    <!--[if !mso]><!-->
    <a href="${url}" class="cta-button" style="display: inline-block; background-color: #000000; color: #ffffff; padding: 16px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; margin: 0;">
      ${text}
    </a>
    <!--<![endif]-->
  `;
}

/**
 * Email footer with unsubscribe and links
 */
export function emailFooter(unsubscribeUrl?: string): string {
  return `
    <hr style="border: none; border-top: 1px solid #eeeeee; margin: 32px 0;">
    <p style="color: #999999; font-size: 12px; margin: 0; line-height: 1.6;">
      <a href="{{UNSUBSCRIBE_URL}}" style="color: #999999; text-decoration: none; {{UNSUBSCRIBE_DISPLAY}}">Unsubscribe</a> <span style="{{UNSUBSCRIBE_DISPLAY}}">|</span>
      <a href="${PRIVACY_URL}" style="color: #999999; text-decoration: none;">Privacy Policy</a> |
      <a href="${TERMS_URL}" style="color: #999999; text-decoration: none;">Terms of Service</a> |
      ${SUPPORT_EMAIL}
    </p>
  `;
}

/**
 * Branded email wrapper with dark mode support
 */
export function brandedEmailWrapper(content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  ${DARK_MODE_META}
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      color: #000000;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px;
    }
    .cta-button {
      background-color: #000000 !important;
      color: #ffffff !important;
    }
    .otp-display {
      background-color: #f5f5f5;
    }
    .event-card {
      background-color: ${BRAND_COLOR};
    }
    .warning-box {
      background-color: #FFF8F0;
      border-left: 4px solid #FF9F43;
    }

    /* Dark mode styles */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #000000 !important;
        color: #ffffff !important;
      }
      .email-container {
        background-color: #000000 !important;
      }
      .cta-button {
        background-color: #ffffff !important;
        color: #000000 !important;
      }
      .otp-display {
        background-color: #1a1a1a !important;
      }
      hr {
        border-top-color: #333333 !important;
      }
      h1, h2, h3, p, span, td {
        color: #ffffff !important;
      }
      a {
        color: #ffffff !important;
      }
      .warning-box {
        background-color: #2a2416 !important;
      }
      .warning-box p {
        color: #ffcc80 !important;
      }
    }

    /* Outlook dark mode */
    [data-ogsc] body {
      background-color: #000000 !important;
      color: #ffffff !important;
    }
    [data-ogsc] .email-container {
      background-color: #000000 !important;
    }
    [data-ogsc] .cta-button {
      background-color: #ffffff !important;
      color: #000000 !important;
    }
    [data-ogsc] .otp-display {
      background-color: #1a1a1a !important;
    }
    [data-ogsc] hr {
      border-top-color: #333333 !important;
    }
    [data-ogsc] h1,
    [data-ogsc] h2,
    [data-ogsc] h3,
    [data-ogsc] p,
    [data-ogsc] span,
    [data-ogsc] td {
      color: #ffffff !important;
    }
    [data-ogsc] a {
      color: #ffffff !important;
    }
  </style>
</head>
<body>
  <div class="email-container">
    ${emailHeader()}
    ${content}
    ${emailFooter()}
  </div>
</body>
</html>`;
}

/**
 * Base email wrapper with consistent styling
 * Now delegates to brandedEmailWrapper for branded styling and dark mode support
 */
function emailWrapper(content: string): string {
  return brandedEmailWrapper(content);
}

/**
 * Generates the OTP verification email HTML content.
 * Used by the emailOTP plugin for signup verification, password reset, and sign-in.
 * @param email - The recipient's email address
 * @param otp - The 6-digit OTP code
 * @param purpose - The purpose of the OTP (defaults to "email-verification")
 * @param verifyUrl - Optional magic link URL for one-click verification
 * @returns Complete HTML email string
 */
export function otpVerificationEmailHtml(
  email: string,
  otp: string,
  purpose: "email-verification" | "forget-password" | "sign-in" = "email-verification",
  verifyUrl?: string
): string {
  const headings: Record<string, string> = {
    "email-verification": "Verify Your Email",
    "forget-password": "Reset Your Password",
    "sign-in": "Sign In to Tenseats",
  };
  const heading = headings[purpose] || "Verify Your Email";

  // Format OTP with spaces between digits for readability
  const formattedOtp = otp.split("").join("  ");

  // Optional magic link section
  const magicLinkSection = verifyUrl
    ? `
    <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 8px;">
      Or verify by clicking the link below:
    </p>
    <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 24px; word-break: break-all;">
      <a href="${verifyUrl}" style="color: ${BRAND_COLOR}; text-decoration: none;">${verifyUrl}</a>
    </p>
    `
    : "";

  const content = `
    <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 16px; font-weight: 600;">${heading}</h1>
    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Hi there,</p>
    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
      Enter the following code to ${purpose === "forget-password" ? "reset your password" : purpose === "sign-in" ? "sign in" : "verify your email address"}:
    </p>
    <div class="otp-display" style="background-color: #f5f5f5; border-radius: 8px; padding: 32px 24px; text-align: center; margin: 0 0 16px;">
      <span style="font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 700; letter-spacing: 12px; color: ${BRAND_COLOR};">${formattedOtp}</span>
    </div>
    <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
      This code expires in <strong>5 minutes</strong> and can be used for <strong>3 attempts</strong>.
    </p>
    ${magicLinkSection}
    <div class="warning-box" style="background-color: #FFF8F0; border-left: 4px solid #FF9F43; padding: 16px; border-radius: 4px; margin-top: 24px;">
      <p style="color: #856404; font-size: 14px; margin: 0 0 8px; font-weight: 700;">
        Didn't request this?
      </p>
      <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0;">
        If you didn't create an account on Tenseats, you can safely ignore this email. Someone may have entered your email address by mistake.
      </p>
    </div>
  `;

  return emailWrapper(content);
}

/**
 * Generates the password reset email HTML content.
 * @param username - The user's username to personalize the greeting
 * @param resetUrl - The password reset URL with token
 * @returns Complete HTML email string
 */
export function passwordResetEmailHtml(
  username: string,
  resetUrl: string
): string {
  const displayName = username ? `@${username}` : "there";

  const content = `
    <h1 style="color: #1a1a1a; font-size: 24px; margin: 0 0 16px; font-weight: 600;">Password Reset Request</h1>
    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 16px;">Hi ${displayName},</p>
    <p style="color: #4a4a4a; font-size: 16px; line-height: 1.6; margin: 0 0 24px;">
      We received a request to reset your password. Click the button below to create a new password. This link expires in <strong>15 minutes</strong>.
    </p>
    <a href="${resetUrl}" class="cta-button" style="display: inline-block; background-color: #000000; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500; margin: 0 0 24px;">
      Reset Password
    </a>
    <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0; word-break: break-all;">
      Or copy this link: <a href="${resetUrl}" style="color: ${BRAND_COLOR};">${resetUrl}</a>
    </p>
    <p style="color: #999999; font-size: 14px; line-height: 1.6; margin: 24px 0 0;">
      If you didn't request this, you can safely ignore this email.
    </p>
  `;

  return emailWrapper(content);
}

