import React, { useEffect, useRef } from "react";

const FallBeamBackground = ({
  className = "",
  lineCount = 25,
  displayText,
  colors = ["#022e75", "#10c6cc"],
}) => {
  const containerRef = useRef(null);

  const dynamicStyles = `
    .fall-beam-line {
      position: absolute;
      width: 2px;
      height: 100%;
      z-index: 1;
      opacity: 0.8;
    }

    .fall-beam-line::after {
      content: "";
      position: absolute;
      left: 0;
      width: 100%;
      height: 120px;
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 0),
        var(--beam-glow-color) 40%,
        var(--beam-glow-color)
      );
      animation: fall var(--ani-duration) var(--ani-delay) linear infinite;
      filter: blur(1px);
    }

    @keyframes fall {
      0% { top: -150px; opacity: 0; }
      10% { opacity: 1; }
      90% { opacity: 1; }
      100% { top: 100%; opacity: 0; }
    }
    `;

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container
      .querySelectorAll(".fall-beam-line")
      .forEach((line) => line.remove());

    for (let i = 0; i < lineCount; i++) {
      const line = document.createElement("div");
      line.classList.add("fall-beam-line");

      const leftPosition = `${i * (100 / lineCount) + (Math.random() * 4 - 2)}%`;
      const duration = 12 + Math.random() * 15 + "s";
      const delay = -(Math.random() * 20) + "s";
      const glowColor = colors[Math.floor(Math.random() * colors.length)];

      line.style.setProperty("left", leftPosition);
      line.style.setProperty("--ani-duration", duration);
      line.style.setProperty("--ani-delay", delay);
      line.style.setProperty("--beam-glow-color", glowColor);

      container.appendChild(line);
    }

    return () => {
      if (container) {
        container
          .querySelectorAll(".fall-beam-line")
          .forEach((line) => line.remove());
      }
    };
  }, [lineCount, colors]);

  return (
    <>
      <style>{dynamicStyles}</style>
      <div
        ref={containerRef}
        className={`absolute inset-0 z-0 overflow-hidden bg-transparent pointer-events-none ${className}`}
      >
        {displayText && (
          <h1 className="relative z-20 grid place-content-center h-full font-sans text-4xl sm:text-5xl lg:text-7xl font-bold text-white p-4 text-center">
            {displayText}
            <div
              className="absolute inset-0 z-30 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%)",
              }}
            />
          </h1>
        )}
      </div>
    </>
  );
};

export default FallBeamBackground;
