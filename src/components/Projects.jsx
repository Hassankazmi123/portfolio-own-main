import { useScrollReveal } from "../hooks/useScrollReveal";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "../hooks/useTheme";

const projects = [
  {
    title: "Firmly",
    description:
      "A modern frontend interface built for the Firmly onboarding flow, providing a seamless user experience.",
    tech: ["React.js", "Node.js", "Tailwind CSS"],
    gradient: "linear-gradient(135deg, #022e75, #0a4494)",
    live: "http://firmly-frontend.s3-website.eu-north-1.amazonaws.com/onboarding",
  },
  {
    title: "Aesthetic & Cardiology Clinic",
    description:
      "A professional clinic website for an Aesthetic Physician and Cardiologist, featuring service showcases, product listings, and a seamless patient-facing experience.",
    tech: ["Next.js", "Node.js", "Tailwind CSS"],
    gradient: "linear-gradient(135deg, #022e75, #0a4494)",
    live: "https://umaisha.vercel.app/",
  },
  {
    title: "Hyperwav",
    description:
      "An AI-powered video editing platform that enables users to remove background noise, add cinematic transitions, and generate new clips — all in minutes.",
    tech: ["React", "Tailwind CSS", "Node.js"],
    gradient: "linear-gradient(135deg, #0e9fa4, #10c6cc)",
    live: "https://hyper-wave.vercel.app/",
  },
  {
    title: "ladyonepk",
    description:
      "Pakistan's go-to beauty destination offering K-Beauty, skincare, haircare, makeup & fragrance — all in one place, with deals up to 70% off.",
    tech: ["React", "Tailwind CSS", "Framer Motion"],
    gradient: "linear-gradient(135deg, #022e75, #10c6cc)",
    live: "https://ladyonepk.com/",
  },
  {
    title: "Dukan",
    description:
      "A Pakistani e-commerce platform empowering online sellers, retailers, and distributors to create their own store and sell online with ease.",
    tech: ["Wordpress"],
    gradient: "linear-gradient(135deg, #1a3c6e, #3dbf9e)",
    live: "https://dukan.pk/",
  },
  {
    title: "Packages",
    description:
      "A premium furniture e-commerce store offering curated packages, curtains, lighting, mattresses, deco & textiles, and design services — all in one elegant shopping experience.",
    tech: ["Next.js", "Tailwind CSS", "MongoDB"],
    gradient: "linear-gradient(135deg, #3b1f0e, #c47c3e)",
    live: "https://www.tukadubai.com/",
  },
];

export default function Projects() {
  const [ref, isVisible] = useScrollReveal();
  const isDark = useTheme();

  const [active, setActive] = useState(0);
  const carouselRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipeDistance = 50;

  useEffect(() => {
    if (isVisible && !isHovering) {
      const interval = setInterval(() => {
        setActive((prev) => (prev + 1) % projects.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isVisible, isHovering]);

  const onTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      setActive((prev) => (prev + 1) % projects.length);
    } else if (distance < -minSwipeDistance) {
      setActive((prev) => (prev - 1 + projects.length) % projects.length);
    }
  };

  const getCardAnimationClass = (index) => {
    if (index === active) return "scale-100 opacity-100 z-20 translate-x-0";
    if (index === (active + 1) % projects.length)
      return "translate-x-[15%] sm:translate-x-[25%] md:translate-x-[40%] scale-95 opacity-40 md:opacity-60 z-10 blur-[1px] md:blur-none";
    if (index === (active - 1 + projects.length) % projects.length)
      return "-translate-x-[15%] sm:-translate-x-[25%] md:-translate-x-[40%] scale-95 opacity-40 md:opacity-60 z-10 blur-[1px] md:blur-none";
    return "scale-90 opacity-0 z-0 pointer-events-none";
  };

  return (
    <section
      id="projects"
      className="section overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
            My Recent Work
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Featured <span className="gradient-text">Projects</span>
          </h2>
        </div>

        <div
          ref={ref}
          className={`reveal ${isVisible ? "visible" : ""} w-full mx-auto flex items-center justify-center`}
        >
          <div className="w-full relative max-w-5xl z-10">
            <div
              className="relative overflow-hidden h-[550px] sm:h-[500px] w-full"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              ref={carouselRef}
            >
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                {projects.map((project, index) => (
                  <div
                    key={project.title}
                    className={`absolute w-[90%] sm:w-[85%] max-w-md lg:max-w-lg transform transition-all duration-700 ease-out ${getCardAnimationClass(
                      index,
                    )}`}
                    onClick={() => {
                      if (index !== active) {
                        setActive(index);
                      }
                    }}
                  >
                    <div
                      className={
                        "premium-card-surface rounded-3xl  flex flex-col group h-full  duration-500 m-2"
                      }
                    >
                      <div
                        className="h-48 sm:h-52 relative overflow-hidden shrink-0 rounded-t-2xl"
                        style={{ background: project.gradient }}
                      >
                        <div
                          className="absolute inset-0 opacity-20"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                            backgroundSize: "20px 20px",
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center lg:p-6 p-4">
                          <span className={`text-2xl sm:text-3xl font-black ${isDark ? "text-white/20" : "text-white/40"} tracking-tighter uppercase select-none group-hover:scale-110 transition-all duration-700 ease-out`}>
                            {project.title}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-0  transition-opacity duration-500" />
                      </div>
                      <div className="p-5 sm:p-6 flex flex-col flex-1  rounded-b-3xl premium-card-surface">
                        <div className="flex justify-between items-start mb-3">
                          <h3
                            className="text-xl font-bold tracking-tight"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {project.title}
                          </h3>
                        </div>

                        <p
                          className="text-sm leading-relaxed mb-6 flex-1 line-clamp-3 sm:line-clamp-none"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                          {project.tech.map((t) => (
                            <span
                              key={t}
                              className="text-[9px] font-bold px-3 py-0.5 premium-card-surface rounded-full uppercase tracking-wider transition-colors"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        <div
                          className={`flex gap-3 sm:gap-4 mt-auto transition-opacity duration-300 ${index === active ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                        >
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-2 rounded-full gradient-bg text-white text-xs sm:text-sm font-bold shadow-lg shadow-accent/20 hover:shadow-accent/40 active:scale-95 transition-all duration-300"
                            onClick={(e) => {
                              if (index !== active) e.preventDefault();
                            }}
                          >
                            <ExternalLink className="h-4 w-4" />
                            Live Preview
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="premium-card-surface cursor-pointer hidden md:flex absolute left-0 md:left-2 lg:left-0 top-1/2 -translate-y-1/2 w-12 h-12  rounded-full items-center justify-center text-white  z-50  transition-all hover:scale-110 "
              onClick={() =>
                setActive(
                  (prev) => (prev - 1 + projects.length) % projects.length,
                )
              }
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6 text-content" />
            </button>
            <button
              className="premium-card-surface cursor-pointer hidden md:flex absolute right-0 md:right-2 lg:right-0 top-1/2 -translate-y-1/2 w-12 h-12  rounded-full items-center justify-center text-white  z-50  transition-all hover:scale-110 "
              onClick={() => setActive((prev) => (prev + 1) % projects.length)}
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6 text-content" />
            </button>
            <div className="absolute -bottom-6 left-0 right-0 flex justify-center items-center space-x-2 sm:space-x-3 z-30">
              {projects.map((_, idx) => (
                <button
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ease-out ${active === idx
                    ? "bg-accent w-6 sm:w-8"
                    : "bg-gray-500/40 hover:bg-gray-400"
                    }`}
                  onClick={() => setActive(idx)}
                  aria-label={`Go to project ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
