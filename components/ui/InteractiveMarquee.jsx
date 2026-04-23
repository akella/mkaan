"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { cn } from "@/lib/utils";

const DRAG_INERTIA_THRESHOLD = 15;

const InteractiveMarquee = ({
  children,
  className = "",
  trackClassName = "",
  speed = 35,
}) => {
  const wrapperRef = useRef(null);
  const trackRef = useRef(null);
  const frameRef = useRef();
  const lastTimeRef = useRef(0);
  const offsetRef = useRef(0);
  const widthRef = useRef(0);
  const velocityRef = useRef(-Math.abs(speed));
  const targetVelocityRef = useRef(-Math.abs(speed));
  const dragVelocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastPointerXRef = useRef(0);
  const lastPointerTimeRef = useRef(0);

  const items = useMemo(() => {
    const base = Children.toArray(children);

    if (!base.length) {
      return base;
    }

    const clones = base.map((child, index) =>
      isValidElement(child)
        ? cloneElement(child, { key: `clone-${index}` })
        : child
    );

    return [...base, ...clones];
  }, [children]);

  useEffect(() => {
    targetVelocityRef.current = -Math.abs(speed);
  }, [speed]);

  const applyTransform = () => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
  };

  const normalizeOffset = () => {
    const width = widthRef.current;

    if (!width) return;

    offsetRef.current = (((offsetRef.current % width) + width) % width) - width;
  };

  useEffect(() => {
    const node = trackRef.current;

    if (!node) return;

    const updateWidth = () => {
      widthRef.current = node.scrollWidth / 2 || 0;
      normalizeOffset();
      applyTransform();
    };

    updateWidth();

    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(updateWidth);
      observer.observe(node);

      return () => observer.disconnect();
    }

    return undefined;
  }, [items]);

  useEffect(() => {
    const step = (time) => {
      if (!lastTimeRef.current) lastTimeRef.current = time;

      const delta = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      const acceleration = Math.min(delta * 6, 1);
      velocityRef.current +=
        (targetVelocityRef.current - velocityRef.current) * acceleration;

      if (!isDraggingRef.current && widthRef.current) {
        offsetRef.current += velocityRef.current * delta;
        normalizeOffset();
        applyTransform();
      }

      frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handlePointerDown = (event) => {
    if (!wrapperRef.current) return;

    wrapperRef.current.setPointerCapture(event.pointerId);
    isDraggingRef.current = true;
    targetVelocityRef.current = 0;
    velocityRef.current = 0;
    dragVelocityRef.current = 0;
    lastPointerXRef.current = event.clientX;
    lastPointerTimeRef.current = performance.now();
    event.preventDefault();
  };

  const handlePointerMove = (event) => {
    if (!isDraggingRef.current) return;

    const now = performance.now();
    const deltaX = event.clientX - lastPointerXRef.current;

    offsetRef.current += deltaX;
    normalizeOffset();
    applyTransform();

    const elapsed = now - lastPointerTimeRef.current;
    if (elapsed > 0) {
      dragVelocityRef.current = (deltaX / elapsed) * 1000;
    }

    lastPointerXRef.current = event.clientX;
    lastPointerTimeRef.current = now;
    event.preventDefault();
  };

  const endDrag = (event) => {
    if (!isDraggingRef.current) return;

    if (wrapperRef.current?.hasPointerCapture(event.pointerId)) {
      wrapperRef.current.releasePointerCapture(event.pointerId);
    }

    isDraggingRef.current = false;

    const velocity = dragVelocityRef.current;

    if (Math.abs(velocity) > DRAG_INERTIA_THRESHOLD && velocity < 0) {
      velocityRef.current = velocity;
    } else {
      velocityRef.current = 0;
    }

    targetVelocityRef.current = -Math.abs(speed);
    lastPointerXRef.current = 0;
    dragVelocityRef.current = 0;
  };

  return (
    <div
      ref={wrapperRef}
      className={cn(
        "relative w-full overflow-hidden cursor-grab active:cursor-grabbing select-none touch-pan-y",
        className
      )}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div
        ref={trackRef}
        className={cn("flex will-change-transform", trackClassName)}
        style={{ transform: "translate3d(0, 0, 0)" }}
      >
        {items}
      </div>
    </div>
  );
};

export default InteractiveMarquee;
