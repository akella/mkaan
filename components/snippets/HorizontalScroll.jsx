"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { debounce } from "lodash";
import { cn } from "@/lib/utils";

const HorizontalScroll = ({ children, className, sliderClassName, ...props }) => {
  const sliderRef = useRef(null);
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    setContainerHeight(sliderRef.current.clientWidth - window.innerWidth);

    const onResize = () => {
      setContainerHeight(sliderRef.current.offsetWidth - window.innerWidth);
    };
    onResize();
    const debouncedOnResize = debounce(onResize, 100);
    window.addEventListener('resize', debouncedOnResize);
    
    return () => {
      window.removeEventListener('resize', debouncedOnResize);
    };
  }, []);
  
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    const slider = sliderRef.current;
    const container = containerRef.current;
    
    gsap.to(slider, {
      x: () => (slider.clientWidth - window.innerWidth) * -1,
      ease: 'none',
      scrollTrigger: {
        trigger: container,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true
      },
    });
  }, []);
  
  return (
    <div ref={containerRef} className={cn("relative", className)} style={{ height: `${containerHeight}px` }} {...props}>
      <div ref={sliderRef} className={cn("sticky top-0 w-full h-screen will-change-transform", sliderClassName)}>
        {children}
      </div>
    </div>
  );
};

export default HorizontalScroll;