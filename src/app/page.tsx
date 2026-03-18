import { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "AI LinkedIn Opener Generator | Personalized LinkedIn Outreach | AuricAI",
  description: "Generate hyper-personalized LinkedIn openers in seconds using AI. Increase reply rates and book more meetings with AuricAI's intelligent LinkedIn outreach generator.",
  alternates: {
    canonical: "https://auricai.tech",
  },
};

export default function Home() {
  return <HomePageClient />;
}
