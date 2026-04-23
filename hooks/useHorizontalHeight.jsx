'use client'
import { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";

const useHorizontalHeight = () => {
  const scrollerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(500);

  useEffect(() => {
    if (!scrollerRef.current) return;
    
    const calculateHeight = () => {
      if (!scrollerRef.current) return;
      
      // Use clientWidth consistently for both initial and resize calculations
      // Add a small buffer to ensure full scrolling capability
      const scrollWidth = scrollerRef.current.scrollWidth || scrollerRef.current.clientWidth;
      const viewportWidth = window.innerWidth;
      const scrollDistance = Math.max(0, scrollWidth - viewportWidth);
      
      // Add some extra height to ensure the scroll completes properly
      setContainerHeight(scrollDistance + 100);
    };
    
    // Calculate immediately
    calculateHeight();
    
    // Set up resize handler
    const debouncedOnResize = debounce(calculateHeight, 100);
    window.addEventListener('resize', debouncedOnResize);
    
    // Create a mutation observer to detect changes in the slider content
    const observer = new MutationObserver(calculateHeight);
    observer.observe(scrollerRef.current, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    });
    
    return () => {
      window.removeEventListener('resize', debouncedOnResize);
      observer.disconnect();
    };
  }, []); // Empty dependency array since we're using ref internally

    
  return { containerHeight, scrollerRef };
}

export default useHorizontalHeight