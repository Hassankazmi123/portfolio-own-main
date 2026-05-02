import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { Send, Mail, Phone, MapPin, CheckCircle, X } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons/BrandIcons";
import { motion, AnimatePresence } from "framer-motion";

export default function Contact() {
  const [ref, isVisible] = useScrollReveal();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setToast({
        show: true,
        message: "Thank you! Your message has been sent.",
        type: "success",
      });
      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 4000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: "hassan.kazmi@nexivatech.com",
      href: "mailto:hassan.kazmi@nexivatech.com",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+92 334 2621414",
      href: "tel:+923342621414",
    },
    { icon: MapPin, label: "Location", value: "Pakistan", href: null },
  ];

  const socialLinks = [
    {
      icon: GithubIcon,
      href: "https://github.com/hassanmkazmi123",
      label: "GitHub",
    },
    {
      icon: LinkedinIcon,
      href: "https://www.linkedin.com/in/syed-muhammad-hassan-kazmi-859887271?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
      label: "LinkedIn",
    },
  ];

  const inputClass =
    "w-full px-4 py-2.5 premium-card-surface rounded-full text-sm outline-none transition-all duration-300 placeholder:text-muted text-content";

  return (
    <section
      id="contact"
      className="section"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <p className="text-accent font-semibold text-sm tracking-widest uppercase mb-3">
            Get In Touch
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Contact <span className="gradient-text">Me</span>
          </h2>
        </div>

        <div
          ref={ref}
          className={`premium-card-surface rounded-3xl p-4 sm:p-10 grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-12 reveal ${isVisible ? "visible" : ""}`}
        >

          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <h3
                className="text-2xl font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                Let&apos;s work together
              </h3>
              <p
                className="text-sm leading-relaxed mb-8"
                style={{ color: "var(--text-secondary)" }}
              >
                I&apos;m always open to discussing new projects, creative ideas,
                or opportunities to be part of your vision. Feel free to reach
                out!
              </p>

              <div className="space-y-5">
                {contactInfo.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full premium-card-surface flex items-center justify-center shrink-0">
                      <item.icon className="h-5 w-5 text-black dark:text-white" />
                    </div>
                    <div>
                      <p
                        className="text-xs font-semibold mb-1 uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm font-medium hover:text-accent transition-colors block"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="flex gap-4 mt-8 pt-8"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                {socialLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110"
                    aria-label={link.label}
                  >
                    <link.icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 flex flex-col justify-center mt-6 lg:mt-0">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className={inputClass}
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={inputClass}
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className={inputClass}
              />
              <textarea
                placeholder="Your Message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className={`${inputClass.replace("rounded-full", "rounded-xl")} resize-none pt-4`}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full gradient-bg  text-white py-3.5 rounded-full font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent/25 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={`fixed top-6 right-6 z-100 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl premium-card-surface  border ${toast.type === "success"
              ? "border-green-500/50"
              : "border-red-500/50"
              }`}
            style={{
              background: "var(--bg-tertiary)",
              color: "var(--text-primary)",
            }}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${toast.type === "success"
                ? "bg-green-500/20 text-green-500"
                : "bg-red-500/20 text-red-500"
                }`}
            >
              {toast.type === "success" ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <X className="w-5 h-5" />
              )}
            </div>
            <p className="font-medium text-sm">{toast.message}</p>
            <button
              onClick={() => setToast((prev) => ({ ...prev, show: false }))}
              className="ml-2 text-muted hover:text-content transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
