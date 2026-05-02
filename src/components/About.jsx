import { useEffect } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useTheme } from "../hooks/useTheme";
import Image from "next/image";
import { Code2, Users, Briefcase } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const stats = [
  { icon: Briefcase, value: "2+", label: "Years Experience" },
  { icon: Code2, value: "20+", label: "Projects Completed" },
  { icon: Users, value: "15+", label: "Happy Clients" },
];

function Counter({ value, isVisible }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const num = parseInt(value) || 0;
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    if (isVisible) {
      const controls = animate(count, num, {
        duration: 2,
        ease: "easeOut",
        delay: 0.5,
      });
      return controls.stop;
    } else {
      count.set(0);
    }
  }, [isVisible, count, num]);

  return (
    <motion.span>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
}

export default function About() {
  const [ref, isVisible] = useScrollReveal({ once: false });
  const isDark = useTheme();

  return (
    <section
      id="about"
      className="section"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
            Get To Know Me
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            About <span className="gradient-text">Me</span>
          </h2>
        </div>

        <div
          ref={ref}
          className={`flex flex-col lg:flex-row gap-12 items-center reveal ${isVisible ? "visible" : ""}`}
        >
          <div className="shrink-0 w-full lg:w-[450px]">
            <div className="relative">
              <div className="w-full h-[550px] sm:h-[650px] rounded-3xl premium-card-surface overflow-hidden shadow-xl border border-white/10 group relative">
                <Image
                  src="/images/aboutme.jpeg"
                  alt="Hassan Kazmi"
                  width={1000}
                  height={1500}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-[1.1] contrast-[1.05]"
                  priority
                />
              </div>
            </div>
          </div>
          <div className="flex-1">
            <h3
              className="text-2xl font-bold mb-4"
              style={{ color: "var(--text-primary)" }}
            >
              Founder & CEO at <span className="text-accent">Nexiva Tech</span> &
              Senior Backend Developer
            </h3>
            <p
              className="text-base leading-relaxed mb-4 text-justify"
              style={{ color: "var(--text-secondary)" }}
            >
              Hello, I'm Hassan Kazmi, Founder & CEO of <strong>Nexiva Tech</strong> and a
              Senior Backend Developer with 2+ years of hands-on experience building
              scalable, high-performance server-side systems. I specialize in designing
              robust APIs, managing complex databases, and architecting backend
              infrastructures using <strong>ASP.NET Core</strong>, <strong>Node.js</strong>,{" "}
              <strong>PostgreSQL</strong>, and <strong>MongoDB</strong> — delivering
              reliable, efficient solutions that power seamless digital experiences.
            </p>
            <p
              className="text-base leading-relaxed mb-4 text-justify"
              style={{ color: "var(--text-secondary)" }}
            >
              My technical foundation is built on <strong>ASP.NET Core</strong> and{" "}
              <strong>Node.js</strong> for building powerful, production-ready backend
              systems, paired with <strong>PostgreSQL</strong> and <strong>MongoDB</strong>{" "}
              for efficient data management. I architect RESTful and real-time APIs,
              design scalable database schemas, and implement secure authentication
              systems. Beyond core backend development, my expertise extends to{" "}
              <strong>cloud deployment</strong>, <strong>AI & ChatBot integration</strong>,
              and <strong>IoT connectivity architectures</strong> — delivering end-to-end
              solutions that are reliable, maintainable, and built to scale.
            </p>
            <p
              className="text-base leading-relaxed mb-4 text-justify"
              style={{ color: "var(--text-secondary)" }}
            >
              At <strong>Nexiva Tech</strong>, I play a dual role: leading backend
              engineering while driving the broader vision of delivering transformative
              digital solutions. Alongside my co-founder's, I shape the company's technical
              roadmap — ensuring every project is architected for performance, scalability,
              and long-term maintainability, while staying aligned with client goals and
              embracing forward-thinking technology strategies.
            </p>
            <p
              className="text-base leading-relaxed mb-6 text-justify"
              style={{ color: "var(--text-secondary)" }}
            >
              My mission is to empower businesses with scalable, secure, and
              high-performance backend systems that serve as the backbone of reliable
              digital products. I thrive in dynamic environments where complex problems
              demand elegant engineering solutions — combining deep technical expertise
              with a product-focused mindset to deliver backend infrastructure that
              drives real, long-term business value.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="premium-card-surface rounded-3xl text-center p-4"
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <stat.icon className="h-5 w-5 text-accent mx-auto mb-2" />
                  <p className="text-2xl font-extrabold gradient-text">
                    <Counter value={stat.value} isVisible={isVisible} />
                  </p>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
