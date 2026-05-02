import { Heart, Mail, Phone, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "./icons/BrandIcons";
import Image from "next/image";
import InteractiveGridBackground from "./InteractiveGridBackground";

const quickLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const socialLinks = [
  { icon: GithubIcon, href: "https://github.com/Hassankazmi123", label: "GitHub" },
  {
    icon: LinkedinIcon,
    href: "https://www.linkedin.com/in/syed-muhammad-hassan-kazmi-859887271?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    label: "LinkedIn",
  },
];

export default function Footer() {
  return (
    <footer className="relative py-10 overflow-hidden bg-transparent">

      <div className="absolute inset-0 -z-10">
        <InteractiveGridBackground
          height="100%"
          gridSize={60}
          idleSpeed={0.03}
          className="opacity-50 dark:opacity-40"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="premium-card-surface rounded-3xl p-4 md:p-8 relative overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between gap-12 md:gap-8 relative z-10 items-center ">

            <div className="flex flex-col items-center md:items-start max-w-sm">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-full mb-6">
                <Image
                  src="/images/logos.png"
                  alt="Hassan Kazmi"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain filter brightness-[1.15] contrast-[1.1]"
                  priority
                />
              </div>
              <p
                className="leading-relaxed text-sm md:text-base mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Crafting exceptional digital experiences with modern
                technologies and a focus on user-centric design.
              </p>
              <div className="flex gap-4 mt-4 justify-center">
                {socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-accent hover:text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/20"
                    aria-label={link.label}
                  >
                    <link.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-12 md:gap-16 lg:gap-24 items-center">

              <div className="flex flex-col items-center">
                <h4 className="font-bold mb-6 text-content uppercase tracking-widest text-xs opacity-70">
                  Company
                </h4>
                <ul className="space-y-4">
                  {quickLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-muted hover:text-accent font-medium text-sm transition-colors duration-300 flex items-center justify-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/30 group-hover:bg-accent transition-colors" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="">
                  <p className="text-sm font-medium text-muted leading-loose">
                    © {new Date().getFullYear()} <br />
                    <span className="text-content font-bold text-lg">
                      Hassan Kazmi
                    </span>{" "}
                    <br />
                    All Rights Reserved.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
