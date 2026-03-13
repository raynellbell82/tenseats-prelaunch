import dynamic from "next/dynamic";

export const LaunchCountdown = dynamic(
  () =>
    import("./launch-countdown-inner").then((m) => m.LaunchCountdownInner),
  {
    ssr: false,
    loading: () => (
      <div className="w-32 h-32 rounded-full bg-muted animate-pulse" />
    ),
  },
);
