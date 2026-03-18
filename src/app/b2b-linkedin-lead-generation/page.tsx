import SEOLandingPage from "@/components/SEOLandingPage";
import { Target, BarChart3, Users, Briefcase } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "B2B LinkedIn Lead Generation | Build Revenue Pipeline | AuricAI",
  description: "Drive more revenue with AI-powered B2B LinkedIn lead generation. Book more meetings and close more deals with hyper-personalized outreach at scale.",
  keywords: ["B2B LinkedIn lead generation", "LinkedIn leads AI tool", "B2B sales pipeline LinkedIn", "LinkedIn meeting booking tool", "AI powered B2B prospecting"],
  alternates: {
    canonical: "https://auricai.tech/b2b-linkedin-lead-generation",
  },
};

export default function B2BLinkedInLeadGeneration() {
  return (
    <SEOLandingPage
      subheadline="B2B Growth Engine"
      headline="Turn LinkedIn Into a Consistent Source of B2B Leads"
      description="Generate qualified conversations and book more meetings using AI-powered personalized outreach."
      ctaText="Start Generating Leads"
      supportingLine="More replies → More calls → More deals."
      problemSolution={{
        problem: "B2B lead generation is harder than ever. Response rates are dropping as prospects become blind to automated sales pitches and low-quality outreach.",
        solution: "AuricAI solves the 'quality vs. quantity' dilemma. We enable your sales team to maintain enterprise-level personalization while achieving the volume needed to hit pipeline targets."
      }}
      useCase={{
        title: "Pipeline & Meetings Focus",
        description: "Built for sales leaders and founders who care about one thing: booked meetings that turn into revenue.",
        points: [
          "High-intent lead hooks",
          "Account-based personalization",
          "Consistent meeting flow",
          "Predictable revenue growth"
        ]
      }}
      benefits={[
        {
          title: "Book More Meetings",
          description: "Our personalized approach consistently delivers 2-3x higher reply rates compared to legacy automation tools.",
          icon: <Briefcase size={24} />
        },
        {
          title: "Account-Based Insights",
          description: "Generate messages that resonate with entire buying committees by referencing specific company-wide initiatives.",
          icon: <Target size={24} />
        },
        {
          title: "Scale Your Sales Team",
          description: "Empower your junior SDRs to write like seasoned VPs by giving them AI-generated research for every DM.",
          icon: <Users size={24} />
        },
        {
          title: "Data-Driven Outbound",
          description: "Track what's working and refine your messaging based on the high-fidelity signals our AI identifies.",
          icon: <BarChart3 size={24} />
        }
      ]}
      examples={[
        {
          scenario: "Strategic Account Outreach",
          message: "Hey David—noticed TechCorp is shifting focus toward the enterprise market this year. That's a huge move! I've seen many companies struggle with the longer sales cycles in enterprise. How is your team adapting their outreach for that shift?",
          color: "blue"
        },
        {
          scenario: "ROI-Focused Cold DM",
          message: "Hi Jessica—was checking out TechCorp's recent case study with 'Globalize.' Incredible results! It's rare to see such a clear ROI in such a short window. Are you looking to replicate that same success with your next batch of enterprise clients?",
          color: "violet"
        },
        {
          scenario: "Company Expansion Signal",
          message: "Hi Mark—congrats on opening the new HQ in London! Expanding into EMEA is a massive milestone. Curious if building out the local GTM team there is a priority for you this quarter?",
          color: "blue"
        }
      ]}
      crossLinks={[
        { title: "LinkedIn Opener Generator", href: "/linkedin-opener-generator" },
        { title: "Cold Message Generator", href: "/linkedin-cold-message-generator" },
        { title: "LinkedIn Outreach Tool", href: "/ai-linkedin-outreach-tool" },
        { title: "Personalization Tool", href: "/linkedin-personalization-tool" }
      ]}
      faqItems={[
        {
          question: "How does AI help with B2B lead generation?",
          answer: "AI automates the most time-consuming part of lead gen: research. By quickly identifying unique profile details, AI enables you to send personalized messages that build trust and increase meeting bookings."
        },
        {
          question: "Is this tool suitable for enterprise sales?",
          answer: "Absolutely. Our 'Deep Research' approach is specifically designed for the high-value, high-trust environments typical of enterprise B2B sales."
        }
      ]}
      additionalContent={
        <div>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem", color: "white" }}>
            The New Playbook for B2B LinkedIn Lead Generation
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            The days of 'spray and pray' are over. <strong>B2B LinkedIn lead generation</strong> in 2024 requires a surgeon's precision. You need to know exactly who you're talking to and why your solution matters to them at this specific moment. 
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            AuricAI's <strong>LinkedIn leads AI tool</strong> gives you the data you need to make every message count. We help you move from being a 'vendor' to a 'trusted partner' before the first meeting even starts. 
          </p>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem", color: "white" }}>
            Building a Predictable B2B Sales Pipeline
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            Our <strong>LinkedIn meeting booking tool</strong> is focused on the end goal: meetings. By consistently delivering high-quality, personalized outreach, you create a predictable flow of leads into your CRM. 
          </p>
          <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc", marginBottom: "1.5rem" }}>
            <li>Focus on high-value accounts.</li>
            <li>Maintain a consistent outbound volume.</li>
            <li>Iterate based on what the AI identifies as high-converting hooks.</li>
          </ul>
        </div>
      }
    />
  );
}
