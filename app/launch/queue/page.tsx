import { LandingHeader } from "@/components/landing/landing-header";
import { QueueStatus } from "@/components/launch/queue-status";

export default function QueuePage() {
  return (
    <>
      <LandingHeader />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <QueueStatus />
      </div>
    </>
  );
}
