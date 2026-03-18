import SEOLandingPage from "@/components/SEOLandingPage";
import { Zap, Target, BarChart3, Rocket } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LinkedIn Cold Message Generator | High-Converting Outbound | AuricAI",
  description: "Generate cold LinkedIn messages that actually get booked. Our intelligent generator crafts personalized outbound DMs that drive revenue and meetings.",
  keywords: ["LinkedIn cold message generator", "cold LinkedIn DM generator", "outbound sales message generator", "LinkedIn outreach templates AI", "B2B cold outreach tool"],
  alternates: {
    canonical: "https://auricai.tech/linkedin-cold-message-generator",
  },
};

export default function LinkedInColdMessageGenerator() {
  return (
    <SEOLandingPage
      subheadline="Cold Outreach Reimagined"
      headline="Send Cold LinkedIn Messages That Don’t Feel Cold"
      description="Turn cold outreach into real conversations. Create personalized DMs that get noticed, opened, and replied to."
      ctaText="Create Your Cold Message"
      supportingLine="Built for real conversations — not spam."
      problemSolution={{
        problem: "Most cold outreach is treated as a numbers game. You send 1,000 messages, hope for 10 replies, and end up burning through your TAM and getting your account restricted.",
        solution: "AuricAI flips the script by automating the research, not just the message. We help you send fewer messages with much higher impact, focusing on quality and relevance."
      }}
      useCase={{
        title: "Strategic Outbound DM Mastery",
        description: "Ideal for sales teams looking to increase meeting bookings without increasing head count or spam.",
        points: [
          "Multi-touch personalization",
          "Value-based prospecting",
          "Account-based hooks",
          "Higher meeting conversion rates"
        ]
      }}
      benefits={[
        {
          title: "Signal-Based Selling",
          description: "Our AI identifies buying signals in profiles—like recent job changes or company growth—to make your pitch timely.",
          icon: <BarChart3 size={24} />
        },
        {
          title: "Avoid the 'Spam' Label",
          description: "By varying your message structure and content for every prospect, you avoid LinkedIn's pattern-matching spam detection.",
          icon: <Zap size={24} />
        },
        {
          title: "Founder-to-Founder Tone",
          description: "Ensure your messages sound like they came from a busy executive, not a junior intern using a mass-mailer.",
          icon: <Rocket size={24} />
        },
        {
          title: "Focus on Revenue",
          description: "Stop wasting hours on research. Let AI do the heavy lifting so you can focus on closing deals.",
          icon: <Target size={24} />
        }
      ]}
      examples={[
        {
          scenario: "Problem-Centric Outbound",
          message: "Hey David—congrats on the Series B! Scaling the sales team is usually a challenge right after. Curious if ramping new SDRs and maintaining quality personalization is a priority for you this quarter?",
          color: "blue"
        },
        {
          scenario: "Hyper-Specific Career Hook",
          message: "Hi Jessica—saw you moved from Google to TechCorp recently. That's a huge transition! I've worked with many ex-Googlers who struggled with the lack of internal tooling in startups. How's the transition been for your team?",
          color: "violet"
        },
        {
          scenario: "Content-Driven Outreach",
          message: "Hi Mark—loved your recent article on LinkedIn about the 'death of the cold call.' It really resonated with our team. We've been experimenting with social-first outreach. Would love to swap notes on what's working for you?",
          color: "blue"
        }
      ]}
      crossLinks={[
        { title: "LinkedIn Opener Generator", href: "/linkedin-opener-generator" },
        { title: "LinkedIn Outreach Tool", href: "/ai-linkedin-outreach-tool" },
        { title: "Personalization Tool", href: "/linkedin-personalization-tool" },
        { title: "B2B Lead Generation", href: "/b2b-linkedin-lead-generation" }
      ]}
      faqItems={[
        {
          question: "How is this different from LinkedIn automation tools?",
          answer: "Automation tools focus on quantity—sending the same message to everyone. AuricAI focuses on quality—generating a unique, researched message for every single person, which drastically increases trust and replies."
        },
        {
          question: "Can I use these messages for cold InMail?",
          answer: "Yes! Our messages are optimized for both standard DMs and LinkedIn InMail, ensuring you get the most out of your premium credits."
        }
      ]}
      additionalContent={
        <div>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem", color: "white" }}>
            The Anatomy of a High-Performing Cold LinkedIn Message
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            A successful <strong>LinkedIn cold message</strong> consists of three parts: a personalized hook, a brief value proposition, and a soft call to action. Most people fail because they jump straight to the pitch.
          </p>
          <p style={{ marginBottom: "1.5rem" }}>
            Using an <strong>AI LinkedIn cold message generator</strong> allows you to perfectly execute the 'hook' every single time. By referencing a specific detail about their career or company, you earn the right to ask for their time.
          </p>
          <h2 style={{ fontSize: "2rem", fontWeight: "700", marginBottom: "1.5rem", color: "white" }}>
            Scaling Your B2B Outbound with AI
          </h2>
          <p style={{ marginBottom: "1.5rem" }}>
            Our <strong>outbound sales message generator</strong> is designed to help you scale without losing the human touch. Whether you're doing 10 or 100 messages a day, each one will feel unique and researched.
          </p>
          <ul style={{ paddingLeft: "1.5rem", listStyleType: "disc", marginBottom: "1.5rem" }}>
            <li>Identify transition periods (new roles, company growth).</li>
            <li>Reference shared professional values.</li>
            <li>Maintain a conversational, non-selling tone.</li>
          </ul>
        </div>
      }
    />
  );
}
