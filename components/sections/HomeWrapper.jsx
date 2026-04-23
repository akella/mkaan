'use client';
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

const HomeWrapper = ({ children, start='80%', end='20%', start2='bottom' }) => {
  const gradient = useRef(null);
  const wrap = useRef(null);
  useGSAP(() => {
    const prBlock = document.querySelector('.js-portfolio-section');
    const vBlock = document.querySelector('.js-values-section');
    const vInner = document.querySelector('.js-values-inner');
    gsap.registerPlugin(ScrollTrigger);
    if (!gradient.current || !prBlock || !vBlock || !vInner) return;

    gsap.fromTo(gradient.current, {
      opacity: 1,
    }, {
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: prBlock,
        start: "top 80%",
        end: "top 30%",
        scrub: true,
      },
    });
    gsap.fromTo(gradient.current, {
      opacity: 0,
    }, {
      opacity: 1,
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        trigger: vBlock,
        start: "top 80%",
        end: "top 30%",
        scrub: true,
        // markers: true,
        invalidateOnRefresh: true,
   
      },
    });

    gsap.fromTo(gradient.current, {
      opacity: 1,
    }, {
      opacity: 0,
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        trigger: vBlock,
        start: `${start2} ${start}`,
        end: `bottom ${end}`,
        scrub: true,
    
        invalidateOnRefresh: true,
      },
    });
  }, []);
  return (
    <div ref={wrap} className="relative">
      {children}
      <div ref={gradient} className="absolute inset-0 bg-[radial-gradient(103.9%_118.82%_at_131.81%_1.39%,_#592D42_0%,_var(--Wine-Shadow,_#3A1A29)_100%)]"></div>
    </div>
  );
}

export default HomeWrapper;