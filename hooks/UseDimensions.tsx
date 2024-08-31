// react/nextjs components
import { useEffect, useRef } from "react";

const UseDimensions = (ref: any) => {
  // Ref to store current dimensions
  const dimensions = useRef({ width: 0, height: 0 });

  // Effect to update dimensions when the ref changes
  useEffect(() => {
    if (ref.current) {
      dimensions.current.width = ref.current.offsetWidth;
      dimensions.current.height = ref.current.offsetHeight;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return dimensions.current;
};

export default UseDimensions;
