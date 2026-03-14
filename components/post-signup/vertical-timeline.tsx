"use client";

interface TimelineStep {
  label: string;
  detail?: string;
  active?: boolean;
}

interface VerticalTimelineProps {
  steps: TimelineStep[];
}

export function VerticalTimeline({ steps }: VerticalTimelineProps) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        return (
          <div key={index} className="flex gap-4">
            {/* Left: dot + connecting line */}
            <div className="flex flex-col items-center">
              <div
                className={`h-2.5 w-2.5 rounded-full shrink-0 mt-1 ${
                  step.active
                    ? "bg-green-500"
                    : "border border-muted-foreground/40 bg-transparent"
                }`}
              />
              {!isLast && (
                <div className="w-px flex-1 bg-muted-foreground/20 my-1.5" />
              )}
            </div>

            {/* Right: label + detail */}
            <div className={`pb-5 ${isLast ? "pb-0" : ""}`}>
              <p
                className={`text-sm font-medium leading-tight ${
                  step.active ? "text-foreground" : "text-foreground/60"
                }`}
              >
                {step.label}
              </p>
              {step.detail && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {step.detail}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
