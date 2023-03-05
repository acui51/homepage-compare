// @ts-nocheck
import { useRef, useEffect } from "react";

const useIntersectionObserver = ({ observedElement, callback }) => {
  const observer = useRef(null);

  useEffect(() => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      callback(entries);
    });

    const { current: currentObserver } = observer;

    if (observedElement) {
      currentObserver.observe(observedElement);
    }

    return () => {
      if (observedElement) {
        currentObserver.unobserve(observedElement);
      }
    };
  }, [observedElement]);
};

export default useIntersectionObserver;
