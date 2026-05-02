import { useScrollReveal } from "../hooks/useScrollReveal";
import {
  Monitor,
  Server,
  Wrench,
  Smartphone,
  Brain,
  TrendingUp,
} from "lucide-react";

const skillCategories = [
  {
    title: "Backend",
    icon: Server,
    color: "#022e75",
    skills: [
      "Node.js",
      "ASP.NET Core",
      "Express.js",
      "MongoDB",
      "Firebase",
      "REST APIs",
      "PostgreSQL",
    ],
  },
  {
    title: "Frontend",
    icon: Monitor,
    color: "#10c6cc",
    skills: [
      "React.js",
      "Next.js",
      "JavaScript",
      "TypeScript",
      "HTML5",
      "CSS3",
      "Tailwind CSS",
      "Redux",
      "Framer Motion",
    ],
  },
  {
    title: "Tools & Others",
    icon: Wrench,
    color: "#10c6cc",
    skills: [
      "Git",
      "GitHub",
      "VS Code",
      "Figma",
      "Vercel",
      "npm",
      "Webpack",
      "Postman",
    ],
  },
  {
    title: "Mobile & IoT",
    icon: Smartphone,
    color: "#022e75",
    skills: [
      "React Native",
      "Flutter",
      "Swift",
      "Kotlin",
      "MQTT",
      "Raspberry Pi",
    ],
  },
  {
    title: "AI & ChatBots",
    icon: Brain,
    color: "#10c6cc",
    skills: [
      "Python",
      "TensorFlow",
      "OpenAI API",
      "PyTorch",
      "LangChain",
      "Dialogflow",
    ],
  },
  {
    title: "SEO & Marketing",
    icon: TrendingUp,
    color: "#022e75",
    skills: [
      "Google Analytics",
      "Technical SEO",
      "SEM",
      "Keyword Research",
      "A/B Testing",
      "Social Media",
    ],
  },
];

export default function Skills() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section
      id="skills"
      className="section"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
            What I Work With
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            My <span className="gradient-text">Skills</span>
          </h2>
        </div>

        <div
          ref={ref}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 reveal ${isVisible ? "visible" : ""}`}
        >
          {skillCategories.map((cat, i) => (
            <div
              key={cat.title}
              className="premium-card-surface rounded-3xl p-6"
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: `${cat.color}15` }}
                >
                  <cat.icon className="h-5 w-5" style={{ color: cat.color }} />
                </div>
                <h3
                  className="text-lg font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {cat.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-1 premium-card-surface rounded-full text-xs font-medium transition-all duration-300 hover:scale-105 cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
