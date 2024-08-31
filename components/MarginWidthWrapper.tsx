import { ReactNode } from "react";

const MarginWidthWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-col md:ml-60 sm:border-r sm:border-zinc-700">
      {children}
    </div>
  );
};

export default MarginWidthWrapper;
