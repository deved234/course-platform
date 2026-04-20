"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function BackgroundAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const dots = Array.from({ length: 60 }).map(() => {
      const dot = document.createElement("div");
      dot.className = "dot";

      container.appendChild(dot);

      // random start position
      gsap.set(dot, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      });

      // infinite floating animation
      gsap.to(dot, {
        x: "+=" + (Math.random() * 200 - 100),
        y: "+=" + (Math.random() * 200 - 100),
        duration: Math.random() * 5 + 5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      return dot;
    });

    return () => {
      dots.forEach((dot) => dot.remove());
    };
  }, []);

  return <div ref={containerRef} className="bg-animation" />;
}
