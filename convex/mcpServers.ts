import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// ---------------------------------------------------------------------------
// Internal Mutation: internalSeed
// Seeds default MCP servers. Called by platformSettings.completeSetup.
// Pre-launch site has no default MCP servers to seed — this is a no-op.
// ---------------------------------------------------------------------------

export const internalSeed = internalMutation({
  args: {},
  returns: v.null(),
  handler: async (_ctx) => {
    // No default MCP servers to seed in pre-launch site.
    return null;
  },
});
