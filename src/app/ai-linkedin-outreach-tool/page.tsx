import SEOLandingPage from "@/components/SEOLandingPage";
import { Zap, Target, Cpu, Layers } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI LinkedIn Outreach Tool | Scale Personalized DMs | AuricAI",
  description: "Scale your LinkedIn outreach without sounding like a robot. Our AI LinkedIn outreach tool automates research and personalization for maximum efficiency.",
  keywords: ["AI LinkedIn outreach tool", "LinkedIn outreach AI", "automated LinkedIn personalization tool", "AI sales outreach software", "LinkedIn prospecting automation"],
  alternates: {
    canonical: "https://auricai.tech/ai-linkedin-outreach-tool",
  },
};

export default function AILinkedinOutreachTool() {
  return (
    <SEOLandingPage
      subheadline="Intelligent Outreach"
      headline="Scale Your LinkedIn Outreach Without Losing Personalization"
      description="Automate your outreach while keeping every message unique, relevant, and human."
      ctaText="Start Smart Outreach"
      supportingLine="More replies. Less manual work."
      problemSolution={{
        problem: "Traditional LinkedIn automation tools are getting users banned and prospects annoyed. They send massive volumes of generic messages that destroy your company's reputation.",
        solution: "AuricAI acts as your AI research assistant. We generate hyper-specific, profile-based context that makes every automated message feel like it was hand-crafted after thirty minutes of research."
      }}
      useCase={{
        title: "Scale Your Outreach Efficiently",
        description: "Built for growth teams and agency owners who need to maintain high quality at high volume.",
        points: [
          "Automated research pipelines",
          "Customization at scale",
          "Seamless workflow integration",
          "Consistent reply-rate growth"
        ]
      }}
      benefits={[
        {
          title: "AI-Powered Research",
          description: "Our tool scans thousands of data points on a profile to find the perfect conversation starter in milliseconds.",
          icon: <Cpu size={24} />
        },
        {
          title: "Intelligent Scaling",
          description: "Increase your outbound volume without sacrificing the 1:1 feel that drives conversions in B2B sales.",
          icon: <Layers size={24} />
        },
        {
          title: "Zero Bot Detection",
          description: "Because every message is unique, LinkedIn's algorithms see you as a high-value, active user, not a bot.",
          icon: <Zap size={24} />
        },
        {
          title: "Data-Driven Hooks",
          description: "We use actual career data and company signals to ensure your outreach is always relevant and timely.",
          icon: <Target size={24} />
        }
      ]}
      examples={[
        {
          scenario: "Aggressive Growth Signal",
          message: "Hey Mark—noticed TechCorp is hiring for 5 new engineering roles this month. That's incredible growth! Scaling the culture during that phase is always tricky. How are you maintaining your engineering standards during the ramp-up?",
          color: "blue"
        },
        {
          scenario: "Shared Professional Expertise",
          message: "Hi Sarah—I was reading your recent contribution to the 'Modern Sales' blog. Your point about signal-based prospecting really hit home. Are you currently using AI to help your SDRs find those signals at scale?",
          color: "violet"
        },
        {
          scenario: "Alumni / Past Experience Connection",
          message: "Hi Jessica—noticed you were also at Salesforce before joining the startup world. I've always found the transition from big tech to early-stage is either a dream or a nightmare. How has the first 6 months been for you?",
          color: "blue"
        }
      ]}
      crossLinks={[
        { title: "LinkedIn Opener Generator", href: "/linkedin-opener-generator" },
        { title: "Cold Message Generator", href: "/linkedin-cold-message-generator" },
        { title: "Personalization Tool", href: "/linkedin-personalization-tool" },
        { title: "B2B Lead Generation", href: "/b2b-linkedin-lead-generation" }
      ]}
      faqItems={[
        {
          question: "Is this a LinkedIn automation tool?",
          answer: "We are an AI-driven personalization layer. While we help you scale your outreach, our focus is on generating the unique content that makes your outreach (whether manual or automated) actually work."
        },
        {
          question: "Can I use this with my existing CRM?",
          answer: "Yes! You can easily copy our AI-generated messages into your CRM or LinkedIn outreach sequences to add that much-needed human touch."
        }
      ]}
      additionalContent={
        <div>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem", color: "white" }}>
            The Future of LinkedIn Outreach is AI-Driven
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            The era of mass-blasting generic templates is over. Prospecting today requires a high degree of intelligence and personalization. An <strong>AI LinkedIn outreach tool</strong> is no longer a luxury—it's a necessity for any team that wants to remain competitive.
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            AuricAI provides the infrastructure for <strong>automated LinkedIn personalization</strong>. By analyzing profile data in real-time, we ensure that every message you send is grounded in reality and professionalism.
          </p>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem", color: "white" }}>
            Maximizing Your Efficiency with AI Outreach software
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            Our <strong>LinkedIn outreach AI</strong> allows you to focus on the conversations that matter, while the AI handles the mundane task of researching and drafting.
          </p>
          <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc", marginBottom: "1.5rem" }}>
            <li>Reduce research time by 90%.</li>
            <li>Increase reply rates by up to 300%.</li>
            <li>Maintain a pristine professional brand.</li>
          </ul>
        </div>
      }
    />
  );
}
