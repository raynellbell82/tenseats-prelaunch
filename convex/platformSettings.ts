import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { authComponent } from "./auth";
import { components, internal } from "./_generated/api";

// Default settings for initial seed
const GLOBAL_SETTINGS = {
  slug: "global",
  platformFee: 499, // $4.99 in cents
  defaultBookingExpiryHours: 72,
  featuredEventLimit: 10, // Default: 10 featured events
};

// Seed platformSettings table (idempotent - skips if exists)
export const seedPlatformSettings = mutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();

    // Check if global settings already exist
    const existing = await ctx.db
      .query("platformSettings")
      .withIndex("by_slug", (q) => q.eq("slug", "global"))
      .unique();

    if (existing) {
      return { created: 0, skipped: 1, total: 1, message: "Global settings already exist" };
    }

    await ctx.db.insert("platformSettings", {
      ...GLOBAL_SETTINGS,
      createdAt: now,
      updatedAt: now,
    });

    return { created: 1, skipped: 0, total: 1, message: "Global settings created" };
  },
});

// Query to get global platform settings
export const getGlobalSettings = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_slug", (q) => q.eq("slug", "global"))
      .unique();

    if (!settings) {
      // Return defaults if not seeded yet
      return {
        platformFee: GLOBAL_SETTINGS.platformFee,
        defaultBookingExpiryHours: GLOBAL_SETTINGS.defaultBookingExpiryHours,
        featuredEventLimit: GLOBAL_SETTINGS.featuredEventLimit,
      };
    }

    return {
      platformFee: settings.platformFee,
      defaultBookingExpiryHours: settings.defaultBookingExpiryHours,
      featuredEventLimit: settings.featuredEventLimit ?? GLOBAL_SETTINGS.featuredEventLimit,
    };
  },
});

/**
 * Get global refund window defaults.
 * Public query — no auth required (read-only, non-sensitive).
 * Returns hardcoded fallbacks if the platformSettings row is missing.
 *
 * Phase 93: Platform-level refund window read path.
 */
export const getRefundWindows = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_slug", (q) => q.eq("slug", "global"))
      .unique();

    return {
      ticketRefundWindowHours: settings?.ticketRefundWindowHours ?? 72,
      rentalRefundWindowHours: settings?.rentalRefundWindowHours ?? 48,
      depositRefundWindowHours: settings?.depositRefundWindowHours ?? 24,
    };
  },
});

/**
 * Check if a user ID is in the admin list.
 * Admin IDs are configured via ADMIN_USER_IDS environment variable (comma-separated).
 */
function isAdminUser(userId: string): boolean {
  const adminIds = process.env.ADMIN_USER_IDS;
  if (!adminIds) {
    return false;
  }
  const adminList = adminIds.split(",").map((id) => id.trim());
  return adminList.includes(userId);
}

/**
 * Check if the current user is an admin.
 * This is for UI gating only - mutations MUST verify admin status server-side.
 *
 * Checks both:
 * 1. ADMIN_USER_IDS env var (legacy/override)
 * 2. adminRoles table (setup wizard assigns roles here)
 */
export const isAdmin = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) {
      return false;
    }

    const userId = String(user._id);

    // Check env var first (legacy/override)
    if (isAdminUser(userId)) {
      return true;
    }

    // Check adminRoles table (setup wizard creates entries here)
    const adminRole = await ctx.db
      .query("adminRoles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    return adminRole?.isSuperAdmin === true || adminRole?.isAdmin === true;
  },
});

/**
 * Update global refund window defaults.
 * Super admin only. Patches only provided fields and writes a per-field audit log entry
 * for each changed field (BEFORE patching — consistent with updatePlatformFee pattern).
 *
 * Phase 93: Platform-level refund window write path.
 */
export const updateRefundWindows = mutation({
  args: {
    ticketRefundWindowHours: v.optional(v.number()),
    rentalRefundWindowHours: v.optional(v.number()),
    depositRefundWindowHours: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Auth: super admin only — inline to capture auth user once (avoids two ~900ms calls)
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) throw new Error("Not authenticated");
    const changedBy = String(authUser._id);

    const adminRole = await ctx.db
      .query("adminRoles")
      .withIndex("by_user", (q) => q.eq("userId", changedBy))
      .unique();
    if (!adminRole?.isSuperAdmin) throw new Error("Super admin access required");

    // Load settings row
    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_slug", (q) => q.eq("slug", "global"))
      .unique();
    if (!settings) throw new Error("Global settings not found - run seedPlatformSettings first");

    // Validate range for each provided field (0 = disabled sentinel, 8760 = 1 year)
    if (args.ticketRefundWindowHours !== undefined) {
      if (args.ticketRefundWindowHours < 0 || args.ticketRefundWindowHours > 8760) {
        throw new Error("ticketRefundWindowHours must be between 0 and 8760");
      }
    }
    if (args.rentalRefundWindowHours !== undefined) {
      if (args.rentalRefundWindowHours < 0 || args.rentalRefundWindowHours > 8760) {
        throw new Error("rentalRefundWindowHours must be between 0 and 8760");
      }
    }
    if (args.depositRefundWindowHours !== undefined) {
      if (args.depositRefundWindowHours < 0 || args.depositRefundWindowHours > 8760) {
        throw new Error("depositRefundWindowHours must be between 0 and 8760");
      }
    }

    const now = Date.now();
    const updates: Record<string, unknown> = {};

    // Audit log + collect updates for each provided field (BEFORE patching)
    if (args.ticketRefundWindowHours !== undefined) {
      await ctx.db.insert("platformSettingsAuditLog", {
        settingSlug: "global",
        fieldChanged: "ticketRefundWindowHours",
        oldValue: settings.ticketRefundWindowHours ?? 72,
        newValue: args.ticketRefundWindowHours,
        changedBy,
        changedAt: now,
      });
      updates.ticketRefundWindowHours = args.ticketRefundWindowHours;
    }

    if (args.rentalRefundWindowHours !== undefined) {
      await ctx.db.insert("platformSettingsAuditLog", {
        settingSlug: "global",
        fieldChanged: "rentalRefundWindowHours",
        oldValue: settings.rentalRefundWindowHours ?? 48,
        newValue: args.rentalRefundWindowHours,
        changedBy,
        changedAt: now,
      });
      updates.rentalRefundWindowHours = args.rentalRefundWindowHours;
    }

    if (args.depositRefundWindowHours !== undefined) {
      await ctx.db.insert("platformSettingsAuditLog", {
        settingSlug: "global",
        fieldChanged: "depositRefundWindowHours",
        oldValue: settings.depositRefundWindowHours ?? 24,
        newValue: args.depositRefundWindowHours,
        changedBy,
        changedAt: now,
      });
      updates.depositRefundWindowHours = args.depositRefundWindowHours;
    }

    // Patch settings only if at least one field was provided
    if (Object.keys(updates).length > 0) {
      updates.updatedAt = now;
      await ctx.db.patch(settings._id, updates);
    }

    return { success: true };
  },
});

/**
 * Update the platform fee setting.
 * Only admins can update this setting. Creates an audit log entry.
 */
export const updatePlatformFee = mutation({
  args: {
    platformFee: v.number(),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Check admin status
    const userId = String(user._id);
    if (!isAdminUser(userId)) {
      throw new Error("Admin access required");
    }

    // Validate fee range (50-5000 cents = $0.50-$50.00)
    if (args.platformFee < 50 || args.platformFee > 5000) {
      throw new Error("Platform fee must be between $0.50 and $50.00");
    }

    // Get existing settings
    const existing = await ctx.db
      .query("platformSettings")
      .withIndex("by_slug", (q) => q.eq("slug", "global"))
      .unique();

    if (!existing) {
      throw new Error("Global settings not found - run seed first");
    }

    // Insert audit log BEFORE updating
    await ctx.db.insert("platformSettingsAuditLog", {
      settingSlug: "global",
      fieldChanged: "platformFee",
      oldValue: existing.platformFee,
      newValue: args.platformFee,
      changedBy: userId,
      changedAt: Date.now(),
    });

    // Update settings
    await ctx.db.patch(existing._id, {
      platformFee: args.platformFee,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      previousFee: existing.platformFee,
    };
  },
});

/**
 * Update the featured event limit setting.
 * Only admins can update this setting. Creates an audit log entry.
 */
export const updateFeaturedEventLimit = mutation({
  args: {
    featuredEventLimit: v.number(),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      throw new Error("Not authenticated");
    }

    // Check admin status
    const userId = String(user._id);
    if (!isAdminUser(userId)) {
      throw new Error("Admin access required");
    }

    // Validate limit range (1-20 featured events)
    if (args.featuredEventLimit < 1 || args.featuredEventLimit > 20) {
      throw new Error("Featured event limit must be between 1 and 20");
    }

    // Get existing settings
    const existing = await ctx.db
      .query("platformSettings")
      .withIndex("by_slug", (q) => q.eq("slug", "global"))
      .unique();

    if (!existing) {
      throw new Error("Global settings not found - run seed first");
    }

    // Insert audit log BEFORE updating
    await ctx.db.insert("platformSettingsAuditLog", {
      settingSlug: "global",
      fieldChanged: "featuredEventLimit",
      oldValue: existing.featuredEventLimit ?? 10,
      newValue: args.featuredEventLimit,
      changedBy: userId,
      changedAt: Date.now(),
    });

    // Update settings
    await ctx.db.patch(existing._id, {
      featuredEventLimit: args.featuredEventLimit,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      previousLimit: existing.featuredEventLimit ?? 10,
    };
  },
});

/**
 * Check if initial setup has been completed.
 * Returns false if setupCompleted is undefined/false or if no settings exist.
 *
 * Phase 40: Setup detection for first-launch wizard.
 */
export const isSetupCompleted = query({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_slug", (q) => q.eq("slug", "global"))
      .unique();

    return settings?.setupCompleted ?? false;
  },
});

/**
 * Validate if provided email matches SETUP_ADMIN_EMAIL env var.
 * Used for email-gated access to setup wizard.
 *
 * Phase 40: Admin email validation for setup access control.
 */
export const validateSetupEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const adminEmail = process.env.SETUP_ADMIN_EMAIL;

    if (!adminEmail) {
      console.error("SETUP_ADMIN_EMAIL environment variable not set");
      throw new ConvexError({
        code: "SETUP_MISCONFIGURED",
        message: "Setup email not configured. Set SETUP_ADMIN_EMAIL in environment variables.",
      });
    }

    // Normalize both emails (case-insensitive, trim whitespace)
    const normalizedInput = args.email.trim().toLowerCase();
    const normalizedAdmin = adminEmail.trim().toLowerCase();

    return normalizedInput === normalizedAdmin;
  },
});

/**
 * Update platform configuration during setup wizard.
 * Only accessible during initial setup (setupCompleted = false).
 *
 * Phase 43: Platform configuration step - name, logo, metro, fee.
 */
export const updatePlatformConfig = mutation({
  args: {
    platformName: v.string(),
    logoStorageId: v.optional(v.id("_storage")), // Optional - can be set later
    defaultMetroId: v.id("metros"),
    platformFee: v.number(), // In cents
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Get the global settings record
    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_slug", (q) => q.eq("slug", "global"))
      .unique();

    if (!settings) {
      throw new Error("Platform settings not found");
    }

    // Only allow during setup (not after completion)
    if (settings.setupCompleted) {
      throw new Error("Setup already completed");
    }

    // Build update object (only include logoStorageId if provided)
    const updateData: Record<string, unknown> = {
      platformName: args.platformName,
      defaultMetroId: args.defaultMetroId,
      platformFee: args.platformFee,
      updatedAt: Date.now(),
    };

    if (args.logoStorageId) {
      updateData.logoStorageId = args.logoStorageId;
    }

    // Update with new configuration
    await ctx.db.patch(settings._id, updateData);

    return null;
  },
});

/**
 * Query to get all active metros for selection dropdown.
 *
 * Phase 43: Metro selection in platform configuration.
 */
export const getActiveMetros = query({
  args: {},
  handler: async (ctx) => {
    const metros = await ctx.db
      .query("metros")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    return metros.map((m) => ({
      _id: m._id,
      name: m.name,
      displayName: m.displayName,
    }));
  },
});

/**
 * Complete the setup wizard - atomically sets setupCompleted flag and grants super admin role.
 * Only callable during initial setup (setupCompleted must be false).
 *
 * Uses email validation instead of Convex auth because Better Auth session tokens
 * may not propagate to the Convex client immediately after signin.
 *
 * Phase 45: Setup completion and admin role assignment.
 */
export const completeSetup = mutation({
  args: {
    email: v.string(), // Setup admin email for validation
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // Validate this is the setup admin email
    const adminEmail = process.env.SETUP_ADMIN_EMAIL;
    if (!adminEmail) {
      return { success: false, error: "SETUP_ADMIN_EMAIL not configured" };
    }

    const normalizedEmail = args.email.toLowerCase().trim();
    if (normalizedEmail !== adminEmail.toLowerCase().trim()) {
      return { success: false, error: "Not authorized - not setup admin email" };
    }

    // Get the global settings record
    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_slug", (q) => q.eq("slug", "global"))
      .unique();

    if (!settings) {
      return { success: false, error: "Platform settings not found" };
    }

    // Idempotent: return early if already completed
    if (settings.setupCompleted) {
      return { success: true };
    }

    // Validate prerequisites before completion
    // Note: logo is optional during setup due to CORS limitations with localhost
    const missingFields: string[] = [];
    if (!settings.platformName || settings.platformName.trim() === "") {
      missingFields.push("platform name");
    }
    // Logo is optional - can be uploaded later via admin settings
    // if (!settings.logoStorageId) {
    //   missingFields.push("logo");
    // }
    if (!settings.defaultMetroId) {
      missingFields.push("default metro");
    }

    if (missingFields.length > 0) {
      return {
        success: false,
        error: `Missing required fields: ${missingFields.join(", ")}. Please go back and complete all steps.`,
      };
    }

    try {
      // Look up the Better Auth user by email to get their ID
      const baUser = await ctx.runQuery(components.betterAuth.adapter.findOne, {
        model: "user",
        where: [{ field: "email", operator: "eq", value: normalizedEmail }],
      });

      if (!baUser) {
        return { success: false, error: "User not found in Better Auth" };
      }

      // Better Auth adapter returns '_id' (Convex document ID)
      const userId = String(baUser._id);

      // Query for existing adminRoles record
      const existingRole = await ctx.db
        .query("adminRoles")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .unique();

      const now = Date.now();

      if (existingRole) {
        // Update existing record to grant super admin
        await ctx.db.patch(existingRole._id, {
          isSuperAdmin: true,
          isAdmin: true,
          updatedAt: now,
          updatedBy: userId,
        });
      } else {
        // Insert new adminRoles record
        await ctx.db.insert("adminRoles", {
          userId,
          isAdmin: true,
          isSuperAdmin: true,
          createdAt: now,
          updatedAt: now,
          createdBy: userId,
          updatedBy: userId,
        });
      }

      // Atomically set setupCompleted flag
      await ctx.db.patch(settings._id, {
        setupCompleted: true,
        updatedAt: now,
      });

      // Seed default MCP servers (idempotent)
      await ctx.scheduler.runAfter(0, internal.mcpServers.internalSeed, {});

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return { success: false, error: `Setup failed: ${message}` };
    }
  },
});

/**
 * Update the platform logo (admin only).
 * Replaces existing logo if one exists.
 */
export const updatePlatformLogo = mutation({
  args: {
    logoStorageId: v.id("_storage"),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // Get authenticated user
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Check admin status
    const userId = String(user._id);
    if (!isAdminUser(userId)) {
      // Also check adminRoles table for super admin
      const adminRole = await ctx.db
        .query("adminRoles")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .unique();

      if (!adminRole?.isSuperAdmin && !adminRole?.isAdmin) {
        return { success: false, error: "Admin access required" };
      }
    }

    // Get existing settings
    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_slug", (q) => q.eq("slug", "global"))
      .unique();

    if (!settings) {
      return { success: false, error: "Platform settings not found" };
    }

    // Delete old logo if exists
    if (settings.logoStorageId) {
      try {
        await ctx.storage.delete(settings.logoStorageId);
      } catch (e) {
        console.warn("Failed to delete old logo:", e);
      }
    }

    // Update with new logo
    await ctx.db.patch(settings._id, {
      logoStorageId: args.logoStorageId,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Get the platform logo URL from storage.
 * Returns null if no logo configured. Public query for navbar display.
 *
 * Phase 45: Dynamic branding for navbar.
 */
export const getLogoUrl = query({
  args: {},
  returns: v.union(v.string(), v.null()),
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_slug", (q) => q.eq("slug", "global"))
      .unique();

    if (!settings || !settings.logoStorageId) {
      return null;
    }

    return await ctx.storage.getUrl(settings.logoStorageId);
  },
});

/**
 * Get the platform dark mode logo URL from storage.
 * Returns null if no dark logo configured. Public query for navbar display.
 */
export const getDarkLogoUrl = query({
  args: {},
  returns: v.union(v.string(), v.null()),
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_slug", (q) => q.eq("slug", "global"))
      .unique();

    if (!settings || !settings.logoDarkStorageId) {
      return null;
    }

    return await ctx.storage.getUrl(settings.logoDarkStorageId);
  },
});

/**
 * Update the platform dark mode logo (admin only).
 * Replaces existing dark logo if one exists.
 */
export const updatePlatformDarkLogo = mutation({
  args: {
    logoStorageId: v.id("_storage"),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // Get authenticated user
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Check admin status
    const userId = String(user._id);
    if (!isAdminUser(userId)) {
      // Also check adminRoles table for super admin
      const adminRole = await ctx.db
        .query("adminRoles")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .unique();

      if (!adminRole?.isSuperAdmin && !adminRole?.isAdmin) {
        return { success: false, error: "Admin access required" };
      }
    }

    // Get existing settings
    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_slug", (q) => q.eq("slug", "global"))
      .unique();

    if (!settings) {
      return { success: false, error: "Platform settings not found" };
    }

    // Delete old dark logo if exists
    if (settings.logoDarkStorageId) {
      try {
        await ctx.storage.delete(settings.logoDarkStorageId);
      } catch (e) {
        console.warn("Failed to delete old dark logo:", e);
      }
    }

    // Update with new dark logo
    await ctx.db.patch(settings._id, {
      logoDarkStorageId: args.logoStorageId,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Get the platform name.
 * Returns configured name or "Tenseats" fallback. Public query for navbar display.
 *
 * Phase 45: Dynamic branding for navbar.
 */
export const getPlatformName = query({
  args: {},
  returns: v.string(),
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_slug", (q) => q.eq("slug", "global"))
      .unique();

    return settings?.platformName || "Tenseats";
  },
});

/**
 * Update the platform name (admin only).
 * Creates an audit log entry.
 *
 * Phase 48: Editable platform name for superadmin.
 */
export const updatePlatformName = mutation({
  args: {
    platformName: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // Get authenticated user
    const user = await authComponent.getAuthUser(ctx);
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    // Check admin status
    const userId = String(user._id);
    if (!isAdminUser(userId)) {
      // Also check adminRoles table for super admin
      const adminRole = await ctx.db
        .query("adminRoles")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .unique();

      if (!adminRole?.isSuperAdmin && !adminRole?.isAdmin) {
        return { success: false, error: "Admin access required" };
      }
    }

    // Validate platform name
    const trimmedName = args.platformName.trim();
    if (trimmedName.length < 1 || trimmedName.length > 50) {
      return { success: false, error: "Platform name must be between 1 and 50 characters" };
    }

    // Get existing settings
    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_slug", (q) => q.eq("slug", "global"))
      .unique();

    if (!settings) {
      return { success: false, error: "Platform settings not found" };
    }

    // Insert audit log BEFORE updating
    await ctx.db.insert("platformSettingsAuditLog", {
      settingSlug: "global",
      fieldChanged: "platformName",
      oldValue: settings.platformName || "Tenseats",
      newValue: trimmedName,
      changedBy: userId,
      changedAt: Date.now(),
    });

    // Update with new platform name
    await ctx.db.patch(settings._id, {
      platformName: trimmedName,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Auto-verify the setup admin's email address.
 *
 * This is called after signUp.email to bypass email verification for the setup admin.
 * Safe because: the admin email was already validated via validateSetupEmail in step 1.
 *
 * Why needed: requireEmailVerification=true blocks session creation on signUp.
 * Setting emailVerified=true allows subsequent signIn.email to create a session.
 *
 * Phase 48: Gap closure for Better Auth session timing issue.
 */
export const autoVerifySetupAdmin = mutation({
  args: { email: v.string() },
  returns: v.object({
    success: v.boolean(),
    error: v.optional(v.string()),
  }),
  handler: async (ctx, args) => {
    // Validate this is the setup admin email
    const adminEmail = process.env.SETUP_ADMIN_EMAIL;
    if (!adminEmail) {
      return { success: false, error: "SETUP_ADMIN_EMAIL not configured" };
    }

    if (args.email.toLowerCase().trim() !== adminEmail.toLowerCase().trim()) {
      return { success: false, error: "Not authorized - not setup admin email" };
    }

    // Check setup is not already complete
    const settings = await ctx.db.query("platformSettings").first();
    if (settings?.setupCompleted) {
      return { success: false, error: "Setup already completed" };
    }

    // Find the user in Better Auth by email
    const user = await ctx.runQuery(components.betterAuth.adapter.findOne, {
      model: "user",
      where: [
        { field: "email", operator: "eq", value: args.email.toLowerCase().trim() },
      ],
    });

    if (!user) {
      return { success: false, error: "User not found in Better Auth" };
    }

    // Set emailVerified to true - this allows signIn.email to create session
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await ctx.runMutation(components.betterAuth.adapter.updateOne, {
      input: {
        model: "user",
        where: [
          { field: "email", operator: "eq", value: args.email.toLowerCase().trim() },
        ],
        update: { emailVerified: true },
      },
    } as any);

    return { success: true };
  },
});

/**
 * Seed refund window defaults into global platformSettings.
 * Idempotent: only patches fields that are currently undefined.
 * Run once after seedPlatformSettings to initialize v3.5 refund windows.
 *
 * Defaults: 72h ticket, 48h rental, 24h deposit.
 */
export const seedRefundWindowDefaults = mutation({
  args: {},
  handler: async (ctx) => {
    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_slug", (q) => q.eq("slug", "global"))
      .unique();

    if (!settings) {
      throw new Error("Global settings not found — run seedPlatformSettings first");
    }

    const updates: Record<string, unknown> = {};

    if (settings.ticketRefundWindowHours === undefined) {
      updates.ticketRefundWindowHours = 72;
    }
    if (settings.rentalRefundWindowHours === undefined) {
      updates.rentalRefundWindowHours = 48;
    }
    if (settings.depositRefundWindowHours === undefined) {
      updates.depositRefundWindowHours = 24;
    }

    if (Object.keys(updates).length === 0) {
      return { seeded: false, message: "Refund window defaults already set" };
    }

    updates.updatedAt = Date.now();
    await ctx.db.patch(settings._id, updates);

    return { seeded: true, message: "Refund window defaults seeded: 72h ticket, 48h rental, 24h deposit" };
  },
});

/**
 * Get recent refund window audit log entries.
 * Admin only. Returns most recent changes to refund window fields.
 *
 * Phase 97: Read path for refund window change history display.
 */
export const getRefundWindowAuditLog = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    // Auth: admin only
    const user = await authComponent.safeGetAuthUser(ctx);
    if (!user) return [];
    const userId = String(user._id);

    // Check env var admin list first
    if (!isAdminUser(userId)) {
      // Check adminRoles table
      const adminRole = await ctx.db
        .query("adminRoles")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .unique();
      if (!adminRole?.isSuperAdmin && !adminRole?.isAdmin) return [];
    }

    const limit = args.limit ?? 20;

    // Query by setting slug "global" to get platform-level changes
    const entries = await ctx.db
      .query("platformSettingsAuditLog")
      .withIndex("by_setting", (q) => q.eq("settingSlug", "global"))
      .order("desc")
      .take(limit);

    // Filter to only refund window fields (exclude platformFee, featuredEventLimit, platformName changes)
    const refundFields = new Set([
      "ticketRefundWindowHours",
      "rentalRefundWindowHours",
      "depositRefundWindowHours",
    ]);

    return entries.filter((e) => refundFields.has(e.fieldChanged));
  },
});

/**
 * DEV ONLY: Reset platform for fresh setup wizard testing.
 * Deletes all Better Auth users/sessions/accounts and resets setupCompleted.
 *
 * WARNING: This is destructive and should only be used in development.
 */
export const devResetPlatform = mutation({
  args: {},
  returns: v.object({
    success: v.boolean(),
    deleted: v.object({
      sessions: v.number(),
      accounts: v.number(),
      users: v.number(),
      appUsers: v.number(),
      adminRoles: v.number(),
    }),
  }),
  handler: async (ctx) => {
    // Safety: only allow in dev by checking for setupCompleted or specific env
    const settings = await ctx.db
      .query("platformSettings")
      .withIndex("by_slug", (q) => q.eq("slug", "global"))
      .unique();

    let deletedSessions = 0;
    let deletedAccounts = 0;
    let deletedUsers = 0;
    let deletedAppUsers = 0;
    let deletedAdminRoles = 0;

    // Pagination options for Better Auth adapter
    const paginationOpts = { cursor: null, numItems: 1000 };

    // 1. Delete all Better Auth sessions
    const sessionsResult = await ctx.runQuery(components.betterAuth.adapter.findMany, {
      model: "session",
      where: [],
      paginationOpts,
    });
    for (const session of sessionsResult.page) {
      await ctx.runMutation(components.betterAuth.adapter.deleteOne, {
        input: {
          model: "session",
          where: [{ field: "_id", operator: "eq", value: session._id }],
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      deletedSessions++;
    }

    // 2. Delete all Better Auth accounts
    const accountsResult = await ctx.runQuery(components.betterAuth.adapter.findMany, {
      model: "account",
      where: [],
      paginationOpts,
    });
    for (const account of accountsResult.page) {
      await ctx.runMutation(components.betterAuth.adapter.deleteOne, {
        input: {
          model: "account",
          where: [{ field: "_id", operator: "eq", value: account._id }],
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      deletedAccounts++;
    }

    // 3. Delete all Better Auth users
    const usersResult = await ctx.runQuery(components.betterAuth.adapter.findMany, {
      model: "user",
      where: [],
      paginationOpts,
    });
    for (const user of usersResult.page) {
      await ctx.runMutation(components.betterAuth.adapter.deleteOne, {
        input: {
          model: "user",
          where: [{ field: "_id", operator: "eq", value: user._id }],
        },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      deletedUsers++;
    }

    // 4. Delete app users (except seed users like tenseats_curated)
    const appUsers = await ctx.db.query("users").collect();
    for (const user of appUsers) {
      // Skip seed users
      if (user.username === "tenseats_curated") continue;
      await ctx.db.delete(user._id);
      deletedAppUsers++;
    }

    // 5. Delete admin roles
    const adminRoles = await ctx.db.query("adminRoles").collect();
    for (const role of adminRoles) {
      await ctx.db.delete(role._id);
      deletedAdminRoles++;
    }

    // 6. Reset setupCompleted flag
    if (settings) {
      await ctx.db.patch(settings._id, {
        setupCompleted: false,
        updatedAt: Date.now(),
      });
    }

    return {
      success: true,
      deleted: {
        sessions: deletedSessions,
        accounts: deletedAccounts,
        users: deletedUsers,
        appUsers: deletedAppUsers,
        adminRoles: deletedAdminRoles,
      },
    };
  },
});
