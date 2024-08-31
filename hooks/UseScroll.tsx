// react/nextjs components
import { useCallback, useEffect, useState } from "react";

// Custom hook to track if the user has scrolled past a threshold
const UseScroll = (threshold: number) => {
  // State to track if the user has scrolled past the threshold
  const [scrolled, setScrolled] = useState(false);

  // Scroll event handler to update the state based on scroll position
  const onScroll = useCallback(() => {
    setScrolled(window.scrollY > threshold);
  }, [threshold]);

  // Effect to add/remove scroll event listener
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  // Effect to check scroll position on initial load
  useEffect(() => {
    onScroll();
  }, [onScroll]);

  return scrolled;
};

export default UseScroll;
