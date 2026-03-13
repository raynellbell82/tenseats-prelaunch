"use client";

import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

type CellValue = string | true | false;

interface TableRow {
  feature: string;
  tenseats: CellValue;
  eventbrite: CellValue;
  tock: CellValue;
  luma: CellValue;
}

const rows: TableRow[] = [
  {
    feature: "Per-seat price",
    tenseats: "$1.99",
    eventbrite: "$2.50+ fees",
    tock: "$3–5+",
    luma: "Free (ad-supported)",
  },
  {
    feature: "Platform fees",
    tenseats: "None",
    eventbrite: "3.7% + $1.79",
    tock: "Commission",
    luma: "Free tier limits",
  },
  {
    feature: "Ads / Sponsored",
    tenseats: false,
    eventbrite: true,
    tock: true,
    luma: true,
  },
  {
    feature: "Data sold",
    tenseats: false,
    eventbrite: true,
    tock: true,
    luma: true,
  },
  {
    feature: "Insider access",
    tenseats: "Included",
    eventbrite: "N/A",
    tock: "N/A",
    luma: "N/A",
  },
  {
    feature: "City-specific curation",
    tenseats: "32 metros",
    eventbrite: "Global generic",
    tock: "Restaurant-focused",
    luma: "Event-focused",
  },
];

function CellContent({
  value,
  isAmber,
}: {
  value: CellValue;
  isAmber: boolean;
}) {
  if (value === true) {
    return <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />;
  }
  if (value === false) {
    return (
      <Check
        className={`h-4 w-4 mx-auto ${isAmber ? "text-amber-500" : "text-muted-foreground/40"}`}
      />
    );
  }
  return (
    <span className={isAmber ? "text-amber-500 font-medium" : ""}>{value}</span>
  );
}

export function WhyEconomics() {
  return (
    <section className="max-w-6xl mx-auto px-6 sm:px-8 py-24 sm:py-32">
      {/* Heading */}
      <motion.h2
        className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        The math is simple
      </motion.h2>

      {/* Subtext */}
      <motion.p
        className="text-muted-foreground text-center mb-16"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
      >
        One price. Every seat. No platform tax.
      </motion.p>

      {/* Table container — scrollable on mobile */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      >
        {/* Left fade hint */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 z-10 bg-gradient-to-r from-background to-transparent md:hidden" />
        {/* Right fade hint */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-background to-transparent md:hidden" />

        <div className="overflow-x-auto -mx-6 px-6 sm:-mx-8 sm:px-8 md:mx-0 md:px-0">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            {/* Header row */}
            <thead>
              <tr>
                <th className="text-left text-xs uppercase tracking-wider text-muted-foreground/60 pb-4 pr-6 font-medium w-[180px]">
                  Feature
                </th>
                {/* Tenseats column — highlighted */}
                <th className="text-center text-xs uppercase tracking-wider pb-4 px-4 font-medium w-[140px] border-t-2 border-amber-500 bg-amber-500/10 rounded-t-lg text-amber-500">
                  Tenseats
                </th>
                <th className="text-center text-xs uppercase tracking-wider text-muted-foreground/60 pb-4 px-4 font-medium">
                  Eventbrite
                </th>
                <th className="text-center text-xs uppercase tracking-wider text-muted-foreground/60 pb-4 px-4 font-medium">
                  Tock
                </th>
                <th className="text-center text-xs uppercase tracking-wider text-muted-foreground/60 pb-4 px-4 font-medium">
                  Luma
                </th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={i % 2 === 0 ? "" : "bg-muted/20"}
                >
                  {/* Feature name — sticky on larger screens */}
                  <td className="py-4 pr-6 text-muted-foreground font-medium align-middle sticky left-0 bg-background">
                    {row.feature}
                  </td>

                  {/* Tenseats value */}
                  <td className="py-4 px-4 text-center align-middle bg-amber-500/10">
                    <CellContent value={row.tenseats} isAmber={true} />
                  </td>

                  {/* Eventbrite */}
                  <td className="py-4 px-4 text-center align-middle text-muted-foreground">
                    <CellContent value={row.eventbrite} isAmber={false} />
                  </td>

                  {/* Tock */}
                  <td className="py-4 px-4 text-center align-middle text-muted-foreground">
                    <CellContent value={row.tock} isAmber={false} />
                  </td>

                  {/* Luma */}
                  <td className="py-4 px-4 text-center align-middle text-muted-foreground">
                    <CellContent value={row.luma} isAmber={false} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
}
