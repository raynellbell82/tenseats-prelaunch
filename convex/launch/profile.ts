import { mutation } from "../_generated/server";
import { v, ConvexError } from "convex/values";
import { getAppUser } from "../authHelpers";

// ---------------------------------------------------------------------------
// Public Mutation: completeProfile (PROF-01, PROF-03)
// Called after checkout to fill in profile fields. Derives city from the
// user's pre-registration metro (metro.cities[0]). Guards against
// double-submission via isProfileComplete flag.
// ---------------------------------------------------------------------------

export const completeProfile = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    dateOfBirth: v.number(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const user = await getAppUser(ctx);
    if (!user) throw new ConvexError("Not authenticated");

    if (user.isProfileComplete === true) {
      throw new ConvexError("Profile already completed");
    }

    // Derive city from pre-registration metro chain (PROF-03):
    // user.preRegistrationId -> preRegistration.metroId -> metro.cities[0]
    let city: string | undefined;

    if (user.preRegistrationId) {
      const preReg = await ctx.db.get(user.preRegistrationId);
      if (preReg) {
        const metro = await ctx.db.get(preReg.metroId);
        if (metro && metro.cities.length > 0) {
          city = metro.cities[0];
        }
      }
    }

    await ctx.db.patch(user._id, {
      firstName: args.firstName,
      lastName: args.lastName,
      dateOfBirth: args.dateOfBirth,
      ...(city !== undefined ? { city } : {}),
      isProfileComplete: true,
    });

    return null;
  },
});
