import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollReveal from "@/components/ScrollReveal";

export default function Home() {
  return (
    <div className="overflow-x-hidden relative w-full">
      <Navbar />
      <main>
        <ScrollReveal direction="fade">
          <Hero />
        </ScrollReveal>

        <ScrollReveal direction="right">
          <About />
        </ScrollReveal>

        <ScrollReveal direction="left">
          <Skills />
        </ScrollReveal>

        <ScrollReveal direction="right">
          <Projects />
        </ScrollReveal>

        <ScrollReveal direction="left">
          <Experience />
        </ScrollReveal>

        <ScrollReveal direction="right">
          <Services />
        </ScrollReveal>

        <ScrollReveal direction="left">
          <Testimonials />
        </ScrollReveal>

        <ScrollReveal direction="up">
          <Contact />
        </ScrollReveal>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
