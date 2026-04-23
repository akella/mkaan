"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const ENTER_CLIP_MS = 680;
const ENTER_TEXT_DELAY_MS = 100;
const TEXT_MS = 420;
const EXIT_CLIP_DELAY_MS = 140;
const EXIT_TOTAL_MS = EXIT_CLIP_DELAY_MS + ENTER_CLIP_MS;
const CLIP_CLOSED_LEFT = "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)";
const CLIP_OPEN = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)";

const HoverTooltip = ({
  visible,
  x = 0,
  y = 0,
  className,
  rowClassName,
  labelClassName,
  dotClassName,
  bubbleClassName,
  text,
  textClassName,
  textStyle,
  showDot = false,
  rootRef,
}) => {
  const [isMounted, setIsMounted] = useState(Boolean(visible));
  const [phase, setPhase] = useState(visible ? "entered" : "hidden");
  const [position, setPosition] = useState({ x, y });

  const rafRef = useRef(null);
  const rafRef2 = useRef(null);
  const exitTimeoutRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setPosition({ x, y });
    }
  }, [visible, x, y]);

  useEffect(() => {
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (rafRef2.current) {
      cancelAnimationFrame(rafRef2.current);
      rafRef2.current = null;
    }

    if (visible) {
      setIsMounted(true);
      setPhase("pre-enter");

      // Two RAF ticks ensure browser applies initial clip/text styles before transition.
      rafRef.current = requestAnimationFrame(() => {
        rafRef2.current = requestAnimationFrame(() => {
          setPhase("entered");
        });
      });

      return undefined;
    }

    if (!isMounted) {
      return undefined;
    }

    setPhase("exiting");
    exitTimeoutRef.current = setTimeout(() => {
      setPhase("hidden");
      setIsMounted(false);
    }, EXIT_TOTAL_MS);

    return undefined;
  }, [visible, isMounted]);

  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (rafRef2.current) {
        cancelAnimationFrame(rafRef2.current);
      }
    };
  }, []);

  if (!isMounted || typeof document === "undefined") {
    return null;
  }

  const isEntered = phase === "entered";
  const isExiting = phase === "exiting";

  return createPortal(
    <div
      ref={rootRef}
      className={cn(
        "pointer-events-none fixed z-[9999] w-max max-md:hidden",
        className,
      )}
      style={{
        left: 0,
        top: 0,
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translateY(calc(-50% - 5px))`,
        willChange: "transform",
      }}
    >
      <div
        className={cn("w-max overflow-hidden", bubbleClassName)}
        style={{
          clipPath: isEntered ? CLIP_OPEN : CLIP_CLOSED_LEFT,
          transition: `clip-path ${ENTER_CLIP_MS}ms cubic-bezier(0.215, 0.61, 0.355, 1) ${
            isExiting ? EXIT_CLIP_DELAY_MS : 0
          }ms`,
          willChange: "clip-path",
        }}
      >
        <div className={cn("flex items-center gap-2", rowClassName)}>
          {showDot && (
            <div
              className={cn(
                "w-1 h-1 rounded-full bg-textWhite mr-3",
                dotClassName,
              )}
            ></div>
          )}
          <div
            className={cn(
              "inline-flex overflow-hidden bg-textWhite px-2 py-1 leading-none text-black",
              labelClassName,
            )}
          >
            <span
              className={cn("inline-block", textClassName)}
              style={{
                transform: isEntered
                  ? "translate3d(0, 0, 0)"
                  : "translate3d(0, 120%, 0)",
                transition: `transform ${TEXT_MS}ms cubic-bezier(0.215, 0.61, 0.355, 1) ${
                  isExiting ? 0 : ENTER_TEXT_DELAY_MS
                }ms`,
                willChange: "transform",
                ...textStyle,
              }}
            >
              {text}
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default HoverTooltip;
