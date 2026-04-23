"use client";

import { useEffect, useRef } from "react";
import { CURSOR_DOT_MOVE_EVENT } from "@/lib/constants";

const supportsPointerFine = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: fine)").matches &&
  window.matchMedia("(min-width: 768px)").matches;

const CustomCursor = () => {
  const orbRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const orb = orbRef.current;
    const dot = dotRef.current;

    if (!orb || !dot) {
      return undefined;
    }

    if (!supportsPointerFine()) {
      orb.style.display = "none";
      dot.style.display = "none";
      return undefined;
    }

    let frameId;
    let orbX = window.innerWidth / 2;
    let orbY = window.innerHeight / 2;
    let targetX = orbX;
    let targetY = orbY;
    let dotX = orbX;
    let dotY = orbY;
    let variant = "light";
    const DOT_OFFSET_X = -7;
    const DOT_OFFSET_Y = -7;
    const SCALE_DURATION = 400;
    let isSuppressed = false;
    let isDotHidden = false;
    let targetDotScale = 1;
    let dotScale = 1;
    let lastFrameTime;
    const shouldSuppressCursor = (target) =>
      Boolean(
        target &&
        typeof target.closest === "function" &&
        target.closest("[data-cursor-hidden]"),
      );
    const shouldHideDot = (target) =>
      Boolean(
        target &&
        typeof target.closest === "function" &&
        target.closest("[data-no-dot]"),
      );

    const updateDotScale = () => {
      targetDotScale = isSuppressed || isDotHidden ? 0 : 1;
    };

    const setVisible = (isVisible) => {
      const next = isVisible ? "true" : "false";
      orb.dataset.visible = next;
      dot.dataset.visible = next;
    };

    const setVariant = (nextVariant) => {
      if (nextVariant === variant) {
        return;
      }
      variant = nextVariant;
      orb.dataset.variant = variant;
      dot.dataset.variant = variant;
    };

    const setSuppressed = (nextSuppressed) => {
      if (nextSuppressed === isSuppressed) {
        return;
      }
      isSuppressed = nextSuppressed;
      const value = nextSuppressed ? "true" : "false";
      orb.dataset.suppressed = value;
      dot.dataset.suppressed = value;
      updateDotScale();
    };

    const setDotHidden = (nextHidden) => {
      if (nextHidden === isDotHidden) {
        return;
      }
      isDotHidden = nextHidden;
      dot.dataset.dotHidden = nextHidden ? "true" : "false";
      updateDotScale();
    };

    const resolveVariant = (target) => {
      if (!target || typeof target.closest !== "function") {
        return "light";
      }
      const area = target.closest("[data-cursor-area]");
      if (!area) {
        return "light";
      }
      return area.dataset.cursorArea === "light" ? "dark" : "light";
    };

    const handleMouseMove = (event) => {
      targetX = event.clientX;
      targetY = event.clientY;
      const suppressed = shouldSuppressCursor(event.target);
      const hideDot = shouldHideDot(event.target);
      setDotHidden(hideDot);
      setSuppressed(suppressed);
      setVisible(true);
      if (suppressed) {
        return;
      }
      setVariant(resolveVariant(event.target));
    };

    const handleMouseLeave = (event) => {
      if (event.relatedTarget === null) {
        setSuppressed(false);
        setDotHidden(false);
        setVisible(false);
      }
    };

    const dispatchDotMove = (x, y) => {
      window.dispatchEvent(
        new CustomEvent(CURSOR_DOT_MOVE_EVENT, {
          detail: { x, y },
        }),
      );
    };

    const animate = (time) => {
      const delta =
        typeof time === "number" && lastFrameTime ? time - lastFrameTime : 16;
      lastFrameTime = time;
      if (targetDotScale !== dotScale) {
        const step = Math.min(1, delta / SCALE_DURATION);
        dotScale += (targetDotScale - dotScale) * step;
      }
      orbX += (targetX - orbX) * 0.25;
      orbY += (targetY - orbY) * 0.25;
      dotX += (targetX - dotX) * 0.1;
      dotY += (targetY - dotY) * 0.1;

      orb.style.transform = `translate3d(${orbX}px, ${orbY}px, 0)`;
      dot.style.transform = `translate3d(${dotX + DOT_OFFSET_X}px, ${
        dotY + DOT_OFFSET_Y
      }px, 0) scale(${dotScale})`;

      dispatchDotMove(dotX, dotY);

      frameId = window.requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);
    orb.dataset.variant = variant;
    dot.dataset.variant = variant;
    orb.dataset.suppressed = "false";
    dot.dataset.suppressed = "false";
    dot.dataset.dotHidden = "false";
    dispatchDotMove(dotX, dotY);
    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <>
      <div
        className="cursor-orb"
        ref={orbRef}
        data-visible="false"
        data-variant="light"
        aria-hidden="true"
      />
      <span
        className="cursor-orb__dot"
        ref={dotRef}
        data-visible="false"
        data-variant="light"
        aria-hidden="true"
      />
    </>
  );
};

export default CustomCursor;
