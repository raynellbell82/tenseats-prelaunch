import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

// Validator helpers for reuse
const coordinates = v.object({
  lat: v.number(),
  lng: v.number(),
});

const timestamps = {
  createdAt: v.number(),
  updatedAt: v.number(),
};

const roleType = v.union(
  v.literal("chef"),
  v.literal("mixologist"),
  v.literal("creator"),
  v.literal("venueHost"),
  v.literal("guest")
);

const membershipTier = v.union(
  v.literal("early_bird"),
  v.literal("founding"),
  v.literal("insider")
);

const membershipCategory = v.union(
  v.literal("chef"),
  v.literal("mixologist"),
  v.literal("creator"),
  v.literal("venueHost"),
  v.literal("guest")
);

const preRegistrationStatus = v.union(
  v.literal("registered"),
  v.literal("verified"),
  v.literal("invited"),
  v.literal("completed"),
  v.literal("invite_expired"),
  v.literal("cancelled")
);

const roleStatus = v.union(
  v.literal("pending"),
  v.literal("active"),
  v.literal("suspended")
);

const eventStatus = v.union(
  v.literal("draft"),
  v.literal("published"),
  v.literal("canceled"),
  v.literal("completed")
);

const postStatus = v.union(v.literal("draft"), v.literal("published"));

const postVisibility = v.union(
  v.literal("public"),
  v.literal("followers"),
  v.literal("private")
);

const mediaType = v.union(v.literal("image"), v.literal("video"));

const cityReference = v.object({
  name: v.string(),
  country: v.optional(v.string()),
  metroId: v.optional(v.id("metros")),
});

const workflowStatus = v.union(
  v.literal("running"),
  v.literal("success"),
  v.literal("failed")
);

const purchaseStatus = v.union(
  v.literal("pending"),
  v.literal("completed"),
  v.literal("refunded")
);

const ticketStatus = v.union(
  v.literal("active"),
  v.literal("refunded"),
  v.literal("used")
);

const scanResult = v.union(
  v.literal("success"),
  v.literal("already_used"),
  v.literal("invalid"),
  v.literal("refunded")
);

const venueRequestStatus = v.union(
  v.literal("pending"),
  v.literal("approved"),
  v.literal("declined"),
  v.literal("expired"),
  v.literal("cancelled")
);

const stripeAccountType = v.literal("express");

const promoCodeDiscountType = v.union(
  v.literal("percentage"),
  v.literal("fixed")
);

// v3.4 Venue Hosting validator constants
const venueListingStatus = v.union(
  v.literal("draft"),
  v.literal("published"),
  v.literal("paused"),
  v.literal("archived")
);

const venueAvailabilityStatus = v.union(
  v.literal("available"),
  v.literal("blocked"),
  v.literal("pending"),    // Has a pending booking request
  v.literal("booked"),     // Confirmed booking
  v.literal("preparation") // Preparation buffer day
);

const venueBookingStatus = v.union(
  v.literal("pending"),    // Awaiting host approval
  v.literal("approved"),   // Host approved, awaiting renter payment
  v.literal("declined"),   // Host declined
  v.literal("expired"),    // Auto-expired (no host response or no payment)
  v.literal("confirmed"),  // Payment complete
  v.literal("completed"),  // Event date passed
  v.literal("cancelled")   // Cancelled after confirmation
);

const cancellationPolicy = v.union(
  v.literal("flexible"),   // Full refund 24h+ before
  v.literal("moderate"),   // Full 7d+, 50% 24h-7d
  v.literal("strict")      // Full 30d+, 50% 7-30d, none <7d
);

const reviewerType = v.union(
  v.literal("renter"),
  v.literal("host")
);

const depositType = v.union(
  v.literal("fixed"),
  v.literal("percentage")
);

export default defineSchema({
  // ============================================
  // USERS & ROLES
  // ============================================

  users: defineTable({
    // Contact info (at least one required)
    email: v.optional(v.string()),
    phone: v.optional(v.string()),

    // Profile
    username: v.string(),
    firstName: v.string(),
    lastName: v.string(),
    displayName: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    bio: v.optional(v.string()),

    // Demographics
    dateOfBirth: v.number(), // Unix timestamp
    city: v.string(),
    state: v.optional(v.string()),
    country: v.string(),
    timezone: v.optional(v.string()),

    // Status
    isVerified: v.boolean(),
    isActive: v.boolean(),
    lastLoginAt: v.optional(v.number()),

    // Denormalized counts (v1.2)
    followersCount: v.optional(v.number()),
    followingCount: v.optional(v.number()),
    postsCount: v.optional(v.number()),

    // v3.6 DM unread conversation count (MSG-01)
    dmUnreadConversationCount: v.optional(v.number()),

    // Notification watermark (v3.3)
    notificationsReadBefore: v.optional(v.number()),

    // Profile expansion (v1.2)
    coverImageUrl: v.optional(v.string()),

    // v4.1 Membership fields (SCHM-05)
    membershipTier: v.optional(membershipTier),
    membershipCategory: v.optional(membershipCategory),
    membershipStartedAt: v.optional(v.number()),
    membershipExpiresAt: v.optional(v.number()),
    isMembershipActive: v.optional(v.boolean()),
    isProfileComplete: v.optional(v.boolean()),
    preRegistrationId: v.optional(v.id("preRegistrations")),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    stripeBillingCustomerId: v.optional(v.string()), // Billing component customer ID (SCHEMA-01)
    stripeConnectAccountId: v.optional(v.string()), // acct_xxx — Stripe Express account ID (ONBOARD-01)
    stripeConnectComplete: v.optional(v.boolean()),  // true when webhook confirms onboarding done (ONBOARD-01)

    // Timestamps
    ...timestamps,
  })
    .index("by_email", ["email"])
    .index("by_phone", ["phone"])
    .index("by_username", ["username"])
    .index("by_city", ["city"])
    .index("by_active", ["isActive"])
    .searchIndex("search_username", {
      searchField: "username",
      filterFields: ["isActive"],
    }),

  userRoles: defineTable({
    userId: v.id("users"),
    role: roleType,
    status: roleStatus,
    verifiedAt: v.optional(v.number()),
    metadata: v.optional(v.any()), // Role-specific data (certifications, etc.)
  })
    .index("by_user", ["userId"])
    .index("by_role", ["role"])
    .index("by_user_role", ["userId", "role"]),

  userPreferences: defineTable({
    // User ID as string — stores Better Auth ID from authComponent.getAuthUser (primary write path)
    // Note: some read paths query with Convex Id<"users"> cast to string; both formats coexist
    userId: v.string(),

    // Cuisine preferences (canonical tags like "italian", "mexican")
    cuisinePreferences: v.optional(v.array(v.string())),

    // Custom hashtags (user-defined)
    hashtagPreferences: v.optional(v.array(v.string())),

    // Current location
    currentMetroId: v.optional(v.id("metros")),

    // Travel lists
    citiesVisited: v.optional(v.array(cityReference)),
    citiesWantToVisit: v.optional(v.array(cityReference)),

    // Feed preferences
    feedPreferences: v.optional(
      v.object({
        showEvents: v.optional(v.boolean()),
        showPosts: v.optional(v.boolean()),
      })
    ),

    // v3.5 Vendor refund window overrides (null = use global default, 0 = disabled, >0 = hours)
    ticketRefundWindowOverride: v.optional(v.union(v.number(), v.null())),
    rentalRefundWindowOverride: v.optional(v.union(v.number(), v.null())),
    depositRefundWindowOverride: v.optional(v.union(v.number(), v.null())),

    // v3.5 Auto-payout preferences
    autoPayoutEnabled: v.optional(v.boolean()),
    autoPayoutDelayHours: v.optional(v.number()), // Valid values: 24, 48, 72, 168 (7 days)

    // Timestamps
    ...timestamps,
  })
    .index("by_user", ["userId"])
    .index("by_metro", ["currentMetroId"]),

  // Admin-managed venue listing options (venue types, amenities, etc.)
  venueOptions: defineTable({
    category: v.union(
      v.literal("venueType"),
      v.literal("amenity"),
      v.literal("kitchenType"),
      v.literal("barEquipment"),
      v.literal("houseRule"),
      v.literal("eventType")
    ),
    group: v.optional(v.string()), // Amenity sub-group: seating, av, service, accessibility
    slug: v.string(),
    displayName: v.string(),
    isActive: v.boolean(),
    sortOrder: v.number(),
    ...timestamps,
  })
    .index("by_category", ["category"])
    .index("by_category_slug", ["category", "slug"]),

  cuisineTags: defineTable({
    slug: v.string(), // Lowercase identifier: "italian"
    displayName: v.string(), // Display version: "Italian"
    category: v.optional(v.string()), // "cuisine", "dietary", "style"
    emoji: v.optional(v.string()), // Optional emoji
    isActive: v.boolean(),
    sortOrder: v.optional(v.number()),
    ...timestamps,
  })
    .index("by_slug", ["slug"])
    .index("by_active", ["isActive"])
    .index("by_category", ["category"]),

  // ============================================
  // METROS & LOCATIONS
  // ============================================

  metros: defineTable({
    name: v.string(), // Slug: "atlanta-ga"
    displayName: v.string(), // "Atlanta, GA"
    cities: v.array(v.string()), // Cities included in this metro
    state: v.string(),
    country: v.string(),
    timezone: v.string(),
    coordinates: v.optional(coordinates),
    isActive: v.boolean(),
    apifyConfig: v.optional(v.any()), // Apify scraper config for this metro
    ...timestamps,
  })
    .index("by_name", ["name"])
    .index("by_active", ["isActive"])
    .index("by_state", ["state"]),

  venues: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    address: v.string(),
    city: v.string(),
    state: v.string(),
    postalCode: v.string(),
    country: v.string(),
    coordinates: v.optional(coordinates),
    metroId: v.optional(v.id("metros")),
    ownerId: v.optional(v.id("users")),
    phone: v.optional(v.string()),
    email: v.optional(v.string()),
    website: v.optional(v.string()),
    capacity: v.optional(v.number()),
    amenities: v.optional(v.array(v.string())),
    images: v.optional(v.array(v.id("_storage"))),
    isVerified: v.boolean(),
    isActive: v.boolean(),
    ...timestamps,

    // v3.7 Google Places integration (SCHEMA-01)
    externalId: v.optional(v.string()),
    externalSource: v.optional(v.string()), // e.g. "google_places"
    externalUrl: v.optional(v.string()),
    placeType: v.optional(v.string()), // e.g. "restaurant", "cafe", "bar"
    neighborhood: v.optional(v.string()),
    googleRating: v.optional(v.number()), // 1.0-5.0
    googleRatingCount: v.optional(v.number()),
    priceLevel: v.optional(v.number()), // 1-4
    thumbnailStorageId: v.optional(v.id("_storage")),
    heroStorageId: v.optional(v.id("_storage")),
    imageQualityScore: v.optional(v.number()),
    needsImageReview: v.optional(v.boolean()),
    publicPinCount: v.optional(v.number()),
    savesCount: v.optional(v.number()),
    contentHash: v.optional(v.string()),
    lastSyncedAt: v.optional(v.number()),
    lastSeenAt: v.optional(v.number()),
    listingId: v.optional(v.id("venueListingDetails")),
  })
    .index("by_city", ["city"])
    .index("by_metro", ["metroId"])
    .index("by_owner", ["ownerId"])
    .index("by_active", ["isActive"])
    // v3.7 new indexes (SCHEMA-06)
    .index("by_external", ["externalSource", "externalId"])
    .index("by_metro_type", ["metroId", "placeType"])
    .index("by_metro_active", ["metroId", "isActive"])
    .index("by_listing", ["listingId"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["metroId", "isActive"],
    }),

  // ============================================
  // EVENTS
  // ============================================

  events: defineTable({
    // Ownership
    creatorId: v.optional(v.id("users")), // Null for curated external events
    postId: v.optional(v.id("posts")), // Link if created via post flow
    venueId: v.optional(v.id("venues")),

    // External source (curated events)
    externalId: v.optional(v.string()),
    externalSource: v.optional(v.string()), // "eventbrite", "facebook", etc.
    externalUrl: v.optional(v.string()),

    // Event details
    title: v.string(),
    description: v.optional(v.string()),
    shortDescription: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    imageStorageId: v.optional(v.id("_storage")),
    imageUrls: v.optional(v.array(v.string())), // Up to 3 external image URLs

    // Date/Time
    startDateTime: v.number(), // Unix timestamp
    endDateTime: v.optional(v.number()),
    timezone: v.string(),

    // Location
    location: v.object({
      address: v.string(),
      city: v.string(),
      state: v.string(),
      postalCode: v.string(),
      country: v.string(),
      coordinates: v.optional(coordinates),
      venueName: v.optional(v.string()),
    }),
    metroId: v.optional(v.id("metros")),

    // Categorization
    category: v.string(),
    tags: v.optional(v.array(v.string())),

    // Restrictions & Capacity
    ageRestriction: v.optional(v.number()), // 18, 21, etc.
    hasAlcohol: v.boolean(),
    capacity: v.optional(v.number()),
    attendeeCount: v.optional(v.number()),

    // Pricing
    isFree: v.boolean(),
    priceRange: v.optional(
      v.object({
        min: v.number(),
        max: v.number(),
        currency: v.optional(v.string()),
      })
    ),

    // Status
    status: eventStatus,
    isCurated: v.boolean(),
    curatedAt: v.optional(v.number()),
    canceledAt: v.optional(v.number()),
    cancelReason: v.optional(v.string()),

    // Featured status
    isFeatured: v.optional(v.boolean()),
    featuredAt: v.optional(v.number()),
    featuredBy: v.optional(v.string()), // Better Auth admin user ID

    // Engagement
    // Optional for backward compatibility with events created before these fields were added
    likesCount: v.optional(v.number()),
    savesCount: v.optional(v.number()),
    sharesCount: v.optional(v.number()),

    // Delta detection (v2.0)
    lastSeenAt: v.optional(v.number()), // Last scrape run timestamp that saw this event
    lastScrapedAt: v.optional(v.number()), // Last scrape run timestamp regardless of seen/not-seen
    contentHash: v.optional(v.string()), // SHA-256 truncated to 16 hex chars of (date + time + location + price)
    consecutiveMisses: v.optional(v.number()), // Counter for auto-cancellation (0, 1, 2, then cancel at 3)
    cancellationSource: v.optional(
      v.union(
        v.literal("auto-detected"),
        v.literal("admin"),
        v.literal("source-reported")
      )
    ), // Who/what cancelled

    // Media storage (v2.0)
    thumbnailStorageId: v.optional(v.id("_storage")), // 750w WebP for feed cards
    heroStorageId: v.optional(v.id("_storage")), // 1200w WebP for detail page
    mediaStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("completed"),
        v.literal("failed")
      )
    ), // Media processing state
    mediaType: v.optional(mediaType), // Detected media type
    videoUrl: v.optional(v.string()), // External video URL from scraping
    videoStorageId: v.optional(v.id("_storage")), // Transcoded H.264 MP4 in Convex storage
    posterStorageId: v.optional(v.id("_storage")), // Auto-generated poster thumbnail

    // Update tracking (v2.0)
    lastUpdatedAt: v.optional(v.number()), // Timestamp of last meaningful update (for frontend "Updated" badge)

    // v3.5 Payout tracking
    payoutProcessedAt: v.optional(v.number()), // Unix timestamp when payout was marked processed
    payoutAmount: v.optional(v.number()),       // Cents paid out to vendor

    // R2 media storage (v4.2)
    r2ImageKey: v.optional(v.string()),
    r2VideoKey: v.optional(v.string()),
    r2ThumbnailKey: v.optional(v.string()),
    r2HeroKey: v.optional(v.string()),

    // Instagram auto-post (v4.2)
    instagramEnabled: v.optional(v.boolean()),
    instagramPostId: v.optional(v.string()),

    // Timestamps
    ...timestamps,
  })
    .index("by_creator", ["creatorId"])
    .index("by_post", ["postId"])
    .index("by_venue", ["venueId"])
    .index("by_metro", ["metroId"])
    .index("by_status", ["status"])
    .index("by_start_date", ["startDateTime"])
    .index("by_curated", ["isCurated"])
    .index("by_category", ["category"])
    .index("by_external", ["externalSource", "externalId"])
    .index("by_featured", ["isFeatured"])
    .index("by_metro_category", ["metroId", "category"])
    .index("by_metro_startDateTime", ["metroId", "startDateTime"])
    .searchIndex("search_title", {
      searchField: "title",
      filterFields: ["metroId", "category", "status"],
    }),

  eventAttendees: defineTable({
    eventId: v.id("events"),
    userId: v.id("users"),
    status: v.union(
      v.literal("interested"),
      v.literal("going"),
      v.literal("attended")
    ),
    ticketId: v.optional(v.string()), // Stripe payment/ticket reference
    ...timestamps,
  })
    .index("by_event", ["eventId"])
    .index("by_user", ["userId"])
    .index("by_event_user", ["eventId", "userId"])
    .index("by_user_event", ["userId", "eventId"]),

  // ============================================
  // POSTS & MEDIA
  // ============================================

  posts: defineTable({
    authorId: v.id("users"),
    content: v.optional(v.string()),

    // Event linkage
    eventId: v.optional(v.id("events")),
    isEvent: v.boolean(),

    // Location
    location: v.optional(
      v.object({
        name: v.string(),
        address: v.optional(v.string()),
        coordinates: v.optional(coordinates),
      })
    ),

    // Tagging
    hashtags: v.optional(v.array(v.string())),
    mentions: v.optional(v.array(v.id("users"))),

    // Visibility
    visibility: postVisibility,

    // Location-based filtering (v1.2)
    metroId: v.optional(v.id("metros")),

    // Cuisine tags for preference-based filtering (v1.2)
    cuisineTags: v.optional(v.array(v.string())),

    // Curated post fields (v1.5)
    isCurated: v.optional(v.boolean()),
    externalId: v.optional(v.string()),
    externalSource: v.optional(v.string()), // "instagram", "tiktok", etc.
    externalUrl: v.optional(v.string()),
    imageUrls: v.optional(v.array(v.string())), // Up to 3 external image URLs

    // Engagement counts (denormalized for performance)
    // Optional for backward compatibility with posts created before these fields were added
    likesCount: v.optional(v.number()),
    commentsCount: v.optional(v.number()),
    savesCount: v.optional(v.number()),
    sharesCount: v.optional(v.number()),

    // Flags
    isPinned: v.boolean(),
    isDeleted: v.boolean(),
    status: v.optional(postStatus),

    // Instagram auto-post (v4.2)
    instagramEnabled: v.optional(v.boolean()),
    instagramStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("processing"),
        v.literal("published"),
        v.literal("failed")
      )
    ),
    instagramContainerId: v.optional(v.string()),
    instagramMediaId: v.optional(v.string()),
    instagramError: v.optional(v.string()),
    instagramRetryCount: v.optional(v.number()),
    instagramPublishedAt: v.optional(v.number()),
    instagramWorkflowId: v.optional(v.string()),

    // Timestamps
    ...timestamps,
  })
    .index("by_author", ["authorId"])
    .index("by_created", ["createdAt"])
    .index("by_event", ["isEvent"])
    .index("by_event_id", ["eventId"])
    .index("by_visibility", ["visibility"])
    .index("by_metro_created", ["metroId"])
    .index("by_external", ["externalSource", "externalId"])
    .index("by_status", ["status"])
    .index("by_author_status", ["authorId", "status"])
    .index("by_metro_status", ["metroId", "status"])
    .index("by_instagram_status", ["instagramStatus"])
    .searchIndex("search_content", {
      searchField: "content",
      filterFields: ["metroId", "status"],
    }),

  postMedia: defineTable({
    postId: v.id("posts"),
    storageId: v.optional(v.id("_storage")), // SCHEMA-01: optional to support R2-migrated records
    type: mediaType,
    mimeType: v.string(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    duration: v.optional(v.number()), // Video duration in seconds
    fileSize: v.number(),
    order: v.number(), // Display order in carousel
    thumbnailId: v.optional(v.id("_storage")),
    altText: v.optional(v.string()),
    // R2 storage (v4.2)
    r2Key: v.optional(v.string()),
    r2ThumbnailKey: v.optional(v.string()),
    migratedAt: v.optional(v.number()),
  })
    .index("by_post", ["postId"])
    .index("by_post_order", ["postId", "order"]),

  // ============================================
  // SOCIAL INTERACTIONS
  // ============================================

  // Instagram OAuth connections (v4.2)
  instagramConnections: defineTable({
    userId: v.id("users"),
    nangoConnectionId: v.string(),
    igUserId: v.string(),
    igUsername: v.string(),
    igAccountType: v.optional(v.string()),
    tokenExpiresAt: v.optional(v.number()),
    scope: v.optional(v.string()),
    ...timestamps,
  })
    .index("by_user", ["userId"])
    .index("by_nango_connection", ["nangoConnectionId"]),

  likes: defineTable({
    userId: v.id("users"),
    targetType: v.union(v.literal("post"), v.literal("event"), v.literal("comment")),
    targetId: v.string(), // Generic ID since it can be post, event, or comment
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_target", ["targetType", "targetId"])
    .index("by_user_target", ["userId", "targetType", "targetId"]),

  saves: defineTable({
    userId: v.id("users"),
    targetType: v.union(v.literal("post"), v.literal("event"), v.literal("venue")), // SCHEMA-02
    targetId: v.string(),
    collectionId: v.optional(v.id("collections")), // For saved collections/folders
    createdAt: v.number(),

    // v3.7 pin fields (SCHEMA-03)
    isPrivate: v.optional(v.boolean()),
    coordinates: v.optional(coordinates),
    notes: v.optional(v.string()),
    rating: v.optional(v.number()),
    visitedAt: v.optional(v.number()),
    noteStatus: v.optional(v.union(
      v.literal("pending_review"),
      v.literal("approved"),
      v.literal("rejected"),
    )),
  })
    .index("by_user", ["userId"])
    .index("by_target", ["targetType", "targetId"])
    .index("by_user_target", ["userId", "targetType", "targetId"])
    .index("by_collection", ["collectionId"])
    // v3.7 new indexes (SCHEMA-07)
    .index("by_user_private", ["userId", "isPrivate"])
    .index("by_target_public", ["targetType", "targetId", "isPrivate"]),

  collections: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.optional(v.string()),
    isPrivate: v.boolean(),
    coverImageId: v.optional(v.id("_storage")),
    itemCount: v.number(),
    lastPinnedAt: v.optional(v.number()), // SCHEMA-04
    ...timestamps,
  })
    .index("by_user", ["userId"]),

  comments: defineTable({
    authorId: v.id("users"),
    postId: v.optional(v.id("posts")), // Optional - comment on post
    eventId: v.optional(v.id("events")), // Optional - comment on event
    parentId: v.optional(v.id("comments")), // For nested replies
    content: v.string(),
    mentions: v.optional(v.array(v.id("users"))),
    likesCount: v.number(),
    isDeleted: v.boolean(),
    ...timestamps,
  })
    .index("by_post", ["postId"])
    .index("by_event", ["eventId"])
    .index("by_author", ["authorId"])
    .index("by_parent", ["parentId"]),

  follows: defineTable({
    followerId: v.id("users"),
    followingId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_pair", ["followerId", "followingId"]),

  venueFollows: defineTable({
    followerId: v.id("users"),
    venueId: v.id("venues"),
    createdAt: v.number(),
  })
    .index("by_follower", ["followerId"])
    .index("by_venue", ["venueId"])
    .index("by_pair", ["followerId", "venueId"]),

  // ============================================
  // TICKETING & PURCHASES
  // ============================================

  ticketTypes: defineTable({
    eventId: v.id("events"),
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(), // In cents (FTC all-in pricing)
    quantity: v.number(), // Total available
    quantitySold: v.number(), // Denormalized for fast availability

    // Purchase limits
    minPerPerson: v.optional(v.number()),
    maxPerPerson: v.optional(v.number()),

    // Sale windows
    saleStartAt: v.optional(v.number()), // Unix timestamp
    saleEndAt: v.optional(v.number()),

    // Visibility
    isHidden: v.boolean(),

    // Display order
    sortOrder: v.number(),

    ...timestamps,
  })
    .index("by_event", ["eventId"])
    .index("by_event_sort", ["eventId", "sortOrder"]),

  purchases: defineTable({
    userId: v.string(), // Better Auth user ID
    eventId: v.id("events"),

    // Status tracking
    status: purchaseStatus,

    // Stripe references
    stripeSessionId: v.optional(v.string()),
    stripePaymentIntentId: v.optional(v.string()),

    // Pricing snapshot (FTC all-in)
    subtotal: v.number(), // Sum of ticket prices in cents
    platformFee: v.number(), // Captured at purchase time in cents
    total: v.number(), // What customer pays in cents

    // Promo code tracking
    promoCode: v.optional(v.string()), // Uppercase promo code used (null if no promo)
    discountAmount: v.optional(v.number()), // Discount amount in cents (null if no discount)

    // v3.5 Stripe fee tracking
    stripeFee: v.optional(v.number()),            // Estimated Stripe fee in cents (informational)
    partialRefundAmount: v.optional(v.number()),  // Cents refunded if partial refund issued

    // Timestamps
    completedAt: v.optional(v.number()),
    refundedAt: v.optional(v.number()),

    ...timestamps,
  })
    .index("by_user", ["userId"])
    .index("by_event", ["eventId"])
    .index("by_stripe_session", ["stripeSessionId"])
    .index("by_status", ["status"]),

  tickets: defineTable({
    purchaseId: v.id("purchases"),
    ticketTypeId: v.id("ticketTypes"),
    userId: v.string(), // Better Auth user ID (non-transferable)

    status: ticketStatus,

    // Pricing snapshot
    price: v.number(), // In cents, from ticketType at purchase

    // Status timestamps
    usedAt: v.optional(v.number()),
    refundedAt: v.optional(v.number()),

    ...timestamps,
  })
    .index("by_purchase", ["purchaseId"])
    .index("by_user", ["userId"])
    .index("by_ticket_type", ["ticketTypeId"])
    .index("by_status", ["status"]),

  ticketScans: defineTable({
    ticketId: v.id("tickets"),
    eventId: v.id("events"),
    scannedBy: v.string(), // Better Auth user ID (host)
    result: scanResult,
    scannedAt: v.number(),
  })
    .index("by_ticket", ["ticketId"])
    .index("by_event", ["eventId"])
    .index("by_event_time", ["eventId", "scannedAt"]),

  // ============================================
  // APPLE WALLET PASSES (v1.9)
  // ============================================

  walletPasses: defineTable({
    ticketId: v.id("tickets"), // One pass per ticket
    storageId: v.optional(v.id("_storage")), // Convex file storage reference for .pkpass file (optional to support cache invalidation)
    authenticationToken: v.string(), // Stable token for Apple web service auth (generated once, never changes)
    passVersion: v.number(), // Increments on pass updates (used by Apple to detect changes)
    lastUpdated: v.number(), // Timestamp of last modification
    ...timestamps,
  })
    .index("by_ticket", ["ticketId"])
    .index("by_auth_token", ["authenticationToken"]),

  walletPassRegistrations: defineTable({
    deviceId: v.string(), // Apple device library identifier
    passTypeId: v.string(), // pass type identifier (e.g., pass.com.tenseats.eventticket)
    serialNumber: v.string(), // ticket ID used as serial number
    pushToken: v.string(), // APNs push token for this device
    authenticationToken: v.string(), // must match the pass's authenticationToken
    ...timestamps,
  })
    .index("by_device_passtype", ["deviceId", "passTypeId"])
    .index("by_serial", ["serialNumber"])
    .index("by_device_serial", ["deviceId", "serialNumber"]),

  // ============================================
  // VENUE BOOKING REQUESTS
  // ============================================

  venueRequests: defineTable({
    // Parties
    eventId: v.id("events"),
    creatorId: v.string(), // Better Auth user ID
    venueId: v.id("venues"),
    venueHostId: v.optional(v.string()), // Better Auth user ID (venue owner)

    // Snapshotted event details (at request time)
    eventTitle: v.string(),
    eventDate: v.number(), // Unix timestamp
    expectedAttendance: v.optional(v.number()),

    // Request details
    message: v.optional(v.string()), // Creator's message to host

    // Status workflow
    status: venueRequestStatus,

    // Response (from host)
    responseMessage: v.optional(v.string()),
    respondedBy: v.optional(v.string()), // Better Auth user ID
    respondedAt: v.optional(v.number()),

    // Expiration
    expiresAt: v.number(), // Calculated from settings

    ...timestamps,
  })
    .index("by_event", ["eventId"])
    .index("by_venue", ["venueId"])
    .index("by_creator", ["creatorId"])
    .index("by_status", ["status"])
    .index("by_expires", ["expiresAt"]),

  // ============================================
  // PLATFORM SETTINGS & ADMIN
  // ============================================

  platformSettings: defineTable({
    slug: v.string(), // "global" - single row

    // Pricing (in cents)
    platformFee: v.number(), // Default: 599 ($5.99)

    // Defaults
    defaultBookingExpiryHours: v.number(), // Default: 72

    // Featured events limit
    featuredEventLimit: v.optional(v.number()), // Default: 10

    // Phase 40: First-time setup detection
    setupCompleted: v.optional(v.boolean()),

    // Phase 43: Platform configuration
    platformName: v.optional(v.string()), // Default: "Tenseats"
    logoStorageId: v.optional(v.id("_storage")), // Convex file storage reference
    logoDarkStorageId: v.optional(v.id("_storage")), // Dark mode logo
    defaultMetroId: v.optional(v.id("metros")), // Reference to metros table

    // v3.4 venue rental platform fee
    venuePlatformFeePercent: v.optional(v.number()), // 0-100, default 15 (%)

    // v3.5 Refund window defaults (hours)
    ticketRefundWindowHours: v.optional(v.number()),  // Default 72h
    rentalRefundWindowHours: v.optional(v.number()),  // Default 48h
    depositRefundWindowHours: v.optional(v.number()), // Default 24h

    ...timestamps,
  })
    .index("by_slug", ["slug"]),

  platformSettingsAuditLog: defineTable({
    settingSlug: v.string(), // "global"
    fieldChanged: v.string(), // e.g., "platformFee"
    oldValue: v.any(),
    newValue: v.any(),
    changedBy: v.string(), // Better Auth admin user ID
    changedAt: v.number(),
  })
    .index("by_setting", ["settingSlug"])
    .index("by_changed_at", ["changedAt"]),

  adminAuditLog: defineTable({
    adminUserId: v.string(), // Better Auth user ID of admin who performed action
    action: v.string(), // "create", "update", "delete", "activate", "deactivate", "promote", "demote"
    targetType: v.string(), // "metro", "user", "settings"
    targetId: v.string(), // ID of the affected record
    changes: v.optional(
      v.object({
        oldValue: v.optional(v.any()),
        newValue: v.optional(v.any()),
      })
    ),
    timestamp: v.number(),
  })
    .index("by_admin", ["adminUserId"])
    .index("by_target", ["targetType", "targetId"])
    .index("by_timestamp", ["timestamp"]),

  // v3.5 Vendor-scoped audit log (mirrors adminAuditLog shape with vendorId instead of adminUserId)
  vendorAuditLog: defineTable({
    vendorId: v.id("users"),
    action: v.string(),            // "refund", "payout_request", "override_window"
    targetType: v.string(),        // "purchase" | "venueBooking"
    targetId: v.string(),          // Convex document ID as string
    metadata: v.optional(v.any()), // Action-specific detail (e.g., { refundAmount: 5000 })
    timestamp: v.number(),         // Date.now()
  })
    .index("by_vendor", ["vendorId"])
    .index("by_target", ["targetType", "targetId"]),

  adminRoles: defineTable({
    userId: v.string(), // Better Auth user ID
    isAdmin: v.boolean(),
    isSuperAdmin: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.string(), // Who granted the role
    updatedBy: v.string(), // Who last modified
  }).index("by_user", ["userId"]),

  exportTokens: defineTable({
    tokenId: v.string(), // Random 32-byte base64url identifier
    userId: v.string(), // Better Auth admin user ID who created token
    exportType: v.union(
      v.literal("users"),
      v.literal("purchases"),
      v.literal("events"),
      v.literal("transactions"),
    ),
    filters: v.optional(v.any()), // Serialized current table filters
    expiresAt: v.number(), // Unix timestamp, 5 minutes from creation
    createdAt: v.number(),
  })
    .index("by_token", ["tokenId"])
    .index("by_expires", ["expiresAt"]),

  venueSettings: defineTable({
    venueId: v.id("venues"),

    // Booking settings (override platform default)
    bookingExpiryHours: v.optional(v.number()),

    ...timestamps,
  })
    .index("by_venue", ["venueId"]),

  // Setup Wizard State (Phase 41)
  setupWizardState: defineTable({
    userId: v.string(), // Better Auth user ID (not v.id("users") - auth ID is string format)
    currentStep: v.number(),
    completedSteps: v.array(v.number()),
    stepData: v.optional(v.any()), // Form data snapshot, validated by frontend schema
    lastActivityAt: v.number(), // Unix timestamp for timeout detection
    ...timestamps,
  })
    .index("by_user", ["userId"]),

  // ============================================
  // STRIPE CONNECT
  // ============================================

  connectedAccounts: defineTable({
    userId: v.string(), // Better Auth user ID

    // Stripe data
    stripeAccountId: v.string(), // acct_xxx

    // Onboarding status
    chargesEnabled: v.boolean(),
    payoutsEnabled: v.boolean(),
    detailsSubmitted: v.boolean(),

    // Account type
    accountType: stripeAccountType, // Only "express" supported

    // Timestamps
    onboardingCompletedAt: v.optional(v.number()),

    ...timestamps,
  })
    .index("by_user", ["userId"])
    .index("by_stripe_account", ["stripeAccountId"]),

  stripeEvents: defineTable({
    stripeEventId: v.string(), // evt_xxx
    eventType: v.string(), // checkout.session.completed, etc.

    // Processing status
    processed: v.boolean(),
    processedAt: v.optional(v.number()),

    // Error tracking
    error: v.optional(v.string()),

    // Raw event data (for debugging/replay)
    eventData: v.optional(v.any()),

    // Connected account (if applicable)
    connectedAccountId: v.optional(v.string()), // acct_xxx

    createdAt: v.number(),
  })
    .index("by_stripe_event", ["stripeEventId"])
    .index("by_event_type", ["eventType"])
    .index("by_processed", ["processed"]),

  // ============================================
  // PROMO CODES
  // ============================================

  promoCodes: defineTable({
    // Code identification
    code: v.string(), // Uppercase normalized (e.g., "TENSEATS-A1B2C3D4")

    // Ownership
    creatorId: v.optional(v.string()), // Better Auth user ID (null for admin codes)
    createdBy: v.string(), // Better Auth user ID (admin or creator)

    // Discount configuration
    discountType: promoCodeDiscountType,
    discountValue: v.number(), // Percentage (1-100) or cents

    // Restrictions
    minPurchaseAmount: v.optional(v.number()), // In cents
    maxRedemptions: v.number(), // Total usage limit
    redemptionCount: v.number(), // Denormalized for atomic increment
    expiresAt: v.number(), // Unix timestamp

    // Event scope
    eventId: v.optional(v.id("events")), // For creator-owned event-specific codes
    eventIds: v.optional(v.array(v.id("events"))), // For admin platform-wide codes

    // Status
    isActive: v.boolean(),

    ...timestamps,
  })
    .index("by_code", ["code"]) // Unique lookup (enforce in mutation)
    .index("by_creator", ["creatorId"])
    .index("by_event", ["eventId"])
    .index("by_created_by", ["createdBy"])
    .index("by_active", ["isActive"])
    .index("by_expires", ["expiresAt"]),

  // ============================================
  // ANALYTICS (v1.9)
  // ============================================

  dailyAnalytics: defineTable({
    date: v.string(), // "2026-02-14" ISO date format
    entityType: v.union(
      v.literal("event"),
      v.literal("creator"),
      v.literal("platform")
    ),
    entityId: v.optional(v.string()), // Event ID or creator user ID (omitted for platform-level)

    // Pre-computed metrics (all in cents for money)
    revenue: v.number(),
    platformFees: v.number(),
    ticketsSold: v.number(),
    refunds: v.number(),
    newUsers: v.optional(v.number()), // Only for platform entity type

    // Source timezone for date boundary computation
    timezone: v.string(), // IANA timezone

    ...timestamps,
  })
    .index("by_date", ["date"])
    .index("by_entity_date", ["entityType", "entityId", "date"])
    .index("by_entity_type_date", ["entityType", "date"]),

  // ============================================
  // NOTIFICATIONS
  // ============================================

  notifications: defineTable({
    userId: v.id("users"), // Recipient
    type: v.union(
      v.literal("like"),
      v.literal("comment"),
      v.literal("follow"),
      v.literal("mention"),
      v.literal("event_reminder"),
      v.literal("event_update"),
      v.literal("comment_reply"),
      v.literal("system"),
      // v3.4 Venue booking notifications (NOTIF-01 through NOTIF-10)
      v.literal("booking_request"),
      v.literal("booking_approved"),
      v.literal("booking_declined"),
      v.literal("booking_confirmed"),
      v.literal("booking_cancelled"),
      v.literal("booking_completed"),
      v.literal("booking_expired"),
      v.literal("review_request"),
      v.literal("review_published"),
      v.literal("payout_processed"),
      v.literal("refund_issued"),
      // v3.6 DM notification (MSG-04)
      v.literal("new_message"),
      // v3.7 Pin note moderation (MOD-04)
      v.literal("pin_note_rejected"),
    ),
    actorId: v.optional(v.id("users")), // Who triggered it
    targetType: v.optional(v.string()),
    targetId: v.optional(v.string()),
    message: v.string(),
    isRead: v.boolean(),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_read", ["userId", "isRead"])
    .index("by_created", ["createdAt"]),

  // ============================================
  // N8N WORKFLOW TRACKING
  // ============================================

  n8nWorkflowRuns: defineTable({
    workflowId: v.string(),
    workflowName: v.optional(v.string()),
    executionId: v.string(),
    status: workflowStatus,
    metrosProcessed: v.array(v.id("metros")),
    eventsCreated: v.number(),
    eventsUpdated: v.number(),
    eventsCanceled: v.number(),
    eventsSeen: v.optional(v.number()),
    eventsSkipped: v.optional(v.number()),
    postsCreated: v.optional(v.number()),
    postsSkipped: v.optional(v.number()),
    errors: v.optional(v.array(v.string())),
    errorMessage: v.optional(v.string()),
    errorNode: v.optional(v.string()),
    metadata: v.optional(v.any()), // Additional run metadata
    startedAt: v.number(),
    completedAt: v.optional(v.number()),

    // v3.7 venue sync counters (SCHEMA-05)
    venuesCreated: v.optional(v.number()),
    venuesUpdated: v.optional(v.number()),
    venuesSkipped: v.optional(v.number()),
    venuesFailed: v.optional(v.number()),
    venuesFlaggedForReview: v.optional(v.number()),
    imagesEvaluated: v.optional(v.number()),
    imagesAccepted: v.optional(v.number()),
  })
    .index("by_workflow", ["workflowId"])
    .index("by_status", ["status"])
    .index("by_started", ["startedAt"])
    .index("by_execution", ["executionId"]),

  // ============================================
  // DIRECT MESSAGES
  // ============================================

  conversations: defineTable({
    participantOneId: v.id("users"), // Lexicographically smaller ID
    participantTwoId: v.id("users"), // Lexicographically larger ID
    lastMessageText: v.optional(v.string()),
    lastMessageSenderId: v.optional(v.id("users")),
    lastMessageAt: v.optional(v.number()),
    participantOneUnread: v.number(),
    participantTwoUnread: v.number(),
    participantOneReadAt: v.optional(v.number()),   // watermark timestamp (MSG-02)
    participantTwoReadAt: v.optional(v.number()),   // watermark timestamp (MSG-02)
    participantOneDeletedAt: v.optional(v.number()), // soft-delete timestamp (MSG-03)
    participantTwoDeletedAt: v.optional(v.number()), // soft-delete timestamp (MSG-03)
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_participant_one", ["participantOneId", "lastMessageAt"])
    .index("by_participant_two", ["participantTwoId", "lastMessageAt"])
    .index("by_pair", ["participantOneId", "participantTwoId"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.id("users"),
    content: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
    isRead: v.boolean(),
    readAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_conversation", ["conversationId", "createdAt"])
    .index("by_conversation_read", ["conversationId", "isRead"]),

  // ============================================
  // EMAIL INFRASTRUCTURE (v1.8)
  // ============================================

  emailSendLog: defineTable({
    recipient: v.string(),
    userId: v.optional(v.string()), // Better Auth user ID
    emailType: v.string(), // "verification", "password-reset", "ticket-delivery", "event-change", "order-confirmation", "event-cancellation", "creator-event-cancelled", "bounce-event", "suppression-event"
    status: v.string(), // "sent", "failed", "hard_bounce", "soft_bounce", "suppressed", "retry_pending", "permanently_failed"
    subject: v.string(),
    attemptCount: v.number(),
    errorMessage: v.optional(v.string()),
    zeptomailRequestId: v.optional(v.string()),
    requestPayload: v.optional(v.any()), // Metadata only (to, subject) — no full HTML
    responsePayload: v.optional(v.any()),
    templateVersion: v.optional(v.string()),
    renderingTime: v.optional(v.number()), // ms
    retryHtmlBody: v.optional(v.string()), // Stored HTML for retry attempts (phase 52)
    createdAt: v.number(),
  })
    .index("by_recipient", ["recipient"])
    .index("by_recipient_created", ["recipient", "createdAt"])
    .index("by_user", ["userId"])
    .index("by_type", ["emailType"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"])
    .index("by_zeptomailRequestId", ["zeptomailRequestId"]),

  emailPreferences: defineTable({
    userId: v.string(), // Better Auth user ID
    categories: v.object({
      // Transactional is always on — not stored here
      eventReminders: v.boolean(),
      socialActivity: v.boolean(),
      marketing: v.boolean(),
      platformUpdates: v.boolean(),
    }),
    // Pause all emails temporarily
    pauseUntil: v.optional(v.number()), // Unix timestamp, auto-resume after this
    // Bounce suppression flag
    isSuppressed: v.optional(v.boolean()),
    suppressedAt: v.optional(v.number()),
    suppressionReason: v.optional(v.string()),
    ...timestamps,
  })
    .index("by_user", ["userId"]),

  pendingEmailChanges: defineTable({
    userId: v.string(), // Better Auth user ID
    currentEmail: v.string(), // Email before change
    newEmail: v.string(), // Requested new email
    status: v.string(), // "pending_old_verification" | "pending_new_verification" | "completed" | "reverted" | "expired"
    oldEmailVerified: v.boolean(), // Whether old email OTP was verified
    newEmailVerified: v.boolean(), // Whether new email OTP was verified
    revertToken: v.string(), // HMAC-signed token for revert link
    revertExpiresAt: v.number(), // 72 hours from completion
    newEmailExpiresAt: v.number(), // 24 hours from initiation for new email verification
    newEmailOtp: v.optional(v.string()),
    newEmailOtpExpiresAt: v.optional(v.number()),
    newEmailOtpAttempts: v.optional(v.number()),
    completedAt: v.optional(v.number()),
    revertedAt: v.optional(v.number()),
    ...timestamps,
  })
    .index("by_user", ["userId"])
    .index("by_user_status", ["userId", "status"])
    .index("by_revert_token", ["revertToken"])
    .index("by_new_email_expires", ["newEmailExpiresAt"]),

  // ============================================
  // VENUE HOSTING (v3.4)
  // ============================================

  // Companion table to venues — NOT modifying venues directly (STATE.md decision)
  venueListingDetails: defineTable({
    venueId: v.id("venues"),         // FK to venues table (owner's venue)
    hostId: v.id("users"),           // Host user (must have venueHost role)

    // Listing identity
    status: venueListingStatus,       // draft | published | paused | archived
    timezone: v.string(),             // IANA timezone (e.g. "America/New_York") — CANCEL-05

    // Venue type & configuration
    venueType: v.string(),            // "restaurant" | "bar_lounge" | "rooftop" | etc.
    kitchenType: v.optional(v.string()), // "full_commercial" | "partial_commercial" | etc.
    maxGuestCount: v.optional(v.number()),
    minBookingHours: v.optional(v.number()),

    // Pricing (all in cents, integers)
    dayRate: v.number(),              // Required for publishing (LIST-13)
    halfDayRate: v.optional(v.number()),
    cleaningFee: v.optional(v.number()),
    depositType: v.optional(depositType),          // "fixed" | "percentage"
    depositValue: v.optional(v.number()),          // Cents if fixed, 0-100 if percentage

    // Booking policy
    cancellationPolicy: v.optional(cancellationPolicy), // Required for publishing (LIST-13)
    instantBook: v.optional(v.boolean()),
    advanceBookingDays: v.optional(v.number()),    // Default 90
    minAdvanceNoticeDays: v.optional(v.number()),  // Default 2
    preparationDays: v.optional(v.number()),       // Buffer between bookings, 0-3

    // Amenities & features
    amenities: v.optional(v.array(v.string())),    // Flat list of amenity slugs
    kitchenEquipment: v.optional(v.array(v.string())),
    barEquipment: v.optional(v.array(v.string())),
    houseRules: v.optional(v.array(v.string())),   // Predefined slugs + custom
    houseRulesCustom: v.optional(v.string()),      // Free text custom rules
    eventTypes: v.optional(v.array(v.string())),   // "popup" | "supper_club" | etc.

    // Operational details
    corkageFee: v.optional(v.number()),            // Cents
    byobPolicy: v.optional(v.string()),
    cateringRestrictions: v.optional(v.string()),
    loadInInstructions: v.optional(v.string()),
    parkingDetails: v.optional(v.string()),

    // Images (storage IDs)
    images: v.optional(v.array(v.id("_storage"))),

    // Rental-specific description (separate from venue's general description)
    description: v.optional(v.string()),

    // Denormalized review metrics (updated by Phase 91 cron)
    averageRating: v.optional(v.number()),
    reviewCount: v.optional(v.number()),

    // Publication tracking
    publishedAt: v.optional(v.number()),
    archivedAt: v.optional(v.number()),

    ...timestamps,
  })
    .index("by_venue", ["venueId"])
    .index("by_host", ["hostId"])
    .index("by_status", ["status"])
    .index("by_host_status", ["hostId", "status"])
    .searchIndex("search_venue_listing", {
      searchField: "venueType",
      filterFields: ["status", "hostId"],
    })
    .searchIndex("search_description", {
      searchField: "description",
      filterFields: ["status"],
    }),

  // One row per (venueId, date). OCC read-patch prevents double booking (BOOK-18).
  venueAvailability: defineTable({
    venueId: v.id("venues"),
    date: v.string(),                // "YYYY-MM-DD" in venue's local calendar — Pitfall #3
    status: venueAvailabilityStatus, // available | blocked | pending | booked | preparation
    bookingId: v.optional(v.id("venueBookings")), // Set when status = pending | booked
    blockedReason: v.optional(v.string()),        // Host notes when manually blocked
    updatedAt: v.number(),           // No createdAt — rows created in bulk, only updatedAt matters
  })
    .index("by_venue_date", ["venueId", "date"])      // Primary: exact date lookup (OCC pattern)
    .index("by_venue_status", ["venueId", "status"])  // Secondary: list by status
    .index("by_booking", ["bookingId"]),               // For finding affected dates when booking changes

  // Full price snapshot at creation time (LIST-17, BOOK-03).
  venueBookings: defineTable({
    // Parties
    venueId: v.id("venues"),
    listingId: v.id("venueListingDetails"),
    renterId: v.id("users"),         // The professional renting the space
    hostId: v.id("users"),           // The venue owner

    // State machine
    status: venueBookingStatus,      // pending | approved | declined | expired | confirmed | completed | cancelled

    // Event details (snapshotted at request time)
    eventDate: v.string(),           // "YYYY-MM-DD"
    eventType: v.string(),           // "popup" | "supper_club" | etc.
    eventDescription: v.optional(v.string()),
    guestCount: v.number(),
    requestMessage: v.optional(v.string()), // Renter's message to host

    // Host response
    responseMessage: v.optional(v.string()),
    respondedAt: v.optional(v.number()),

    // Price snapshot (ALL set at request time, never re-read from listing — LIST-17)
    dayRateSnapshot: v.number(),     // Cents — listing's dayRate at request time
    cleaningFeeSnapshot: v.number(), // Cents (0 if no cleaning fee)
    depositSnapshot: v.number(),     // Cents — computed from depositType + depositValue
    platformFeeSnapshot: v.number(), // Cents — computed from venuePlatformFeePercent * rental
    totalSnapshot: v.number(),       // Cents — dayRate + cleaning + deposit + platformFee

    // Cancellation policy snapshot
    cancellationPolicySnapshot: cancellationPolicy, // Locked at request time

    // Stripe payment tracking (set by Phase 87)
    stripePaymentIntentId: v.optional(v.string()),
    stripeTransferId: v.optional(v.string()),       // For refund reversal (PAY-08)
    paymentStatus: v.optional(v.union(
      v.literal("pending"),
      v.literal("captured"),
      v.literal("failed"),
      v.literal("refunded"),
      v.literal("partially_refunded"),
    )),

    // Cancellation details (set by Phase 86)
    cancelledBy: v.optional(v.union(v.literal("renter"), v.literal("host"))),
    cancelledAt: v.optional(v.number()),
    refundAmountSnapshot: v.optional(v.number()),  // Cents — computed at cancellation, never recomputed (CANCEL-07)

    // Payout (set by Phase 87/cron)
    payoutProcessedAt: v.optional(v.number()),
    payoutAmount: v.optional(v.number()),           // Cents

    // v3.5 Stripe fee tracking
    stripeFee: v.optional(v.number()),  // Estimated Stripe fee in cents (informational)

    // Expiry
    requestExpiresAt: v.optional(v.number()),       // 48h after request for host response
    paymentDeadlineAt: v.optional(v.number()),      // 24h after approval for renter payment

    // Status history (append-only log for BOOK-15)
    statusHistory: v.optional(v.array(v.object({
      status: venueBookingStatus,
      timestamp: v.number(),
      actorId: v.optional(v.id("users")),
      note: v.optional(v.string()),
    }))),

    // Completion tracking
    completedAt: v.optional(v.number()),

    ...timestamps,
  })
    .index("by_venue", ["venueId"])
    .index("by_renter", ["renterId"])
    .index("by_host", ["hostId"])
    .index("by_status", ["status"])
    .index("by_event_date", ["eventDate"])
    .index("by_venue_date", ["venueId", "eventDate"])    // BOOK-16: prevent duplicate pending/confirmed
    .index("by_renter_status", ["renterId", "status"])
    .index("by_host_status", ["hostId", "status"])
    .index("by_expires", ["requestExpiresAt"])            // Cron: expire pending requests
    .index("by_payment_deadline", ["paymentDeadlineAt"]), // Cron: expire unpaid approved bookings

  // Double-blind review system. REV-04: composite index enforces one review per booking per reviewer.
  venueReviews: defineTable({
    bookingId: v.id("venueBookings"),
    reviewerId: v.id("users"),           // Who wrote this review
    revieweeId: v.id("users"),           // Who is being reviewed
    venueId: v.id("venues"),             // Denormalized for listing-level aggregates
    reviewerType: reviewerType,          // "renter" | "host"

    // Rating fields
    overallRating: v.number(),           // 1-5 (integer)

    // Renter-reviewing-venue category ratings (optional — for renter reviews)
    cleanlinessRating: v.optional(v.number()),
    accuracyRating: v.optional(v.number()),
    communicationRating: v.optional(v.number()),
    locationRating: v.optional(v.number()),
    valueRating: v.optional(v.number()),
    kitchenRating: v.optional(v.number()),

    // Host-reviewing-renter category ratings (optional — for host reviews)
    respectRating: v.optional(v.number()),
    cleanupRating: v.optional(v.number()),
    hostCommunicationRating: v.optional(v.number()),

    // Review content
    content: v.string(),                 // Free text review

    // Host response to renter's review (REV-07)
    hostResponse: v.optional(v.string()),
    hostRespondedAt: v.optional(v.number()),

    // Double-blind reveal (REV-03)
    isPublished: v.boolean(),            // false until reveal condition met
    publishedAt: v.optional(v.number()),

    // Moderation (REV-08)
    reportedAt: v.optional(v.number()),
    reportReason: v.optional(v.string()),

    // Review window enforcement (REV-06)
    windowExpiresAt: v.number(),         // 14 days after booking completion

    ...timestamps,
  })
    .index("by_booking", ["bookingId"])
    .index("by_booking_reviewer", ["bookingId", "reviewerType"])  // REV-04: unique enforcement
    .index("by_reviewer", ["reviewerId"])
    .index("by_reviewee", ["revieweeId"])
    .index("by_venue", ["venueId"])
    .index("by_venue_published", ["venueId", "isPublished"])      // Listing page: show only published
    .index("by_published", ["isPublished"])                       // Cron: find unpublished reviews to reveal
    .index("by_window_expires", ["windowExpiresAt"]),             // Cron: publish expired windows

  // One-directional event reviews (attendee → creator). Published immediately — no blind reveal.
  eventReviews: defineTable({
    eventId: v.id("events"),
    purchaseId: v.id("purchases"),
    reviewerId: v.id("users"),
    revieweeId: v.id("users"),
    overallRating: v.number(),
    contentRating: v.optional(v.number()),
    organizationRating: v.optional(v.number()),
    valueRating: v.optional(v.number()),
    content: v.string(),
    isPublished: v.boolean(),
    publishedAt: v.optional(v.number()),
    reportedAt: v.optional(v.number()),
    reportReason: v.optional(v.string()),
    ...timestamps,
  })
    .index("by_event", ["eventId"])
    .index("by_purchase", ["purchaseId"])
    .index("by_reviewer", ["reviewerId"])
    .index("by_reviewee", ["revieweeId"])
    .index("by_event_published", ["eventId", "isPublished"]),

  // ============================================
  // MCP SERVERS
  // ============================================

  mcpServers: defineTable({
    slug: v.string(),
    name: v.string(),
    url: v.string(),
    authToken: v.optional(v.string()),
    description: v.optional(v.string()),
    transport: v.union(
      v.literal("auto"),
      v.literal("sse"),
      v.literal("streamable-http")
    ),
    enabled: v.boolean(),
    category: v.optional(v.string()),
    metadata: v.optional(v.any()),
    toolsCached: v.optional(v.array(v.object({
      name: v.string(),
      description: v.optional(v.string()),
    }))),
    toolCount: v.optional(v.number()),
    lastConnectedAt: v.optional(v.number()),
    lastError: v.optional(v.string()),
    createdBy: v.optional(v.string()),
    ...timestamps,
  })
    .index("by_slug", ["slug"])
    .index("by_enabled", ["enabled"])
    .index("by_category", ["category"]),

  // v4.1 Launch Queue tables (SCHM-02, SCHM-03, SCHM-04)

  launchConfig: defineTable({
    deadline: v.number(),
    deadlineScheduleId: v.id("_scheduled_functions"),
    isLifetimeOfferActive: v.boolean(),
    featureBannerEnabled: v.optional(v.boolean()),
    featureQueueEnabled: v.optional(v.boolean()),
    featureCheckoutEnabled: v.optional(v.boolean()),
    featureCountdownEnabled: v.optional(v.boolean()),
    inviteWindowMs: v.optional(v.number()),
    ...timestamps,
  }),

  launchSlots: defineTable({
    metroId: v.id("metros"),
    category: membershipCategory,
    cap: v.number(),
    invitedCount: v.number(),
    completedCount: v.number(),
    isClosed: v.optional(v.boolean()),
    ...timestamps,
  })
    .index("by_metro_category", ["metroId", "category"])
    .index("by_metro", ["metroId"])
    .index("by_category", ["category"]),

  preRegistrations: defineTable({
    email: v.string(),
    userId: v.optional(v.string()),
    metroId: v.id("metros"),
    category: membershipCategory,
    status: preRegistrationStatus,
    invitedAt: v.optional(v.number()),
    inviteExpiresAt: v.optional(v.number()),
    inviteScheduleId: v.optional(v.id("_scheduled_functions")),
    completedAt: v.optional(v.number()),
    stripeSessionId: v.optional(v.string()),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_userId", ["userId"])
    .index("by_metro_category_status", ["metroId", "category", "status"])
    .index("by_status_createdAt", ["status", "createdAt"]),

  // Storage migration tracking (v4.2)
  migrationJobs: defineTable({
    status: v.union(
      v.literal("running"),
      v.literal("paused"),
      v.literal("completed"),
      v.literal("failed")
    ),
    cursor: v.optional(v.string()),
    totalProcessed: v.number(),
    totalFailed: v.number(),
    totalEnqueued: v.number(),
    isDone: v.optional(v.boolean()),
    startedAt: v.number(),
    completedAt: v.optional(v.number()),
  }),
});
