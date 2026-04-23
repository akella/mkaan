"use client";
import { useState, useEffect, useRef } from "react";

export const useCurrentSection = () => {
  const [currentSection, setCurrentSection] = useState(null);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.hasAttribute("data-light-section")) {
              setCurrentSection("light");
            } else {
              setCurrentSection("dark");
            }
          }
        });
      },
      {
        threshold: 0,
        rootMargin: "0px 0px -100% 0px",
      }
    );

    const sections = document.querySelectorAll("section");

    sections.forEach((section) => {
      observerRef.current.observe(section);
    });

    return () => {
      if (observerRef.current) {
        sections.forEach((section) => {
          observerRef.current.unobserve(section);
        });
        observerRef.current.disconnect();
      }
    };
  }, []);

  return currentSection === "light";
};
