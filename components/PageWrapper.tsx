import { ReactNode } from "react";

const PageWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-[calc(100vh-60px)] flex flex-col bg-zinc-50 flex-grow pt-10 pb-4">
      {children}
    </div>
  );
};

export default PageWrapper;
