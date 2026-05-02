import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowDown, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons/BrandIcons";
import { motion } from "framer-motion";
import { useTheme } from "../hooks/useTheme";
import FallBeamBackground from "./FallBeamBackground";

const roles = [
  "Backend Developer",
  "ASP.NET Core Specialist",
  "Node.js Developer",
  "Database Designer",
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const isDark = useTheme();

  useEffect(() => {
    const currentRole = roles[roleIndex];
    let timeout;

    if (!isDeleting && displayText === currentRole) {
      timeout = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === "") {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setRoleIndex((prev) => (prev + 1) % roles.length);
      }, 500);
    } else {
      timeout = setTimeout(
        () => {
          setDisplayText(
            isDeleting
              ? currentRole.substring(0, displayText.length - 1)
              : currentRole.substring(0, displayText.length + 1),
          );
        },
        isDeleting ? 40 : 80,
      );
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      <FallBeamBackground lineCount={15} />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col-reverse md:flex-row items-center gap-12 py-20">

        <div
          className="flex-1 text-center md:text-left"
          style={{ animation: "fadeInUp 0.8s ease-out" }}
        >
          <p className="text-accent font-semibold mb-3 tracking-wide uppercase">
            Welcome to my portfolio
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 tracking-tight">
            {"Hi, I'm "}
            <span className="gradient-text">Hassan Kazmi</span>
          </h1>
          <div
            className="text-xl sm:text-2xl font-medium mb-6 h-9"
            style={{ color: "var(--text-secondary)" }}
          >
            {displayText}
            <span
              className="inline-block w-[2px] h-6 ml-1 gradient-bg align-middle"
              style={{ animation: "blink 1s step-end infinite" }}
            />
          </div>
          <p
            className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto md:mx-0"
            style={{ color: "var(--text-secondary)" }}
          >
            Building scalable, high-performance backend systems with clean architecture
            and reliable engineering. Passionate about ASP.NET Core, Node.js, and
            designing robust APIs and database solutions that power modern digital products.
          </p>

          <div className="flex flex-nowrap gap-3 sm:gap-4 justify-center md:justify-start mb-8">
            <a
              href="#projects"
              className="gradient-bg text-white px-4 sm:px-7 py-3 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 hover:scale-105 inline-flex items-center gap-2 whitespace-nowrap"
            >
              View My Work
              <ArrowDown className="h-4 w-4 shrink-0" />
            </a>
            <a
              href="#contact"
              className="px-4 sm:px-7 py-3 rounded-full font-semibold text-xs sm:text-sm transition-all duration-300 hover:scale-105 inline-flex items-center gap-2 whitespace-nowrap"
              style={{
                border: "2px solid transparent",
                backgroundImage:
                  "linear-gradient(var(--bg-primary), var(--bg-primary)), linear-gradient(135deg, #022e75, #10c6cc)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
                color: "var(--text-primary)",
              }}
            >
              Contact Me
              <Mail className="h-4 w-4 shrink-0" />
            </a>
          </div>

          <div className="flex items-center gap-4 justify-center md:justify-start">
            <a
              href="https://github.com/hassankazmi123"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full transition-all duration-300 hover:text-accent hover:scale-110"
              style={{ color: "var(--text-muted)" }}
            >
              <GithubIcon className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/syed-muhammad-hassan-kazmi-859887271?utm_source=share_via&utm_content=profile&utm_medium=member_ios"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full transition-all duration-300 hover:text-accent hover:scale-110"
              style={{ color: "var(--text-muted)" }}
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
            <a
              href="mailto:hassan.kazmi@nexivatech.com"
              className="p-2.5 rounded-full transition-all duration-300 hover:text-accent hover:scale-110"
              style={{ color: "var(--text-muted)" }}
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div
          className="shrink-0 mt-8 sm:mt-0 2xl:mt-0 xl:mt-0 lg:mt-0 md:mt-0 "
          style={{ animation: "fadeIn 1s ease-out 0.3s both" }}
        >
          <div className="relative">
            <motion.div
              animate={{ y: [-15, 15] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden relative z-10 shadow-2xl"
            >
              <Image
                src={isDark ? "/images/black.PNG" : "/images/hassan.PNG"}
                alt="Hassan Kazmi"
                width={500}
                height={500}
                className="w-full h-full object-cover filter brightness-[1.1] contrast-[1.1]"
                priority
              />
            </motion.div>
            <div
              className="absolute -inset-4 rounded-full opacity-20 -z-10"
              style={{
                background: "linear-gradient(135deg, #022e75, #10c6cc)",
                filter: "blur(30px)",
                animation: "float 6s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{ animation: "float 2s ease-in-out infinite" }}
      >
        <ArrowDown className="h-5 w-5 text-accent opacity-60" />
      </div>
    </section>
  );
}
