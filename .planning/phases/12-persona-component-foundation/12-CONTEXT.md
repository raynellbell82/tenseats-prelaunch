# Phase 12: Persona Component Foundation - Context

**Gathered:** 2026-03-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Update types, component, and icon maps to support all 6 personas (Guest, Chef, Mixologist, Curator, Venue Host, Facilitator). Responsive 6-card grid layout, custom brand icons, shared card component. No copy writing — that's Phase 13.

</domain>

<decisions>
## Implementation Decisions

### Card design
- Use why-personas card style as baseline: rounded border, bg-card/50, subtle hover transition
- Layout per card: custom SVG icon + role title (uppercase badge) + city headline (bold) + city description
- No per-card CTA buttons — single section-level CTA below the grid
- Equal height rows via CSS Grid default stretch behavior
- Dark card aesthetic: border-border/50, hover:border-border

### Custom persona icons
- 6 custom monoline SVG icons — one per persona role (Guest, Chef, Mixologist, Curator, Venue Host, Facilitator)
- Monoline style: clean single-weight line art in Tenseats brand palette
- Use frontend-design skill and web-asset-generator skill to create these
- Icons replace Lucide icons on BOTH city-personas and why-tenseats persona sections

### Section CTA
- Single "Find your seat" button centered below the 6-card grid
- Amber accent styling with Sparkles icon — matches why-tenseats CTA pattern
- Links to `/launch?city=[slug]` (city-specific, not generic /launch)

### Grid responsive layout
- `grid-cols-1` mobile / `sm:grid-cols-2` tablet (640px+) / `lg:grid-cols-3` desktop (1024px+)
- Matches COMP-01 requirement: 3x2 desktop / 2x3 tablet / 1x6 mobile
- Breakpoints identical to why-personas grid — proven pattern

### Section header
- Keep city-specific header: "Who's at the table in [City]"
- No subtitle needed — the header is already strong

### Shared component
- Extract a reusable PersonaCard component used by both why-personas.tsx and city-personas.tsx
- Why-personas passes generic props (fixed descriptions); city-personas passes city-specific props (cityHeadline, cityDescription)
- Custom SVG icons shared across both usages

### Claude's Discretion
- Exact icon designs within monoline constraint
- Card spacing, padding, and typography fine-tuning
- Animation/motion timing on card entrance
- PersonaCard prop interface design

</decisions>

<specifics>
## Specific Ideas

- "Use the image as your template and guide" — the why-personas card grid is the visual reference
- "Each city does not have to match the same designs" — cities differentiate through copy, not card styling
- Icon + Role + Headline + Description layout (4 elements per card, not 3)

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `components/why/why-personas.tsx`: Already renders 6 personas in 3-col grid with Facilitator. Visual reference for card design
- `components/cities/city-personas.tsx`: Current component to refactor — has roleIconMap, roleDisplayMap, CTA pattern
- `lib/city-data.ts`: CityData type needs "facilitator" added to role union
- Lucide icons currently used: ChefHat, Wine, Building2, Search, Users (city), Network (why-tenseats only)

### Established Patterns
- Framer Motion: Both persona components use `motion.div` with staggered `whileInView` animations
- Tailwind v4: `@import "tailwindcss"` syntax, no config file
- shadcn/ui Button component with `variant="outline"` and `rounded-full`

### Integration Points
- `app/cities/[slug]/page.tsx` renders `<CityPersonas city={cityData} />`
- `app/why-tenseats/page.tsx` renders `<WhyPersonas />`
- Both will need to import the shared PersonaCard component
- Custom SVG icons will need a home (likely `components/icons/` or inline SVG components)

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 12-persona-component-foundation*
*Context gathered: 2026-03-13*
