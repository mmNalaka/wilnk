"use client";
import { FeaturesGridSection } from "@/components/features-grid";
import HeroSection from "@/components/hero-section";
import { useQuery } from "@tanstack/react-query";
import { client } from "@/utils/query-client";

export default function Home() {
  const healthCheck = useQuery({
    queryKey: ['health', 'healthCheck'],
    queryFn: () => client.health.healthCheck()
  });

  return (
    <main>
      <HeroSection />
      <FeaturesGridSection />

      <span className="text-sm text-muted-foreground">
        {healthCheck.isLoading
          ? "Checking..."
          : healthCheck.data
          ? "Connected"
          : "Disconnected"}
      </span>
    </main>
  );
}
