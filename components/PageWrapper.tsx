import { ReactNode } from "react";

const PageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="md:h-[calc(100vh-58px)] flex flex-col bg-zinc-50 flex-grow">
      {children}
    </div>
  );
};

export default PageWrapper;
