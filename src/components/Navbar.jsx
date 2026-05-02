import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Menu, X, ChevronDown } from "lucide-react";
import { ToggleTheme } from "./ToggleTheme";
import { useTheme } from "../hooks/useTheme";

const SERVICES = [
  { name: "Web Development", href: "#services" },
  { name: "Frontend Architecture", href: "#services" },
  { name: "Backend Architecture", href: "#services" },
  { name: "UI/UX Implementation", href: "#services" },
  { name: "Performance Optimization", href: "#services" },
  { name: "Bug Fixing & Debugging", href: "#services" },
  { name: "API Integration", href: "#services" },
  { name: "App Development", href: "#services" },
  { name: "Software Development", href: "#services" },
  { name: "AI", href: "#services" },
  { name: "IoT", href: "#services" },
  { name: "ChatBot", href: "#services" },
  { name: "SEO Optimization", href: "#services" },
  { name: "Digital Marketing", href: "#services" },
];

function Logo({ mobile = false }) {
  const isDark = useTheme();
  const handleLogoClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <a
      href="#home"
      className="flex items-center justify-center cursor-pointer"
      onClick={handleLogoClick}
    >
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 overflow-hidden rounded-full">
        <Image
          src={isDark ? "/images/blacklogo.PNG" : "/images/logos.PNG"}
          alt="Hassan Kazmi"
          width={100}
          height={100}
          className="w-full h-full object-contain filter brightness-[1.15] contrast-[1.1]"
          priority
        />
      </div>
    </a>
  );
}

function DesktopNav({ navItems, activeSection, handleNavClick }) {
  const [openMenu, setOpenMenu] = useState(null);
  const [closeTimeout, setCloseTimeout] = useState(null);

  const handleMouseEnter = (menuName) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setOpenMenu(menuName);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setOpenMenu(null);
    }, 150);
    setCloseTimeout(timeout);
  };

  return (
    <div className="hidden md:flex items-center justify-between w-full h-[72px]">

      <div className="flex items-center shrink-0">
        <Logo />
      </div>

      <div className="flex items-center space-x-3">
        {navItems.map((item) => {
          const isActive = activeSection === item.href.replace("#", "");

          if (!item.children) {
            return (
              <div key={item.name} className="relative inline-block group">
                <a
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="flex items-center space-x-1 transition-colors duration-200 relative font-medium text-[13px]"
                  style={{
                    color: isActive ? "#10c6cc" : "var(--text-secondary)",
                  }}
                >
                  <span>{item.name}</span>
                  <span
                    className={`pointer-events-none absolute -bottom-1 left-0 h-0.5 bg-linear-to-r from-accent to-brand transition-all duration-200 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                  />
                </a>
              </div>
            );
          }

          return (
            <div
              key={item.name}
              className="relative inline-block group"
              onMouseEnter={() => handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className="flex items-center gap-1 font-medium relative text-[13px] cursor-pointer"
                type="button"
                style={{
                  color: isActive ? "#10c6cc" : "var(--text-secondary)",
                }}
              >
                <span>{item.name}</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-300 ease-out ${openMenu === item.name ? "rotate-180" : ""
                    }`}
                />
                <span
                  className={`pointer-events-none absolute -bottom-1 left-0 h-0.5 bg-linear-to-r from-accent to-brand transition-all duration-200 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                />
              </button>

              <div
                className={`absolute left-0 top-10 transition-all duration-300 ease-out w-64 ${openMenu === item.name
                  ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                  : "opacity-0 translate-y-2 scale-95 pointer-events-none"
                  }`}
              >
                <div
                  className="premium-card-surface rounded-3xl  p-3"
                >
                  <ul className="max-h-[70vh] overflow-auto">
                    {item.children.map((child) => (
                      <li key={child.name}>
                        <a
                          href={child.href}
                          onClick={(e) => handleNavClick(e, child.href)}
                          className="block px-3 py-2 rounded-xl text-sm transition-all duration-200 ease-out hover:text-white hover:bg-linear-to-r from-accent to-brand"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {child.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <ToggleTheme />
        <a href="#contact" onClick={(e) => handleNavClick(e, "#contact")}>
          <button className="btn-54">
            <div className="original2">Get In Touch</div>
            <div className="letters2">
              <span>G</span>
              <span>E</span>
              <span className="mr-2">T</span>
              <span>I</span>
              <span className="mr-2">N</span>
              <span>T</span>
              <span>O</span>
              <span>U</span>
              <span>C</span>
              <span>H</span>
            </div>
          </button>
        </a>
      </div>
    </div>
  );
}

function MobileNav({
  navItems,
  isOpen,
  setIsOpen,
  activeSection,
  handleNavClick,
}) {
  const [openDropdowns, setOpenDropdowns] = useState({});

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  return (
    <div className="md:hidden w-full">
      <div className="flex items-center justify-between w-full h-[60px]">
        <Logo mobile />
        <div className="flex items-center gap-3">
          <ToggleTheme />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full gradient-bg text-white shadow-lg transition-all"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <div className={isOpen ? "animate-menu-bounce" : ""}>
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </div>
          </button>
        </div>
      </div>

      <div
        className={`absolute left-0 right-0 top-[88px] z-50 transition-all duration-500 ease-out transform  ${isOpen
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 -translate-y-6 scale-95 pointer-events-none"
          }`}
      >
        <div
          className="p-4 space-y-2 rounded-3xl shadow-2xl border premium-card-surface"
          style={{
            backdropFilter: "blur(24px)",
            borderColor: "var(--card-border)",
          }}
        >
          {navItems.map((item, index) => {
            const isActive = activeSection === item.href.replace("#", "");

            if (!item.children) {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    handleNavClick(e, item.href);
                    setIsOpen(false);
                  }}
                  className={`flex items-center px-2 py-1 rounded-2xl text-base font-semibold transition-all ${isActive ? "gradient-text bg-accent/5" : ""
                    }`}
                  style={{
                    color: isActive ? "#10c6cc" : "var(--text-primary)",
                    transitionDelay: `${index * 50}ms`,
                  }}
                >
                  {item.name}
                </a>
              );
            }

            return (
              <div
                key={item.name}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenDropdowns((prev) => ({
                      ...prev,
                      [item.name]: !prev[item.name],
                    }))
                  }
                  className="w-full flex items-center justify-between px-2 py-1 rounded-2xl text-base font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  <span>{item.name}</span>
                  <ChevronDown
                    className={`h-5 w-5 transition-transform duration-300 ${openDropdowns[item.name] ? "rotate-180" : ""
                      }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 overflow-hidden ${openDropdowns[item.name]
                    ? "grid-rows-[1fr] opacity-100 mt-1"
                    : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                  <div className="min-h-0">
                    <ul className="pl-4 space-y-1 max-h-[30vh] overflow-y-auto pr-1">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          <a
                            href={child.href}
                            onClick={(e) => {
                              handleNavClick(e, child.href);
                              setIsOpen(false);
                            }}
                            className="block px-4 py-2 rounded-xl text-sm font-medium"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {child.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-2">
            <a
              href="#contact"
              className="block w-full"
              onClick={(e) => {
                handleNavClick(e, "#contact");
                setIsOpen(false);
              }}
            >
              <button className="btn-54 w-full!">
                <div className="original2">Get In Touch</div>
                <div className="letters2">
                  <span>G</span>
                  <span>E</span>
                  <span className="mr-2">T</span>
                  <span>I</span>
                  <span className="mr-2">N</span>
                  <span>T</span>
                  <span>O</span>
                  <span>U</span>
                  <span>C</span>
                  <span>H</span>
                </div>
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Services", href: "#services", children: SERVICES },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Experience", href: "#experience" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      const sections = [
        "home",
        "about",
        "services",
        "skills",
        "projects",
        "experience",
        "contact",
      ];
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActiveSection(section);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-4 bg-transparent px-4 sm:px-6">
      <div
        className={"max-w-3xl mx-auto px-4 sm:px-6 premium-card-surface rounded-full transition-all duration-500"}
      >
        <DesktopNav
          navItems={navItems}
          activeSection={activeSection}
          handleNavClick={handleNavClick}
        />
        <MobileNav
          navItems={navItems}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          activeSection={activeSection}
          handleNavClick={handleNavClick}
        />
      </div>
    </nav>
  );
}
