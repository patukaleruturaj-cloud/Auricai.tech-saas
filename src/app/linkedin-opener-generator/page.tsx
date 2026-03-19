import SEOLandingPage from "@/components/SEOLandingPage";
import { Zap, Target, MessageSquare, Heart } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI LinkedIn Opener Generator | Personalized First Messages | AuricAI",
  description: "Stop getting ignored on LinkedIn. Use our AI LinkedIn opener generator to craft hyper-personalized first messages that guarantee higher reply rates.",
  keywords: ["AI LinkedIn opener generator", "LinkedIn opener generator", "LinkedIn first message generator", "LinkedIn icebreaker AI", "personalized LinkedIn openers"],
  alternates: {
    canonical: "https://auricai.tech/linkedin-opener-generator",
  },
};

export default function LinkedInOpenerGenerator() {
  return (
    <SEOLandingPage
      subheadline="Break the Ice with AI"
      headline="AI LinkedIn Opener Generator"
      description="Stop getting ignored. Generate hyper-personalized LinkedIn openers that feel 1:1 written — in seconds. Built for SDRs and founders who care about reply rates."
      ctaText="Generate Your First Message Now"
      supportingLine="No templates. No guesswork. Just messages that feel human."
      problemSolution={{
        problem: "99% of LinkedIn outreach fails because the first message is a boring, generic template that looks exactly like every other spam message in your prospect's inbox.",
        solution: "AuricAI analyzes your prospect's profile, recent activity, and career history to find a unique 'hook' that makes your first message impossible to ignore."
      }}
      useCase={{
        title: "Master First-Message Personalization",
        description: "Perfect for SDRs and founders who need to start conversations without sounding like a bot.",
        points: [
          "Hyper-relevant icebreakers",
          "Deep profile analysis hooks",
          "Natural, human-like tone",
          "Increased connection acceptance"
        ]
      }}
      benefits={[
        {
          title: "Profile-First Hooks",
          description: "We don't just use their name. We find that one specific project or skill that makes them feel seen.",
          icon: <Target size={24} />
        },
        {
          title: "Bypass Spam Filters",
          description: "Human-sounding messages ensure your account stays safe and your replies stay high.",
          icon: <Zap size={24} />
        },
        {
          title: "Scale Quality",
          description: "Generate dozens of unique openers specifically for each prospect in seconds, not hours.",
          icon: <MessageSquare size={24} />
        },
        {
          title: "Build Real Rappo",
          description: "Start with a compliment or observation that builds genuine trust from the very first DM.",
          icon: <Heart size={24} />
        }
      ]}
      examples={[
        {
          scenario: "Shared Connection + Achievement",
          message: "Hi Sarah—noticed we're both connected to David. Huge congrats on the Series B at TechCorp! Scaling that engineering team is a massive win. Curious how your hiring strategy is shifting this quarter?",
          color: "blue"
        },
        {
          scenario: "Specific 'About' Section Detail",
          message: "Hey Mark—really resonated with your point about 'empathy-led sales' in your profile. It's so rare to see that in fintech. Would love to hear how you're training your new SDRs on that approach?",
          color: "violet"
        },
        {
          scenario: "Recent Post Engagement",
          message: "Hi Jessica—your recent post on the future of PLG was spot on, especially regarding user friction. I've been thinking about that a lot for our own onboarding. How has the feedback been from your community?",
          color: "blue"
        }
      ]}
      crossLinks={[
        { title: "Cold Message Generator", href: "/linkedin-cold-message-generator" },
        { title: "LinkedIn Outreach Tool", href: "/ai-linkedin-outreach-tool" },
        { title: "Personalization Tool", href: "/linkedin-personalization-tool" },
        { title: "B2B Lead Generation", href: "/b2b-linkedin-lead-generation" }
      ]}
      faqItems={[
        {
          question: "What is an AI LinkedIn Opener Generator?",
          answer: "An AI LinkedIn Opener Generator is a tool that uses artificial intelligence to research a LinkedIn profile and generate a personalized introductory message (opener) designed to maximize reply rates."
        },
        {
          question: "How does AuricAI personalize the openers?",
          answer: "Our AI scans the prospect's 'About' section, experience, skills, and recent activity to identify unique signals that can be used as a natural conversation starter."
        }
      ]}
      additionalContent={
        <div>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem", color: "white" }}>
            Why Your LinkedIn Openers Aren't Getting Replies
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            Most LinkedIn outreach today is automated spam. People can smell a template from a mile away. If your opener starts with "I see we have similar interests" or "I was impressed by your profile," you're already losing.
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            The key to a high-performing <strong>LinkedIn opener</strong> is specific relevance. You need to prove that you've actually looked at their profile for more than 5 seconds. This is where an <strong>AI LinkedIn opener generator</strong> like AuricAI becomes your secret weapon.
          </p>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem", color: "white" }}>
            How to Use AI for Personalized Outreach
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            By leveraging our <strong>LinkedIn first message generator</strong>, you can automate the research phase of your prospecting. Simply input the profile details, and our AI will provide you with three distinct options for your <strong>LinkedIn icebreaker</strong>.
          </p>
          <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc", marginBottom: "1.5rem" }}>
            <li>Focus on their recent wins.</li>
            <li>Connect on shared career philosophies.</li>
            <li>Ask a low-friction, high-relevance question.</li>
          </ul>
        </div>
      }
    />
  );
}
