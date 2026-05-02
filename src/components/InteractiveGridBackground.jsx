"use client";

import React, { useEffect, useRef, useState } from "react";

const InteractiveGridBackground = ({
  gridSize = 50,
  gridColor = "#cbcbcb",
  darkGridColor = "#303030",
  effectColor = "rgba(16, 198, 204, 0.25)",
  darkEffectColor = "rgba(16, 198, 204, 0.45)",
  trailLength = 4,
  width,
  height,
  idleSpeed = 0.05,
  glow = true,
  glowRadius = 15,
  children,
  showFade = true,
  fadeIntensity = 30,
  idleRandomCount = 3,
  className = "",
  ...props
}) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const trailRef = useRef([]);
  const idleTargetsRef = useRef([]);
  const idlePositionsRef = useRef([]);
  const lastMouseTimeRef = useRef(0);

  useEffect(() => {
    lastMouseTimeRef.current = Date.now();
    const updateDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    updateDarkMode();
    const observer = new MutationObserver(() => updateDarkMode());
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const rawX = e.clientX - rect.left;
      const rawY = e.clientY - rect.top;
      if (rawX < 0 || rawY < 0 || rawX > rect.width || rawY > rect.height)
        return;
      lastMouseTimeRef.current = Date.now();
      const snappedX = Math.floor(rawX / gridSize);
      const snappedY = Math.floor(rawY / gridSize);
      const last = trailRef.current[0];
      if (!last || last.x !== snappedX || last.y !== snappedY) {
        trailRef.current.unshift({ x: snappedX, y: snappedY });
        if (trailRef.current.length > trailLength) trailRef.current.pop();
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [gridSize, trailLength]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let rafId;
    const currentContainer = containerRef.current;
    const resize = () => {
      const containerWidth =
        width || currentContainer?.clientWidth || window.innerWidth;
      const containerHeight =
        height || currentContainer?.clientHeight || window.innerHeight;
      canvas.width = containerWidth;
      canvas.height = containerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const cols = Math.floor(canvas.width / gridSize);
    const rows = Math.floor(canvas.height / gridSize);
    idleTargetsRef.current = Array.from({ length: idleRandomCount }, () => ({
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    }));
    idlePositionsRef.current = idleTargetsRef.current.map((p) => ({ ...p }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const lineColor = isDarkMode ? darkGridColor : gridColor;
      const glowColor = isDarkMode ? darkEffectColor : effectColor;
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x <= canvas.width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y <= canvas.height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();
      if (Date.now() - lastMouseTimeRef.current > 1500) {
        idlePositionsRef.current.forEach((pos, i) => {
          const target = idleTargetsRef.current[i];
          const dx = target.x - pos.x;
          const dy = target.y - pos.y;
          if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
            idleTargetsRef.current[i] = {
              x: Math.floor(Math.random() * cols),
              y: Math.floor(Math.random() * rows),
            };
          } else {
            pos.x += dx * idleSpeed;
            pos.y += dy * idleSpeed;
          }
          const rx = Math.round(pos.x);
          const ry = Math.round(pos.y);
          const last = trailRef.current[0];
          if (!last || last.x !== rx || last.y !== ry) {
            trailRef.current.unshift({ x: rx, y: ry });
            if (trailRef.current.length > trailLength * 2)
              trailRef.current.pop();
          }
        });
      }
      trailRef.current.forEach((cell, idx) => {
        const alpha = 1 - idx * (1 / (trailRef.current.length + 1));
        ctx.fillStyle = glowColor.replace(/[\d.]+\)$/g, `${alpha})`);
        if (glow) {
          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = glowRadius * alpha;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fillRect(cell.x * gridSize, cell.y * gridSize, gridSize, gridSize);
      });
      rafId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [
    gridSize,
    width,
    height,
    isDarkMode,
    gridColor,
    darkGridColor,
    effectColor,
    darkEffectColor,
    trailLength,
    idleSpeed,
    glow,
    glowRadius,
    idleRandomCount,
  ]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ minHeight: height || "400px" }}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60"
      />
      {showFade && (
        <div
          className="pointer-events-none absolute inset-0 bg-transparent"
          style={{
            backgroundImage: `radial-gradient(circle at center, transparent 0%, var(--bg-primary) 100%)`,
          }}
        />
      )}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

export default InteractiveGridBackground;
