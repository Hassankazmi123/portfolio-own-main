import React, { useState, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { MapPin, Calendar, Briefcase } from "lucide-react";
import { cn } from "../lib/utils";

const experiences = [
  {
    role: "Founder & CEO",
    company: "Nexiva Tech",
    location: "Pakistan",
    period: "July 2025 — Present",
    description: [
      "Leading company vision, technical strategy, and product roadmap across all client engagements",
      "Building and managing a high-performing engineering team focused on scalable backend solutions",
      "Overseeing end-to-end delivery of web, mobile, and API-driven projects for diverse clients",
    ],
    current: true,
  },
  {
    role: "Senior Backend Developer",
    company: "Nexiva Tech",
    location: "Faisalabad, Punjab, Pakistan",
    period: "Nov 2023 — Present",
    description: [
      "Architecting and developing RESTful APIs and real-time backend systems using ASP.NET Core and Node.js",
      "Designing and optimizing relational and non-relational databases with PostgreSQL and MongoDB",
      "Implementing secure authentication, role-based access control, and third-party service integrations",
    ],
    current: true,
  },
  {
    role: "Backend Developer Intern",
    company: "Aiksol Technologies",
    location: "Faisalabad, Punjab, Pakistan",
    period: "June 2023 — Aug 2023",
    description: [
      "Gained hands-on experience in server-side development and RESTful API design",
      "Contributed to database modeling and backend logic for real-world production applications",
      "Participated in team sprints, code reviews, and collaborative development workflows",
    ],
    current: false,
  },
  {
    role: "Backend Developer",
    company: "Aiksol Technologies",
    location: "Faisalabad, Punjab, Pakistan",
    period: "Aug 2023 — Oct 2024",
    description: [
      "Built and maintained production-ready RESTful APIs using ASP.NET Core and Node.js over 1+ year of hands-on experience",
      "Designed database schemas and wrote optimized queries across PostgreSQL and MongoDB for real-world applications",
      "Collaborated in agile sprints, participated in code reviews, and consistently delivered features on schedule",
    ],
    current: false,
  },
];

export default function Experience() {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      const newIndex = Math.floor(v * experiences.length);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < experiences.length) {
        setActiveIndex(newIndex);
      }
    });
    return () => unsubscribe();
  }, [scrollYProgress, activeIndex]);

  return (
    <section id="experience" className="section bg-transparent relative" ref={containerRef}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-24">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">Professional Journey</p>
          <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Work <span className="gradient-text">Experience</span>
          </h2>
        </div>

        <div className="relative">
          <div
            className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 hidden md:block opacity-20"
            style={{ background: "var(--border)" }}
          />
          <motion.div
            className="absolute left-0 md:left-1/2 top-0 w-[2px] -translate-x-1/2 hidden md:block z-10"
            style={{
              height: progressHeight,
              background: "linear-gradient(to bottom, #10c6cc, #022e75)",
              boxShadow: "0 0 15px rgba(16, 198, 204, 0.5)"
            }}
          />
          <motion.div
            className="absolute left-0 md:left-1/2 z-20 hidden md:block"
            style={{
              top: progressHeight,
              left: "50%",
              translateX: "-50%",
              translateY: "-50%",
            }}
          >
            <motion.div
              className="w-4 h-4 rounded-full"
              style={{
                background: "radial-gradient(circle, #10c6cc 0%, #022e75 100%)",
                boxShadow: "0 0 20px 5px rgba(16, 198, 204, 0.6)"
              }}
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>
          {experiences.map((exp, i) => (
            <div
              key={i}
              className={cn(
                "relative flex flex-col md:flex-row md:gap-16 lg:gap-24 2xl:mb-24 xl:mb-16 lg:mb-12 md:mb-8 mb-6 last:mb-0",
                i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              )}
            >
              <div className="absolute left-0 md:left-1/2 -translate-x-1/2 top-8 z-30 hidden md:block">
                <motion.div
                  className={cn(
                    "w-5 h-5 rounded-full border-4 bg-background flex items-center justify-center transition-colors duration-500",
                    i <= activeIndex ? "border-accent shadow-[0_0_10px_rgba(16,198,204,0.5)]" : "border-gray-500"
                  )}
                  initial={false}
                  animate={i <= activeIndex ? { scale: 1.2 } : { scale: 1 }}
                />
              </div>
              <div className="hidden md:block md:w-1/2" />
              <motion.div
                className="md:w-1/2"
                initial={{ opacity: 0, x: i % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <div className="premium-card-surface rounded-3xl lg:p-6 p-4 group hover:border-accent/30 transition-all duration-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white shrink-0">
                        <Briefcase className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                          {exp.role}
                        </h3>
                        <p className="text-accent font-semibold text-sm">{exp.company}</p>
                      </div>
                    </div>
                    {exp.current && (
                      <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full gradient-bg text-white shadow-lg shadow-accent/20">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs mb-6 px-1" style={{ color: "var(--text-muted)" }}>
                    <span className="flex items-center gap-1.5 font-medium">
                      <Calendar className="h-4 w-4 text-accent" /> {exp.period}
                    </span>
                    <span className="flex items-center gap-1.5 font-medium">
                      <MapPin className="h-4 w-4 text-accent" /> {exp.location}
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {exp.description.map((item, j) => (
                      <li key={j} className="text-sm flex gap-3 leading-relaxed " style={{ color: "var(--text-secondary)" }}>
                        <span className="text-accent  shrink-0">▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
