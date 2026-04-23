"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";

const EASE_NAME = "faqAccordionOut";
const EASE_CONFIG = "0.25,1,0.5,1";

gsap.registerPlugin(CustomEase);
CustomEase.create(EASE_NAME, EASE_CONFIG);

const combineClasses = (...classes) => classes.filter(Boolean).join(" ");

const FAQAccordion = ({
  items = [],
  initialOpenIndex = 0,
  className = "",
  listClassName = "",
  itemClassName = "",
  questionClassName = "text-18 pr-6",
  answerClassName = "pb-6 pt-[72px] max-md:pt-16 text-14 md:max-w-[312px]",
  buttonClassName = "w-full flex items-center justify-between py-4 text-left focus:outline-none select-none",
}) => {
  const [openIndex, setOpenIndex] = useState(initialOpenIndex);
  const containersRef = useRef([]);
  const textsRef = useRef([]);

  useEffect(() => {
    setOpenIndex(initialOpenIndex);
  }, [initialOpenIndex]);

  useEffect(() => {
    if (!items.length) return;

    containersRef.current = containersRef.current.slice(0, items.length);
    textsRef.current = textsRef.current.slice(0, items.length);

    items.forEach((_, i) => {
      const container = containersRef.current[i];
      const text = textsRef.current[i];
      if (!container || !text) return;

      if (i === initialOpenIndex) {
        gsap.set(container, { height: "auto" });
        gsap.set(text, { yPercent: 0, autoAlpha: 1 });
      } else {
        gsap.set(container, { height: 0, overflow: "hidden" });
        gsap.set(text, { yPercent: 100, autoAlpha: 0 });
      }
    });
  }, [items, initialOpenIndex]);

  const registerContainer = (el, index) => {
    if (el) {
      containersRef.current[index] = el;
    }
  };

  const registerText = (el, index) => {
    if (el) {
      textsRef.current[index] = el;
    }
  };

  const handleToggle = (index) => {
    if (index === openIndex) return;

    const prevIndex = openIndex;
    const prevContainer = containersRef.current[prevIndex];
    const prevText = textsRef.current[prevIndex];
    const nextContainer = containersRef.current[index];
    const nextText = textsRef.current[index];

    if (prevContainer && prevText) {
      gsap.to(prevContainer, { height: 0, duration: 0.8, ease: EASE_NAME });
      gsap.to(prevText, {
        yPercent: 100,
        autoAlpha: 0,
        duration: 0.8,
        ease: EASE_NAME,
      });
    }

    if (nextContainer && nextText) {
      gsap.to(nextContainer, {
        height: "auto",
        duration: 0.8,
        ease: EASE_NAME,
      });
      gsap.fromTo(
        nextText,
        { yPercent: 100, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: EASE_NAME },
      );
    }

    setOpenIndex(index);
  };

  if (!items?.length) {
    return null;
  }

  return (
    <div className={combineClasses("faq-accordion", className)}>
      <ul className={combineClasses("faq-accordion__list", listClassName)}>
        {items.map((item, index) => {
          const question = item.Title ?? item.question ?? "";
          const answer = item.Description ?? item.answer ?? "";
          const isOpen = index === openIndex;
          return (
            <li
              key={question || index}
              className={combineClasses("faq-accordion__item", itemClassName)}
            >
              <button
                type="button"
                className={combineClasses(
                  "faq-accordion__trigger",
                  !isOpen ? "md:hover:py-6 transition-all duration-300" : "",
                  buttonClassName,
                )}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${index}`}
                onClick={() => handleToggle(index)}
              >
                <span
                  className={combineClasses(
                    "faq-accordion__question",
                    questionClassName,
                  )}
                >
                  {question}
                </span>
                <div className="relative">
                  <div className="w-[13px] h-px bg-textWhite"></div>
                  <div
                    className={`absolute inset-0 w-[13px] h-px bg-textWhite transform transition-all duration-500 ease-[var(--ease-inOut)] ${!isOpen ? "rotate-90" : ""}`}
                  ></div>
                </div>
              </button>
              <div
                id={`faq-panel-${index}`}
                ref={(el) => registerContainer(el, index)}
                className="overflow-hidden"
              >
                <div
                  ref={(el) => registerText(el, index)}
                  className={combineClasses(
                    "faq-accordion__answer",
                    answerClassName,
                  )}
                >
                  {answer}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FAQAccordion;
