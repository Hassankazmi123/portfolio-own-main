import { useScrollReveal } from "../hooks/useScrollReveal";
import {
  Globe,
  Palette,
  Zap,
  Bug,
  Link2,
  LayoutDashboard,
  Smartphone,
  Wrench,
  Brain,
  Cloud,
  Bot,
  Search,
  TrendingUp,
} from "lucide-react";

const services = [
  {
    icon: Globe,
    title: "Web Development",
    description:
      "Full-stack web application development using React.js, Next.js, and modern backend technologies.",
  },
  {
    icon: LayoutDashboard,
    title: "Frontend Architecture",
    description:
      "Designing scalable, maintainable frontend architectures with component libraries and design systems.",
  },
  {
    icon: Palette,
    title: "UI/UX Implementation",
    description:
      "Pixel-perfect implementation of designs from Figma, translating mockups into responsive, interactive UIs.",
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description:
      "Speed up your existing web applications with code splitting, lazy loading, and Core Web Vitals optimization.",
  },
  {
    icon: Bug,
    title: "Bug Fixing & Debugging",
    description:
      "Identify and resolve complex bugs, memory leaks, and performance bottlenecks in your applications.",
  },
  {
    icon: Link2,
    title: "API Integration",
    description:
      "Seamlessly connect your frontend with RESTful APIs, GraphQL endpoints, and third-party services.",
  },
  {
    icon: Smartphone,
    title: "App Development",
    description:
      "High-quality iOS and Android apps with seamless UX and native-like performance.",
  },
  {
    icon: Wrench,
    title: "Software Development",
    description:
      "Custom software tailored to your workflows, integrations, and scale.",
  },
  {
    icon: Brain,
    title: "AI",
    description:
      "Intelligent solutions using ML and NLP to automate and unlock insights.",
  },
  {
    icon: Cloud,
    title: "IoT",
    description:
      "Connect devices and systems with secure, real-time data pipelines.",
  },
  {
    icon: Bot,
    title: "ChatBot",
    description:
      "Conversational assistants that handle support, onboarding, and lead capture 24/7.",
  },
  {
    icon: Search,
    title: "SEO Optimization",
    description:
      "Technical and on-page SEO to grow organic traffic and conversions.",
  },
  {
    icon: TrendingUp,
    title: "Digital Marketing",
    description:
      "Campaigns that amplify your brand and drive measurable business results.",
  },
];

export default function Services() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section
      id="services"
      className="section"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
            What I Offer
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            My <span className="gradient-text">Services</span>
          </h2>
        </div>

        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal ${isVisible ? "visible" : ""}`}
        >
          {services.map((service, i) => (
            <div
              key={service.title}
              className="premium-card-surface rounded-3xl lg:p-6 p-4 group cursor-pointer hover:rotate-3"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <service.icon className="h-6 w-6 text-white" />
              </div>
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                {service.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
