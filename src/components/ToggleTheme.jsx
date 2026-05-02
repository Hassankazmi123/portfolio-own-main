import { useCallback, useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { flushSync } from "react-dom";
import { cn } from "../lib/utils";

export const ToggleTheme = ({
  className,
  duration = 400,
  animationType = "round-morph",
  ...props
}) => {
  const [isDark, setIsDark] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    updateTheme();
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current) return;

    const newTheme = !isDark;
    const updateDOM = () => {
      flushSync(() => {
        setIsDark(newTheme);
        document.documentElement.classList.toggle("dark");
        localStorage.setItem("theme", newTheme ? "dark" : "light");
      });
    };

    if (!document.startViewTransition) {
      updateDOM();
      return;
    }

    await document.startViewTransition(() => {
      updateDOM();
    }).ready;

    document.documentElement.animate(
      [
        { opacity: 0, transform: "scale(0.8) rotate(5deg)" },
        { opacity: 1, transform: "scale(1) rotate(0deg)" },
      ],
      {
        duration: duration * 1.2,
        easing: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  }, [isDark, duration, animationType]);

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-full transition-all duration-300 cursor-pointer",
        "hover:bg-accent/10",
        isDark
          ? "hover:text-amber-400 text-content"
          : "hover:text-brand text-content",
        className,
      )}
      aria-label="Toggle theme"
      {...props}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
};
