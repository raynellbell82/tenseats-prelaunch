import { defineApp } from "convex/server";
import betterAuth from "@convex-dev/better-auth/convex.config";
import rateLimiter from "@convex-dev/rate-limiter/convex.config";
import presence from "@convex-dev/presence/convex.config.js";
import stripe from "@convex-dev/stripe/convex.config.js";
import r2 from "@convex-dev/r2/convex.config";
import workflow from "@convex-dev/workflow/convex.config";
import workpool from "@convex-dev/workpool/convex.config";

const app = defineApp();

app.use(betterAuth);
app.use(rateLimiter);
app.use(presence);
app.use(stripe);
app.use(r2);
app.use(workflow);
app.use(workpool, { name: "migrationPool" });

export default app;
