import type { Id, Doc } from "./_generated/dataModel";
import type { QueryCtx, MutationCtx } from "./_generated/server";
import { authComponent } from "./auth";

/**
 * Get the app user ID from the authenticated JWT identity.
 * Uses ctx.auth.getUserIdentity() (~1ms) instead of the expensive
 * authComponent.getAuthUser() (~900ms).
 */
export async function getAppUserId(ctx: QueryCtx | MutationCtx): Promise<Id<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  const email = identity.email;
  if (!email) return null;
  const appUser = await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", email))
    .first();
  return appUser?._id ?? null;
}

/**
 * Get the full app user document from the authenticated JWT identity.
 * Returns null if not authenticated or user not found.
 */
/**
 * Check if the current user is a super admin.
 * Uses authComponent.getAuthUser to get the Better Auth string ID,
 * then queries the adminRoles table. Returns false on any failure.
 */
export async function isSuperAdmin(ctx: QueryCtx | MutationCtx): Promise<boolean> {
  try {
    const authUser = await authComponent.getAuthUser(ctx);
    if (!authUser) return false;
    const betterAuthId = String(authUser._id);
    const adminRole = await ctx.db
      .query("adminRoles")
      .withIndex("by_user", (q) => q.eq("userId", betterAuthId))
      .unique();
    return adminRole?.isSuperAdmin === true;
  } catch {
    return false;
  }
}

export async function getAppUser(ctx: QueryCtx | MutationCtx): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  const email = identity.email;
  if (!email) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_email", (q) => q.eq("email", email))
    .first();
}
