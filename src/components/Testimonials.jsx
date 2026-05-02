import { useState, useEffect, useRef } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Mustafa Rana",
    role: "CEO, TechVista Solutions",
    country: "Pakistan",
    text: "Hassan delivered a robust, scalable backend for our e-commerce platform that exceeded our expectations. His clean architecture and attention to performance made the project a true success. Highly recommended!",
    initials: "MR",
  },
  {
    name: "Umair Masood",
    role: "Project Manager, CloudSync",
    country: "Pakistan",
    text: "Hassan's expertise in ASP.NET Core and Node.js is truly impressive. He optimized our backend infrastructure, reduced response times significantly, and delivered ahead of schedule. A true professional.",
    initials: "UM",
  },
  {
    name: "James Whitfield",
    role: "CTO, NovaBridge Technologies",
    country: "United Kingdom",
    text: "Hassan architected a multi-tenant SaaS backend for us with exceptional attention to security and scalability. His understanding of complex system design is well beyond his years of experience.",
    initials: "JW",
  },
  {
    name: "Carlos Mendez",
    role: "Director of Engineering, Loopify",
    country: "Canada",
    text: "Hassan integrated third-party payment gateways and built a robust order management API for our platform. Delivered ahead of schedule with thorough documentation. Would work with him again.",
    initials: "CM",
  },
  {
    name: "Ali Raza",
    role: "Founder, DesignCraft Studio",
    country: "Pakistan",
    text: "Hassan's team built our company website from scratch — clean design, fast load times, and fully responsive. He understood our brand vision immediately and translated it into a polished digital presence.",
    initials: "AR",
  },
  {
    name: "Fatima Al-Rashidi",
    role: "Product Manager, Gulf Digital Hub",
    country: "UAE",
    text: "Hassan's team delivered a sleek, modern website for our business with smooth animations and excellent mobile performance. The attention to detail and timely delivery made the entire experience effortless.",
    initials: "FA",
  },
  {
    name: "Sana Tariq",
    role: "Co-Founder, MedLink Pakistan",
    country: "Pakistan",
    text: "Hassan's team developed our clinic's website with a clean layout and intuitive navigation. Patients consistently compliment how easy it is to browse our services and products. Excellent work overall.",
    initials: "ST",
  },
  {
    name: "Daniel Müller",
    role: "Founder, StackForge GmbH",
    country: "Germany",
    text: "We needed a fast, professional website for our software agency and Hassan delivered exactly that. Great communication, pixel-perfect execution, and handed over clean, maintainable code.",
    initials: "DM",
  },
  {
    name: "Dr. Haroon Siddiqui",
    role: "Head of CS Department, GCUF",
    country: "Pakistan",
    text: "Hassan's team developed a fully functional electronic voting machine for our university project showcase. The system was reliable, tamper-resistant, and impressed both faculty and external evaluators.",
    initials: "HS",
  },
  {
    name: "Bilal Malik",
    role: "Robotics Lab Supervisor",
    country: "Pakistan",
    text: "Hassan's team built a gesture-controlled car that responded to hand movements with impressive accuracy and low latency. A creative and technically well-executed IoT project that stood out in our lab.",
    initials: "BM",
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [ref, isVisible] = useScrollReveal();
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (isVisible && !isHovering) {
      const interval = setInterval(() => {
        setCurrent((prev) => (prev + 1) % testimonials.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isVisible, isHovering]);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  return (
    <section
      id="testimonials"
      className="section"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
            Client Feedback
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            What People <span className="gradient-text">Say</span>
          </h2>
        </div>

        <div
          ref={ref}
          className={`relative reveal ${isVisible ? "visible" : ""}`}
        >
          <div
            className="premium-card-surface rounded-3xl text-center relative overflow-hidden flex flex-col"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Quote className="h-10 w-10 text-accent opacity-20 mx-auto mt-6 sm:mt-8 mb-4" />

            <div className="w-full overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-out w-full"
                style={{ transform: `translateX(-${current * 100}%)` }}
              >
                {testimonials.map((t, idx) => (
                  <div key={idx} className="w-full shrink-0 px-8 pb-8 sm:px-10">
                    <p
                      className="text-lg sm:text-xl leading-relaxed mb-8 italic"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="flex items-center justify-center gap-4">
                      <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-sm">
                        {t.initials}
                      </div>
                      <div className="text-left">
                        <p
                          className="font-bold text-sm"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {t.name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pb-6 sm:pb-8">
              <button
                onClick={prev}
                className="p-2 rounded-full transition-all duration-300 hover:bg-accent/10 cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className="w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer"
                    style={{
                      background:
                        i === current
                          ? "linear-gradient(135deg, #022e75, #10c6cc)"
                          : "var(--border)",
                      transform: i === current ? "scale(1.3)" : "scale(1)",
                    }}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="p-2 rounded-full transition-all duration-300 hover:bg-accent/10 cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
