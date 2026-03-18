import SEOLandingPage from "@/components/SEOLandingPage";
import { Search, Heart, UserCheck, Sparkles } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkedIn Personalization Tool | Deep Research-Based DMs | AuricAI",
  description: "Ditch the templates. Our LinkedIn personalization tool uses deep research to craft messages that feel truly 1:1. Build better relationships and book more meetings.",
  keywords: ["LinkedIn personalization tool", "deep research LinkedIn outreach", "personalized LinkedIn message generator", "AI LinkedIn research tool", "1:1 LinkedIn outreach software"],
  alternates: {
    canonical: "https://auricai.tech/linkedin-personalization-tool",
  },
};

export default function LinkedInPersonalizationTool() {
  return (
    <SEOLandingPage
      subheadline="Hyper Personalization"
      headline="Deep Personalization for LinkedIn That Actually Works"
      description="Go beyond basic templates. Create messages tailored to every prospect’s profile, content, and context."
      ctaText="Personalize Your Messages"
      supportingLine="Because generic outreach is dead."
      problemSolution={{
        problem: "Modern professionals are overwhelmed with generic outreach. If your message doesn't immediately prove that you've done your homework, it's destined for the archive folder.",
        solution: "AuricAI performs 'deep-dive' research into a prospect's career history, public contributions, and skill sets to craft a message so specific it couldn't have been sent to anyone else."
      }}
      useCase={{
        title: "Deep Research-Based Messaging",
        description: "Perfect for high-ticket sales, enterprise prospecting, and relationship-driven business development.",
        points: [
          "Unique career milestone hooks",
          "Public contribution references",
          "Skill-specific icebreakers",
          "Trust-first conversation design"
        ]
      }}
      benefits={[
        {
          title: "Deep-Dive Research",
          description: "We look beyond the job title to find the actual impact your prospect has made in their previous roles.",
          icon: <Search size={24} />
        },
        {
          title: "Build Instant Trust",
          description: "Specific personalization proves that you value their time and expertise, instantly setting you apart from spammers.",
          icon: <Heart size={24} />
        },
        {
          title: "1:1 Feel at Scale",
          description: "Our AI ensures that even when you're reaching out to dozens of prospects, every single message feels hand-written.",
          icon: <UserCheck size={24} />
        },
        {
          title: "Intelligent Insights",
          description: "Get context on why a specific hook was chosen, helping you better prepare for the eventual meeting.",
          icon: <Sparkles size={24} />
        }
      ]}
      examples={[
        {
          scenario: "Shared Past Project Focus",
          message: "Hey Mark—was looking through your early work on the 'OpenFin' project. The way you handled the API transition was legendary. Curious if those same architectural principles are what you're bringing to TechCorp today?",
          color: "blue"
        },
        {
          scenario: "Specific Award / Recognition",
          message: "Hi Jessica—huge congrats on being named a Top 40 Under 40 in FinTech! That's a massive achievement. I'd love to hear how that recognition has shifted your perspective on the industry this year?",
          color: "violet"
        },
        {
          scenario: "Niche Skillset Acknowledgment",
          message: "Hi Sarah—rare to see a VP of Sales with a background in data science! That must give you such a unique edge when it comes to forecasting and pipeline analysis. How does that technical background influence your team's GTM strategy?",
          color: "blue"
        }
      ]}
      crossLinks={[
        { title: "LinkedIn Opener Generator", href: "/linkedin-opener-generator" },
        { title: "Cold Message Generator", href: "/linkedin-cold-message-generator" },
        { title: "LinkedIn Outreach Tool", href: "/ai-linkedin-outreach-tool" },
        { title: "B2B Lead Generation", href: "/b2b-linkedin-lead-generation" }
      ]}
      faqItems={[
        {
          question: "What is a LinkedIn personalization tool?",
          answer: "It's a tool that automates the research process to find unique, non-generic details about a prospect's profile to use in outbound messaging, ensuring a higher response rate."
        },
        {
          question: "Why is deep research important in LinkedIn outreach?",
          answer: "Because decision-makers receive dozens of messages daily. Deep research is the only way to stand out and prove that you aren't just sending mass-marketing templates."
        }
      ]}
      additionalContent={
        <div>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem", color: "white" }}>
            The Science of Personalized LinkedIn Outreach
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            Personalization isn't just about adding a name; it's about context. A <strong>LinkedIn personalization tool</strong> like AuricAI finds the 'why' behind the outreach. Why this person? Why now?
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            When you use <strong>deep research LinkedIn outreach</strong>, you're signaling to the prospect that you're a professional who does their due diligence. This builds the foundational trust required for high-stakes B2B relationships.
          </p>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem", color: "white" }}>
            Moving Beyond the 'About' Section
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            Our <strong>AI LinkedIn research tool</strong> goes beyond the surface level. We analyze experience sequences, endorsed skills, and public signals to generate <strong>1:1 LinkedIn outreach</strong> that resonates on a personal level.
          </p>
          <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc", marginBottom: "1.5rem" }}>
            <li>Avoid obvious, over-used profile details.</li>
            <li>Connect on long-term career trajectories.</li>
            <li>Maintain a respectful and highly professional tone.</li>
          </ul>
        </div>
      }
    />
  );
}
